import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, RefreshCw } from "lucide-react";
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
      ["Total", leads.length, ""],
      ["New", c("new"), "new"],
      ["Interested", c("interested"), "interested"],
      ["Visit scheduled", c("visit_scheduled"), "visit_scheduled"],
      ["Installed", c("installed"), "installed"],
      ["Not interested", c("not_interested"), "not_interested"],
    ] as [string, number, string][];
  }, [leads]);

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
        <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          <RemindersPanel
            counts={counts}
            active=""
            onSelect={(b) => b && navigate(`${portalPath(role, "/admin/leads")}?bucket=${b}`)}
          />

          {/* Status totals: each tile opens the Leads page filtered to that status */}
          <section>
            <h2 className="text-base md:text-lg font-bold mb-2.5">All leads by status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 md:gap-3">
              {stats.map(([k, v, status]) => (
                <button
                  key={k}
                  onClick={() => navigate(`${portalPath(role, "/admin/leads")}${status ? `?status=${status}` : ""}`)}
                  className="text-left rounded-2xl lg:rounded-xl bg-bg-light dark:bg-d-bg-light border border-border dark:border-d-border p-3 shadow-sm lg:shadow-none hover:border-primary/50 hover:shadow-md active:scale-[0.98] transition"
                >
                  <div className="text-2xl font-bold tabular-nums">{v.toLocaleString("en-IN")}</div>
                  <div className="text-xs text-text-muted dark:text-d-text-muted">{k}</div>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </AdminLayout>
  );
}
