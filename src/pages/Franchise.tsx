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
} from "lucide-react";
import SEO from "../components/SEO";

const Franchise = () => {
  // Static franchise partner directory; update here when onboarding/removing a partner
  const franchises = [
    {
      id: 1,
      name: "K. Chakradhar",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      phone: "+91 99661 51436",
      address: "HIG 372, H B Colony, Bhavanipuram, Vijayawada - 520012",
      mapsUrl: "https://maps.app.goo.gl/tGGAbPxx1R1dhwUC6",
    },
    {
      id: 2,
      name: "Srinivas Chowdary",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      phone: "+91 91543 44771",
      address:
        "1-69-4/1, Rythu Bazaar Rd, Opposite Rythu Bazaar, MVP Colony, Sector 4, Visakhapatnam, Andhra Pradesh - 530017",
      mapsUrl: "https://maps.app.goo.gl/6r74cFHskrFdBoZZ7",
    },
  ];

  const [query, setQuery] = useState("");
  const [activeState, setActiveState] = useState("All");

  const states = useMemo(
    () => ["All", ...Array.from(new Set(franchises.map((f) => f.state)))],
    [franchises]
  );

  const cityCount = useMemo(
    () => new Set(franchises.map((f) => f.city)).size,
    [franchises]
  );

  const filteredFranchises = useMemo(() => {
    const q = query.trim().toLowerCase();
    return franchises.filter((franchise) => {
      const matchesState = activeState === "All" || franchise.state === activeState;
      const matchesQuery =
        !q ||
        franchise.name.toLowerCase().includes(q) ||
        franchise.city.toLowerCase().includes(q) ||
        franchise.state.toLowerCase().includes(q);
      return matchesState && matchesQuery;
    });
  }, [franchises, query, activeState]);

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
      <SEO
        title="Franchise Opportunities - Neoplatron"
        description="Learn about Neoplatron's franchise program, eligibility, and benefits of becoming a franchise partner."
        canonical="/partners/franchise"
        keywords="Neoplatron franchise, franchise opportunity, franchise partner"
      />

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary via-secondary to-primary text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-tertiary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
            <span className="px-3 sm:px-4 text-xs font-medium tracking-widest uppercase text-bg-light">
              Franchise Program
            </span>
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
          </div>

          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Become a{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
              Franchise Partner
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-bg-light/90 max-w-2xl mx-auto leading-relaxed font-light mb-6 sm:mb-8">
            Join the Neoplatron franchise network and bring our Advanced Digital Plasma Technology to your region, with full training and marketing support.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
              <Building2 className="w-4 h-4 text-tertiary" />
              <span className="text-sm font-medium">
                {franchises.length} Franchise Partners
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
              <Globe2 className="w-4 h-4 text-tertiary" />
              <span className="text-sm font-medium">
                {states.length - 1} States · {cityCount} Cities
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg dark:from-d-bg to-transparent"></div>
      </section>

      {/* Franchise Partners List Section */}
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
                placeholder="Search by partner name, city, or state..."
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
            Showing {filteredFranchises.length} of {franchises.length} franchise partners
          </p>

          {filteredFranchises.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
              {filteredFranchises.map((franchise) => (
                <div
                  key={franchise.id}
                  className="group relative bg-bg-light dark:bg-d-bg-light rounded-2xl border border-border dark:border-d-border shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Accent top bar */}
                  <div className="h-1.5 bg-linear-to-r from-primary via-secondary to-tertiary" />

                  <div className="p-6 sm:p-8 flex flex-col space-y-5 flex-1">
                    {/* Name + Location Tag */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h2 className="min-w-0 break-words text-lg sm:text-xl font-bold font-title text-text dark:text-d-text">
                        {franchise.name}
                      </h2>
                      <span className="shrink-0 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-primary/10 text-primary dark:text-d-primary rounded-full whitespace-nowrap">
                        {franchise.city}, {franchise.state}
                      </span>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4.5 h-4.5 text-text-muted dark:text-d-text-muted shrink-0 mt-0.5" />
                      <p className="text-sm text-text-para dark:text-d-text-para leading-relaxed">
                        {franchise.address}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto flex flex-col xs:flex-row gap-2.5 pt-1">
                      {franchise.phone && (
                        <a
                          href={`tel:${franchise.phone}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-linear-to-r from-primary to-secondary hover:shadow-lg rounded-xl py-2.5 px-4 transition-all"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </a>
                      )}
                      <a
                        href={franchise.mapsUrl}
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
                No franchise partners found
              </h3>
              <p className="text-sm text-text-para dark:text-d-text-para max-w-md mx-auto mb-6">
                We couldn't find a partner matching your search. Try a different city or state — or be the first to bring Neoplatron to your area.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveState("All");
                }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary dark:text-d-primary hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Details Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-bg-light dark:bg-d-bg-light rounded-2xl border border-border dark:border-d-border shadow-xl overflow-hidden">
            <div className="h-1.5 bg-linear-to-r from-primary via-secondary to-tertiary" />

            <div className="p-6 sm:p-8 lg:p-10">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary dark:text-d-primary mb-2">
                Franchise Benefits
              </span>
              <h2 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text mb-6 sm:mb-8">
                Franchise Eligibility &amp; Requirements
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-8 sm:mb-10">
                {[
                  "Initial purchase of 20–30 Neoplatron Kits",
                  "Suitable for entrepreneurs, automobile businesses, workshops, distributors, and service centers",
                  "Training and technical support provided",
                  "Marketing assistance from the Neoplatron team",
                ].map((point) => (
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

              <div className="text-center">
                <Link
                  to="/get-started/franchise"
                  className="group inline-flex items-center gap-2 bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Franchise;
