import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

export type StaffRole = "master" | "admin" | "telecaller";

type Info = { role: StaffRole | null; email: string; userId: string };

// Remembered for the browser session so moving between admin pages does not show a spinner
// each time. Access is still re-checked in the background on every page.
let cached: Info | null = null;

supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") cached = null;
});

// Verifies the logged-in user is still whitelisted and returns their role.
// Revoked / unknown users are signed out and sent to /admin.
export function useAdminRole() {
  const navigate = useNavigate();
  const [info, setInfo] = useState<Info | null>(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // getSession reads the stored login without a network round-trip; the two queries
        // below go to the server with that login, so a revoked user is still caught.
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) {
          cached = null;
          if (!cancelled) setInfo(null);
          navigate("/admin");
          return;
        }
        const [wl, roleRes] = await Promise.all([
          user.email
            ? supabase.from("admin_whitelist").select("role").eq("email", user.email).single()
            : null,
          supabase.from("user_roles").select("role").eq("user_id", user.id).single(),
        ]);
        if (wl && (wl.error || !wl.data)) {
          cached = null;
          await supabase.auth.signOut();
          alert("Your access has been revoked.");
          navigate("/admin");
          return;
        }
        cached = {
          role: roleRes.data ? (roleRes.data.role as StaffRole) : null,
          email: user.email ?? "",
          userId: user.id,
        };
        if (!cancelled) setInfo(cached);
      } catch (e) {
        console.error("Error checking role:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  return { role: info?.role ?? null, email: info?.email ?? "", userId: info?.userId ?? "", loading };
}
