import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";

import Logo from "./Logo";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    {
      name: "Products",
      path: "/products/overview",
      hasDropdown: true,
      dropdownItems: [
        { name: "Product Overview", path: "/products/overview" },
        { name: "Kits", path: "/products/kits" },
      ],
    },
    { name: "Gallery", path: "/gallery" },
    { name: "FAQ's", path: "/faqs" },
    { name: "Warranty", path: "/warranty" },
    { name: "Contact Us", path: "/contact" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProductsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-linear-to-br from-bg/40 to-bg-dark/50 dark:from-d-bg/50 dark:to-d-bg-dark/50 backdrop-blur-2xl border-b border-border/50 dark:border-d-border/50 shadow-lg shadow-black/5 dark:shadow-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="shrink-0">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 ml-auto whitespace-nowrap">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <div
                  key={item.name}
                  className="relative"
                  ref={dropdownRef}
                  onMouseEnter={() => setIsProductsDropdownOpen(true)}
                  onMouseLeave={() => setIsProductsDropdownOpen(false)}
                >
                  <Link
                    to={item.path}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-text dark:text-d-text 
                        hover:bg-bg-dark dark:hover:bg-d-bg-dark hover:text-primary dark:hover:text-d-primary 
                        transition-colors flex items-center gap-1"
                  >
                    <span className="relative inline-block">
                      {item.name}
                      {(location.pathname === item.path ||
                        location.pathname.startsWith("/products/")) && (
                        <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-tertiary dark:bg-d-tertiary"></span>
                      )}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isProductsDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Link>

                  {/* Dropdown Menu */}
                  {isProductsDropdownOpen && (
                    <div className="absolute top-8 left-0 mt-1 w-48 bg-bg dark:bg-d-bg border border-border dark:border-d-border rounded-lg shadow-lg py-1">
                      {item.dropdownItems?.map((dropdownItem) => (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.path}
                          className="block px-4 py-2 text-sm text-text dark:text-d-text  dark:hover:bg-d-bg-light hover:text-primary dark:hover:text-d-primary transition-colors"
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="px-3 py-2 rounded-md text-sm font-medium text-text dark:text-d-text 
                      hover:bg-bg-dark dark:hover:bg-d-bg-dark hover:text-primary dark:hover:text-d-primary 
                      transition-colors"
                >
                  <span className="relative inline-block">
                    {item.name}
                    {location.pathname === item.path && (
                      <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-tertiary dark:bg-d-tertiary"></span>
                    )}
                  </span>
                </Link>
              )
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text dark:text-d-text hover:text-primary dark:hover:text-d-primary p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border dark:border-d-border">
          <nav className="flex flex-col space-y-1 px-4 py-2">
            {navItems.map((item) => (
              <div key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => !item.hasDropdown && setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium text-text 
                      dark:text-d-text hover:bg-bg-light dark:hover:bg-d-bg-light 
                      hover:text-primary dark:hover:text-d-primary transition-colors relative ${
                        location.pathname === item.path ||
                        (item.hasDropdown &&
                          location.pathname.startsWith("/products/"))
                          ? "border-l-4 border-tertiary dark:border-d-tertiary"
                          : ""
                      }`}
                >
                  {item.name}
                </Link>
                {item.hasDropdown && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.dropdownItems?.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.name}
                        to={dropdownItem.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-sm text-text-para dark:text-d-text-para hover:bg-bg-light dark:hover:bg-d-bg-light hover:text-primary dark:hover:text-d-primary transition-colors"
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
