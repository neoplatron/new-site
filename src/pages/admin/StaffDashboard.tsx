import BrandLoader from "../../components/admin/BrandLoader";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import AdminLayout, { portalPath } from "../../components/admin/AdminLayout";
import SEO from "../../components/SEO";
import RemindersPanel from "../../components/leads/RemindersPanel";
import { useAdminRole } from "../../hooks/useAdminRole";
import { useLeads } from "../../hooks/useLeads";
import type { Lead } from "../../components/leads/leadTypes";

// Landing page: today's and upcoming reminders. Tapping a card opens the leads list filtered to it.
export default function StaffDashboard() {
  const navigate = useNavigate();
  const { role, email, loading: roleLoading } = useAdminRole();
  const { leads, loading, load, counts } = useLeads();

  const stats = useMemo(() => {
    const c = (s: Lead["status"]) => leads.filter((l) => l.status === s).length;
    // [label, count, status filter to open on the Leads page ("" = all leads)]
    return [
      ["Total", leads.length, "", "bg-primary"],
      ["New", c("new"), "new", "bg-blue-500"],
      ["Interested", c("interested"), "interested", "bg-amber-500"],
      ["Visit scheduled", c("visit_scheduled"), "visit_scheduled", "bg-purple-500"],
      ["Installed", c("installed"), "installed", "bg-emerald-500"],
      ["Not interested", c("not_interested"), "not_interested", "bg-zinc-400"],
    ] as [string, number, string, string][];
  }, [leads]);

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

  return (
    <AdminLayout
      role={role}
      email={email}
      title="Dashboard"
      actions={
        <button onClick={load} className="p-2 rounded-lg border border-border dark:border-d-border" aria-label="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      }
    >
      <SEO title="Dashboard - Neoplatron" noindex />
      {loading && leads.length === 0 ? (
        <BrandLoader text="Fetching your leads and reminders..." />
      ) : (
        <div className="space-y-8 md:space-y-10 max-w-6xl">
          <RemindersPanel
            counts={counts}
            active=""
            onSelect={(b) => b && navigate(`${portalPath(role, "/admin/leads")}?bucket=${b}`)}
          />

          {/* Status totals: each tile opens the Leads page filtered to that status */}
          <section>
            <h2 className="text-base md:text-lg font-bold mb-3">All leads by status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {stats.map(([k, v, status, dot]) => (
                <button
                  key={k}
                  onClick={() => navigate(`${portalPath(role, "/admin/leads")}${status ? `?status=${status}` : ""}`)}
                  className="text-left rounded-2xl bg-bg-light dark:bg-d-bg-light border border-border dark:border-d-border p-4 shadow-sm hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-text-muted dark:text-d-text-muted">
                    <span className={`w-2 h-2 rounded-full ${dot}`} />
                    {k}
                  </div>
                  <div className="text-2xl font-bold tabular-nums mt-1.5">{v.toLocaleString("en-IN")}</div>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  );
}
