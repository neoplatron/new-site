// Daily follow-up digest for telecallers.
// Scheduled with pg_cron (08:30 IST) - see README "Leads dashboard setup".
// Secrets: RESEND_API_KEY, CRON_SECRET, FOLLOWUP_EMAIL_FROM (optional), SITE_URL (optional)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.
import { createClient } from "npm:@supabase/supabase-js@2";

const IST_OFFSET_MS = 5.5 * 3600_000;

interface LeadRow {
  id: string;
  full_name: string;
  mobile: string;
  city: string | null;
  state: string | null;
  vehicle: string | null;
  status: string;
  next_followup_at: string | null;
  followup_note: string | null;
  visit_date: string | null;
  assigned_to: string | null;
  interest_reason: string | null;
}

const esc = (s: string | null | undefined) =>
  (s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const istYmd = (d: Date) => new Date(d.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);

function fmtIst(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function section(title: string, rows: LeadRow[]) {
  if (!rows.length) return "";
  const items = rows
    .map((l) => {
      const where = [l.city, l.state].filter(Boolean).join(", ");
      const when = l.next_followup_at ? `Due ${fmtIst(l.next_followup_at)}` : "";
      return `<tr>
        <td style="padding:8px;border-bottom:1px solid #eee"><b>${esc(l.full_name)}</b><br/><span style="color:#666;font-size:12px">${esc(where)} ${l.vehicle ? "&middot; " + esc(l.vehicle) : ""}</span></td>
        <td style="padding:8px;border-bottom:1px solid #eee"><a href="tel:${esc(l.mobile)}">${esc(l.mobile)}</a></td>
        <td style="padding:8px;border-bottom:1px solid #eee;font-size:13px">${esc(l.followup_note ?? l.interest_reason ?? "")}<br/><span style="color:#999">${when}</span></td>
      </tr>`;
    })
    .join("");
  return `<h3 style="margin:20px 0 6px">${title} (${rows.length})</h3><table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${items}</table>`;
}

Deno.serve(async (req) => {
  const secret = Deno.env.get("CRON_SECRET");
  if (!secret || req.headers.get("x-cron-secret") !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY is not configured");
    const from = Deno.env.get("FOLLOWUP_EMAIL_FROM") || "Neoplatron Leads <onboarding@resend.dev>";
    const siteUrl = Deno.env.get("SITE_URL") || "https://neoplatron.com";

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const now = new Date();
    const today = istYmd(now);
    const tomorrow = istYmd(new Date(now.getTime() + 86_400_000));
    // End of today in IST, as a UTC instant.
    const endOfTodayIst = new Date(new Date(`${today}T23:59:59+05:30`).getTime()).toISOString();

    const { data, error } = await supabase
      .from("leads")
      .select("id,full_name,mobile,city,state,vehicle,status,next_followup_at,followup_note,visit_date,assigned_to,interest_reason")
      .not("status", "in", "(installed,not_interested,invalid)")
      .or(`next_followup_at.lte.${endOfTodayIst},visit_date.in.(${today},${tomorrow})`);
    if (error) throw error;
    const leads = (data ?? []) as LeadRow[];
    if (!leads.length) return Response.json({ sent: 0, reason: "nothing due" });

    const { data: tcs } = await supabase.from("admin_whitelist").select("email,name").eq("role", "telecaller");
    const telecallers = (tcs ?? []) as { email: string; name: string | null }[];

    // recipient email -> leads
    const byEmail = new Map<string, LeadRow[]>();
    const push = (email: string, l: LeadRow) => byEmail.set(email, [...(byEmail.get(email) ?? []), l]);
    const emailCache = new Map<string, string | null>();

    for (const l of leads) {
      if (l.assigned_to) {
        if (!emailCache.has(l.assigned_to)) {
          const { data: u } = await supabase.auth.admin.getUserById(l.assigned_to);
          emailCache.set(l.assigned_to, u?.user?.email ?? null);
        }
        const e = emailCache.get(l.assigned_to);
        if (e) { push(e, l); continue; }
      }
      telecallers.forEach((t) => push(t.email, l)); // unassigned -> whole telecaller team
    }

    let sent = 0;
    for (const [email, rows] of byEmail) {
      const overdue = rows.filter((l) => l.next_followup_at && new Date(l.next_followup_at) < now);
      const dueToday = rows.filter((l) => l.next_followup_at && new Date(l.next_followup_at) >= now && !overdue.includes(l));
      const confirmTomorrow = rows.filter((l) => l.visit_date === tomorrow);
      const visitToday = rows.filter((l) => l.visit_date === today);
      const html = `<div style="font-family:Arial,sans-serif;max-width:640px">
        <h2 style="margin-bottom:4px">Your follow-ups for today</h2>
        <p style="color:#666;margin-top:0">${rows.length} lead(s) need attention.</p>
        ${section("Overdue callbacks", overdue)}
        ${section("Call back today", dueToday)}
        ${section("Visiting tomorrow - call to confirm", confirmTomorrow)}
        ${section("Visiting today", visitToday)}
        <p style="margin-top:24px"><a href="${siteUrl}/admin/leads?follow=today" style="background:#0a7;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none">Open leads dashboard</a></p>
      </div>`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [email], subject: `Neoplatron: ${rows.length} follow-up(s) for today`, html }),
      });
      if (!res.ok) console.error("Resend error for", email, res.status, await res.text());
      else sent++;
    }
    return Response.json({ sent, recipients: byEmail.size });
  } catch (e) {
    console.error("send-followup-digest error:", e);
    return Response.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
});
