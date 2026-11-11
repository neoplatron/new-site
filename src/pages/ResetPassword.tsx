import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Shield } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import SEO from "../components/SEO";

const field =
  "w-full px-4 py-3 pl-11 pr-10 rounded-lg bg-bg dark:bg-d-bg border border-border dark:border-d-border focus:border-primary focus:ring-1 focus:ring-primary outline-hidden transition-all text-text dark:text-d-text";

// Landing page for the "Forgot Password?" email link.
// Supabase signs the user in from the link, so a session here means the link was valid.
export default function ResetPassword() {
  const navigate = useNavigate();
  const base = useLocation().pathname.startsWith("/team") ? "/team" : "/admin";
  const [state, setState] = useState<"checking" | "ready" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    // getSession waits for the client to finish reading the tokens out of the link.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setState(session ? "ready" : "invalid");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !cancelled) setState("ready");
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setSaving(true);
    // Also clears the "temporary password" flag so the user is not asked to change it again.
    const { error: upErr } = await supabase.auth.updateUser({ password, data: { must_change_password: false } });
    setSaving(false);
    if (upErr) return setError(upErr.message);
    navigate(`${base}/dashboard`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg flex items-center justify-center p-4">
      <SEO title="Reset password - Neoplatron" noindex />
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-title text-3xl font-bold text-text dark:text-d-text mb-2">Set a new password</h1>
        </div>

        <div className="bg-bg-light dark:bg-d-bg-light p-8 rounded-2xl border-2 border-border dark:border-d-border shadow-xl">
          {state === "checking" && (
            <div className="py-6 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          )}

          {state === "invalid" && (
            <div className="space-y-5 text-center">
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-600 text-sm text-left">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>This reset link is invalid or has expired. Request a new one from the login page.</span>
              </div>
              <Link to={base} className="inline-block text-primary hover:underline font-medium text-sm">Back to Login</Link>
            </div>
          )}

          {state === "ready" && (
            <form onSubmit={submit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-600 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {([["New password", password, setPassword], ["Confirm new password", confirm, setConfirm]] as const).map(([title, value, set], i) => (
                <div key={title}>
                  <label className="block text-sm font-medium text-text dark:text-d-text mb-2">{title}</label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      className={field}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      autoFocus={i === 0}
                      required
                    />
                    <Lock className="w-5 h-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    {i === 0 && (
                      <button
                        type="button"
                        onClick={() => setShow(!show)}
                        aria-label={show ? "Hide passwords" : "Show passwords"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                      >
                        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Save password<ArrowRight className="w-5 h-5" /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
