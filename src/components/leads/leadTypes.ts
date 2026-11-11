import type { Database } from "../../integrations/supabase/types";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadCall = Database["public"]["Tables"]["lead_calls"]["Row"];
export type LeadStatus = Lead["status"];
export type CallOutcome = LeadCall["outcome"];

export const STATUS_META: Record<LeadStatus, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  no_answer: { label: "No answer", cls: "bg-gray-500/10 text-gray-600 border-gray-500/30" },
  callback: { label: "Call back", cls: "bg-amber-500/10 text-amber-600 border-amber-500/30" },
  interested: { label: "Interested", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30" },
  visit_scheduled: { label: "Visit scheduled", cls: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  installed: { label: "Installed", cls: "bg-green-600/10 text-green-700 border-green-600/30" },
  not_interested: { label: "Not interested", cls: "bg-red-500/10 text-red-600 border-red-500/30" },
  invalid: { label: "Invalid", cls: "bg-zinc-500/10 text-zinc-500 border-zinc-500/30" },
};

export type InquiryType = Lead["inquiry_type"];
export const INQUIRY_META: Record<InquiryType, { label: string; cls: string }> = {
  installation: { label: "Installation", cls: "bg-blue-500/10 text-blue-600 border-blue-500/30" },
  franchise: { label: "Franchise", cls: "bg-purple-500/10 text-purple-600 border-purple-500/30" },
  distribution: { label: "Distribution", cls: "bg-orange-500/10 text-orange-600 border-orange-500/30" },
};
export const INQUIRY_TYPES = Object.keys(INQUIRY_META) as InquiryType[];

export const OUTCOME_LABEL: Record<CallOutcome, string> = {
  answered: "Answered",
  not_answered: "Not answered",
  busy: "Busy",
  switched_off: "Switched off",
  wrong_number: "Wrong number",
};

export const STATUSES = Object.keys(STATUS_META) as LeadStatus[];
export const OUTCOMES = Object.keys(OUTCOME_LABEL) as CallOutcome[];

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const fmtDateTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
export const fmtDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
export const fmtYmd = (d: string | null) =>
  d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" }) : "—";

export const waLink = (mobile: string) => {
  const digits = mobile.replace(/\D/g, "");
  const n = digits.length === 10 ? "91" + digits : digits;
  return `https://wa.me/${n}`;
};

export const cleanMobile = (s: string) => s.replace(/[\s-]+/g, "");
export const isValidMobile = (s: string) => /^(\+?91)?[6-9]\d{9}$/.test(cleanMobile(s));

// Statuses that end the conversation: no more reminders for these leads.
export const CLOSED_STATUSES: readonly LeadStatus[] = ["installed", "not_interested", "invalid"];
export const isClosed = (s: LeadStatus) => CLOSED_STATUSES.includes(s);

// Shared by the public installation form and the staff edit form.
export const INSTALL_TARGET_OPTIONS = [
  "Car",
  "Truck",
  "Bus",
  "Generator (DG Set)",
  "Earthmover",
  "Marine engines/boats",
  "Other",
];

export const ENGINE_CAPACITY_OPTIONS = [
  "Below 1800cc",
  "Above 1800cc",
  "I'm Not Sure of My Vehicle's Engine Capacity",
];

export type Bucket =
  | "overdue" | "today" | "visit_today" | "new" | "called" | "followup" | "repeat"
  | "tomorrow" | "visit_tomorrow" | "upcoming";

export const EMPTY_BUCKET_COUNTS: Record<Bucket, number> = {
  overdue: 0, today: 0, visit_today: 0, new: 0, called: 0, followup: 0, repeat: 0,
  tomorrow: 0, visit_tomorrow: 0, upcoming: 0,
};

const DAY_MS = 86_400_000;

// Classify leads into reminder buckets (a lead may fall in several).
export function bucketsFor(l: Lead, now: Date, repeatMobiles: Set<string>): Bucket[] {
  const out: Bucket[] = [];
  const today = ymd(now);
  const tomorrow = ymd(addDays(now, 1));
  const eod = addDays(startOfDay(now), 1).getTime();
  // Contacted at least once - includes closed leads.
  if (l.call_count > 0) out.push("called");
  if (isClosed(l.status)) return out;
  // Open leads still waiting on a follow-up call, whenever it is due.
  if (l.next_followup_at || l.status === "callback") out.push("followup");
  if (l.next_followup_at) {
    const t = new Date(l.next_followup_at).getTime();
    if (t < now.getTime()) out.push("overdue");
    else if (t < eod) out.push("today");
    else if (t < eod + DAY_MS) out.push("tomorrow");
  }
  if (l.visit_date === tomorrow) out.push("visit_tomorrow");
  if (l.visit_date === today) out.push("visit_today");
  // Anything (call back or visit) falling 2-7 days from now.
  const weekEnd = eod + 7 * DAY_MS;
  const followT = l.next_followup_at ? new Date(l.next_followup_at).getTime() : 0;
  const visitT = l.visit_date ? new Date(l.visit_date + "T00:00:00").getTime() : 0;
  if ([followT, visitT].some((t) => t >= eod + DAY_MS && t < weekEnd)) out.push("upcoming");
  if (l.status === "new" && l.call_count === 0) out.push("new");
  if (repeatMobiles.has(l.mobile) && l.status === "new") out.push("repeat");
  return out;
}
