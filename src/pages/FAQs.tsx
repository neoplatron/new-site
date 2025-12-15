import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  HelpCircle,
  Zap,
  Shield,
  Wrench,
  DollarSign,
  CheckCircle,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

// Mock FAQ data matching your structure
const faqData = [
  {
    category: "technology",
    question: "What is Advanced Digital Plasma Technology (ADPT)?",
    answer: [
      "ADPT is a revolutionary green hydrogen technology that uses controlled electrolysis to generate Nano Hydrogen Energy.",
      "The system connects to your vehicle's manifold air inlet and enters the combustion chamber.",
      "It helps combust more fuel in less time, producing more thermal and kinetic energy.",
      "The technology is 100% safe with on-demand generation—no hydrogen storage required.",
    ],
  },
  {
    category: "technology",
    question: "How does the ADPT device work?",
    answer: [
      "Uses controlled/regulated electrolysis process to generate Nano Hydrogen Energy.",
      "Nano Hydrogen is connected to the manifold air inlet and enters the combustion chamber.",
      "Helps combust more fuel in less time, producing more thermal and kinetic energy.",
      "No engine modifications needed—suitable for any IC engine using fossil fuels.",
    ],
  },
  {
    category: "installation",
    question: "Does installation require engine modifications?",
    answer: [
      "No engine modifications are required for ADPT installation.",
      "The device is designed to be compatible with all vehicle types.",
      "Professional installation takes approximately 2-3 hours.",
      "All components are reversible and do not void your vehicle warranty.",
    ],
  },
  {
    category: "warranty",
    question: "What certifications does NEOPLATRON have?",
    answer: [
      "ISO 2001-2015 Certified for quality management.",
      "NSIC Approved by National Small Industries Corporation.",
      "ICAT Certified for safety and efficiency standards.",
      "Multiple patents filed for our innovative technology.",
    ],
  },
  {
    category: "performance",
    question: "What kind of mileage improvement can I expect?",
    answer: [
      "Fuel efficiency improvements range from 70-100% depending on vehicle type.",
      "Emission reduction of up to 90% for cleaner environmental impact.",
      "Temperature reduction of 10 degrees in exhaust systems.",
      "Up to 20% increase in engine pickup and performance.",
    ],
  },
  {
    category: "performance",
    question: "Will ADPT reduce my vehicle maintenance costs?",
    answer: [
      "Yes, maintenance costs are reduced by 50-70% on average.",
      "Cleaner combustion means less carbon buildup in the engine.",
      "Extended engine life due to reduced operating temperatures.",
      "Lower frequency of oil changes and spark plug replacements.",
    ],
  },
  {
    category: "pricing",
    question: "What is the typical ROI for ADPT installation?",
    answer: [
      "Most customers recover their investment within 8-12 months.",
      "Savings come from improved fuel efficiency and reduced maintenance.",
      "Commercial vehicles see faster ROI due to higher usage.",
      "Long-term benefits include extended vehicle lifespan.",
    ],
  },
  {
    category: "installation",
    question: "Which vehicles are compatible with ADPT?",
    answer: [
      "Compatible with all engine types from 100cc to 6000cc.",
      "Works with Petrol, Diesel, CNG, and LPG fuel types.",
      "Suitable for 2-wheelers, cars, SUVs, trucks, and commercial vehicles.",
      "Both personal and commercial vehicles benefit from the technology.",
    ],
  },
];

interface FAQItem {
  category: string;
  question: string;
  answer: string[];
}

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    {
      id: "all",
      name: "All FAQs",
      icon: <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "technology",
      name: "Technology",
      icon: <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "installation",
      name: "Installation",
      icon: <Wrench className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "warranty",
      name: "Warranty & Certification",
      icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "performance",
      name: "Performance",
      icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
    {
      id: "pricing",
      name: "Pricing",
      icon: <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />,
    },
  ];

  const faqs = (faqData as FAQItem[]).map((faq) => ({
    ...faq,
    answer: (
      <ul className="space-y-2.5">
        {faq.answer.map((line, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary dark:bg-d-primary mt-2 shrink-0" />
            <span>{line.trim() === "" ? <br /> : line}</span>
          </li>
        ))}
      </ul>
    ),
  }));

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
      {/* Hero Section */}
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
              Help Center
            </span>
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
          </div>

          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            Frequently Asked
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
              {" "}
              Questions
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-bg-light/90 max-w-2xl mx-auto leading-relaxed">
            Find answers to common questions about NEOPLATRON's Advanced Digital
            Plasma Technology
          </p>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg dark:from-d-bg to-transparent"></div>
      </section>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 relative z-20">
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-text-muted dark:text-d-text-muted w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 sm:pl-16 pr-6 py-4 sm:py-5 rounded-xl sm:rounded-2xl border-2 border-border dark:border-d-border 
                       bg-bg-light dark:bg-d-bg-light text-text dark:text-d-text text-base sm:text-lg
                       focus:outline-none focus:border-primary dark:focus:border-d-primary
                       shadow-xl transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative">
          {/* Section label */}
          <div className="text-center mb-6">
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
              Filter by Category
            </span>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative flex items-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all text-sm sm:text-base
                  ${
                    activeCategory === category.id
                      ? "bg-linear-to-r from-primary to-secondary text-white shadow-lg scale-105"
                      : "bg-bg-light dark:bg-d-bg-light text-text dark:text-d-text hover:bg-bg-dark dark:hover:bg-d-bg-dark border-2 border-border dark:border-d-border hover:border-primary/50 dark:hover:border-d-primary/50"
                  }`}
              >
                {activeCategory === category.id && (
                  <div className="absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl blur opacity-50"></div>
                )}
                <span className="relative">{category.icon}</span>
                <span className="relative hidden sm:inline">
                  {category.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 dark:bg-d-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-8 h-8 sm:w-10 sm:h-10 text-primary dark:text-d-primary" />
            </div>
            <p className="text-lg sm:text-xl text-text-para dark:text-d-text-para mb-4">
              No FAQs found matching your search
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
              }}
              className="text-primary dark:text-d-primary hover:underline text-sm sm:text-base"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div key={index} className="group relative">
                {/* Card glow effect */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10 dark:from-d-primary/10 dark:to-d-secondary/10 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative bg-bg-light dark:bg-d-bg-light rounded-xl sm:rounded-2xl border-2 border-border dark:border-d-border overflow-hidden hover:border-primary/30 dark:hover:border-d-primary/30 transition-all shadow-lg hover:shadow-2xl">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-left
                             hover:bg-bg dark:hover:bg-d-bg transition-colors group"
                  >
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 pr-4">
                      {/* Question number badge */}
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-primary/10 to-secondary/10 dark:from-d-primary/10 dark:to-d-secondary/10 flex items-center justify-center shrink-0 border border-primary/20 dark:border-d-primary/20 group-hover:scale-110 transition-transform">
                        <span className="text-xs sm:text-sm font-bold text-primary dark:text-d-primary">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>

                      <span className="text-base sm:text-lg font-semibold text-text dark:text-d-text leading-snug">
                        {faq.question}
                      </span>
                    </div>

                    {/* Chevron icon */}
                    <div className="shrink-0">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all ${
                          openIndex === index
                            ? "bg-primary text-white"
                            : "bg-bg dark:bg-d-bg text-text-muted dark:text-d-text-muted group-hover:bg-primary/10 dark:group-hover:bg-d-primary/10"
                        }`}
                      >
                        {openIndex === index ? (
                          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                        ) : (
                          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                        )}
                      </div>
                    </div>
                  </button>

                  {openIndex === index && (
                    <div className="px-5 sm:px-8 py-5 sm:py-6 bg-bg dark:bg-d-bg border-t-2 border-border dark:border-d-border">
                      <div className="pl-11 sm:pl-14">{faq.answer}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact CTA Section */}
      <section className="relative bg-bg-light dark:bg-d-bg-light py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t-2 border-border dark:border-d-border overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 dark:bg-d-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/5 dark:bg-d-secondary/5 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Icon */}
          <div className="relative inline-block mb-6 sm:mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl"></div>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-linear-to-br from-primary to-secondary rounded-xl sm:rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Need More Help?
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
            </div>

            <h2 className="font-title text-2xl sm:text-3xl lg:text-4xl font-bold text-text dark:text-d-text mb-4 sm:mb-6">
              Still have{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                questions?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-text-para dark:text-d-text-para max-w-2xl mx-auto leading-relaxed">
              Can't find the answer you're looking for? Our expert team is here
              to help you with personalized support.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/contact"
              className="group relative inline-flex items-center gap-2 bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-semibold px-8 py-4 rounded-xl
                       transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <div className="absolute inset-0 bg-white/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative">Contact Our Team</span>
              <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 bg-bg dark:bg-d-bg text-text dark:text-d-text font-semibold px-8 py-4 rounded-xl border-2 border-border dark:border-d-border hover:border-primary dark:hover:border-d-primary transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Call Us Directly</span>
            </a>
          </div>

          {/* Additional info */}
          <div className="mt-8 sm:mt-12 pt-8 border-t border-border dark:border-d-border">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-text-para dark:text-d-text-para">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>24/7 Support Available</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border dark:bg-d-border"></div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Expert Technical Team</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border dark:bg-d-border"></div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>Fast Response Time</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQs;
