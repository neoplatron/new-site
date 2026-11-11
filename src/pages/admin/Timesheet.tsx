import BrandLoader from "../../components/admin/BrandLoader";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Briefcase, ChevronLeft, ChevronRight, Clock, Loader2, Plus, RefreshCw, Trash2, X } from "lucide-react";
import type { Database } from "../../integrations/supabase/types";
import AdminLayout from "../../components/admin/AdminLayout";
import SEO from "../../components/SEO";
import { supabase } from "../../integrations/supabase/client";
import { useAdminRole } from "../../hooks/useAdminRole";
import {
  OUTCOME_LABEL, STATUS_META, addDays, ymd,
  type CallOutcome, type Lead, type LeadCall,
} from "../../components/leads/leadTypes";

type LeadLite = Pick<Lead, "id" | "full_name" | "mobile" | "city" | "state" | "status">;

const OUTCOME_CLS: Record<CallOutcome, string> = {
  answered: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  not_answered: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  busy: "bg-orange-500/10 text-orange-600 border-orange-500/30",
  switched_off: "bg-zinc-500/10 text-zinc-600 border-zinc-500/30",
  wrong_number: "bg-red-500/10 text-red-600 border-red-500/30",
};

type WorkEntry = Database["public"]["Tables"]["timesheet_entries"]["Row"];
type Item =
  | { kind: "call"; t: number; call: LeadCall }
  | { kind: "work"; t: number; entry: WorkEntry };

const time = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
// "14:30[:00]" -> "02:30 pm"
const clock = (hm: string) => time(`2000-01-01T${hm.slice(0, 5)}:00`);
const hourLabel = (h: number) => `${clock(`${String(h).padStart(2, "0")}:00`)} - ${clock(`${String((h + 1) % 24).padStart(2, "0")}:00`)}`;
const toMin = (hm: string) => Number(hm.slice(0, 2)) * 60 + Number(hm.slice(3, 5));
const minutesBetween = (a: string, b: string) => Math.max(0, toMin(b) - toMin(a));
const fmtDuration = (m: number) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ""}`.trim() : `${m}m`);
const plusHour = (hm: string) => {
  const m = Math.min(toMin(hm) + 60, 23 * 60 + 59);
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

const fieldLabel = "text-xs font-medium text-text-muted dark:text-d-text-muted mb-1.5";

const pad = (n: number) => String(n).padStart(2, "0");

// 12-hour time picker (hour / minute / AM-PM). `value` and `onChange` use 24-hour "HH:MM".
// Native <input type="time"> follows the device setting, which is often 24-hour.
function TimePicker12({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  const h24 = Number(value.slice(0, 2));
  const min = Number(value.slice(3, 5));
  const pm = h24 >= 12;
  const h12 = h24 % 12 || 12;
  const set = (h: number, m: number, isPm: boolean) => onChange(`${pad((h % 12) + (isPm ? 12 : 0))}:${pad(m)}`);
  const minutes = [...new Set([...Array.from({ length: 12 }, (_, i) => i * 5), min])].sort((a, b) => a - b);
  const cls = `${input} px-2 rounded-xl flex-1 min-w-0`;
  return (
    <div className="flex items-center gap-1.5" role="group" aria-label={label}>
      <select className={cls} value={h12} onChange={(e) => set(Number(e.target.value), min, pm)} aria-label={`${label} hour`}>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => <option key={h} value={h}>{h}</option>)}
      </select>
      <span>:</span>
      <select className={cls} value={min} onChange={(e) => set(h12, Number(e.target.value), pm)} aria-label={`${label} minute`}>
        {minutes.map((m) => <option key={m} value={m}>{pad(m)}</option>)}
      </select>
      <select className={cls} value={pm ? "PM" : "AM"} onChange={(e) => set(h12, min, e.target.value === "PM")} aria-label={`${label} AM or PM`}>
        <option>AM</option>
        <option>PM</option>
      </select>
    </div>
  );
}

const input =
  "px-3 py-2 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text text-sm focus:outline-none focus:border-primary";

// Day-wise log of the calls each team member made.
// Telecallers see their own day; admin and master can pick any team member.
export default function Timesheet() {
  const { role, email, userId, loading: roleLoading } = useAdminRole();
  const [day, setDay] = useState(() => ymd(new Date()));
  const [member, setMember] = useState(""); // email; "" = everyone (admin/master only)
  const [calls, setCalls] = useState<LeadCall[]>([]);
  const [leadMap, setLeadMap] = useState<Map<string, LeadLite>>(new Map());
  const [names, setNames] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [workStart, setWorkStart] = useState(() => `${String(new Date().getHours()).padStart(2, "0")}:00`);
  const [workEnd, setWorkEnd] = useState(() => plusHour(`${String(new Date().getHours()).padStart(2, "0")}:00`));
  const [workText, setWorkText] = useState("");
  const [saving, setSaving] = useState(false);
  const [showWork, setShowWork] = useState(false);
  const dateRef = useRef<HTMLInputElement>(null);

  const canSeeAll = role === "master" || role === "admin";

  const load = useCallback(async () => {
    if (!role) return;
    setLoading(true);
    const start = new Date(day + "T00:00:00");
    const end = addDays(start, 1);

    const all: LeadCall[] = [];
    for (let from = 0; ; from += 1000) {
      let q = supabase
        .from("lead_calls")
        .select("*")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("created_at", { ascending: true })
        .range(from, from + 999);
      if (!canSeeAll) q = q.eq("called_by", userId);
      const { data, error } = await q;
      if (error) {
        console.error("Error loading timesheet:", error);
        break;
      }
      all.push(...((data ?? []) as LeadCall[]));
      if (!data || data.length < 1000) break;
    }
    // Rows created by the sheet import are history, not work done by a person.
    const real = all.filter((c) => c.called_by_email !== "Sheet import");

    const ids = [...new Set(real.map((c) => c.lead_id))];
    const map = new Map<string, LeadLite>();
    for (let i = 0; i < ids.length; i += 100) {
      const { data } = await supabase
        .from("leads")
        .select("id, full_name, mobile, city, state, status")
        .in("id", ids.slice(i, i + 100));
      (data ?? []).forEach((l) => map.set(l.id, l as LeadLite));
    }

    // Other work logged by hand (row-level security limits telecallers to their own).
    const { data: work, error: workErr } = await supabase
      .from("timesheet_entries")
      .select("*")
      .eq("work_date", day)
      .order("start_time", { ascending: true });
    if (workErr) console.error("Error loading other work:", workErr);

    setCalls(real);
    setLeadMap(map);
    setEntries((work ?? []) as WorkEntry[]);
    setLoading(false);
  }, [role, canSeeAll, userId, day]);

  useEffect(() => {
    load();
  }, [load]);

  // Team member names for the picker (admin/master).
  useEffect(() => {
    if (!canSeeAll) return;
    supabase.from("admin_whitelist").select("email, name").then(({ data }) => {
      setNames(new Map((data ?? []).map((r) => [r.email, r.name || r.email])));
    });
  }, [canSeeAll]);

  const members = useMemo(() => {
    const emails = new Set<string>([...names.keys(), ...calls.map((c) => c.called_by_email).filter((e): e is string => !!e)]);
    return [...emails].sort();
  }, [names, calls]);

  const shown = useMemo(
    () => (canSeeAll && member ? calls.filter((c) => c.called_by_email === member) : calls),
    [calls, member, canSeeAll]
  );

  const shownWork = useMemo(
    () => (canSeeAll && member ? entries.filter((e) => e.user_email === member) : entries),
    [entries, member, canSeeAll]
  );

  // Calls and other work merged into one timeline, grouped by the hour they started in.
  const hours = useMemo(() => {
    const items: Item[] = [
      ...shown.map((call) => ({ kind: "call" as const, t: new Date(call.created_at).getTime(), call })),
      ...shownWork.map((entry) => ({ kind: "work" as const, t: new Date(`${entry.work_date}T${entry.start_time}`).getTime(), entry })),
    ].sort((a, b) => a.t - b.t);
    const groups = new Map<number, Item[]>();
    items.forEach((it) => {
      const h = new Date(it.t).getHours();
      groups.set(h, [...(groups.get(h) ?? []), it]);
    });
    return [...groups].sort((a, b) => a[0] - b[0]);
  }, [shown, shownWork]);

  const summary = useMemo(() => {
    const answered = shown.filter((c) => c.outcome === "answered").length;
    const workMin = shownWork.reduce((n, e) => n + minutesBetween(e.start_time, e.end_time), 0);
    return [
      ["Calls made", shown.length],
      ["Answered", answered],
      ["Not connected", shown.length - answered],
      ["Leads contacted", new Set(shown.map((c) => c.lead_id)).size],
      ["First to last call", shown.length ? `${time(shown[0].created_at)} - ${time(shown[shown.length - 1].created_at)}` : "-"],
      ["Other work", workMin ? fmtDuration(workMin) : "-"],
    ] as [string, number | string][];
  }, [shown, shownWork]);

  const addWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (workEnd <= workStart) return alert("End time must be after start time.");
    setSaving(true);
    const { error } = await supabase.from("timesheet_entries").insert({
      user_id: userId,
      user_email: email,
      work_date: day,
      start_time: workStart,
      end_time: workEnd,
      description: workText.trim(),
    });
    setSaving(false);
    if (error) {
      console.error("Error saving other work:", error);
      return alert("Could not save: " + error.message);
    }
    setWorkText("");
    setWorkStart(workEnd);
    setWorkEnd(plusHour(workEnd));
    load();
  };

  const removeWork = async (id: string) => {
    if (!confirm("Remove this entry?")) return;
    const { error } = await supabase.from("timesheet_entries").delete().eq("id", id);
    if (error) return alert("Could not remove: " + error.message);
    load();
  };

  // Per-person totals, shown when viewing everyone.
  const perMember = useMemo(() => {
    const m = new Map<string, { calls: number; answered: number }>();
    calls.forEach((c) => {
      const k = c.called_by_email || "Unknown";
      const v = m.get(k) ?? { calls: 0, answered: 0 };
      v.calls++;
      if (c.outcome === "answered") v.answered++;
      m.set(k, v);
    });
    return [...m].sort((a, b) => b[1].calls - a[1].calls);
  }, [calls]);

  if (roleLoading) {
    return <BrandLoader fullScreen />;
  }
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-d-bg text-text dark:text-d-text p-6 text-center">
        Your account has no role assigned yet. Ask the master admin to add you.
      </div>
    );
  }

  const today = ymd(new Date());
  const shift = (n: number) => setDay(ymd(addDays(new Date(day + "T00:00:00"), n)));
  const label = (e: string | null) => (e ? names.get(e) || e : "Unknown");

  return (
    <AdminLayout
      role={role}
      email={email}
      title="Timesheet"
      actions={
        <button onClick={load} className="p-2 rounded-lg border border-border dark:border-d-border" aria-label="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      }
    >
      <SEO title="Timesheet - Neoplatron" noindex />
      <div className="space-y-4 md:space-y-6">
        <section className="flex flex-wrap items-center gap-2">
          {/* Day switcher: arrows step a day, tapping the date opens the calendar */}
          <div className="flex items-center w-full sm:w-auto rounded-2xl bg-bg-light dark:bg-d-bg-light border border-border dark:border-d-border shadow-sm p-1">
            <button onClick={() => shift(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-border/30 active:scale-95 transition" aria-label="Previous day">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => dateRef.current?.showPicker?.()}
              className="relative flex-1 sm:min-w-[220px] px-3 py-1 text-center rounded-xl hover:bg-border/30 transition"
            >
              <div className="text-sm font-semibold leading-tight">
                {day === today ? "Today" : new Date(day + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long" })}
              </div>
              <div className="text-xs text-text-muted dark:text-d-text-muted">
                {new Date(day + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </div>
              <input
                ref={dateRef}
                type="date"
                value={day}
                max={today}
                onChange={(e) => e.target.value && setDay(e.target.value)}
                className="absolute bottom-0 left-1/2 w-0 h-0 opacity-0 pointer-events-none"
                tabIndex={-1}
                aria-label="Pick a date"
              />
            </button>
            <button onClick={() => shift(1)} disabled={day >= today} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-border/30 active:scale-95 transition disabled:opacity-30" aria-label="Next day">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {day !== today && (
            <button onClick={() => setDay(today)} className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">Back to today</button>
          )}
          {canSeeAll && (
            <select className={`${input} w-full sm:w-auto sm:ml-auto rounded-xl`} value={member} onChange={(e) => setMember(e.target.value)} aria-label="Team member">
              <option value="">All team members</option>
              {members.map((e) => <option key={e} value={e}>{label(e)}</option>)}
            </select>
          )}
        </section>

        {/* Day summary */}
        <section className="rounded-3xl md:rounded-2xl bg-linear-to-br from-primary to-primary/80 text-white p-5 shadow-lg shadow-primary/20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider opacity-80">Calls made</div>
              <div className="text-5xl font-bold tabular-nums leading-none mt-1">{summary[0][1]}</div>
            </div>
            <div className="text-right text-xs opacity-90 space-y-1">
              <div className="flex items-center justify-end gap-1.5"><Clock className="w-3.5 h-3.5" />{summary[4][1]}</div>
              <div className="flex items-center justify-end gap-1.5"><Briefcase className="w-3.5 h-3.5" />Other work: {summary[5][1]}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-5">
            {summary.slice(1, 4).map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-white/15 px-3 py-2.5">
                <div className="text-xl font-bold tabular-nums">{v}</div>
                <div className="text-[11px] opacity-85 leading-tight">{k}</div>
              </div>
            ))}
          </div>
        </section>

        {canSeeAll && !member && perMember.length > 0 && (
          <section className="rounded-2xl md:rounded-xl bg-bg-light dark:bg-d-bg-light border border-border dark:border-d-border p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-text-muted dark:text-d-text-muted mb-2">By team member</div>
            <div className="divide-y divide-border dark:divide-d-border">
              {perMember.map(([e, v]) => (
                <button key={e} onClick={() => setMember(e)} className="w-full flex items-center gap-3 py-2 text-left text-sm">
                  <span className="min-w-0 flex-1 truncate font-medium">{label(e)}</span>
                  <span className="shrink-0 text-text-muted dark:text-d-text-muted">{v.answered} answered</span>
                  <span className="shrink-0 font-bold tabular-nums w-16 text-right">{v.calls} calls</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Log work that isn't a lead call (meetings, follow-up messages, office work...) */}
        {!showWork ? (
          <button
            onClick={() => setShowWork(true)}
            className="w-full flex items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-left active:scale-[0.99] transition"
          >
            <span className="w-9 h-9 shrink-0 rounded-full bg-primary text-white flex items-center justify-center"><Plus className="w-5 h-5" /></span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-primary">Add other work</span>
              <span className="block text-xs text-text-muted dark:text-d-text-muted">Meetings, WhatsApp follow-ups, office tasks</span>
            </span>
          </button>
        ) : (
          <form onSubmit={addWork} className="rounded-2xl bg-bg-light dark:bg-d-bg-light border border-border dark:border-d-border shadow-sm p-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Briefcase className="w-4 h-4" /></span>
              <span className="font-semibold">Add other work</span>
              <button type="button" onClick={() => setShowWork(false)} className="ml-auto p-1.5 rounded-full hover:bg-border/30 text-text-muted dark:text-d-text-muted" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className={fieldLabel}>From</div>
                <TimePicker12 value={workStart} onChange={setWorkStart} label="From" />
              </div>
              <div>
                <div className={fieldLabel}>To</div>
                <TimePicker12 value={workEnd} onChange={setWorkEnd} label="To" />
              </div>
            </div>
            <div>
              <div className={fieldLabel}>What did you do?</div>
              <textarea
                className={`${input} w-full rounded-xl resize-none`}
                rows={2}
                placeholder="e.g. WhatsApp follow-ups, team meeting"
                value={workText}
                onChange={(e) => setWorkText(e.target.value)}
                required
                maxLength={500}
              />
            </div>
            <button type="submit" disabled={saving || !workText.trim()} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold shadow-sm active:scale-[0.98] transition disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Save entry
            </button>
          </form>
        )}

        {loading ? (
          <BrandLoader text="Loading timesheet..." />
        ) : hours.length === 0 ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3"><Clock className="w-7 h-7" /></div>
            <div className="font-semibold">Nothing logged yet</div>
            <div className="text-sm text-text-muted dark:text-d-text-muted mt-1 max-w-xs">Calls you log on leads appear here automatically. Add anything else with "Add other work".</div>
          </div>
        ) : (
          hours.map(([h, items]) => {
            const nCalls = items.filter((i) => i.kind === "call").length;
            const nWork = items.length - nCalls;
            return (
          <section key={h} className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-text-muted dark:text-d-text-muted">
              <span className="text-text dark:text-d-text">{hourLabel(h)}</span>
              <span className="h-px flex-1 bg-border dark:bg-d-border" />
              <span>{[nCalls ? `${nCalls} call${nCalls === 1 ? "" : "s"}` : "", nWork ? `${nWork} other` : ""].filter(Boolean).join(" · ")}</span>
            </div>
            {items.map((it) => {
              if (it.kind === "work") {
                const w = it.entry;
                return (
                  <div key={w.id} className="flex gap-3 rounded-2xl md:rounded-xl border border-sky-500/30 bg-sky-500/5 p-3">
                    <div className="shrink-0 w-16 text-sm font-semibold tabular-nums pt-0.5">{clock(w.start_time)}</div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="px-2 py-0.5 text-[11px] font-medium rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-600">Other work</span>
                        <span className="text-xs text-text-muted dark:text-d-text-muted">
                          until {clock(w.end_time)} · {fmtDuration(minutesBetween(w.start_time, w.end_time))}
                        </span>
                      </div>
                      <div className="text-sm break-words">{w.description}</div>
                      {canSeeAll && !member && (
                        <div className="text-[11px] text-text-muted dark:text-d-text-muted">by {label(w.user_email)}</div>
                      )}
                    </div>
                    {w.user_id === userId && (
                      <button onClick={() => removeWork(w.id)} className="shrink-0 self-start p-1.5 text-text-muted dark:text-d-text-muted hover:text-red-500" aria-label="Remove entry">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              }
              const c = it.call;
              const l = leadMap.get(c.lead_id);
              return (
                <div key={c.id} className="flex gap-3 rounded-2xl md:rounded-xl border border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light p-3 shadow-sm md:shadow-none">
                  <div className="shrink-0 w-16 text-sm font-semibold tabular-nums pt-0.5">{time(c.created_at)}</div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-semibold truncate">{l?.full_name ?? "Deleted lead"}</span>
                      <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border ${OUTCOME_CLS[c.outcome]}`}>{OUTCOME_LABEL[c.outcome]}</span>
                      {l && <span className={`px-2 py-0.5 text-[11px] rounded-full border ${STATUS_META[l.status].cls}`}>{STATUS_META[l.status].label}</span>}
                    </div>
                    {l && (
                      <div className="text-xs text-text-muted dark:text-d-text-muted">
                        {[l.mobile, [l.city, l.state].filter(Boolean).join(", ")].filter(Boolean).join(" · ")}
                      </div>
                    )}
                    {c.summary && <div className="text-sm break-words">{c.summary}</div>}
                    {canSeeAll && !member && (
                      <div className="text-[11px] text-text-muted dark:text-d-text-muted">by {label(c.called_by_email)}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </section>
            );
          })
        )}
      </div>
    </AdminLayout>
  );
}
