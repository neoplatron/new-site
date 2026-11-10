import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

export type StaffRole = "master" | "admin" | "telecaller";

// Verifies the logged-in user is still whitelisted and returns their role.
// Revoked / unknown users are signed out and sent to /admin.
export function useAdminRole() {
  const navigate = useNavigate();
  const [role, setRole] = useState<StaffRole | null>(null);
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/admin"); return; }
        if (user.email) {
          const { data: wl, error: wlErr } = await supabase
            .from("admin_whitelist").select("role").eq("email", user.email).single();
          if (wlErr || !wl) {
            await supabase.auth.signOut();
            alert("Your access has been revoked.");
            navigate("/admin");
            return;
          }
        }
        const { data } = await supabase
          .from("user_roles").select("role").eq("user_id", user.id).single();
        if (cancelled) return;
        setEmail(user.email ?? "");
        setUserId(user.id);
        if (data) setRole(data.role as StaffRole);
      } catch (e) {
        console.error("Error checking role:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  return { role, email, userId, loading };
}
