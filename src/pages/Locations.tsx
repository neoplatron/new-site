import { useMemo } from "react";
import { MapPin, Phone, Navigation, User, Building2 } from "lucide-react";
import SEO from "../components/SEO";
import { PARTNERS, PARTNER_TYPE_META } from "../data/partners";

// Groups partners by state, then city, so a visitor can scan "where are you near me"
// without needing to search or filter anything.
const Locations = () => {
  const stateCount = useMemo(
    () => new Set(PARTNERS.map((p) => p.state)).size,
    []
  );
  const cityCount = useMemo(
    () => new Set(PARTNERS.map((p) => p.city)).size,
    []
  );

  const groupedByState = useMemo(() => {
    const stateMap = new Map<string, typeof PARTNERS>();
    for (const partner of PARTNERS) {
      const list = stateMap.get(partner.state) ?? [];
      list.push(partner);
      stateMap.set(partner.state, list);
    }
    return Array.from(stateMap.entries()).sort((a, b) => {
      if (a[0] === "Telangana") return -1;
      if (b[0] === "Telangana") return 1;
      return a[0].localeCompare(b[0]);
    });
  }, []);

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
      <SEO
        title="Our Locations - Neoplatron"
        description="See every city and state where Neoplatron is present through our authorized dealers, distributors, and franchise partners, with phone numbers to call directly."
        canonical="/locations"
        keywords="Neoplatron locations, Neoplatron near me, Neoplatron cities, Neoplatron states, Neoplatron contact numbers"
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
              Where We Are
            </span>
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
          </div>

          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Our Authorized{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
              Locations
            </span>
          </h1>

          <p className="text-base sm:text-lg text-bg-light/90 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8">
            All the dealers, distributors, and franchise partners of Neoplatron, city by city. Find the one nearest you and call the number directly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2">
              <Building2 className="w-4 h-4 text-tertiary" />
              <span className="text-sm font-medium">
                {stateCount} States · {cityCount} Cities
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg dark:from-d-bg to-transparent"></div>
      </section>

      {/* Locations by State */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">
          {groupedByState.map(([state, partners]) => (
            <div key={state}>
              <h2 className="font-title text-2xl sm:text-3xl font-bold text-text dark:text-d-text mb-6 sm:mb-8 flex items-center gap-3">
                <MapPin className="w-7 h-7 text-primary dark:text-d-primary shrink-0" />
                {state}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-bg-light dark:bg-d-bg-light rounded-2xl border border-border dark:border-d-border shadow-md overflow-hidden flex flex-col"
                  >
                    <div className="h-1.5 bg-linear-to-r from-primary via-secondary to-tertiary" />

                    <div className="p-6 sm:p-7 flex flex-col space-y-5 flex-1">
                      {/* City + Partner type, big and simple */}
                      <div>
                        <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary dark:text-d-primary rounded-full mb-2">
                          {partner.city}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold font-title text-text dark:text-d-text break-words">
                          {partner.name}
                        </h3>
                        <p className="text-sm font-medium text-text-muted dark:text-d-text-muted mt-1">
                          {PARTNER_TYPE_META[partner.type].label}
                        </p>
                      </div>

                      {/* Address */}
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-text-muted dark:text-d-text-muted shrink-0 mt-0.5" />
                        <p className="text-sm text-text-para dark:text-d-text-para leading-relaxed">
                          {partner.address}
                        </p>
                      </div>

                      {/* Contact person */}
                      {partner.contactPerson && (
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-text-muted dark:text-d-text-muted shrink-0" />
                          <span className="text-sm font-medium text-text dark:text-d-text">
                            {partner.contactPerson}
                          </span>
                        </div>
                      )}

                      {/* Phone number shown as plain text, same style as address/contact */}
                      {partner.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-text-muted dark:text-d-text-muted shrink-0" />
                          <span className="text-sm font-medium text-text dark:text-d-text">
                            {partner.phone}
                          </span>
                        </div>
                      )}

                      <div className="mt-auto flex flex-col xs:flex-row gap-2.5 pt-1">
                        {partner.phone && (
                          <a
                            href={`tel:${partner.phone}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-linear-to-r from-primary to-secondary hover:shadow-lg rounded-xl py-2.5 px-4 transition-all"
                          >
                            <Phone className="w-4 h-4" />
                            Call Now
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Locations;
