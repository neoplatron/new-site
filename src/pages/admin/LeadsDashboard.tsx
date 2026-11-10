import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BellRing, Clock, Download, Loader2, Phone, Plus, RefreshCw, Search, SlidersHorizontal, Upload, X } from "lucide-react";
import WhatsAppIcon from "../../components/leads/WhatsAppIcon";
import AdminLayout from "../../components/admin/AdminLayout";
import SEO from "../../components/SEO";
import { useAdminRole } from "../../hooks/useAdminRole";
import { useLeads } from "../../hooks/useLeads";
import { INDIAN_STATES } from "../../data/indianStates";
import { downloadCsv } from "../../utils/csv";
import LeadDrawer from "../../components/leads/LeadDrawer";
import { BUCKET_TITLE } from "../../components/leads/RemindersPanel";
import AddLeadModal from "../../components/leads/AddLeadModal";
import ImportCsvModal from "../../components/leads/ImportCsvModal";
import {
  INQUIRY_META, INQUIRY_TYPES, STATUSES, STATUS_META, addDays, fmtDate, fmtDateTime, fmtYmd, startOfDay, waLink,
  type Bucket, type InquiryType, type Lead,
} from "../../components/leads/leadTypes";

const MOBILE_PAGE = 40;
const DESKTOP_PAGE = 100;
const sel =
  "h-10 px-3 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text text-sm shadow-sm transition focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

const ghostBtn =
  "inline-flex items-center justify-center gap-1.5 h-10 min-w-10 px-2.5 md:px-3.5 rounded-lg border border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light text-sm font-medium shadow-sm hover:border-primary/50 hover:text-primary active:scale-95 transition";

const initialsOf = (name: string) => name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
// Some enquiries already carry the state inside the city text; don't print it twice.
const locationOf = (city?: string | null, state?: string | null) =>
  city && state && city.toLowerCase().includes(state.toLowerCase()) ? city : [city, state].filter(Boolean).join(", ");

const isPartner = (l: Lead) => l.inquiry_type === "franchise" || l.inquiry_type === "distribution";

const fsel =`${sel} w-full min-w-0 md:w-auto`;

export default function LeadsDashboard() {
  const { role, email, userId, loading: roleLoading } = useAdminRole();
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  // Phones render cards in pages so thousands of leads don't slow scrolling.
  const [mobileLimit, setMobileLimit] = useState(MOBILE_PAGE);
  // The desktop table does the same: drawing ~4,000 rows on every filter change made the page lag.
  const [desktopLimit, setDesktopLimit] = useState(DESKTOP_PAGE);
  useEffect(() => { setMobileLimit(MOBILE_PAGE); setDesktopLimit(DESKTOP_PAGE); }, [params]);
  const { leads, loading, load, now, bucketMap } = useLeads();
  const [openId, setOpenId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const get = (k: string) => params.get(k) ?? "";
  const setP = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  // The dropdown lists only real Indian states/UTs; junk values typed into old enquiries fall under "Other".
  const states = useMemo(() => [...INDIAN_STATES].sort(), []);
  const targets = useMemo(() => [...new Set(leads.map((l) => l.install_target).filter((s): s is string => !!s))].sort(), [leads]);

  const filtered = useMemo(() => {
    const q = get("q").trim().toLowerCase();
    const st = get("state");
    const status = get("status");
    const target = get("target");
    const cc = get("cc");
    const from = get("from");
    const to = get("to");
    const mine = get("mine") === "1";
    const follow = get("follow");
    const bucket = get("bucket") as Bucket | "";
    const sod = startOfDay(now).getTime();
    const weekEnd = addDays(startOfDay(now), 7).getTime();

    const type = get("type");

    const list = leads.filter((l) => {
      // Rows loaded before the inquiry_type migration is applied have no type: treat as installation.
      if (type && (l.inquiry_type ?? "installation") !== type) return false;
      if (q && ![l.full_name, l.mobile, l.vehicle, l.city, l.state, l.email, l.territory, l.occupation].some((v) => v?.toLowerCase().includes(q))) return false;
      if (st === "__none") { if (l.state) return false; }
      else if (st === "__other") { if (!l.state || (INDIAN_STATES as readonly string[]).includes(l.state)) return false; }
      else if (st && l.state !== st) return false;
      if (status && l.status !== status) return false;
      if (target && l.install_target !== target) return false;
      if (cc && l.engine_capacity !== cc) return false;
      if (from && l.created_at < new Date(from + "T00:00:00").toISOString()) return false;
      if (to && l.created_at > new Date(to + "T23:59:59").toISOString()) return false;
      if (mine && l.assigned_to !== userId) return false;
      if (follow) {
        const t = l.next_followup_at ? new Date(l.next_followup_at).getTime() : null;
        if (t === null) return false;
        if (follow === "overdue" && t >= now.getTime()) return false;
        if (follow === "today" && !(t >= sod && t < sod + 86_400_000)) return false;
        if (follow === "week" && !(t < weekEnd)) return false;
      }
      if (bucket && !bucketMap.get(l.id)?.includes(bucket)) return false;
      return true;
    });

    const sort = get("sort");
    // "Latest first" is the calling queue: a lead drops out of it once a call has been logged.
    if (sort === "latest") {
      return list.filter((l) => l.call_count === 0).sort((a, b) => b.created_at.localeCompare(a.created_at));
    }
    if (sort === "oldest") return list.sort((a, b) => a.created_at.localeCompare(b.created_at));
    // Default: follow-ups first (soonest), then newest enquiries.
    return list.sort((a, b) => {
      const ta = a.next_followup_at ? new Date(a.next_followup_at).getTime() : Infinity;
      const tb = b.next_followup_at ? new Date(b.next_followup_at).getTime() : Infinity;
      if (ta !== tb) return ta - tb;
      return b.created_at.localeCompare(a.created_at);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, params, now, userId, bucketMap]);

  const typeCounts = useMemo(() => {
    const c: Record<InquiryType, number> = { installation: 0, franchise: 0, distribution: 0 };
    leads.forEach((l) => c[l.inquiry_type ?? "installation"]++);
    return c;
  }, [leads]);

  const byState = useMemo(() => {
    const m = new Map<string, number>();
    const type = get("type");
    leads.filter((l) => !type || (l.inquiry_type ?? "installation") === type).forEach((l) => m.set(l.state || "Unknown", (m.get(l.state || "Unknown") ?? 0) + 1));
    return [...m].sort((a, b) => b[1] - a[1]).slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leads, params]);

  const exportCsv = () => {
    downloadCsv(`neoplatron-leads-${new Date().toISOString().slice(0, 10)}.csv`, [
      ["Enquired", "Name", "Mobile", "City", "State", "Install on", "Vehicle", "Engine", "Status", "Calls", "Last called", "Next follow-up", "Visit date", "Remark"],
      ...filtered.map((l) => [
        fmtDateTime(l.created_at), l.full_name, l.mobile, l.city, l.state, l.install_target, l.vehicle, l.engine_capacity,
        STATUS_META[l.status].label, l.call_count, fmtDateTime(l.last_called_at), fmtDateTime(l.next_followup_at), l.visit_date, l.interest_reason,
      ]),
    ]);
  };

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-d-bg">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-d-bg text-text dark:text-d-text p-6 text-center">
        Your account has no role assigned yet. Ask the master admin to invite your email.
      </div>
    );
  }

  const openLead = leads.find((l) => l.id === openId) ?? null;
  const activeFilterCount = ["state", "status", "target", "cc", "from", "to", "follow", "sort"].filter((k) => get(k)).length;
  const hasFilters =["sort", "type","q","state", "status", "target", "cc", "from", "to", "mine", "follow", "bucket"].some((k) => get(k));

  return (
    <AdminLayout
      role={role}
      email={email}
      title="Leads"
      actions={
        <>
          <button onClick={load} className={ghostBtn} aria-label="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          {/* Telecallers can view and call leads but not bulk-export them. */}
          {role !== "telecaller" && (
            <button onClick={exportCsv} aria-label="Export" className={ghostBtn}>
              <Download className="w-4 h-4" /><span className="hidden md:inline">Export</span>
            </button>
          )}
          {role === "master" && (
            <button onClick={() => setShowImport(true)} aria-label="Import sheet" className={ghostBtn}>
              <Upload className="w-4 h-4" /><span className="hidden md:inline">Import sheet</span>
            </button>
          )}
          <button onClick={() => setShowAdd(true)} aria-label="Add enquiry" className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/25 active:scale-95 transition">
            <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add enquiry</span><span className="sm:hidden">Add</span>
          </button>
        </>
      }
    >
      <SEO title="Leads - Neoplatron" noindex />
      <div className="space-y-4 md:space-y-6">
        {/* Set when arriving from a dashboard reminder card */}
        {get("bucket") && BUCKET_TITLE[get("bucket") as Bucket] && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-muted dark:text-d-text-muted">Showing reminder:</span>
            <span className="inline-flex items-center gap-1.5 max-w-full pl-3 pr-1 py-1 rounded-full bg-primary text-white font-medium shadow-sm shadow-primary/30">
              <BellRing className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{BUCKET_TITLE[get("bucket") as Bucket]}</span>
              <button onClick={() => setP("bucket", "")} className="shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors" aria-label="Clear reminder filter" title="Show all leads">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}

        {/* Enquiry type: installation / franchise / distribution */}
        <select className={`${sel} w-full md:hidden font-medium`} value={get("type")} onChange={(e) => setP("type", e.target.value)} aria-label="Enquiry type">
          <option value="">All enquiries ({leads.length.toLocaleString("en-IN")})</option>
          {INQUIRY_TYPES.map((t) => (
            <option key={t} value={t}>{INQUIRY_META[t].label} ({typeCounts[t].toLocaleString("en-IN")})</option>
          ))}
        </select>
        <div className="hidden md:flex gap-1 p-1 rounded-xl bg-border/30 w-fit" role="tablist" aria-label="Enquiry type">
          {(["", ...INQUIRY_TYPES] as const).map((t) => {
            const active = get("type") === t;
            return (
              <button
                key={t || "all"}
                role="tab"
                aria-selected={active}
                onClick={() => setP("type", t)}
                className={`flex-1 md:flex-none shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-1.5 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition ${active ? "bg-bg-light dark:bg-d-bg-light text-primary shadow-sm" : "text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text"}`}
              >
                {t ? INQUIRY_META[t].label : "All"}
                <span className="text-[11px] tabular-nums opacity-70">{(t ? typeCounts[t] : leads.length).toLocaleString("en-IN")}</span>
              </button>
            );
          })}
        </div>

        <section className="md:rounded-2xl md:bg-bg-light md:dark:bg-d-bg-light md:border border-border dark:border-d-border md:p-4 md:shadow-sm">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted dark:text-d-text-muted mb-2.5">Leads by state <span className="hidden md:inline">(click to filter)</span></div>
          <div className="flex gap-2 overflow-x-auto -mx-4 px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:mx-0 md:px-0 md:pb-0">
            {byState.map(([s, n]) => {
              const active = s === "Unknown" ? get("state") === "__none" : get("state") === s;
              return (
                <button
                  key={s}
                  onClick={() => setP("state", active ? "" : s === "Unknown" ? "__none" : s)}
                  className={`shrink-0 whitespace-nowrap inline-flex items-center gap-2 pl-3 pr-1.5 py-1 rounded-full text-xs font-medium border transition ${active ? "bg-primary text-white border-primary shadow-sm shadow-primary/30" : "border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light md:bg-bg md:dark:bg-d-bg hover:border-primary/50 hover:text-primary"}`}
                >
                  {s}
                  <span className={`min-w-6 px-1.5 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ${active ? "bg-white/20" : "bg-border/40 text-text-muted dark:text-d-text-muted"}`}>{n.toLocaleString("en-IN")}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-wrap gap-2 items-center md:rounded-2xl md:bg-bg-light md:dark:bg-d-bg-light md:border border-border dark:border-d-border md:p-3 md:shadow-sm">
          <div className="relative flex-1 min-w-0 md:min-w-[260px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input className={`${sel} w-full pl-9`} placeholder="Search name, mobile, vehicle, city" value={get("q")} onChange={(e) => setP("q", e.target.value)} />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            className={`md:hidden inline-flex items-center gap-1.5 h-10 px-3 rounded-lg border text-sm font-medium shadow-sm ${showFilters || activeFilterCount ? "border-primary text-primary" : "border-border dark:border-d-border"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="min-w-5 h-5 px-1 rounded-full bg-primary text-white text-[11px] flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
          {/* Collapsible on phones, always inline on desktop */}
          <div className={`${showFilters ? "grid grid-cols-2 gap-2 w-full" : "hidden"} md:contents`}>
            <select className={`${fsel} md:max-w-[220px]`} value={get("state")} onChange={(e) => setP("state", e.target.value)}>
              <option value="">All states</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
              <option value="__none">No state given</option>
              <option value="__other">Other / unrecognised</option>
            </select>
            <select className={fsel} value={get("status")} onChange={(e) => setP("status", e.target.value)}>
              <option value="">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
            </select>
            <select className={fsel} value={get("target")} onChange={(e) => setP("target", e.target.value)}>
              <option value="">Any vehicle type</option>
              {targets.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className={fsel} value={get("cc")} onChange={(e) => setP("cc", e.target.value)}>
              <option value="">Any engine size</option>
              <option value="Below 1800cc">Below 1800cc</option>
              <option value="Above 1800cc">Above 1800cc</option>
              <option value="I'm Not Sure of My Vehicle's Engine Capacity">Not sure</option>
            </select>
            <select className={fsel} value={get("follow")} onChange={(e) => setP("follow", e.target.value)}>
              <option value="">Any follow-up</option>
              <option value="overdue">Overdue</option>
              <option value="today">Today</option>
              <option value="week">Next 7 days</option>
            </select>
            <select className={fsel} value={get("sort")} onChange={(e) => setP("sort", e.target.value)} aria-label="Sort order">
              <option value="">Sort: Follow-ups first</option>
              <option value="latest">Sort: Latest first (not called yet)</option>
              <option value="oldest">Sort: Oldest first</option>
            </select>
            <input type="date" className={fsel} value={get("from")} onChange={(e) => setP("from", e.target.value)} aria-label="From date" />
            <input type="date" className={fsel} value={get("to")} onChange={(e) => setP("to", e.target.value)} aria-label="To date" />
          </div>
          {hasFilters && (
            <button onClick={() => setParams({}, { replace: true })} className="inline-flex items-center gap-1 h-10 px-3 rounded-lg text-sm font-medium text-text-muted dark:text-d-text-muted hover:text-red-500 hover:bg-red-500/10 transition"><X className="w-4 h-4" />Reset</button>
          )}
        </section>

        <div className="text-xs md:text-sm text-text-muted dark:text-d-text-muted">
          Showing <b className="text-text dark:text-d-text tabular-nums">{filtered.length.toLocaleString("en-IN")}</b> of <span className="tabular-nums">{leads.length.toLocaleString("en-IN")}</span> leads
        </div>

        {loading && leads.length === 0 ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-text-muted dark:text-d-text-muted">No leads match these filters.</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-border/20 text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted">
                  <tr>
                    {["Name", "Location", "Vehicle", "Status", "Last call", "Next follow-up"].map((h) => (
                      <th key={h} className={`px-3 py-3 font-semibold whitespace-nowrap ${h === "Last call" ? "hidden xl:table-cell" : ""}`}>{h}</th>
                    ))}
                    <th className="px-3 py-3" aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, desktopLimit).map((l) => {
                    const overdue = bucketMap.get(l.id)?.includes("overdue");
                    return (
                      <tr key={l.id} onClick={() => setOpenId(l.id)} className="group border-t border-border/70 dark:border-d-border/70 hover:bg-primary/5 cursor-pointer transition-colors">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 shrink-0 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center">{initialsOf(l.full_name)}</div>
                            <div className="min-w-0">
                              <div className="font-semibold group-hover:text-primary transition-colors">{l.full_name}</div>
                              <div className="text-xs text-text-muted dark:text-d-text-muted tabular-nums whitespace-nowrap">{l.mobile} · {fmtDate(l.created_at)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 max-w-[200px]">{locationOf(l.city, l.state) || <span className="text-text-muted dark:text-d-text-muted">-</span>}</td>
                        <td className="px-3 py-3 max-w-[180px]">
                          {isPartner(l) ? (
                            <>
                              <span className={`inline-block px-2 py-0.5 text-[11px] font-medium rounded-full border ${INQUIRY_META[l.inquiry_type].cls}`}>{INQUIRY_META[l.inquiry_type].label}</span>
                              <div className="text-xs text-text-muted dark:text-d-text-muted mt-0.5">{[l.occupation, l.territory].filter(Boolean).join(" · ")}</div>
                            </>
                          ) : (
                            <><div>{l.vehicle || "-"}</div><div className="text-xs text-text-muted dark:text-d-text-muted">{l.install_target}</div></>
                          )}
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-xs font-medium rounded-full border ${STATUS_META[l.status].cls}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                            {STATUS_META[l.status].label}
                          </span>
                        </td>
                        <td className="hidden xl:table-cell px-3 py-3 whitespace-nowrap tabular-nums">
                          {l.last_called_at ? fmtDateTime(l.last_called_at) : <span className="text-text-muted dark:text-d-text-muted">Not called</span>}
                          <div className="text-xs text-text-muted dark:text-d-text-muted">{l.call_count} call{l.call_count === 1 ? "" : "s"}</div>
                        </td>
                        <td className={`px-3 py-3 ${overdue ? "text-red-600 font-semibold" : ""}`}>
                          <div className="whitespace-nowrap tabular-nums">{l.next_followup_at ? fmtDateTime(l.next_followup_at) : <span className="text-text-muted dark:text-d-text-muted">-</span>}</div>
                          {l.visit_date && <div className="text-xs">Visit {fmtYmd(l.visit_date)}</div>}
                          {l.followup_note && <div title={l.followup_note} className="text-xs font-normal text-text-muted dark:text-d-text-muted max-w-[160px] truncate">{l.followup_note}</div>}
                        </td>
                        {/* Pinned to the right edge so Call / WhatsApp stay reachable on narrow screens */}
                        <td className="px-3 py-3 whitespace-nowrap text-right sticky right-0 bg-bg-light dark:bg-d-bg-light group-hover:bg-bg dark:group-hover:bg-d-bg transition-colors" onClick={(e) => e.stopPropagation()}>
                          <a href={`tel:${l.mobile}`} className="inline-flex p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors mr-1.5" aria-label="Call" title="Call"><Phone className="w-4 h-4" /></a>
                          <a href={waLink(l.mobile)} target="_blank" rel="noreferrer" className="inline-flex p-2 rounded-lg bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-colors" aria-label="WhatsApp" title="WhatsApp"><WhatsAppIcon className="w-4 h-4" /></a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length > desktopLimit && (
                <button onClick={() => setDesktopLimit((n) => n + DESKTOP_PAGE)} className="w-full py-3 border-t border-border dark:border-d-border text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                  Show {Math.min(DESKTOP_PAGE, filtered.length - desktopLimit)} more ({(filtered.length - desktopLimit).toLocaleString("en-IN")} left)
                </button>
              )}
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.slice(0, mobileLimit).map((l) => {
                const overdue = bucketMap.get(l.id)?.includes("overdue");
                return (
                  <div key={l.id} onClick={() => setOpenId(l.id)} className="rounded-2xl border border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light p-3.5 shadow-sm active:scale-[0.99] transition space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center">{initialsOf(l.full_name)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold truncate">{l.full_name}</div>
                        <div className="text-xs text-text-muted dark:text-d-text-muted truncate">{locationOf(l.city, l.state) || "Location not given"}</div>
                      </div>
                      <span className={`shrink-0 whitespace-nowrap px-2 py-0.5 text-[11px] font-medium rounded-full border ${STATUS_META[l.status].cls}`}>{STATUS_META[l.status].label}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs text-text-muted dark:text-d-text-muted">
                      <span className="truncate">
                        {isPartner(l)
                          ? [INQUIRY_META[l.inquiry_type].label, l.occupation, l.territory].filter(Boolean).join(" · ")
                          : [l.vehicle, l.install_target].filter(Boolean).join(" · ") || "-"}
                      </span>
                      <span className="shrink-0">{fmtDate(l.created_at)} · {l.call_count} call{l.call_count === 1 ? "" : "s"}</span>
                    </div>
                    {l.next_followup_at && (
                      <div className={`flex items-start gap-2 text-xs rounded-lg px-2.5 py-2 ${overdue ? "bg-red-500/10 text-red-600" : "bg-amber-500/10 text-amber-700 dark:text-amber-500"}`}>
                        <Clock className="w-3.5 h-3.5 mt-px shrink-0" />
                        <span className="min-w-0">
                          <span className="font-semibold">{overdue ? "Overdue" : "Follow-up"} · {fmtDateTime(l.next_followup_at)}</span>
                          {l.followup_note && <span className="block truncate opacity-90">{l.followup_note}</span>}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <a href={`tel:${l.mobile}`} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-medium active:scale-[0.98] transition">
                        <Phone className="w-4 h-4" />{l.mobile}
                      </a>
                      <a href={waLink(l.mobile)} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="inline-flex items-center justify-center w-12 rounded-xl bg-emerald-600 text-white active:scale-[0.98] transition">
                        <WhatsAppIcon className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                );
              })}
              {filtered.length > mobileLimit && (
                <button onClick={() => setMobileLimit((n) => n + MOBILE_PAGE)} className="w-full py-3 rounded-xl border border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light text-sm font-medium">
                  Show more ({(filtered.length - mobileLimit).toLocaleString("en-IN")} left)
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {openLead && (
        <LeadDrawer
          key={openLead.id}
          lead={openLead}
          userId={userId}
          userEmail={email}
          onClose={() => setOpenId(null)}
          onSaved={load}
          canDelete={role === "master" || role === "admin"}
        />
      )}
      {showAdd && <AddLeadModal userId={userId} onClose={() => setShowAdd(false)} onDone={load} />}
      {showImport && <ImportCsvModal userId={userId} onClose={() => setShowImport(false)} onDone={load} />}
    </AdminLayout>
  );
}
