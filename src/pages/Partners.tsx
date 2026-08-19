import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  ArrowRight,
  MapPin,
  Phone,
  Navigation,
  Search,
  Building2,
  Globe2,
  X,
  ChevronDown,
  User,
} from "lucide-react";
import SEO from "../components/SEO";

type PartnerType = "dealer" | "distributor" | "franchise";

interface Partner {
  id: string;
  type: PartnerType;
  name: string;
  city: string;
  state: string;
  contactPerson?: string;
  phone?: string;
  address: string;
  mapsUrl: string;
}

const PARTNER_TYPE_META: Record<
  PartnerType,
  {
    label: string;
    labelPlural: string;
    searchNoun: string;
    applyPath: string;
    applyLabel: string;
    benefitsHeading: string;
    benefits: string[];
  }
> = {
  dealer: {
    label: "Dealer",
    labelPlural: "Dealers",
    searchNoun: "dealer",
    applyPath: "/get-started/distribution",
    applyLabel: "Apply as a Dealer",
    benefitsHeading: "Why Partner With Neoplatron?",
    benefits: [
      "Ideal for established businesses, automobile distributors, fleet service providers, industrial suppliers, and entrepreneurs",
      "Market and distribute Neoplatron products within your allotted region",
      "Product training and technical support from our team",
      "Marketing assistance to help you grow in your territory",
    ],
  },
  distributor: {
    label: "Distributor",
    labelPlural: "Distributors",
    searchNoun: "distributor",
    applyPath: "/get-started/distribution",
    applyLabel: "Apply as a Distributor",
    benefitsHeading: "Why Distribute For Neoplatron?",
    benefits: [
      "Ideal for established businesses, automobile distributors, fleet service providers, industrial suppliers, and entrepreneurs",
      "Distribute Neoplatron products within your allotted region",
      "Product training and technical support from our team",
      "Marketing assistance to help you grow in your territory",
    ],
  },
  franchise: {
    label: "Franchise Partner",
    labelPlural: "Franchise Partners",
    searchNoun: "franchise partner",
    applyPath: "/get-started/franchise",
    applyLabel: "Apply for a Franchise",
    benefitsHeading: "Franchise Eligibility & Requirements",
    benefits: [
      "Initial purchase of 20–30 Neoplatron Kits",
      "Suitable for entrepreneurs, automobile businesses, workshops, distributors, and service centers",
      "Training and technical support provided",
      "Marketing assistance from the Neoplatron team",
    ],
  },
};

// Static partner directory; update here when onboarding/removing a partner
const PARTNERS: Partner[] = [
  {
    id: "dealer-1",
    type: "dealer",
    name: "Marvel Auto Centre",
    city: "Pune",
    state: "Maharashtra",
    contactPerson: "Tanveer",
    phone: "+91 93074 57713",
    address:
      "Nizam Park, Gulmohar Society, Next to Dilliwala Dairy, Market Yard, Pune - 37",
    mapsUrl: "https://maps.app.goo.gl/pSn7AN5BoU4s8Y9s9",
  },
  {
    id: "dealer-2",
    type: "dealer",
    name: "Karthikeya Motors",
    city: "Hyderabad",
    state: "Telangana",
    contactPerson: "Praveen",
    phone: "+91 93936 83783",
    address:
      "SV Colony, Chengicharla X Road, Warangal Highway, Pillar No: 122, Hyderabad, Telangana",
    mapsUrl: "https://maps.app.goo.gl/v9y7aJ1VB2F1T8DB9?g_st=iw",
  },
  {
    id: "distributor-1",
    type: "distributor",
    name: "Srinivas Chowdary",
    city: "East Godavari",
    state: "Andhra Pradesh",
    phone: "+91 91543 44771",
    address:
      "Thirumala Apartment, Ground Floor, Pothavaram Road, East Godavari Dt, Andhra Pradesh - 543112",
    mapsUrl: "https://maps.app.goo.gl/FhuJfCAEfsJYWen47?g_st=aw",
  },
  {
    id: "franchise-1",
    type: "franchise",
    name: "K. Chakradhar",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    phone: "+91 99661 51436",
    address: "HIG 372, H B Colony, Bhavanipuram, Vijayawada - 520012",
    mapsUrl: "https://maps.app.goo.gl/tGGAbPxx1R1dhwUC6",
  },
  {
    id: "franchise-2",
    type: "franchise",
    name: "Srinivas Chowdary",
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    phone: "+91 91543 44771",
    address:
      "1-69-4/1, Rythu Bazaar Rd, Opposite Rythu Bazaar, MVP Colony, Sector 4, Visakhapatnam, Andhra Pradesh - 530017",
    mapsUrl: "https://maps.app.goo.gl/6r74cFHskrFdBoZZ7",
  },
];

const TYPE_FILTERS: { value: "All" | PartnerType; label: string }[] = [
  { value: "All", label: "All Partners" },
  { value: "dealer", label: "Dealers" },
  { value: "distributor", label: "Distributors" },
  { value: "franchise", label: "Franchise" },
];

const Partners = () => {
  const [query, setQuery] = useState("");
  const [activeState, setActiveState] = useState("All");
  const [activeType, setActiveType] = useState<"All" | PartnerType>("All");

  const cityCount = useMemo(
    () => new Set(PARTNERS.map((p) => p.city)).size,
    []
  );
  const stateCount = useMemo(
    () => new Set(PARTNERS.map((p) => p.state)).size,
    []
  );

  const states = useMemo(() => {
    const scoped =
      activeType === "All"
        ? PARTNERS
        : PARTNERS.filter((p) => p.type === activeType);
    return ["All", ...Array.from(new Set(scoped.map((p) => p.state)))];
  }, [activeType]);

  const filteredPartners = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PARTNERS.filter((partner) => {
      const matchesType = activeType === "All" || partner.type === activeType;
      const matchesState =
        activeState === "All" || partner.state === activeState;
      const matchesQuery =
        !q ||
        partner.name.toLowerCase().includes(q) ||
        partner.city.toLowerCase().includes(q) ||
        partner.state.toLowerCase().includes(q);
      return matchesType && matchesState && matchesQuery;
    });
  }, [query, activeState, activeType]);

  const resultsNoun =
    activeType === "All" ? "partners" : PARTNER_TYPE_META[activeType].searchNoun + "s";
  const searchPlaceholderNoun =
    activeType === "All" ? "partner" : PARTNER_TYPE_META[activeType].searchNoun;

  const hasFilters =
    query.trim() !== "" || activeState !== "All" || activeType !== "All";

  const clearFilters = () => {
    setQuery("");
    setActiveState("All");
    setActiveType("All");
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
      <SEO
        title="Our Partners - Neoplatron"
        description="Meet Neoplatron's authorized dealers, distributors, and franchise partners, and learn how to become one yourself."
        canonical="/partners"
        keywords="Neoplatron dealer, Neoplatron distributor, Neoplatron franchise, partner network, distribution partner"
      />

      {/* Hero Section: generic intro banner, not tied to any single partner type */}
      <section className="relative bg-linear-to-br from-primary via-secondary to-primary text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-tertiary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
            <span className="px-3 sm:px-4 text-xs font-medium tracking-widest uppercase text-bg-light">
              Partner Network
            </span>
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
          </div>

          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Our{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
              Partners
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-bg-light/90 max-w-2xl mx-auto leading-relaxed font-light mb-6 sm:mb-8">
            Connecting our innovative green mobility solutions with communities around the world through our authorized dealers, distributors, and franchise partners.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
              <Building2 className="w-4 h-4 text-tertiary" />
              <span className="text-sm font-medium">
                {PARTNERS.length} Authorized Partners
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
              <Globe2 className="w-4 h-4 text-tertiary" />
              <span className="text-sm font-medium">
                {stateCount} States · {cityCount} Cities
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg dark:from-d-bg to-transparent"></div>
      </section>

      {/* Partners List Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Search + Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted dark:text-d-text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search by ${searchPlaceholderNoun} name, city, or state...`}
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light text-sm text-text dark:text-d-text placeholder:text-text-muted dark:placeholder:text-d-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted hover:text-primary dark:hover:text-d-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative sm:w-52">
              <select
                value={activeType}
                onChange={(e) => {
                  setActiveType(e.target.value as "All" | PartnerType);
                  setActiveState("All");
                }}
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light text-sm font-medium text-text dark:text-d-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
              >
                {TYPE_FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-d-text-muted" />
            </div>

            <div className="relative sm:w-56">
              <select
                value={activeState}
                onChange={(e) => setActiveState(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-border dark:border-d-border bg-bg-light dark:bg-d-bg-light text-sm font-medium text-text dark:text-d-text focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state === "All" ? "All States" : state}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted dark:text-d-text-muted" />
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs sm:text-sm text-text-muted dark:text-d-text-muted mb-4 sm:mb-6">
            Showing {filteredPartners.length} of{" "}
            {activeType === "All"
              ? PARTNERS.length
              : PARTNERS.filter((p) => p.type === activeType).length}{" "}
            {resultsNoun}
          </p>

          {filteredPartners.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="group relative bg-bg-light dark:bg-d-bg-light rounded-2xl border border-border dark:border-d-border shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Accent top bar */}
                  <div className="h-1.5 bg-linear-to-r from-primary via-secondary to-tertiary" />

                  <div className="p-6 sm:p-8 flex flex-col space-y-5 flex-1">
                    {/* Name + Tags */}
                    <div className="flex flex-col gap-2">
                      <h2 className="min-w-0 break-words text-lg sm:text-xl font-bold font-title text-text dark:text-d-text">
                        {partner.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2">
                        {activeType === "All" && (
                          <span className="max-w-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-secondary/10 text-secondary dark:text-d-secondary rounded-full break-words">
                            {PARTNER_TYPE_META[partner.type].label}
                          </span>
                        )}
                        <span className="max-w-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary dark:text-d-primary rounded-full break-words">
                          {partner.city}, {partner.state}
                        </span>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4.5 h-4.5 text-text-muted dark:text-d-text-muted shrink-0 mt-0.5" />
                      <p className="text-sm text-text-para dark:text-d-text-para leading-relaxed">
                        {partner.address}
                      </p>
                    </div>

                    {/* Contact person */}
                    {partner.contactPerson && (
                      <div className="flex items-center gap-3">
                        <User className="w-4.5 h-4.5 text-text-muted dark:text-d-text-muted shrink-0" />
                        <span className="text-sm font-medium text-text dark:text-d-text">
                          {partner.contactPerson}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="mt-auto flex flex-col xs:flex-row gap-2.5 pt-1">
                      {partner.phone && (
                        <a
                          href={`tel:${partner.phone}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-linear-to-r from-primary to-secondary hover:shadow-lg rounded-xl py-2.5 px-4 transition-all"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      )}
                      <a
                        href={partner.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary dark:text-d-primary border-2 border-primary/30 dark:border-d-primary/30 hover:bg-primary hover:text-white hover:border-primary rounded-xl py-2.5 px-4 transition-all"
                      >
                        <Navigation className="w-4 h-4" />
                        Directions
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-bg-light dark:bg-d-bg-light rounded-2xl border border-dashed border-border dark:border-d-border">
              <Search className="w-10 h-10 text-text-muted dark:text-d-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-bold font-title text-text dark:text-d-text mb-2">
                No {resultsNoun} found
              </h3>
              <p className="text-sm text-text-para dark:text-d-text-para max-w-md mx-auto mb-6">
                We couldn't find a {searchPlaceholderNoun} matching your search. Try a different city or state — or be the first to bring Neoplatron to your area.
              </p>
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-d-primary hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Become a Partner Section */}
      <section className="pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-bg-light dark:bg-d-bg-light rounded-2xl border border-border dark:border-d-border shadow-xl overflow-hidden">
            <div className="h-1.5 bg-linear-to-r from-primary via-secondary to-tertiary" />

            <div className="p-6 sm:p-8 lg:p-10">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary dark:text-d-primary mb-2">
                Partner Benefits
              </span>
              <h2 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text mb-6 sm:mb-8">
                {activeType === "All"
                  ? "Why Partner With Neoplatron?"
                  : PARTNER_TYPE_META[activeType].benefitsHeading}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-10">
                {(activeType === "All"
                  ? PARTNER_TYPE_META.dealer.benefits
                  : PARTNER_TYPE_META[activeType].benefits
                ).map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 bg-bg dark:bg-d-bg rounded-xl border border-border dark:border-d-border p-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-sm">
                      <CheckCircle className="w-4.5 h-4.5 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-text-para dark:text-d-text-para pt-1">
                      {point}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                {activeType === "All" ? (
                  <>
                    <Link
                      to="/get-started/distribution"
                      className="group inline-flex items-center gap-2 bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all"
                    >
                      Apply as a Dealer / Distributor
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/get-started/franchise"
                      className="group inline-flex items-center gap-2 text-primary dark:text-d-primary font-semibold py-3 px-6 rounded-xl border-2 border-primary/30 dark:border-d-primary/30 hover:bg-primary hover:text-white hover:border-primary transition-all"
                    >
                      Apply for a Franchise
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </>
                ) : (
                  <Link
                    to={PARTNER_TYPE_META[activeType].applyPath}
                    className="group inline-flex items-center gap-2 bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all"
                  >
                    {PARTNER_TYPE_META[activeType].applyLabel}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
