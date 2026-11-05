import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Info,
  Package,
  Boxes,
  Image,
  Handshake,
  MapPin,
  ShieldCheck,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Star,
  Youtube,
  Instagram,
  Facebook,
  Rocket,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import SEO from "../components/SEO";
import FloatingParticles from "../components/FloatingParticles";
import { mobile_logo } from "../constants/images";
import "./Links.css";

// Opens Google's "Write a review" form directly for the Neoplatron listing (Place ID)
const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJ8_tEbwCdyzsRGPjaunHqpWc";

const WHATSAPP_URL =
  "https://wa.me/919666636524?text=Hi%20Neoplatron!%20I%27m%20interested%20in%20the%20Neoplatron%20Green%20Hydrogen%20Kit.";

type LinkItem = {
  label: string;
  subtext?: string;
  icon: LucideIcon;
  /** Internal route (starts with "/") or external URL */
  href: string;
  highlight?: boolean;
  twinkle?: boolean;
};

type LinkGroup = { title: string; items: LinkItem[] };

const groups: LinkGroup[] = [
  {
    title: "Get Started",
    items: [
      {
        label: "Enquire Now",
        subtext: "Installation, franchise or distribution",
        icon: Rocket,
        href: "/get-started",
        highlight: true,
      },
      {
        label: "Chat on WhatsApp",
        subtext: "Quick answers from our team",
        icon: MessageCircle,
        href: WHATSAPP_URL,
      },
    ],
  },
  {
    title: "Reviews",
    items: [
      {
        label: "Rate us on Google",
        subtext: "Share your experience",
        icon: Star,
        href: GOOGLE_REVIEW_URL,
        twinkle: true,
      },
      {
        label: "Customer Video Reviews",
        subtext: "Watch on YouTube",
        icon: Youtube,
        href: "https://www.youtube.com/@neoplatronhydrogen",
      },
    ],
  },
  {
    title: "Explore",
    items: [
      { label: "Homepage", icon: Home, href: "/" },
      { label: "About Us", icon: Info, href: "/about" },
      { label: "Products", icon: Package, href: "/products/overview" },
      { label: "Kits", icon: Boxes, href: "/products/kits" },
      { label: "Gallery", icon: Image, href: "/gallery" },
      { label: "Partners", icon: Handshake, href: "/partners" },
      { label: "Locations", icon: MapPin, href: "/locations" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Contact Us", icon: Phone, href: "/contact" },
      { label: "Warranty", icon: ShieldCheck, href: "/warranty" },
      { label: "FAQs", icon: HelpCircle, href: "/faqs" },
    ],
  },
];

const quickActions = [
  { label: "Call", icon: Phone, href: "tel:+917416493939" },
  { label: "WhatsApp", icon: MessageCircle, href: WHATSAPP_URL },
  { label: "Email", icon: Mail, href: "mailto:info@neoplatron.com" },
  { label: "Instagram", icon: Instagram, href: "https://www.instagram.com/neoplatron/" },
  { label: "Facebook", icon: Facebook, href: "https://www.facebook.com/Neoplatron" },
  { label: "YouTube", icon: Youtube, href: "https://www.youtube.com/@neoplatronhydrogen" },
];

// Rising hydrogen bubbles — generated once at module load
const bubbles = Array.from({ length: 18 }, (_, i) => {
  const size = 8 + Math.random() * 22;
  return {
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${size}px`,
    duration: `${9 + Math.random() * 10}s`,
    delay: `${-Math.random() * 15}s`,
  };
});

const isExternal = (href: string) => !href.startsWith("/");

// 3D tilt + spotlight that follows the cursor
const handleTilt = (e: MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty("--mx", `${x * 100}%`);
  el.style.setProperty("--my", `${y * 100}%`);
  el.style.setProperty("--rx", `${(0.5 - y) * 10}deg`);
  el.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
};
const resetTilt = (e: MouseEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
};

const LinkButton = ({ item }: { item: LinkItem }) => {
  const Icon = item.icon;
  const base =
    "lk-card group flex items-center gap-4 w-full rounded-2xl px-4 py-3.5 border backdrop-blur-sm";
  const style = item.highlight
    ? "lk-card-hl bg-primary text-white border-transparent"
    : "bg-bg-light/85 dark:bg-d-bg-light/85 border-border dark:border-d-border hover:border-secondary/60 text-text dark:text-d-text";

  const content = (
    <>
      <span
        className={`lk-icon relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          item.highlight
            ? "bg-white/20"
            : "bg-primary/10 text-primary dark:bg-secondary/15 dark:text-secondary"
        }`}
      >
        <Icon className={`w-5 h-5 ${item.twinkle ? "lk-twinkle fill-current" : ""}`} />
      </span>
      <span className="relative flex-1 min-w-0 text-left">
        <span className="block font-button font-semibold text-[15px] leading-tight">
          {item.label}
        </span>
        {item.subtext && (
          <span
            className={`block text-xs mt-0.5 ${
              item.highlight ? "text-white/80" : "text-text-para dark:text-d-text-para"
            }`}
          >
            {item.subtext}
          </span>
        )}
      </span>
      <ChevronRight
        className={`relative w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1.5 ${
          item.highlight ? "text-white/80" : "text-text-muted dark:text-d-text-muted"
        }`}
      />
    </>
  );

  const props = {
    className: `${base} ${style}`,
    onMouseMove: handleTilt,
    onMouseLeave: resetTilt,
  };

  return isExternal(item.href) ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" {...props}>
      {content}
    </a>
  ) : (
    <Link to={item.href} {...props}>
      {content}
    </Link>
  );
};

const Links = () => {
  let cardIndex = 0;

  return (
    <div className="min-h-screen bg-bg-dark dark:bg-d-bg-dark relative overflow-hidden">
      <SEO
        title="Neoplatron - Links"
        description="All Neoplatron links in one place: products, enquiries, reviews, warranty, contact and social media."
        canonical="/links"
      />

      {/* Animated background: aurora blobs, rising bubbles, floating hydrogen icons */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="lk-blob lk-blob-1" />
        <div className="lk-blob lk-blob-2" />
        <div className="lk-blob lk-blob-3" />
        {bubbles.map((b) => (
          <span
            key={b.id}
            className="lk-bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDuration: b.duration,
              animationDelay: b.delay,
            }}
          />
        ))}
        <FloatingParticles />
      </div>

      <main className="relative z-10 max-w-md mx-auto px-4 pt-14 pb-12">
        {/* Profile */}
        <header className="flex flex-col items-center text-center">
          <div className="lk-pop" style={{ animationDelay: "0.05s" }}>
            <div className="lk-logo-wrap">
              <div className="absolute inset-0 rounded-full bg-white shadow-lg flex items-center justify-center p-3">
                <img src={mobile_logo} alt="Neoplatron" className="max-w-full max-h-full object-contain" />
              </div>
            </div>
          </div>
          <h1
            className="lk-enter lk-title font-title text-3xl font-bold mt-6 tracking-wider"
            style={{ animationDelay: "0.25s" }}
          >
            NEOPLATRON
          </h1>
          <p
            className="lk-enter text-sm text-text-para dark:text-d-text-para mt-1 max-w-xs"
            style={{ animationDelay: "0.35s" }}
          >
            Advanced Digital Plasma Technology for better mileage &amp; lower emissions
          </p>
        </header>

        {/* Quick actions */}
        <nav aria-label="Quick contact" className="mt-6 flex justify-center flex-wrap gap-2.5">
          {quickActions.map(({ label, icon: Icon, href }, i) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              aria-label={label}
              title={label}
              className="lk-pop"
              style={{ animationDelay: `${0.45 + i * 0.08}s` }}
            >
              <span className="lk-action w-11 h-11 rounded-full bg-bg-light dark:bg-d-bg-light text-primary dark:text-secondary shadow-sm flex items-center justify-center border border-border dark:border-d-border hover:border-secondary hover:text-secondary hover:shadow-lg hover:shadow-secondary/40 transition-colors">
                <Icon className="w-5 h-5" />
              </span>
            </a>
          ))}
        </nav>

        {/* Link groups */}
        <div className="mt-8 space-y-7" style={{ perspective: "800px" }}>
          {groups.map((group) => (
            <section key={group.title}>
              <h2
                className="lk-enter text-xs font-semibold uppercase tracking-widest text-text-muted dark:text-d-text-muted mb-3 px-1"
                style={{ animationDelay: `${0.9 + cardIndex * 0.07}s` }}
              >
                {group.title}
              </h2>
              <div className="space-y-2.5">
                {group.items.map((item) => (
                  <div
                    key={item.label}
                    className="lk-enter"
                    style={{ animationDelay: `${0.95 + cardIndex++ * 0.07}s` }}
                  >
                    <LinkButton item={item} />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-10 text-center text-xs text-text-para-muted dark:text-d-text-para-muted">
          © {new Date().getFullYear()} Neoplatron India Pvt. Ltd. ·{" "}
          <Link to="/privacy" className="hover:underline">
            Privacy
          </Link>
        </footer>
      </main>
    </div>
  );
};

export default Links;
