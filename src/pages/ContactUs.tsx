// import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  // Send,
  // CheckCircle,
  ArrowRight,
} from "lucide-react";
// import { contactUs } from "../constants/illustrations";
// import Lottie from "lottie-react";

const ContactUs = () => {
  // const [formData, setFormData] = useState({
  //   name: "",
  //   email: "",
  //   phone: "",
  //   subject: "",
  //   message: "",
  // });
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
  //   null
  // );

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  //   >
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setSubmitStatus(null);

  //   // Simulate form submission
  //   setTimeout(() => {
  //     console.log("Form submitted:", formData);
  //     setSubmitStatus("success");
  //     setIsSubmitting(false);
  //     setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

  //     // Clear success message after 5 seconds
  //     setTimeout(() => {
  //       setSubmitStatus(null);
  //     }, 5000);
  //   }, 1500);
  // };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 7416493939",
      subtext: "Mon-Sat, 9AM-6PM",
      href: "tel:+917416493939",
      color: "primary",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@neoplatron.com",
      subtext: "We reply within 24 hours",
      href: "mailto:info@neoplatron.com",
      color: "secondary",
    },
    {
      icon: MapPin,
      label: "Office",
      value: "ECIL, Hyderabad-51",
      subtext: "Telangana, India",
      href: "https://maps.google.com/?q=ECIL,Hyderabad",
      color: "tertiary",
    },
  ];

  // const subjects = [
  //   "Product Inquiry",
  //   "Installation Support",
  //   "Technical Support",
  //   "Pricing Information",
  //   "Partnership Opportunity",
  //   "Other",
  // ];

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
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
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
              Us
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-bg-light/90 max-w-2xl mx-auto leading-relaxed">
            Have questions about our technology? We're here to help you make the
            switch to sustainable mobility
          </p>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg dark:from-d-bg to-transparent"></div>
      </section>

      {/* Contact Information Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-12 sm:mb-16 relative z-20">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;
            const colorMap = {
              primary: "from-primary to-primary/80",
              secondary: "from-secondary to-secondary/80",
              tertiary: "from-tertiary to-tertiary/80",
            };

            return (
              <a
                key={index}
                href={item.href}
                target={item.label === "Office" ? "_blank" : undefined}
                rel={
                  item.label === "Office" ? "noopener noreferrer" : undefined
                }
                className="group relative"
              >
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
                      <p className="text-sm sm:text-base font-semibold text-text dark:text-d-text mb-1 truncate">
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
              </a>
            );
          })}
        </div>
      </section>

      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 flex-row">
          <div className="lg:col-span-1">
            <Lottie
              animationData={contactUs}
              loop={true}
              className="w-full h-auto"
            />
          </div>

          <div className="lg:col-span-1">
            <div className="relative group">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 dark:from-d-primary/20 dark:to-d-secondary/20 rounded-2xl sm:rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative bg-bg-light dark:bg-d-bg-light rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-4 lg:p-8 border-2 border-border dark:border-d-border shadow-2xl">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-secondary to-tertiary rounded-xl flex items-center justify-center shadow-lg">
                    <Send className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="font-title text-xl sm:text-2xl lg:text-3xl font-bold text-text dark:text-d-text">
                      Send us a Message
                    </h2>
                    <p className="text-sm text-text-para dark:text-d-text-para">
                      Fill out the form below and we'll get back to you
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-4">
                  <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        Full Name <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 sm:py-3.5 rounded-lg border-2 border-border dark:border-d-border 
                                 bg-bg dark:bg-d-bg text-text dark:text-d-text
                                 focus:outline-none focus:border-primary dark:focus:border-d-primary
                                 transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                        placeholder="John Doe"
                      />
                    </div>

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
                        className="w-full px-4 py-3 sm:py-3.5 rounded-lg border-2 border-border dark:border-d-border 
                                 bg-bg dark:bg-d-bg text-text dark:text-d-text
                                 focus:outline-none focus:border-primary dark:focus:border-d-primary
                                 transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 sm:py-3.5 rounded-lg border-2 border-border dark:border-d-border 
                                 bg-bg dark:bg-d-bg text-text dark:text-d-text
                                 focus:outline-none focus:border-primary dark:focus:border-d-primary
                                 transition-all placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                      >
                        Subject <span className="text-error">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 sm:py-3.5 rounded-lg border-2 border-border dark:border-d-border 
                                 bg-bg dark:bg-d-bg text-text dark:text-d-text
                                 focus:outline-none focus:border-primary dark:focus:border-d-primary
                                 transition-all"
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-text dark:text-d-text mb-2"
                    >
                      Your Message <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 sm:py-3.5 rounded-lg border-2 border-border dark:border-d-border 
                               bg-bg dark:bg-d-bg text-text dark:text-d-text
                               focus:outline-none focus:border-primary dark:focus:border-d-primary
                               transition-all resize-none placeholder:text-text-muted dark:placeholder:text-d-text-muted"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="group relative w-full bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-primary
                             text-white font-semibold py-4 px-6 rounded-xl
                             focus:outline-none focus:ring-4 focus:ring-primary/20
                             disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all shadow-lg hover:shadow-2xl hover:scale-[1.02]
                             flex items-center justify-center gap-2"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="relative">
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </span>
                    {!isSubmitting && (
                      <Send className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </button>

                  {submitStatus === "success" && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-success/20 rounded-xl blur-xl"></div>
                      <div className="relative p-4 sm:p-5 rounded-xl bg-success/10 border-2 border-success">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-success font-semibold mb-1">
                              Message sent successfully!
                            </p>
                            <p className="text-sm text-text-para dark:text-d-text-para">
                              We've received your message and will get back to
                              you within 24 hours.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <div className="relative group">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 rounded-2xl sm:rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

          <div className="relative bg-bg-light dark:bg-d-bg-light rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden border-2 border-border dark:border-d-border shadow-2xl">
            <div className="p-6 sm:p-8 border-b-2 border-border dark:border-d-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-tertiary to-warning rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text">
                    Our Location
                  </h2>
                  <p className="text-sm text-text-para dark:text-d-text-para">
                    Visit us at our Hyderabad office
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-80 sm:h-96 lg:h-[500px] bg-bg dark:bg-d-bg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30445.089384745957!2d78.54263!3d17.47629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9b1e6e6e6e6f%3A0x6e6e6e6e6e6e6e6e!2sECIL%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-20 dark:grayscale-40 opacity-90"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
