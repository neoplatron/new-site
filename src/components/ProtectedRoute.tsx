import { useEffect, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import BrandLoader from "./admin/BrandLoader";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return <BrandLoader fullScreen text="Checking your login..." />;
    }

    if (!session) {
        return <Navigate to={location.pathname.startsWith("/team") ? "/team" : "/admin"} state={{ from: location }} replace />;
    }

    return children;
}
