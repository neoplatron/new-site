import { guessState } from "../data/indianStates";
import { parseDelimited } from "./csv";
import type { Database } from "../integrations/supabase/types";

type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
type CallInsert = Database["public"]["Tables"]["lead_calls"]["Insert"];
export interface ParsedRow {
  lead: LeadInsert;
  call: { outcome: CallInsert["outcome"]; summary: string | null } | null;
}

// Header lookup that tolerates the long Google-Form question titles.
function findCol(headers: string[], ...needles: string[]) {
  return headers.findIndex((h) => needles.some((n) => h.toLowerCase().includes(n)));
}

function parseTimestamp(s: string): string | null {
  // M/D/YYYY H:mm:ss (Google Sheets, US format)
  const m = s.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!m) {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d.toISOString();
  }
  const d = new Date(+m[3], +m[1] - 1, +m[2], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
  return d.toISOString();
}

function normMobile(s: string) {
  let d = s.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  return d;
}

type InquiryType = NonNullable<LeadInsert["inquiry_type"]>;

// A call counts as "not connected" only if the note says so; partner tabs often leave the
// "answered" checkbox unticked even when the remarks describe a real conversation.
const NOT_CONNECTED = /did\s*n.?t pick|not pick|no answer|not answer|no response|switch|busy|not reachable|ringing/;

export function parseSheet(text: string): { rows: ParsedRow[]; skipped: number; type: InquiryType } {
  const table = parseDelimited(text);
  if (table.length < 2) return { rows: [], skipped: 0, type: "installation" };
  const h = table[0].map((x) => x.trim());
  // Which tab is this? Each tab of the sheet has its own questions.
  const type: InquiryType =
    findCol(h, "investment budget", "distribution rights") >= 0 ? "distribution"
    : findCol(h, "territory") >= 0 ? "franchise"
    : "installation";
  const partner = type !== "installation";
  const p = {
    email: findCol(h, "email"),
    territory: findCol(h, "territory", "distribution rights"),
    occupation: findCol(h, "occupation"),
    experience: findCol(h, "previously worked"),
    budget: findCol(h, "investment budget"),
    // The franchise tab has a stray "Column 13" before Occupation; where it is filled, the
    // answers sit one column to the left of their headings.
    stray: h.findIndex((x) => /^column \d+$/i.test(x)),
  };
  const c = {
    ts: findCol(h, "timestamp"),
    name: findCol(h, "full name"),
    mobile: findCol(h, "mobile"),
    city: findCol(h, "city"),
    target: findCol(h, "install the neoplatron", "install"),
    vehicle: findCol(h, "vehicle brand"),
    cc: findCol(h, "engine capacity"),
    time: findCol(h, "callback time"),
    q: findCol(h, "what would you like to know"),
    called: findCol(h, "have we called"),
    state: h.findIndex((x) => x.toLowerCase() === "state"),
    remarks: h.findIndex((x) => x.toLowerCase() === "remarks"),
  };
  // The sheet has two columns titled "Did customer answered the call?..." -> answered flag, then notes.
  const didCols = h.map((x, i) => (x.toLowerCase().startsWith("did customer") ? i : -1)).filter((i) => i >= 0);
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

    let status: LeadInsert["status"] = "new";
    let reason: string | null = null;
    let call: ParsedRow["call"] = null;
    if (called) {
      const text = `${remarks} ${notes}`.toLowerCase();
      if (!answered) {
        status = "no_answer";
        call = { outcome: "not_answered", summary: notes || remarks || null };
      } else {
        if (/price|cost|high|expensive|not inte?re?st|no need|not required/.test(text)) {
          status = "not_interested";
          reason = remarks || notes || null;
        } else if (/inte?re?st/.test(text)) {
          status = "interested";
          reason = remarks || null;
        } else {
          status = "callback";
        }
        call = { outcome: "answered", summary: [notes, remarks && remarks !== notes ? `(${remarks})` : ""].filter(Boolean).join(" ") || null };
      }
    }

    rows.push({
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
      call,
    });
  }
  return { rows, skipped, type };
}

