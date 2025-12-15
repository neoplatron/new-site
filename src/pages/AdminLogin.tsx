import { useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield, Lock, ArrowRight, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); // For success messages
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to where they wanted to go, or dashboard
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const validatePassword = (pwd: string) => {
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    return hasUpper && hasNumber && hasSymbol;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      // 0. Validate Password
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      if (!validatePassword(password)) {
        throw new Error("Password must contain at least 1 uppercase letter, 1 number, and 1 symbol");
      }

      // 1. Sign Up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        // Successful signup AND login (Email verification disabled/not required)
        navigate(from, { replace: true });
      } else if (data.user) {
        // Successful signup but requires email verification
        setMessage("Account created! PLEASE NOTE: If you are not redirected immediately, your system requires Email Verification. Please check your inbox.");
        setMode("login");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`, // We need to handle this route later, or just login page
      });

      if (error) throw error;
      setMessage("Password reset email sent! Please check your inbox.");
      setMode("login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-title text-3xl font-bold text-text dark:text-d-text mb-2">
            Admin Portal
          </h1>
          <p className="text-text-muted dark:text-d-text-muted">
            {mode === "login" && "Sign in to manage sellers and warranties"}
            {mode === "register" && "Create your admin account (Invite required)"}
            {mode === "forgot" && "Reset your password"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-bg-light dark:bg-d-bg-light p-8 rounded-2xl border-2 border-border dark:border-d-border shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-600 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {message && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3 text-green-600 text-sm">
              <Shield className="w-5 h-5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form onSubmit={mode === "login" ? handleLogin : mode === "register" ? handleRegister : handleForgotPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text dark:text-d-text mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-lg bg-bg dark:bg-d-bg border border-border dark:border-d-border focus:border-primary focus:ring-1 focus:ring-primary outline-hidden transition-all text-text dark:text-d-text"
                  placeholder="admin@example.com"
                  required
                />
                <Shield className="w-5 h-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {mode !== "forgot" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text dark:text-d-text mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pl-11 pr-10 rounded-lg bg-bg dark:bg-d-bg border border-border dark:border-d-border focus:border-primary focus:ring-1 focus:ring-primary outline-hidden transition-all text-text dark:text-d-text"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="w-5 h-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-text dark:text-d-text mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-11 pr-10 rounded-lg bg-bg dark:bg-d-bg border border-border dark:border-d-border focus:border-primary focus:ring-1 focus:ring-primary outline-hidden transition-all text-text dark:text-d-text"
                        placeholder="••••••••"
                        required
                      />
                      <Lock className="w-5 h-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {mode === "login" && "Sign In"}
                  {mode === "register" && "Create Account"}
                  {mode === "forgot" && "Send Reset Link"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm space-y-2">
            {mode === "login" && (
              <>
                <button onClick={() => setMode("forgot")} className="text-primary hover:underline font-medium">
                  Forgot Password?
                </button>
                <div className="text-text-muted">
                  Have an invite code?{" "}
                  <button onClick={() => setMode("register")} className="text-primary hover:underline font-medium">
                    Sign Up
                  </button>
                </div>
              </>
            )}

            {(mode === "register" || mode === "forgot") && (
              <button onClick={() => setMode("login")} className="text-text-muted hover:text-primary transition-colors">
                Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
