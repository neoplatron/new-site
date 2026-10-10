import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, X } from "lucide-react";

const STORAGE_KEY = "partner-popup-seen";
const VISIBLE_MS = 20000;

const chipClass =
  "flex items-center gap-1.5 rounded-lg bg-primary/10 dark:bg-d-secondary/15 px-2.5 py-1.5 text-xs font-semibold text-primary dark:text-d-secondary hover:bg-primary hover:text-white dark:hover:bg-d-secondary dark:hover:text-white transition-colors";

export default function PartnerPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // storage unavailable; show anyway
    }
    setOpen(true);
    const timer = setTimeout(() => {
      setOpen(false);
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
    }, VISIBLE_MS);
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

if (!open) return null;

  return (
    <div
      className="fixed bottom-3 right-3 left-3 sm:left-auto sm:bottom-4 sm:right-4 z-[100] sm:w-72 animate-popup-in"
      role="dialog"
      aria-labelledby="partner-popup-title"
    >
      <div className="relative overflow-hidden rounded-xl border border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light px-3.5 pt-3 pb-3.5 text-text dark:text-d-text shadow-xl">
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-2 top-2 p-1 text-text-muted dark:text-d-text-muted hover:text-primary dark:hover:text-d-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <h2
          id="partner-popup-title"
          className="pr-6 text-sm font-bold leading-snug text-primary dark:text-d-secondary"
        >
          Become a Distributor or Dealer
        </h2>
        <p className="mt-0.5 mb-2.5 text-xs text-text-muted dark:text-d-text-muted">
          Contact us:
        </p>
        <div className="flex flex-wrap gap-1.5">
          <a href="tel:+917416493939" className={chipClass}>
            <Phone className="w-3 h-3" />
            7416493939
          </a>
          <a href="tel:+919666636524" className={chipClass}>
            <Phone className="w-3 h-3" />
            9666636524
          </a>
          <a href="mailto:info@neoplatron.in" className={chipClass}>
            <Mail className="w-3 h-3" />
            info@neoplatron.in
          </a>
        </div>
        <Link
          to="/get-started/distribution"
          onClick={close}
          className="mt-2.5 block text-xs font-semibold text-tertiary hover:underline"
        >
          Become a partner now &rarr;
        </Link>
        <div className="absolute bottom-0 left-0 h-0.5 w-full bg-tertiary animate-popup-timer" />
      </div>
    </div>
  );
}
