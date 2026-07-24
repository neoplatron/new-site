import { Link } from "react-router-dom";
import { Store, Truck, Wrench, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

const FRANCHISE_FORM_URL = "/get-started/franchise";
const DISTRIBUTION_FORM_URL = "/get-started/distribution";
const INSTALLATION_FORM_URL = "/get-started/installation";

const inquiryOptions = [
  {
    icon: Wrench,
    label: "Installation",
    value: "Installation Inquiry",
    subtext: "Request an installation",
    href: INSTALLATION_FORM_URL,
    color: "tertiary",
  },
  {
    icon: Store,
    label: "Franchise",
    value: "Franchise Inquiry",
    subtext: "Partner with us as a franchise",
    href: FRANCHISE_FORM_URL,
    color: "primary",
  },
  {
    icon: Truck,
    label: "Distribution",
    value: "Distribution Inquiry",
    subtext: "Become a distributor or dealer",
    href: DISTRIBUTION_FORM_URL,
    color: "secondary",
  },
];

const GetStarted = () => {
  return (
    <div className="bg-bg dark:bg-d-bg">
      <SEO
        title="Get Started - Neoplatron"
        description="Choose an inquiry type to get started with Neoplatron - Franchise, Distribution, or Installation."
        canonical="/get-started"
        noindex
      />
      {/* Hero Section - Compact */}
      <section className="relative bg-linear-to-br from-primary via-secondary to-primary text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-tertiary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          {/* Accent line above heading */}
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
            <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-bg-light">
              Get in Touch
            </span>
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
          </div>

          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            Choose an{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
              Inquiry Type
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-bg-light/90 max-w-2xl mx-auto leading-relaxed">
            Select the option that best matches your requirement. Complete a short form, and our team will review your enquiry and get back to you shortly.

          </p>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg dark:from-d-bg to-transparent"></div>
      </section>

      {/* Inquiry Option Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-10 sm:mb-14 relative z-20">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {inquiryOptions.map((item, index) => {
            const Icon = item.icon;
            const colorMap = {
              primary: "from-primary to-primary/80",
              secondary: "from-secondary to-secondary/80",
              tertiary: "from-tertiary to-tertiary/80",
            };

            return (
              <Link key={index} to={item.href} className="group relative">
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${
                    colorMap[item.color as keyof typeof colorMap]
                  }/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                <div className="relative bg-bg-light dark:bg-d-bg-light rounded-xl sm:rounded-2xl p-5 sm:p-6 border-2 border-border dark:border-d-border hover:border-primary/30 transition-all shadow-lg hover:shadow-2xl">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-linear-to-br ${
                        colorMap[item.color as keyof typeof colorMap]
                      } flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-medium text-text-muted dark:text-d-text-muted mb-1 uppercase tracking-wide">
                        {item.label}
                      </h3>
                      <p className="text-sm sm:text-base font-semibold text-text dark:text-d-text mb-1">
                        {item.value}
                      </p>
                      <p className="text-xs sm:text-sm text-text-para dark:text-d-text-para">
                        {item.subtext}
                      </p>
                    </div>

                    {/* Arrow indicator */}
                    <ArrowRight className="w-4 h-4 text-text-muted dark:text-d-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="text-center text-xs sm:text-sm text-text-muted dark:text-d-text-muted mt-6">
          Not sure which enquiry is right for you? Choose any option, and our team will guide you to the right solution.
        </p>
      </section>
    </div>
  );
};

export default GetStarted;
