import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { EMPTY_BUCKET_COUNTS, bucketsFor, type Bucket, type Lead } from "../components/leads/leadTypes";

const PAGE = 1000;

// Loads every lead and classifies them into reminder buckets.
// Shared by the dashboard (reminder counts) and the leads list.
export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());

  const load = useCallback(async () => {
    setLoading(true);
    const all: Lead[] = [];
    for (let from = 0; ; from += PAGE) {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, from + PAGE - 1);
      if (error) {
        console.error("Error loading leads:", error);
        break;
      }
      all.push(...((data ?? []) as Lead[]));
      if (!data || data.length < PAGE) break;
    }
    setLeads(all);
    setNow(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Refresh the clock every minute so "overdue" stays accurate.
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const repeatMobiles = useMemo(() => {
    const seen = new Map<string, number>();
    leads.forEach((l) => seen.set(l.mobile, (seen.get(l.mobile) ?? 0) + 1));
    return new Set([...seen].filter(([, n]) => n > 1).map(([m]) => m));
  }, [leads]);

  const bucketMap = useMemo(() => {
    const m = new Map<string, Bucket[]>();
    leads.forEach((l) => m.set(l.id, bucketsFor(l, now, repeatMobiles)));
    return m;
  }, [leads, now, repeatMobiles]);

  const counts = useMemo(() => {
    const c: Record<Bucket, number> = { ...EMPTY_BUCKET_COUNTS };
    bucketMap.forEach((bs) => bs.forEach((b) => c[b]++));
    return c;
  }, [bucketMap]);

  return { leads, loading, load, now, bucketMap, counts };
}
