import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products/overview" },
    { name: "Gallery", path: "/gallery" },
  ];

  const supportLinks = [
    { name: "FAQ's", path: "/faqs" },
    { name: "Warranty", path: "/warranty" },
    { name: "Contact Us", path: "/contact" },
  ];

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 74164 93939",
      href: "tel:+917416493939",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@neoplatron.com",
      href: "mailto:info@neoplatron.com",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "Cherlapalli Phase-3, Hyderabad-51, Telangana India",
      href: "https://maps.app.goo.gl/2hEuUsaM4jhPsH1i8",
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "", // Replace with actual link
      label: "Facebook",
      color: "hover:bg-[#1877F2] hover:text-white",
    },
    {
      icon: Twitter,
      href: "", // Replace with actual link
      label: "Twitter",
      color: "hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/neoplatron/", // Replace with actual link
      label: "Instagram",
      color: "hover:bg-linear-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:text-white",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/PLACEHOLDER", // Replace with actual link
      label: "LinkedIn",
      color: "hover:bg-[#0A66C2] hover:text-white",
    },
    {
      icon: Youtube,
      href: "https://www.youtube.com/@neoplatronhydrogen", // Replace with actual link
      label: "YouTube",
      color: "hover:bg-[#FF0000] hover:text-white",
    },
  ];

  return (
    <footer className="bg-bg-dark dark:bg-d-bg-dark border-t border-border dark:border-d-border">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-12 lg:gap-16">
          {/* Company Info Section */}
          <div className="space-y-4">
            <Link to="/">
              <Logo logoHeight={28} logo2Height={20} gap={12} />
            </Link>

            <p className="text-sm text-text-para dark:text-d-text-para leading-relaxed mt-4">
              Leading provider of innovative solutions and services. We are
              committed to delivering excellence and quality to our customers.
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`w-10 h-10 rounded-full bg-bg dark:bg-d-bg 
                       flex items-center justify-center
                       text-text-para dark:text-d-text-para
                       ${social.color}
                       transition-all duration-300 hover:scale-110 shadow-sm`}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links Wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-3">
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-text dark:text-d-text mb-2">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-text-para dark:text-d-text-para 
                         hover:text-primary dark:hover:text-d-primary 
                         transition-colors inline-flex items-center group"
                    >
                      <span
                        className="w-0 group-hover:w-2 h-0.5 bg-primary dark:bg-d-primary 
                               transition-all duration-300 mr-0 group-hover:mr-2"
                      ></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-lg font-semibold text-text dark:text-d-text mb-2">
                Support
              </h3>
              <ul className="space-y-2">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm text-text-para dark:text-d-text-para 
                         hover:text-primary dark:hover:text-d-primary 
                         transition-colors inline-flex items-center group"
                    >
                      <span
                        className="w-0 group-hover:w-2 h-0.5 bg-primary dark:bg-d-primary 
                               transition-all duration-300 mr-0 group-hover:mr-2"
                      ></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-text dark:text-d-text mb-2">
                Contact Us
              </h3>

              <ul className="space-y-3">
                {contactInfo.map((contact) => {
                  const Icon = contact.icon;
                  return (
                    <li key={contact.label}>
                      <a
                        href={contact.href}
                        target={
                          contact.label === "Address" ? "_blank" : undefined
                        }
                        rel={
                          contact.label === "Address"
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="flex items-start space-x-3 text-sm text-text-para dark:text-d-text-para 
                           hover:text-primary dark:hover:text-d-primary transition-colors group"
                      >
                        <Icon
                          size={18}
                          className="shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                        />
                        <span className="wrap-break-word">{contact.value}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border dark:border-d-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-center items-center">
            {/* Copyright */}
            <p className="text-sm text-text-para dark:text-d-text-para text-center">
              © {currentYear} Neoplatron. All rights reserved. Designed and Developed by <a href="https://www.creathy.in" target="_blank" rel="noopener noreferrer" className="text-primary dark:text-d-primary hover:underline">Creathy</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
