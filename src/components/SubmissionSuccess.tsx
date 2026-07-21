import { Link } from "react-router-dom";
import { CheckCircle2, MessageCircle, Phone, ArrowRight } from "lucide-react";

const PHONE_NUMBER = "9666636525";
const WHATSAPP_URL =
  "https://wa.me/919666636524?text=Hi%20Neoplatron!%20I%27m%20interested%20in%20the%20Neoplatron%20Green%20Hydrogen%20Kit.%20I%20would%20like%20to%20know%20more%20about%20the%20product";

interface SubmissionSuccessProps {
  message: string;
}

const SubmissionSuccess = ({ message }: SubmissionSuccessProps) => {
  return (
    <div className="text-center py-2 sm:py-4">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-9 h-9 text-success" />
      </div>

      <h3 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text mb-2">
        Inquiry Submitted!
      </h3>
      <p className="text-sm sm:text-base text-text-para dark:text-d-text-para max-w-md mx-auto mb-8">
        {message}
      </p>

      <p className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-text-muted dark:text-d-text-muted mb-4">
        While we review your application
      </p>

      <div className="grid sm:grid-cols-3 gap-4">
        <a
          href={`tel:+91${PHONE_NUMBER}`}
          className="group flex flex-col items-center text-center gap-3 rounded-xl border-2 border-border dark:border-d-border p-5 hover:border-primary/40 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Phone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text dark:text-d-text">
              Call Us
            </p>
            <p className="text-xs text-text-muted dark:text-d-text-muted mt-0.5">
              +91 {PHONE_NUMBER}
            </p>
          </div>
        </a>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center text-center gap-3 rounded-xl border-2 border-border dark:border-d-border p-5 hover:border-primary/40 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text dark:text-d-text">
              WhatsApp Us
            </p>
            <p className="text-xs text-text-muted dark:text-d-text-muted mt-0.5">
              Chat instantly
            </p>
          </div>
        </a>

        <Link
          to="/"
          className="group flex flex-col items-center text-center gap-3 rounded-xl border-2 border-border dark:border-d-border p-5 hover:border-primary/40 hover:shadow-lg transition-all"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowRight className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text dark:text-d-text">
              Know More
            </p>
            <p className="text-xs text-text-muted dark:text-d-text-muted mt-0.5">
              Explore Neoplatron
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SubmissionSuccess;
