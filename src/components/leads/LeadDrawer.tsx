import { useCallback, useEffect, useState } from "react";
import { Loader2, Phone, Trash2, X } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { supabase } from "../../integrations/supabase/client";
import { INDIAN_STATES } from "../../data/indianStates";
import {
  INQUIRY_META, OUTCOMES, OUTCOME_LABEL, STATUSES, STATUS_META, addDays, fmtDateTime, fmtYmd, startOfDay, waLink, ymd,
  type CallOutcome, type Lead, type LeadCall, type LeadStatus,
} from "./leadTypes";

type NextAction = "none" | "retry3h" | "callback" | "tomorrow" | "in3days" | "nextweek" | "visit";

const input =
  "w-full px-3 py-2 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text text-sm focus:outline-none focus:border-primary";
const label = "block text-xs font-semibold text-text-muted dark:text-d-text-muted mb-1 uppercase tracking-wide";

const at = (d: Date, h: number, m = 0) => { const x = new Date(d); x.setHours(h, m, 0, 0); return x; };
const toLocalInput = (d: Date) => `${ymd(d)}T${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

interface Props {
  lead: Lead;
  userId: string;
  userEmail: string;
  onClose: () => void;
  onSaved: () => void;
  canDelete?: boolean;
}

export default function LeadDrawer({ lead, userId, userEmail, onClose, onSaved, canDelete = false }: Props) {
  const [calls, setCalls] = useState<LeadCall[]>([]);
  const [outcome, setOutcome] = useState<CallOutcome>("answered");
  const [summary, setSummary] = useState("");
  const [status, setStatus] = useState<LeadStatus>(lead.status === "new" ? "interested" : lead.status);
  const [reason, setReason] = useState(lead.interest_reason ?? "");
  const [next, setNext] = useState<NextAction>("none");
  const [callbackAt, setCallbackAt] = useState(toLocalInput(at(addDays(new Date(), 1), 10)));
  const [visitDate, setVisitDate] = useState(lead.visit_date ?? ymd(addDays(new Date(), 2)));
  const [city, setCity] = useState(lead.city ?? "");
  const [state, setState] = useState(lead.state ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Permanently removes the lead; its call history goes with it (database cascade).
  const deleteLead = async () => {
    if (!confirm(`Delete ${lead.full_name} (${lead.mobile})?\n\nThis also removes the call history for this lead and cannot be undone.`)) return;
    setDeleting(true);
    const { data, error: delErr } = await supabase.from("leads").delete().eq("id", lead.id).select("id");
    setDeleting(false);
    if (delErr) return alert("Could not delete: " + delErr.message);
    // Row-level security blocks silently: no error, but nothing deleted.
    if (!data?.length) return alert("Could not delete: your account is not allowed to delete leads.");
    onSaved();
    onClose();
  };

  const loadCalls = useCallback(async () => {
    const { data } = await supabase
      .from("lead_calls")
      .select("*")
      .eq("lead_id", lead.id)
      .order("created_at", { ascending: false });
    setCalls((data ?? []) as LeadCall[]);
  }, [lead.id]);

  useEffect(() => {
    loadCalls();
  }, [loadCalls]);

  // Sensible defaults when the outcome changes.
  const pickOutcome = (o: CallOutcome) => {
    setOutcome(o);
    if (o === "answered") {
      if (status === "no_answer") setStatus("interested");
      if (next === "retry3h") setNext("none");
    } else if (o === "wrong_number") {
      setStatus("invalid");
      setNext("none");
    } else {
      setStatus("no_answer");
      setNext("retry3h");
    }
  };

  const pickStatus = (s: LeadStatus) => {
    setStatus(s);
    if (s === "visit_scheduled") setNext("visit");
    else if (s === "callback" && (next === "none" || next === "visit")) setNext("callback");
  };

  const computeFollowup = (): { at: string | null; note: string | null; visit: string | null } => {
    const now = new Date();
    switch (next) {
      case "retry3h":
        return { at: new Date(now.getTime() + 3 * 3600_000).toISOString(), note: "Retry - did not pick up", visit: null };
      case "callback":
        return { at: new Date(callbackAt).toISOString(), note: "Customer asked for a call back", visit: null };
      case "tomorrow":
        return { at: at(addDays(now, 1), 10).toISOString(), note: "Call back tomorrow", visit: null };
      case "in3days":
        return { at: at(addDays(now, 3), 10).toISOString(), note: "Follow up in 3 days", visit: null };
      case "nextweek":
        return { at: at(addDays(now, 7), 10).toISOString(), note: "Said will come next week - call to confirm", visit: null };
      case "visit": {
        const v = new Date(visitDate + "T00:00:00");
        let f = at(addDays(v, -1), 10); // day before, 10 AM
        if (f.getTime() <= now.getTime()) f = at(v, 9);
        if (f.getTime() <= now.getTime()) f = now;
        return { at: f.toISOString(), note: `Visit on ${fmtYmd(visitDate)} - call to confirm`, visit: visitDate };
      }
      default:
        return { at: null, note: null, visit: lead.visit_date };
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const f = computeFollowup();
      const finalStatus: LeadStatus = next === "visit" ? "visit_scheduled" : status;
      const { error: callErr } = await supabase.from("lead_calls").insert({
        lead_id: lead.id,
        called_by: userId,
        called_by_email: userEmail,
        outcome,
        summary: summary.trim() || null,
      });
      if (callErr) throw callErr;
      const { error: upErr } = await supabase
        .from("leads")
        .update({
          status: finalStatus,
          interest_reason: reason.trim() || null,
          next_followup_at: f.at,
          followup_note: f.note,
          visit_date: f.visit,
          city: city.trim() || null,
          state: state || null,
        })
        .eq("id", lead.id);
      if (upErr) throw upErr;
      setSummary("");
      setNext("none");
      await loadCalls();
      onSaved();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const quick: { v: NextAction; l: string }[] = [
    { v: "none", l: "No follow-up" },
    { v: "retry3h", l: "Retry in 3 hrs" },
    { v: "callback", l: "Call back at..." },
    { v: "tomorrow", l: "Tomorrow" },
    { v: "in3days", l: "In 3 days" },
    { v: "nextweek", l: "Next week" },
    { v: "visit", l: "Will visit on..." },
  ];

  const details: [string, string | null][] = (lead.inquiry_type ?? "installation") === "installation"
    ? [
        ["Enquired", fmtDateTime(lead.created_at)],
        ["Install on", lead.install_target],
        ["Vehicle", lead.vehicle],
        ["Engine", lead.engine_capacity],
        ["Preferred callback", lead.preferred_callback_time],
        ["Calls made", String(lead.call_count)],
      ]
    : [
        ["Enquired", fmtDateTime(lead.created_at)],
        ["Enquiry type", INQUIRY_META[lead.inquiry_type].label],
        ["Email", lead.email],
        ["Territory wanted", lead.territory],
        ["Occupation", lead.occupation],
        lead.inquiry_type === "franchise" ? ["Prior experience", lead.prior_experience] : ["Investment budget", lead.investment_budget],
        ["Calls made", String(lead.call_count)],
      ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-lg h-full overflow-y-auto bg-bg-light dark:bg-d-bg-light shadow-2xl p-5 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-text dark:text-d-text">{lead.full_name}</h2>
            <p className="text-sm text-text-muted dark:text-d-text-muted">{lead.mobile}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {canDelete && (
              <button
                onClick={deleteLead}
                disabled={deleting}
                aria-label="Delete lead"
                title="Delete lead"
                className="p-1.5 rounded text-text-muted dark:text-d-text-muted hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50"
              >
                {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
              </button>
            )}
            <button onClick={onClose} aria-label="Close" className="p-1.5 rounded hover:bg-border/40">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <a href={`tel:${lead.mobile}`} className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-white text-sm font-semibold">
            <Phone className="w-4 h-4" />Call
          </a>
          <a href={waLink(lead.mobile)} target="_blank" rel="noreferrer" className="flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold">
            <WhatsAppIcon className="w-4 h-4" />WhatsApp
          </a>
        </div>

        {lead.next_followup_at && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-text dark:text-d-text">
            <b>Next follow-up:</b> {fmtDateTime(lead.next_followup_at)}
            {lead.followup_note ? ` - ${lead.followup_note}` : ""}
            {lead.visit_date && <div><b>Visit date:</b> {fmtYmd(lead.visit_date)}</div>}
          </div>
        )}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          {details.map(([k, v]) => (
            <div key={k}>
              <dt className={label}>{k}</dt>
              <dd className="text-text dark:text-d-text">{v || "-"}</dd>
            </div>
          ))}
          {lead.question && (
            <div className="col-span-2">
              <dt className={label}>Customer asked</dt>
              <dd className="text-text dark:text-d-text">{lead.question}</dd>
            </div>
          )}
          <div>
            <label className={label}>City</label>
            <input className={input} value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className={label}>State</label>
            <select className={input} value={state} onChange={(e) => setState(e.target.value)}>
              <option value="">- not set -</option>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </dl>

        <form onSubmit={save} className="space-y-4 rounded-xl border-2 border-border dark:border-d-border p-4">
          <h3 className="font-bold text-text dark:text-d-text">Log this call</h3>
          <div>
            <span className={label}>What happened?</span>
            <div className="flex flex-wrap gap-2">
              {OUTCOMES.map((o) => (
                <button
                  type="button"
                  key={o}
                  onClick={() => pickOutcome(o)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${outcome === o ? "bg-primary text-white border-primary" : "border-border dark:border-d-border text-text dark:text-d-text"}`}
                >
                  {OUTCOME_LABEL[o]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={label}>What did they say? (brief)</label>
            <textarea
              className={input}
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. Wants to see a demo, will come next week with the car"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={label}>Status</label>
              <select className={input} value={status} onChange={(e) => pickStatus(e.target.value as LeadStatus)}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_META[s].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label}>Reason / remark</label>
              <input className={input} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. price too high" />
            </div>
          </div>
          <div>
            <span className={label}>Follow-up / reminder</span>
            <div className="flex flex-wrap gap-2">
              {quick.map((q) => (
                <button
                  type="button"
                  key={q.v}
                  onClick={() => setNext(q.v)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${next === q.v ? "bg-secondary text-white border-secondary" : "border-border dark:border-d-border text-text dark:text-d-text"}`}
                >
                  {q.l}
                </button>
              ))}
            </div>
            {next === "callback" && (
              <input type="datetime-local" className={`${input} mt-2`} value={callbackAt} onChange={(e) => setCallbackAt(e.target.value)} required />
            )}
            {next === "visit" && (
              <div className="mt-2">
                <input type="date" className={input} value={visitDate} min={ymd(startOfDay(new Date()))} onChange={(e) => setVisitDate(e.target.value)} required />
                <p className="text-xs text-text-muted dark:text-d-text-muted mt-1">
                  A reminder to confirm will be set for the day before, 10 AM.
                </p>
              </div>
            )}
          </div>
          {error && <p className="text-sm text-error">{error}</p>}
          <button
            disabled={saving}
            className="w-full py-2.5 rounded-lg bg-linear-to-r from-primary to-secondary text-white font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}Save call
          </button>
        </form>

        <div>
          <h3 className="font-bold text-text dark:text-d-text mb-3">Call history</h3>
          {calls.length === 0 ? (
            <p className="text-sm text-text-muted dark:text-d-text-muted">No calls logged yet.</p>
          ) : (
            <ol className="space-y-3 border-l-2 border-border dark:border-d-border pl-4">
              {calls.map((c) => (
                <li key={c.id} className="text-sm">
                  <div className="text-xs text-text-muted dark:text-d-text-muted">
                    {fmtDateTime(c.created_at)} · {c.called_by_email ?? "-"}
                  </div>
                  <div className="font-semibold text-text dark:text-d-text">{OUTCOME_LABEL[c.outcome]}</div>
                  {c.summary && <div className="text-text-para dark:text-d-text-para">{c.summary}</div>}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
}
