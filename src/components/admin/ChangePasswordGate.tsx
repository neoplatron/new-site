import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";

// Blocks the admin area until a user who was given a temporary password sets their own.
export default function ChangePasswordGate() {
  const [needed, setNeeded] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setNeeded(user?.user_metadata?.must_change_password === true);
    });
  }, []);

  if (!needed) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password, data: { must_change_password: false } });
    setSaving(false);
    if (error) setError(error.message);
    else setNeeded(false);
  };

  const input =
    "w-full px-4 py-2 rounded-lg border border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:ring-1 focus:ring-primary outline-hidden";

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white dark:bg-d-bg-light rounded-xl p-6 shadow-2xl space-y-4">
        <div>
          <h2 className="text-xl font-bold text-text dark:text-d-text">Set your password</h2>
          <p className="text-sm text-text-muted dark:text-d-text-muted mt-1">
            You signed in with a temporary password. Choose your own to continue.
          </p>
        </div>
        <input type="password" className={input} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus required />
        <input type="password" className={input} placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={saving} className="w-full py-2 bg-primary text-white rounded-lg font-medium flex justify-center disabled:opacity-50">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save password"}
        </button>
      </form>
    </div>
  );
}
