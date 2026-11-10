import { useState } from "react";
import { Loader2, Upload, X } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import { parseSheet, type ParsedRow } from "../../utils/leadsImport";
import type { Database } from "../../integrations/supabase/types";

type CallInsert = Database["public"]["Tables"]["lead_calls"]["Insert"];

interface Props {
  userId: string;
  onClose: () => void;
  onDone: () => void;
}

export default function ImportCsvModal({ userId, onClose, onDone }: Props) {
  const [parsed, setParsed] = useState<{ rows: ParsedRow[]; skipped: number; type: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    setMsg("");
    setParsed(parseSheet(await f.text()));
  };

  const run = async () => {
    if (!parsed) return;
    setBusy(true);
    setMsg("");
    try {
      // The website saves each enquiry to the dashboard and to the sheet a few seconds apart, so a
      // sheet row within 15 minutes of an existing lead (same type and mobile) is the same enquiry.
      const digits = (m: string) => m.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
      const existing = new Map<string, number[]>();
      for (let from = 0; ; from += 1000) {
        const { data, error } = await supabase
          .from("leads").select("mobile,created_at,inquiry_type").order("created_at").range(from, from + 999);
        if (error) throw error;
        for (const l of data ?? []) {
          const k = `${l.inquiry_type ?? "installation"}|${digits(l.mobile)}`;
          existing.set(k, [...(existing.get(k) ?? []), new Date(l.created_at).getTime()]);
        }
        if (!data || data.length < 1000) break;
      }
      const fresh = parsed.rows.filter((r) => {
        const k = `${r.lead.inquiry_type ?? "installation"}|${digits(r.lead.mobile)}`;
        const t = new Date(r.lead.created_at!).getTime();
        const times = existing.get(k) ?? [];
        if (times.some((x) => Math.abs(x - t) < 15 * 60_000)) return false;
        existing.set(k, [...times, t]);
        return true;
      });

      let inserted = 0;
      for (let i = 0; i < fresh.length; i += 100) {
        const chunk = fresh.slice(i, i + 100);
        // ignoreDuplicates: re-importing never overwrites telecaller edits; returns only the new rows.
        const { data, error } = await supabase
          .from("leads")
          .upsert(chunk.map((r) => r.lead), { onConflict: "mobile,created_at", ignoreDuplicates: true })
          .select("id,mobile,created_at");
        if (error) throw error;
        const idByKey = new Map((data ?? []).map((d) => [`${d.mobile}|${new Date(d.created_at).getTime()}`, d.id]));
        const calls: CallInsert[] = [];
        for (const r of chunk) {
          const id = idByKey.get(`${r.lead.mobile}|${new Date(r.lead.created_at!).getTime()}`);
          if (id && r.call) {
            calls.push({ lead_id: id, called_by: userId, called_by_email: "Sheet import", outcome: r.call.outcome, summary: r.call.summary });
          }
        }
        inserted += data?.length ?? 0;
        if (calls.length) {
          const { error: cErr } = await supabase.from("lead_calls").insert(calls);
          if (cErr) throw cErr;
        }
      }
      setMsg(`Imported ${inserted} new lead(s). ${parsed.rows.length - inserted} already existed.`);
      onDone();
    } catch (e) {
      console.error(e);
      setMsg(e instanceof Error ? `Import failed: ${e.message}` : "Import failed");
    } finally {
      setBusy(false);
    }
  };

  const called = parsed?.rows.filter((r) => r.call).length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-bg-light dark:bg-d-bg-light p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-text dark:text-d-text">Import from Google Sheet</h2>
          <button onClick={onClose} aria-label="Close"><X className="w-5 h-5" /></button>
        </div>
        <p className="text-sm text-text-para dark:text-d-text-para">
          Open the Installation, Franchise or Distribution tab in the sheet, then File, Download,
          Comma-separated values (.csv), and upload it here (one tab at a time). Existing leads
          (same mobile and timestamp) are skipped, so it is safe to import again.
        </p>
        <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border dark:border-d-border rounded-xl py-6 cursor-pointer text-sm text-text dark:text-d-text">
          <Upload className="w-4 h-4" /> Choose CSV file
          <input type="file" accept=".csv,.tsv,text/csv,text/tab-separated-values" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {parsed && (
          <div className="text-sm text-text dark:text-d-text space-y-1">
            <div>Detected tab: <b className="capitalize">{parsed.type}</b> enquiries.</div>
            <div><b>{parsed.rows.length}</b> leads found{parsed.skipped ? `, ${parsed.skipped} rows skipped (missing name/mobile/date)` : ""}.</div>
            <div><b>{called}</b> already called - their call notes will be added to history.</div>
            <div><b>{parsed.rows.filter((r) => r.lead.state).length}</b> have a state.</div>
          </div>
        )}
        {msg && <p className="text-sm text-text dark:text-d-text">{msg}</p>}
        <button
          disabled={!parsed || !parsed.rows.length || busy}
          onClick={run}
          className="w-full py-2.5 rounded-lg bg-linear-to-r from-primary to-secondary text-white font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}Import
        </button>
      </div>
    </div>
  );
}
