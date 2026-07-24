import { useEffect, useRef, useState } from "react";
import { CheckCircle, Send, XCircle } from "lucide-react";
import { submitToSheet } from "../../api/sheetFormAPI";
import SubmissionSuccess from "../../components/SubmissionSuccess";
import SEO from "../../components/SEO";

const INSTALL_TARGET_OPTIONS = [
  "Car",
  "Truck",
  "Bus",
  "Generator (DG Set)",
  "Earthmover",
  "Marine engines/boats",
  "Other",
];

const ENGINE_CAPACITY_OPTIONS = [
  "Below 1800cc",
  "Above 1800cc",
  "I'm Not Sure of My Vehicle's Engine Capacity",
];

const CALLBACK_TIME_OPTIONS = ["10 AM – 12 PM", "12 PM – 3 PM", "3 PM – 5 PM"];

const InstallationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    cityState: "",
    installTarget: "",
    vehicleBrandModel: "",
    engineCapacity: "",
    callbackTime: "",
    question: "",
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await submitToSheet("installation", formData);
      setSubmitStatus("success");
      setFormData({
        fullName: "",
        mobileNumber: "",
        cityState: "",
        installTarget: "",
        vehicleBrandModel: "",
        engineCapacity: "",
        callbackTime: "",
        question: "",
      });
    } catch (err) {
      console.error("Installation form submit error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
      <SEO
        title="Installation Inquiry - Neoplatron"
        description="Request an installation of the Neoplatron Green Hydrogen Kit. Fill out our installation inquiry form and our team will get in touch with you."
        canonical="/get-started/installation"
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
              Installation Inquiry
            </span>
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
          </div>

          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
            Request an{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
              Installation
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-bg-light/90 max-w-2xl mx-auto leading-relaxed">
            Looking to Install Neoplatron? Share your vehicle details, and our experts will assist you with compatibility, pricing, and Installation.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg dark:from-d-bg to-transparent"></div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 sm:mb-16 relative z-20">
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            <div className="relative bg-bg-light dark:bg-d-bg-light rounded-xl sm:rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-8 border-2 border-border dark:border-d-border shadow-2xl">
              <h2 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text mb-3">
                Compatible with All Fuel Types & Vehicles
              </h2>
              <p className="text-sm sm:text-base text-text-para dark:text-d-text-para mb-6">
                Neoplatron is an advanced fuel optimization system designed
                to improve combustion efficiency and is compatible with
                Petrol, Diesel, CNG, and LPG vehicles. The system is
                suitable for a wide range of applications, including cars,
                commercial vehicles, trucks, buses, generators (DG sets),
                earthmovers, and marine engines.
              </p>

              <h3 className="text-sm sm:text-base font-semibold text-text dark:text-d-text mb-3 uppercase tracking-wide">
                Key Benefits
              </h3>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { value: "90%", label: "Fuel efficiency*" },
                  { value: "25%", label: "Pickup & performance" },
                  { value: "50%", label: "Lower maintenance" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl bg-primary/5 dark:bg-d-primary/10 border border-primary/20 p-3 text-center"
                  >
                    <p className="font-title text-xl sm:text-2xl font-bold text-primary leading-tight">
                      {stat.value}
                    </p>
                    <p className="text-[11px] sm:text-xs text-text-muted dark:text-d-text-muted leading-snug mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <ul className="space-y-4">
                {[
                  "Helps decarbonize the engine and prevents future carbon deposits for smoother operation",
                  "Reduces harmful exhaust emissions",
                  "No modifications or alterations to the vehicle or engine",
                  "Quick and easy installation (60 mins)",
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
                <SubmissionSuccess message="Thanks! Your installation inquiry has been submitted. We'll get back to you soon." />
              ) : (
                <>
                  <p className="text-sm sm:text-base text-text-para dark:text-d-text-para mb-5 sm:mb-6">
                    Please complete the form below with your vehicle details.
                    Our team will review your enquiry and contact you with
                    compatibility, pricing, and installation information.
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
                          placeholder="Your name here"
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
                          placeholder="Your Phone number here"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="cityState"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        City & State <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        id="cityState"
                        name="cityState"
                        required
                        value={formData.cityState}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                        placeholder="Which city&State are you from?"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="installTarget"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        What would you like to install the Neoplatron
                        Hydrogen Kit on? <span className="text-error">*</span>
                      </label>
                      <select
                        id="installTarget"
                        name="installTarget"
                        required
                        value={formData.installTarget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all"
                      >
                        <option value="">Select an option</option>
                        {INSTALL_TARGET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="vehicleBrandModel"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        Vehicle Brand and Model{" "}
                        <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        id="vehicleBrandModel"
                        name="vehicleBrandModel"
                        required
                        value={formData.vehicleBrandModel}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                        placeholder="e.g. Hyundai i20"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="engineCapacity"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        Engine Capacity (CC) <span className="text-error">*</span>
                      </label>
                      <select
                        id="engineCapacity"
                        name="engineCapacity"
                        required
                        value={formData.engineCapacity}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all"
                      >
                        <option value="">Select an option</option>
                        {ENGINE_CAPACITY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="callbackTime"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        Preferred Callback Time{" "}
                        <span className="text-error">*</span>
                      </label>
                      <select
                        id="callbackTime"
                        name="callbackTime"
                        required
                        value={formData.callbackTime}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all"
                      >
                        <option value="">Select an option</option>
                        {CALLBACK_TIME_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="question"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        What would you like to know about the Neoplatron
                        Green Hydrogen Kit?
                      </label>
                      <textarea
                        id="question"
                        name="question"
                        rows={4}
                        value={formData.question}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border-2 border-border dark:border-d-border bg-bg dark:bg-d-bg text-text dark:text-d-text focus:outline-none focus:border-primary dark:focus:border-d-primary transition-all resize-none placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                        placeholder="e.g. Will this work with my car's turbo diesel engine?"
                      />
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

export default InstallationForm;
