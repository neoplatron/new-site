import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { supabase } from "../../integrations/supabase/client";
import { INDIAN_STATES } from "../../data/indianStates";

const inp =
  "w-full px-3 py-2 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text text-sm focus:outline-none focus:border-primary";

interface Props {
  userId: string | null;
  onClose: () => void;
  onDone: () => void;
}

export default function AddLeadModal({ userId, onClose, onDone }: Props) {
  const [f, setF] = useState({
    full_name: "", mobile: "", city: "", state: "", install_target: "",
    vehicle: "", engine_capacity: "", question: "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mobile = f.mobile.replace(/[\s-]+/g, "");
    if (!f.full_name.trim()) return setErr("Name is required.");
    if (!/^(\+?91)?[6-9]\d{9}$/.test(mobile)) return setErr("Enter a valid 10-digit mobile number.");
    setSaving(true);
    setErr("");
    const { error } = await supabase.from("leads").insert({
      source: "phone",
      full_name: f.full_name.trim(),
      mobile,
      city: f.city.trim() || null,
      state: f.state || null,
      install_target: f.install_target || null,
      vehicle: f.vehicle.trim() || null,
      engine_capacity: f.engine_capacity || null,
      question: f.question.trim() || null,
      assigned_to: userId,
    });
    setSaving(false);
    if (error) return setErr(error.message);
    onDone();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-bg-light dark:bg-d-bg-light border border-border dark:border-d-border p-5 space-y-3 text-text dark:text-d-text"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Add enquiry (phone call)</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X className="w-5 h-5" /></button>
        </div>
        <input className={inp} placeholder="Full name *" value={f.full_name} onChange={set("full_name")} required />
        <input className={inp} placeholder="Mobile number *" inputMode="tel" value={f.mobile} onChange={set("mobile")} required />
        <div className="grid grid-cols-2 gap-3">
          <input className={inp} placeholder="City" value={f.city} onChange={set("city")} />
          <select className={inp} value={f.state} onChange={set("state")}>
            <option value="">State</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select className={inp} value={f.install_target} onChange={set("install_target")}>
            <option value="">Vehicle type</option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Other">Other</option>
          </select>
          <select className={inp} value={f.engine_capacity} onChange={set("engine_capacity")}>
            <option value="">Engine size</option>
            <option value="Below 1800cc">Below 1800cc</option>
            <option value="Above 1800cc">Above 1800cc</option>
            <option value="I'm Not Sure of My Vehicle's Engine Capacity">Not sure</option>
          </select>
        </div>
        <input className={inp} placeholder="Vehicle brand / model" value={f.vehicle} onChange={set("vehicle")} />
        <textarea className={inp} rows={3} placeholder="Notes / what they asked" value={f.question} onChange={set("question")} />
        {err && <div className="text-sm text-red-600">{err}</div>}
        <button disabled={saving} className="w-full inline-flex justify-center items-center gap-2 py-2.5 rounded-lg bg-primary text-white font-semibold disabled:opacity-60">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}Save enquiry
        </button>
      </form>
    </div>
  );
}
