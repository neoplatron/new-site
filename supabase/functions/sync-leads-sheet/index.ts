// Pulls new enquiries from the Google Sheet into `leads`. Run on a schedule with pg_cron
// (see README "Automatic Google Sheet sync"). Safe to run repeatedly: existing leads are never touched.
//
// Secrets:
//   CRON_SECRET            shared with the other scheduled function
//   LEADS_SHEET_ID         the long id in the sheet's URL (/spreadsheets/d/<ID>/edit)
//   LEADS_SHEET_GID        tab id(s): the number after #gid= in the URL. Comma-separate several
//                          (Installation, Franchise, Distribution); each tab's type is detected from
//                          its headings. Default: first tab only.
//   GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / GOOGLE_REFRESH_TOKEN   already set for warranty uploads
//   LEADS_SHEET_CSV_URL    optional: a "Publish to web" CSV link, used instead of the Google login
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.
//
// NOTE: the parsing below mirrors src/utils/leadsImport.ts (the manual "Import sheet" button).
// Keep the two in step if the sheet's columns or the status rules change.
import { createClient } from "npm:@supabase/supabase-js@2";

const IST_OFFSET_MS = 5.5 * 3600_000;
// The website form saves each enquiry to the database and to the sheet a few seconds apart.
// A sheet row this close to an existing lead with the same mobile is that same enquiry.
const SAME_ENQUIRY_MS = 15 * 60_000;

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];
const guessState = (text: string) => {
  const t = text.toLowerCase();
  return INDIAN_STATES.find((s) => t.includes(s.toLowerCase())) ?? "";
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

function parseCsv(text: string): string[][] {
  const clean = text.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (inQuotes) {
      if (c === '"') {
        if (clean[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && clean[i + 1] === "\n") i++;
      row.push(field); field = "";
      rows.push(row); row = [];
    } else field += c;
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

// Sheet timestamps are M/D/YYYY H:mm:ss in India time. The manual import parses them in the
// browser's (IST) timezone, so this must produce the identical instant or every row would duplicate.
function parseTimestamp(s: string): string | null {
  const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) return null;
  const utc = Date.UTC(+m[3], +m[1] - 1, +m[2], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0)) - IST_OFFSET_MS;
  return new Date(utc).toISOString();
}

function normMobile(s: string) {
  let d = s.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  return d;
}

type Status = "new" | "no_answer" | "callback" | "interested" | "not_interested";
interface ParsedRow {
  lead: Record<string, string | null>;
  createdMs: number;
  call: { outcome: "answered" | "not_answered"; summary: string | null } | null;
}

const NOT_CONNECTED = /did\s*n.?t pick|not pick|no answer|not answer|no response|switch|busy|not reachable|ringing/;

function parseSheet(text: string): { rows: ParsedRow[]; skipped: number; type: string } {
  const table = parseCsv(text);
  if (table.length < 2) return { rows: [], skipped: 0, type: "installation" };
  const h = table[0].map((x) => x.trim().toLowerCase());
  const find = (...needles: string[]) => h.findIndex((x) => needles.some((n) => x.includes(n)));
  // Each tab has its own questions; the headings tell us which tab this is.
  const type =
    find("investment budget", "distribution rights") >= 0 ? "distribution"
    : find("territory") >= 0 ? "franchise"
    : "installation";
  const partner = type !== "installation";
  const p = {
    email: find("email"),
    territory: find("territory", "distribution rights"),
    occupation: find("occupation"),
    experience: find("previously worked"),
    budget: find("investment budget"),
    // The franchise tab has a stray "Column 13" before Occupation; where it is filled, the
    // answers sit one column to the left of their headings.
    stray: h.findIndex((x) => /^column \d+$/.test(x)),
  };
  const c = {
    ts: find("timestamp"),
    name: find("full name"),
    mobile: find("mobile"),
    city: find("city"),
    target: find("install the neoplatron", "install"),
    vehicle: find("vehicle brand"),
    cc: find("engine capacity"),
    time: find("callback time"),
    q: find("what would you like to know"),
    called: find("have we called"),
    state: h.indexOf("state"),
    remarks: h.indexOf("remarks"),
  };
  if (c.ts < 0 || c.name < 0 || c.mobile < 0) {
    throw new Error("Sheet is missing the Timestamp, Full name or Mobile column - is this the right tab?");
  }
  const didCols = h.map((x, i) => (x.startsWith("did customer") ? i : -1)).filter((i) => i >= 0);
  const ansCol = didCols[0] ?? -1;
  const notesCol = didCols[1] ?? -1;

  const rows: ParsedRow[] = [];
  let skipped = 0;
  for (const r of table.slice(1)) {
    const g = (i: number) => (i >= 0 ? (r[i] ?? "").trim() : "");
    const created = parseTimestamp(g(c.ts));
    const mobile = normMobile(g(c.mobile));
    if (!created || mobile.length < 10 || !g(c.name)) { skipped++; continue; }

    const cityRaw = g(c.city);
    const state = g(c.state) || guessState(cityRaw);
    const called = /^(yes|true|y)$/i.test(g(c.called));
    const notes = g(notesCol);
    const remarks = g(c.remarks);
    const said = `${remarks} ${notes}`.trim().toLowerCase();
    const answered = /^(true|yes|y)$/i.test(g(ansCol)) || (partner && !!said && !NOT_CONNECTED.test(said));
    const shifted = p.stray >= 0 && !!g(p.stray);

    let status: Status = "new";
    let reason: string | null = null;
    let call: ParsedRow["call"] = null;
    if (called) {
      const t = `${remarks} ${notes}`.toLowerCase();
      if (!answered) {
        status = "no_answer";
        call = { outcome: "not_answered", summary: notes || remarks || null };
      } else {
        if (/price|cost|high|expensive|not inte?re?st|no need|not required/.test(t)) {
          status = "not_interested";
          reason = remarks || notes || null;
        } else if (/inte?re?st/.test(t)) {
          status = "interested";
          reason = remarks || null;
        } else {
          status = "callback";
        }
        call = { outcome: "answered", summary: [notes, remarks && remarks !== notes ? `(${remarks})` : ""].filter(Boolean).join(" ") || null };
      }
    }

    rows.push({
      createdMs: new Date(created).getTime(),
      call,
      lead: {
        created_at: created,
        source: "sheet_import",
        inquiry_type: type,
        email: g(p.email) || null,
        territory: g(p.territory) || null,
        occupation: (shifted ? g(p.stray) : g(p.occupation)) || null,
        prior_experience: (shifted ? g(p.occupation) : g(p.experience)) || null,
        investment_budget: g(p.budget) || null,
        full_name: g(c.name),
        mobile,
        city: cityRaw || null,
        state: state || null,
        install_target: g(c.target) || null,
        vehicle: g(c.vehicle) || null,
        engine_capacity: g(c.cc) || null,
        preferred_callback_time: g(c.time) || null,
        question: g(c.q) || null,
        status,
        interest_reason: reason,
      },
    });
  }
  return { rows, skipped, type };
}

// One CSV per tab. LEADS_SHEET_GID (or LEADS_SHEET_CSV_URL) may list several, comma-separated.
async function fetchSheetCsvs(): Promise<string[]> {
  const direct = Deno.env.get("LEADS_SHEET_CSV_URL");
  const targets = (direct ?? Deno.env.get("LEADS_SHEET_GID") ?? "0").split(",").map((s) => s.trim()).filter(Boolean);
  return await Promise.all(targets.map((t) => fetchSheetCsv(direct ? t : null, t)));
}

async function fetchSheetCsv(direct: string | null, gid: string): Promise<string> {
  let res: Response;
  if (direct) {
    res = await fetch(direct);
  } else {
    const id = Deno.env.get("LEADS_SHEET_ID");
    if (!id) throw new Error("Set LEADS_SHEET_ID (or LEADS_SHEET_CSV_URL)");
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
        client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "",
        refresh_token: Deno.env.get("GOOGLE_REFRESH_TOKEN") ?? "",
        grant_type: "refresh_token",
      }),
    });
    const tok = await tokenRes.json();
    if (!tokenRes.ok || !tok.access_token) throw new Error(`Google auth failed: ${tok.error} - ${tok.error_description}`);
    res = await fetch(`https://docs.google.com/spreadsheets/d/${id}/export?format=csv&gid=${gid}`, {
      headers: { Authorization: `Bearer ${tok.access_token}` },
    });
  }
  const text = await res.text();
  if (!res.ok || /^\s*<(!doctype|html)/i.test(text)) {
    throw new Error(
      `Could not read the sheet (HTTP ${res.status}). The saved Google login may not have permission to read ` +
        "this sheet - see README \"Automatic Google Sheet sync\".",
    );
  }
  return text;
}

Deno.serve(async (req) => {
  const secret = Deno.env.get("CRON_SECRET");
  if (!secret || req.headers.get("x-cron-secret") !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const tabs = (await fetchSheetCsvs()).map(parseSheet);
    const rows = tabs.flatMap((t) => t.rows);
    const skipped = tabs.reduce((n, t) => n + t.skipped, 0);
    const keyOf = (type: string | null, mobile: string) => `${type ?? "installation"}|${normMobile(mobile)}`;
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false },
    });

    // Enquiry times already in the database, by enquiry type and mobile.
    const existing = new Map<string, number[]>();
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase
        .from("leads").select("mobile,created_at,inquiry_type")
        .order("created_at").range(from, from + 999);
      if (error) throw error;
      for (const l of data ?? []) {
        const k = keyOf(l.inquiry_type, l.mobile);
        const t = new Date(l.created_at).getTime();
        const list = existing.get(k);
        if (list) list.push(t);
        else existing.set(k, [t]);
      }
      if (!data || data.length < 1000) break;
    }

    const fresh = rows.filter((r) => {
      const k = keyOf(r.lead.inquiry_type, r.lead.mobile!);
      const times = existing.get(k) ?? [];
      if (times.some((t) => Math.abs(t - r.createdMs) < SAME_ENQUIRY_MS)) return false;
      existing.set(k, [...times, r.createdMs]); // also de-dupes within the sheet itself
      return true;
    });

    // ?dry=1 reports what would be added without writing anything.
    if (new URL(req.url).searchParams.get("dry") === "1") {
      return json({
        ok: true, dryRun: true, tabs: tabs.map((t) => `${t.type}: ${t.rows.length} rows`),
        sheetRows: rows.length, wouldInsert: fresh.length,
        alreadyPresent: rows.length - fresh.length, skipped,
        sample: fresh.slice(0, 5).map((r) => ({ name: r.lead.full_name, mobile: r.lead.mobile, enquired: r.lead.created_at })),
      });
    }

    let inserted = 0;
    for (let i = 0; i < fresh.length; i += 100) {
      const chunk = fresh.slice(i, i + 100);
      const { data, error } = await supabase
        .from("leads")
        .upsert(chunk.map((r) => r.lead), { onConflict: "mobile,created_at", ignoreDuplicates: true })
        .select("id,mobile,created_at");
      if (error) throw error;
      inserted += data?.length ?? 0;

      const idByKey = new Map((data ?? []).map((d) => [`${d.mobile}|${new Date(d.created_at).getTime()}`, d.id]));
      const calls = chunk.flatMap((r) => {
        const id = idByKey.get(`${r.lead.mobile}|${r.createdMs}`);
        return id && r.call
          ? [{ lead_id: id, called_by: null, called_by_email: "Sheet import", outcome: r.call.outcome, summary: r.call.summary }]
          : [];
      });
      if (calls.length) {
        const { error: cErr } = await supabase.from("lead_calls").insert(calls);
        if (cErr) throw cErr;
      }
    }

    const result = { ok: true, sheetRows: rows.length, inserted, alreadyPresent: rows.length - fresh.length, skipped };
    console.log("sync-leads-sheet:", result);
    return json(result);
  } catch (e) {
    console.error("sync-leads-sheet failed:", e);
    return json({ ok: false, error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
