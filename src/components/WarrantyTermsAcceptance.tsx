import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { WARRANTY_TERMS, WARRANTY_TERMS_TITLE } from "../../supabase/functions/_shared/warrantyTerms";

interface WarrantyTermsAcceptanceProps {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
}

const WarrantyTermsAcceptance = ({ accepted, onChange }: WarrantyTermsAcceptanceProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border dark:border-d-border overflow-hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-bg dark:bg-d-bg hover:bg-primary/5 transition-colors text-left"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-text dark:text-d-text">
            <FileText className="w-4 h-4 text-primary" />
            {WARRANTY_TERMS_TITLE}
          </span>
          <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="max-h-80 overflow-y-auto px-4 py-4 border-t border-border dark:border-d-border space-y-4 text-xs leading-relaxed text-text dark:text-d-text">
            {WARRANTY_TERMS.map((section) => (
              <section key={section.title}>
                <h5 className="font-semibold text-sm text-primary dark:text-d-text mb-1.5">{section.title}</h5>
                <div className="space-y-1.5">
                  {section.items.map((item, i) => (
                    <div key={i} className={item.n ? "flex gap-2" : "pl-10"}>
                      {item.n && <span className="font-semibold shrink-0 w-10">{item.n}</span>}
                      <div className={item.subheading ? "font-semibold" : ""}>
                        {item.text}
                        {item.bullets && (
                          <ul className="list-disc pl-5 mt-1 space-y-0.5">
                            {item.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <label className="flex items-start gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-primary shrink-0"
        />
        <span className="text-sm text-text dark:text-d-text">
          I confirm the details provided are accurate and I agree to the{" "}
          <button type="button" onClick={() => setOpen(true)} className="text-primary underline underline-offset-2">
            Warranty Terms &amp; Conditions
          </button>
          . A copy will be included with my warranty certificate. *
        </span>
      </label>
    </div>
  );
};

export default WarrantyTermsAcceptance;
