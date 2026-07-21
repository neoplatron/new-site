import { useEffect, useRef, useState } from "react";
import { CheckCircle, Send, XCircle } from "lucide-react";
import { submitToSheet } from "../../api/sheetFormAPI";
import SubmissionSuccess from "../../components/SubmissionSuccess";
import SEO from "../../components/SEO";

const OCCUPATION_OPTIONS = [
  "Automobile Workshop",
  "Car Accessories Shop",
  "Spare Parts Dealer",
  "Automobile Dealer",
  "Distributor",
  "Entrepreneur",
  "Fleet Owner",
  "Other",
];

const FranchiseForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    cityState: "",
    territory: "",
    occupation: "",
    priorExperience: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );
  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitStatus === "success") {
      resultCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [submitStatus]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await submitToSheet("franchise", formData);
      setSubmitStatus("success");
      setFormData({
        fullName: "",
        mobileNumber: "",
        email: "",
        cityState: "",
        territory: "",
        occupation: "",
        priorExperience: "",
      });
    } catch (err) {
      console.error("Franchise form submit error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
      <SEO
        title="Franchise Inquiry - Neoplatron"
        description="Become a Neoplatron franchise partner. Fill out our franchise inquiry form and our team will get in touch with you."
        canonical="/get-started/franchise"
        noindex
      />
      <section className="relative bg-linear-to-br from-primary via-secondary to-primary text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-tertiary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
            <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-bg-light">
              Franchise Inquiry
            </span>
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
          </div>

          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            Become a{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
              Franchise Partner
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-bg-light/90 max-w-2xl mx-auto leading-relaxed">
            Fill out the details below and our team will get in touch with you
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg dark:from-d-bg to-transparent"></div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 sm:mb-16 relative z-20">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="relative bg-bg-light dark:bg-d-bg-light rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-border dark:border-d-border shadow-2xl">
              <h2 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text mb-4">
                Franchise Eligibility & Requirements
              </h2>
              <ul className="space-y-4">
                {[
                  "Initial purchase of 20–30 Neoplatron Kits",
                  "Suitable for entrepreneurs, automobile businesses, workshops, distributors, and service centers",
                  "Training and technical support provided",
                  "Marketing assistance from the Neoplatron team",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <span className="text-sm sm:text-base text-text-para dark:text-d-text-para pt-1">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div
              ref={resultCardRef}
              className="relative bg-bg-light dark:bg-d-bg-light rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-border dark:border-d-border shadow-2xl scroll-mt-24"
            >
              {submitStatus === "success" ? (
                <SubmissionSuccess message="Thanks! Your franchise inquiry has been submitted. We'll get back to you soon." />
              ) : (
                <>
                  <p className="text-sm sm:text-base text-text-para dark:text-d-text-para mb-5 sm:mb-6">
                    Please complete the form below. Our team will review your
                    application and contact shortlisted applicants with
                    further details.
                  </p>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5 sm:space-y-6"
                  >
                    <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                        >
                          Full Name <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                          placeholder="Ravi Kumar"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="mobileNumber"
                          className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                        >
                          Mobile Number (WhatsApp preferred){" "}
                          <span className="text-error">*</span>
                        </label>
                        <input
                          type="tel"
                          id="mobileNumber"
                          name="mobileNumber"
                          required
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                          placeholder="98765 43210"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                        >
                          Email Address <span className="text-error">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                          placeholder="ravi.kumar@gmail.com"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="cityState"
                          className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                        >
                          Your Current City & State{" "}
                          <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          id="cityState"
                          name="cityState"
                          required
                          value={formData.cityState}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                          placeholder="Vijayawada, Andhra Pradesh"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="territory"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        Which territory are you interested in?{" "}
                        <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        id="territory"
                        name="territory"
                        required
                        value={formData.territory}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                        placeholder="Krishna, Guntur, or nearby districts"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="occupation"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        Current Occupation / Business{" "}
                        <span className="text-error">*</span>
                      </label>
                      <select
                        id="occupation"
                        name="occupation"
                        required
                        value={formData.occupation}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all"
                      >
                        <option value="">Select an option</option>
                        {OCCUPATION_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <span className="block text-sm font-semibold text-text dark:text-d-text mb-2">
                        Have you previously worked in sales or the automobile
                        industry? <span className="text-error">*</span>
                      </span>
                      <div className="flex gap-6">
                        {["Yes", "No"].map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center gap-2 text-sm text-text dark:text-d-text"
                          >
                            <input
                              type="radio"
                              name="priorExperience"
                              value={opt}
                              required
                              checked={formData.priorExperience === opt}
                              onChange={handleChange}
                              className="accent-primary"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group relative w-full bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-semibold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                    >
                      <span>
                        {isSubmitting ? "Submitting..." : "Submit Inquiry"}
                      </span>
                      {!isSubmitting && <Send className="w-5 h-5" />}
                    </button>

                    {submitStatus === "error" && (
                      <div className="p-4 sm:p-5 rounded-xl bg-error/10 border-2 border-error flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                        <p className="text-sm text-text dark:text-d-text">
                          Something went wrong submitting your inquiry. Please
                          try again.
                        </p>
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FranchiseForm;
