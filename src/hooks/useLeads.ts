import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { EMPTY_BUCKET_COUNTS, bucketsFor, type Bucket, type Lead } from "../components/leads/leadTypes";

const PAGE = 1000;

// Last loaded list, kept for the browser session so moving between Dashboard and Leads
// shows data at once while a fresh copy loads in the background.
let cache: Lead[] | null = null;
// Only the most recent load may update the screen (an older, slower one must not overwrite it).
let latestLoad = 0;

supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") cache = null;
});

// False once we learn the get_all_leads database function is not installed.
let rpcAvailable = true;

// Fast path: one request returns every lead (see the get_all_leads migration).
// Returns undefined when the function is unavailable so the caller falls back to paging.
async function fetchViaRpc(): Promise<Lead[] | undefined> {
  if (!rpcAvailable) return undefined;
  const { data, error } = await supabase.rpc("get_all_leads");
  if (error || !Array.isArray(data)) {
    // PGRST202 = function not found: stop trying for this session.
    if (error?.code === "PGRST202") rpcAvailable = false;
    else console.error("get_all_leads failed, falling back to paging:", error);
    return undefined;
  }
  return data as unknown as Lead[];
}

// Fallback: the table is read 1000 rows at a time, one page after another.
async function fetchPaged(): Promise<Lead[] | null> {
  const all: Lead[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) {
      console.error("Error loading leads:", error);
      return null;
    }
    all.push(...((data ?? []) as Lead[]));
    if (!data || data.length < PAGE) return all;
  }
}

async function fetchAllLeads(): Promise<Lead[] | null> {
  const started = performance.now();
  const viaRpc = await fetchViaRpc();
  const all = viaRpc ?? (await fetchPaged());
  if (all) {
    console.info(`Leads: ${all.length} loaded in ${Math.round(performance.now() - started)} ms (${viaRpc ? "single request" : "paged"})`);
  }
  return all;
}

// A page mounting twice in quick succession (React dev mode does this) shares one download.
let inflight: Promise<Lead[] | null> | null = null;
const fetchShared = () => (inflight ??= fetchAllLeads().finally(() => { inflight = null; }));

// Loads every lead and classifies them into reminder buckets.
// Shared by the dashboard (reminder counts) and the leads list.
export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(() => cache ?? []);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());

  // shared = may reuse a download already in progress (page open); a refresh after a
  // save must always fetch again so it sees the change.
  const run = useCallback(async (shared: boolean) => {
    const mine = ++latestLoad;
    setLoading(true);
    const all = await (shared ? fetchShared() : fetchAllLeads());
    if (mine !== latestLoad) return;
    // On a failed load keep showing what we already have.
    if (all) {
      cache = all;
      setLeads(all);
    }
    setNow(new Date());
    setLoading(false);
  }, []);

  const load = useCallback(() => run(false), [run]);

  useEffect(() => {
    run(true);
  }, [run]);

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
