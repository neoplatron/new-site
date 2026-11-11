import { useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import { INDIAN_STATES } from "../../data/indianStates";
import { ENGINE_CAPACITY_OPTIONS, INSTALL_TARGET_OPTIONS, cleanMobile, isValidMobile, type Lead } from "./leadTypes";

const input =
  "w-full px-3 py-2 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text text-sm focus:outline-none focus:border-primary";
const label = "block text-xs font-semibold text-text-muted dark:text-d-text-muted mb-1 uppercase tracking-wide";

// Old enquiries can hold values that are no longer offered; keep them selectable.
const withCurrent = (options: string[], current: string) =>
  current && !options.includes(current) ? [current, ...options] : options;

interface Props {
  lead: Lead;
  onCancel: () => void;
  onSaved: () => void;
}

// Corrects a lead's own details (name, number, vehicle...) without logging a call.
export default function LeadEditForm({ lead, onCancel, onSaved }: Props) {
  const type = lead.inquiry_type ?? "installation";
  const [f, setF] = useState({
    full_name: lead.full_name,
    mobile: lead.mobile,
    city: lead.city ?? "",
    state: lead.state ?? "",
    question: lead.question ?? "",
    install_target: lead.install_target ?? "",
    vehicle: lead.vehicle ?? "",
    engine_capacity: lead.engine_capacity ?? "",
    email: lead.email ?? "",
    territory: lead.territory ?? "",
    occupation: lead.occupation ?? "",
    prior_experience: lead.prior_experience ?? "",
    investment_budget: lead.investment_budget ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const text = (k: keyof typeof f, title: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label className={label}>{title}</label>
      <input className={input} value={f[k]} onChange={set(k)} {...props} />
    </div>
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mobile = cleanMobile(f.mobile);
    if (!f.full_name.trim()) return setErr("Name is required.");
    // An untouched number is left alone even if it would not pass today's check (old imports).
    if (mobile !== lead.mobile && !isValidMobile(mobile)) return setErr("Enter a valid 10-digit mobile number.");
    const orNull = (s: string) => s.trim() || null;
    setSaving(true);
    setErr("");
    const { data, error } = await supabase
      .from("leads")
      .update({
        full_name: f.full_name.trim(),
        mobile,
        city: orNull(f.city),
        state: f.state || null,
        question: orNull(f.question),
        ...(type === "installation"
          ? { install_target: f.install_target || null, vehicle: orNull(f.vehicle), engine_capacity: f.engine_capacity || null }
          : {
              email: orNull(f.email),
              territory: orNull(f.territory),
              occupation: orNull(f.occupation),
              ...(type === "franchise" ? { prior_experience: orNull(f.prior_experience) } : { investment_budget: orNull(f.investment_budget) }),
            }),
      })
      .eq("id", lead.id)
      .select("id");
    setSaving(false);
    if (error) return setErr(error.message);
    // Row-level security blocks silently: no error, but nothing changed.
    if (!data?.length) return setErr("Could not save: your account is not allowed to edit this lead.");
    onSaved();
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border-2 border-primary/40 p-4">
      <h3 className="font-bold text-text dark:text-d-text">Edit details</h3>
      <div className="grid grid-cols-2 gap-3">
        {text("full_name", "Name", { required: true })}
        {text("mobile", "Mobile", { required: true, inputMode: "tel" })}
        {text("city", "City")}
        <div>
          <label className={label}>State</label>
          <select className={input} value={f.state} onChange={set("state")}>
            <option value="">- not set -</option>
            {withCurrent([...INDIAN_STATES], f.state).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {type === "installation" ? (
          <>
            <div>
              <label className={label}>Install on</label>
              <select className={input} value={f.install_target} onChange={set("install_target")}>
                <option value="">- not set -</option>
                {withCurrent(INSTALL_TARGET_OPTIONS, lead.install_target ?? "").map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Engine</label>
              <select className={input} value={f.engine_capacity} onChange={set("engine_capacity")}>
                <option value="">- not set -</option>
                {withCurrent(ENGINE_CAPACITY_OPTIONS, lead.engine_capacity ?? "").map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">{text("vehicle", "Vehicle brand / model")}</div>
          </>
        ) : (
          <>
            {text("email", "Email", { type: "email" })}
            {text("territory", "Territory wanted")}
            {text("occupation", "Occupation")}
            {type === "franchise" ? text("prior_experience", "Prior experience") : text("investment_budget", "Investment budget")}
          </>
        )}
        <div className="col-span-2">
          <label className={label}>Customer asked</label>
          <textarea className={input} rows={2} value={f.question} onChange={set("question")} />
        </div>
      </div>
      {err && <p className="text-sm text-red-600">{err}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2 rounded-lg border-2 border-border dark:border-d-border text-sm font-semibold text-text dark:text-d-text">
          Cancel
        </button>
        <button disabled={saving} className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}Save details
        </button>
      </div>
    </form>
  );
}
