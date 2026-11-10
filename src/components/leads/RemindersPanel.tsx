import { AlertTriangle, BellRing, CalendarCheck, CalendarClock, CalendarDays, CalendarRange, PhoneForwarded, Repeat, Sparkles } from "lucide-react";
import type { Bucket } from "./leadTypes";

const META: Record<Bucket, { title: string; hint: string; icon: typeof BellRing; cls: string }> = {
  overdue: { title: "Overdue callbacks", hint: "Promised a call - time has passed", icon: AlertTriangle, cls: "border-red-500/50 bg-red-500/10 text-red-600" },
  today: { title: "Call back today", hint: "Follow-ups due later today", icon: BellRing, cls: "border-amber-500/50 bg-amber-500/10 text-amber-600" },
  visit_today: { title: "Visiting today", hint: "Customers expected at the centre", icon: CalendarCheck, cls: "border-emerald-500/50 bg-emerald-500/10 text-emerald-600" },
  new: { title: "New - not called", hint: "Never contacted yet", icon: Sparkles, cls: "border-blue-500/50 bg-blue-500/10 text-blue-600" },
  repeat: { title: "Repeat enquiries", hint: "Submitted the form more than once", icon: Repeat, cls: "border-zinc-500/50 bg-zinc-500/10 text-zinc-600" },
  tomorrow: { title: "Call back tomorrow", hint: "Follow-ups due tomorrow", icon: PhoneForwarded, cls: "border-orange-500/50 bg-orange-500/10 text-orange-600" },
  visit_tomorrow: { title: "Visiting tomorrow", hint: "Call today to confirm", icon: CalendarClock, cls: "border-purple-500/50 bg-purple-500/10 text-purple-600" },
  upcoming: { title: "Later this week", hint: "Calls and visits in 2-7 days", icon: CalendarRange, cls: "border-sky-500/50 bg-sky-500/10 text-sky-600" },
};

export const BUCKET_TITLE = Object.fromEntries(
  Object.entries(META).map(([k, v]) => [k, v.title])
) as Record<Bucket, string>;

const GROUPS: { title: string; icon: typeof BellRing; buckets: Bucket[]; grid: string }[] = [
  { title: "Today's reminders", icon: BellRing, buckets: ["overdue", "today", "visit_today", "new", "repeat"], grid: "lg:grid-cols-5" },
  { title: "Upcoming reminders", icon: CalendarDays, buckets: ["tomorrow", "visit_tomorrow", "upcoming"], grid: "lg:grid-cols-5" },
];

interface Props {
  counts: Record<Bucket, number>;
  active: Bucket | "";
  onSelect: (b: Bucket | "") => void;
}

export default function RemindersPanel({ counts, active, onSelect }: Props) {
  return (
    <section className="space-y-4">
      {GROUPS.map((g, gi) => {
        const total = g.buckets.reduce((n, b) => n + (b === "repeat" ? 0 : counts[b]), 0);
        const GroupIcon = g.icon;
        return (
          <div key={g.title}>
            <div className="flex items-center gap-2 mb-2.5">
              <GroupIcon className="w-5 h-5 text-primary" />
              <h2 className="text-base md:text-lg font-bold text-text dark:text-d-text">{g.title}</h2>
              <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-bold">{total.toLocaleString("en-IN")}</span>
              {gi === 0 && active && (
                <button onClick={() => onSelect("")} className="ml-auto text-xs underline text-text-muted dark:text-d-text-muted">
                  Clear
                </button>
              )}
            </div>
            <div className={`grid grid-cols-2 sm:grid-cols-3 ${g.grid} gap-2.5 md:gap-3`}>
              {g.buckets.map((b) => {
                const m = META[b];
                const Icon = m.icon;
                return (
                  <button
                    key={b}
                    onClick={() => onSelect(active === b ? "" : b)}
                    className={`text-left rounded-2xl lg:rounded-xl border lg:border-2 p-3 shadow-sm lg:shadow-none transition active:scale-[0.98] ${m.cls} ${active === b ? "ring-2 ring-primary" : ""} ${counts[b] === 0 ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="w-4 h-4" />
                      <span className="text-2xl font-bold tabular-nums">{counts[b].toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-sm font-semibold mt-1 leading-tight">{m.title}</div>
                    <div className="text-[11px] opacity-80 leading-tight mt-0.5">{m.hint}</div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </section>
  );
}
