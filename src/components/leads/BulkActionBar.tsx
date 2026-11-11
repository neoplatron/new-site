import { useState } from "react";
import { Download, Loader2, Trash2, X } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import { STATUSES, STATUS_META, isClosed, type Lead, type LeadStatus } from "./leadTypes";

// Ids go in the request URL, so large selections are sent in batches.
const CHUNK = 100;
const chunks = (ids: string[]) => Array.from({ length: Math.ceil(ids.length / CHUNK) }, (_, i) => ids.slice(i * CHUNK, (i + 1) * CHUNK));

interface Props {
  selected: Lead[];
  onExport: (rows: Lead[]) => void;
  onClear: () => void;
  // Called after a change so the list reloads.
  onDone: () => void;
}

// Shown while leads are ticked in the list (master / admin only).
export default function BulkActionBar({ selected, onExport, onClear, onDone }: Props) {
  const [status, setStatus] = useState<LeadStatus | "">("");
  const [busy, setBusy] = useState<"status" | "delete" | null>(null);
  const n = selected.length;
  const count = `${n.toLocaleString("en-IN")} lead${n === 1 ? "" : "s"}`;

  // Runs one request per batch and returns how many rows the database actually changed.
  const run = async (op: (ids: string[]) => PromiseLike<{ data: { id: string }[] | null; error: { message: string } | null }>) => {
    let changed = 0;
    for (const ids of chunks(selected.map((l) => l.id))) {
      const { data, error } = await op(ids);
      if (error) return { changed, error: error.message };
      changed += data?.length ?? 0;
    }
    return { changed, error: "" };
  };

  const finish = (verb: string, r: { changed: number; error: string }) => {
    setBusy(null);
    if (r.error) alert(`Stopped after ${r.changed} of ${n}: ${r.error}`);
    // Row-level security blocks silently: no error, but fewer rows come back.
    else if (r.changed < n) alert(`Only ${r.changed} of ${n} leads were ${verb}. Your account may not be allowed to change the rest.`);
    onClear();
    onDone();
  };

  const applyStatus = async () => {
    if (!status) return;
    if (!confirm(`Change ${count} to "${STATUS_META[status].label}"?${isClosed(status) ? "\n\nTheir follow-up reminders will be cleared." : ""}`)) return;
    setBusy("status");
    const patch = isClosed(status) ? { status, next_followup_at: null, followup_note: null } : { status };
    finish("updated", await run((ids) => supabase.from("leads").update(patch).in("id", ids).select("id")));
  };

  const remove = async () => {
    if (!confirm(`Delete ${count}?\n\nThis also removes their call history and cannot be undone.`)) return;
    setBusy("delete");
    finish("deleted", await run((ids) => supabase.from("leads").delete().in("id", ids).select("id")));
  };

  const btn = "inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium transition disabled:opacity-50";

  return (
    <div className="fixed z-40 inset-x-3 bottom-20 md:bottom-4 md:left-64 md:right-4 flex flex-wrap items-center gap-2 rounded-2xl border border-primary/40 bg-bg-light dark:bg-d-bg-light p-2.5 shadow-xl text-text dark:text-d-text">
      <span className="px-2 text-sm font-semibold tabular-nums">{n.toLocaleString("en-IN")} selected</span>
      <select
        className="h-9 px-2 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg text-sm"
        value={status}
        onChange={(e) => setStatus(e.target.value as LeadStatus | "")}
        aria-label="New status"
      >
        <option value="">Change status to...</option>
        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
      </select>
      <button onClick={applyStatus} disabled={!status || !!busy} className={`${btn} bg-primary text-white`}>
        {busy === "status" && <Loader2 className="w-4 h-4 animate-spin" />}Apply
      </button>
      <button onClick={() => onExport(selected)} disabled={!!busy} className={`${btn} border border-border dark:border-d-border hover:border-primary/50 hover:text-primary`}>
        <Download className="w-4 h-4" />Export
      </button>
      <button onClick={remove} disabled={!!busy} className={`${btn} border border-red-500/40 text-red-600 hover:bg-red-500/10`}>
        {busy === "delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}Delete
      </button>
      <button onClick={onClear} disabled={!!busy} aria-label="Clear selection" title="Clear selection" className={`${btn} ml-auto text-text-muted dark:text-d-text-muted hover:bg-border/40`}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
