import { AlertTriangle, BellRing, CalendarCheck, CalendarClock, CalendarDays, CalendarRange, ChevronRight, History, Layers, PhoneCall, PhoneForwarded, Repeat, Sparkles } from "lucide-react";
import type { Bucket } from "./leadTypes";

type Meta = { title: string; hint: string; icon: typeof BellRing; chip: string; num: string };

const META: Record<Bucket, Meta> = {
  overdue: { title: "Overdue callbacks", hint: "Promised a call, time has passed", icon: AlertTriangle, chip: "bg-red-500/15 text-red-600 dark:text-red-400", num: "text-red-600 dark:text-red-400" },
  today: { title: "Call back today", hint: "Follow-ups due later today", icon: BellRing, chip: "bg-amber-500/15 text-amber-600 dark:text-amber-400", num: "text-amber-600 dark:text-amber-400" },
  visit_today: { title: "Visiting today", hint: "Customers expected at the centre", icon: CalendarCheck, chip: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400", num: "text-emerald-600 dark:text-emerald-400" },
  new: { title: "New, not called", hint: "Never contacted yet", icon: Sparkles, chip: "bg-blue-500/15 text-blue-600 dark:text-blue-400", num: "text-blue-600 dark:text-blue-400" },
  called: { title: "Already called", hint: "Contacted at least once", icon: PhoneCall, chip: "bg-teal-500/15 text-teal-600 dark:text-teal-400", num: "text-teal-600 dark:text-teal-400" },
  followup: { title: "Follow up", hint: "Open leads needing another call", icon: History, chip: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400", num: "text-indigo-600 dark:text-indigo-400" },
  repeat: { title: "Repeat enquiries", hint: "Submitted the form more than once", icon: Repeat, chip: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400", num: "text-zinc-600 dark:text-zinc-300" },
  tomorrow: { title: "Call back tomorrow", hint: "Follow-ups due tomorrow", icon: PhoneForwarded, chip: "bg-orange-500/15 text-orange-600 dark:text-orange-400", num: "text-orange-600 dark:text-orange-400" },
  visit_tomorrow: { title: "Visiting tomorrow", hint: "Call today to confirm", icon: CalendarClock, chip: "bg-purple-500/15 text-purple-600 dark:text-purple-400", num: "text-purple-600 dark:text-purple-400" },
  upcoming: { title: "Later this week", hint: "Calls and visits in 2-7 days", icon: CalendarRange, chip: "bg-sky-500/15 text-sky-600 dark:text-sky-400", num: "text-sky-600 dark:text-sky-400" },
};

export const BUCKET_TITLE = Object.fromEntries(
  Object.entries(META).map(([k, v]) => [k, v.title])
) as Record<Bucket, string>;

type Group = {
  title: string;
  subtitle: string;
  icon: typeof BellRing;
  buckets: Bucket[];
  grid: string;
  /** Show a total badge: only for groups where every card is a task due on that day. */
  showTotal: boolean;
};

const GROUPS: Group[] = [
  {
    title: "Today's reminders",
    subtitle: "Calls and visits you promised for today",
    icon: BellRing,
    buckets: ["overdue", "today", "visit_today"],
    grid: "lg:grid-cols-3",
    showTotal: true,
  },
  {
    title: "Upcoming reminders",
    subtitle: "Coming up in the next few days",
    icon: CalendarDays,
    buckets: ["tomorrow", "visit_tomorrow", "upcoming"],
    grid: "lg:grid-cols-3",
    showTotal: true,
  },
  {
    title: "Lead pipeline",
    subtitle: "Where your leads stand right now",
    icon: Layers,
    buckets: ["new", "called", "followup", "repeat"],
    grid: "lg:grid-cols-4",
    showTotal: false,
  },
];

interface Props {
  counts: Record<Bucket, number>;
  active: Bucket | "";
  onSelect: (b: Bucket | "") => void;
}

export default function RemindersPanel({ counts, active, onSelect }: Props) {
  return (
    <section className="space-y-7 md:space-y-9">
      {GROUPS.map((g, gi) => {
        const total = g.buckets.reduce((n, b) => n + counts[b], 0);
        const GroupIcon = g.icon;
        return (
          <div key={g.title}>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <GroupIcon className="w-[18px] h-[18px]" />
              </span>
              <div className="min-w-0 leading-tight">
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-bold text-text dark:text-d-text">{g.title}</h2>
                  {g.showTotal && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                        total > 0 ? "bg-primary text-white" : "bg-border/50 dark:bg-d-border text-text-muted dark:text-d-text-muted"
                      }`}
                    >
                      {total.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted dark:text-d-text-muted mt-0.5">{g.subtitle}</p>
              </div>
              {gi === 0 && active && (
                <button onClick={() => onSelect("")} className="ml-auto text-xs font-medium text-primary hover:underline">
                  Clear filter
                </button>
              )}
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 ${g.grid} gap-3`}>
              {g.buckets.map((b) => {
                const m = META[b];
                const Icon = m.icon;
                const empty = counts[b] === 0;
                return (
                  <button
                    key={b}
                    onClick={() => onSelect(active === b ? "" : b)}
                    className={`group relative text-left rounded-2xl bg-bg-light dark:bg-d-bg-light border border-border dark:border-d-border p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40 active:scale-[0.98] transition-all duration-200 ${
                      active === b ? "ring-2 ring-primary border-primary/40" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.chip} ${empty ? "opacity-50" : ""}`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <span
                        className={`text-3xl font-bold tabular-nums leading-none tracking-tight ${
                          empty ? "text-text-muted/50 dark:text-d-text-muted/50" : m.num
                        }`}
                      >
                        {counts[b].toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold text-text dark:text-d-text leading-tight">{m.title}</div>
                        <div className="text-xs text-text-muted dark:text-d-text-muted leading-snug mt-0.5">{m.hint}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 shrink-0 text-text-muted/60 dark:text-d-text-muted/60 group-hover:translate-x-0.5 group-hover:text-primary transition" />
                    </div>
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
