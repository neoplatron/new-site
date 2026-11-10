import { useEffect, type ReactNode } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ClipboardList, LayoutDashboard, LogOut, PhoneCall, Shield, ShieldCheck, Store, Users, type LucideIcon } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import type { StaffRole } from "../../hooks/useAdminRole";
import ChangePasswordGate from "./ChangePasswordGate";

type MenuItem = { to: string; label: string; short: string; icon: LucideIcon; roles: StaffRole[] };

// Single source of truth for who sees which admin section.
export const ADMIN_MENU: MenuItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", short: "Home", icon: LayoutDashboard, roles: ["master", "admin", "telecaller"] },
  { to: "/admin/leads", label: "Leads", short: "Leads", icon: PhoneCall, roles: ["master", "admin", "telecaller"] },
  { to: "/admin/timesheet", label: "Timesheet", short: "Timesheet", icon: ClipboardList, roles: ["master", "admin", "telecaller"] },
  { to: "/admin/sellers", label: "Sellers", short: "Sellers", icon: Store, roles: ["master", "admin"] },
  { to: "/admin/warranty", label: "Warranty", short: "Warranty", icon: ShieldCheck, roles: ["master", "admin"] },
  { to: "/admin/team", label: "Team & Roles", short: "Team", icon: Users, roles: ["master"] },
];

// Telecallers live under /team, everyone else under /admin.
export const portalPath = (role: StaffRole | null, adminPath: string) =>
  role === "telecaller" ? adminPath.replace(/^\/admin/, "/team") : adminPath;

type Props = {
  role: StaffRole | null;
  email: string;
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export default function AdminLayout({ role, email, title, actions, children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const isTeam = role === "telecaller";
  const items = ADMIN_MENU.filter((i) => role && i.roles.includes(role)).map((i) => ({ ...i, to: portalPath(role, i.to) }));

  // Keep the URL prefix in line with the role (e.g. a telecaller opening an /admin/... link).
  useEffect(() => {
    if (!role) return;
    const want = isTeam
      ? location.pathname.replace(/^\/admin(?=\/)/, "/team")
      : location.pathname.replace(/^\/team(?=\/)/, "/admin");
    if (want !== location.pathname) navigate(want + location.search, { replace: true });
  }, [role, isTeam, location.pathname, location.search, navigate]);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate(isTeam ? "/team" : "/admin");
  };

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
      isActive
        ? "bg-primary text-white"
        : "text-text-muted dark:text-d-text-muted hover:bg-border/30 hover:text-text dark:hover:text-d-text"
    }`;

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg text-text dark:text-d-text font-body md:pl-60">
      {/* Fixed on desktop so it stays put while the page scrolls; sticky top bar on mobile. */}
      <aside className="sticky top-0 z-40 flex items-center md:items-stretch md:fixed md:inset-y-0 md:left-0 md:w-60 md:flex-col md:overflow-y-auto bg-bg-light/85 dark:bg-d-bg-light/85 backdrop-blur-md md:bg-bg-light md:dark:bg-d-bg-light md:backdrop-blur-none border-b md:border-b-0 md:border-r border-border dark:border-d-border">
        <div className="flex items-center gap-2.5 px-4 py-2.5 md:py-5">
          <div className="w-9 h-9 md:w-8 md:h-8 bg-primary rounded-xl md:rounded-lg md:bg-primary/10 flex items-center justify-center shadow-sm md:shadow-none">
            <Shield className="w-5 h-5 text-white md:text-primary" />
          </div>
          <div className="leading-tight">
            <div className="font-title text-base md:text-lg font-bold">{role === "telecaller" ? "Team Portal" : "Admin Portal"}</div>
            <div className="md:hidden text-[11px] text-text-muted dark:text-d-text-muted truncate max-w-[180px]">{email}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="md:hidden ml-auto mr-3 w-9 h-9 flex items-center justify-center rounded-full bg-border/30 text-text-muted dark:text-d-text-muted active:scale-95 transition"
          aria-label="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </button>

        <nav className="hidden md:flex w-full flex-col gap-1 px-3 flex-1">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={linkCls}>
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block w-full p-3 border-t border-border dark:border-d-border">
          <div className="px-1 mb-2">
            <div className="text-xs truncate" title={email}>{email}</div>
            {role && (
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-primary/10 text-primary">
                {role}
              </span>
            )}
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-muted dark:text-d-text-muted hover:text-red-500 hover:bg-border/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className={`min-w-0 ${items.length > 1 ? "pb-20 md:pb-0" : ""}`}>
        <header className="px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 flex items-center gap-3">
          <h1 className="text-xl md:text-2xl font-bold font-title min-w-0 truncate">{title}</h1>
          {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
        <main className="px-4 sm:px-6 lg:px-8 py-4 md:py-6">{children}</main>
      </div>

      {/* Mobile bottom tab bar (only when there is more than one section) */}
      {items.length > 1 && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 flex bg-bg-light/90 dark:bg-d-bg-light/90 backdrop-blur-md border-t border-border dark:border-d-border pb-[env(safe-area-inset-bottom)]">
          {items.map(({ to, short, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
                  isActive ? "text-primary" : "text-text-muted dark:text-d-text-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`px-4 py-1 rounded-full transition-colors ${isActive ? "bg-primary/10" : ""}`}>
                    <Icon className="w-5 h-5" />
                  </span>
                  {short}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      )}
      <ChangePasswordGate />
    </div>
  );
}
