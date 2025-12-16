import {
  left_fuel_consumption,
  left_mileage,
  left_pollution,
  right_fuel_consumption,
  right_mileage,
  right_pollution,
  mobile_logo,
  icat_logo,
  iso_logo,
  patent_logo,
  inhouse_logo,
  installations_logo,
} from "../constants/images";
import { ArrowRight, Award, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  bio,
  bus,
  car,
  motor,
  fast,
  maintenance,
  petrol,
  truck,
} from "../constants/icons";
import ThreeDCarousel from "../components/ThreeDCarousel";
import SavingsCalculator from "../components/SavingsCalculator";
import "./Home.css";

const Home = () => {
  const achievements = [
    {
      icon: <img src={icat_logo} alt="ICAT" className="w-full h-full object-contain" />,
      title: "ICAT Certified",
      desc: "Tested and Approved by a global automotive authority",
    },

    {
      icon: <img src={iso_logo} alt="ISO" className="w-full h-full object-contain" />,
      title: "ISO Certified",
      desc: "Internationally recognized quality management",
    },
    {
      icon: <img src={patent_logo} alt="Patented" className="w-full h-full object-contain" />,
      title: "Patented Technology",
      desc: "Unique, protected innovation in hydrogen tech",
    },
    {
      icon: <img src={inhouse_logo} alt="In-House" className="w-full h-full object-contain" />,
      title: "In-House Manufacturing",
      desc: "Complete production facility in Hyderabad",
    },
    {
      icon: <img src={installations_logo} alt="Installations" className="w-full h-full object-contain" />,
      title: "23,000+ Installations",
      desc: "Proven track record across India",
    },
  ];

  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => (prev.includes(index) ? prev : [...prev, index]));
          }
        });
      },
      { threshold: 0.1 }
    );

    const items = document.querySelectorAll(".achievement-card");
    items.forEach((item) => observerRef.current?.observe(item));

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <>
      <section className="relative flex items-center justify-center overflow-hidden bg-bg dark:bg-d-bg">
        <div className="absolute inset-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-linear-to-br from-bg-dark/20 via-bg/30 to-bg-light/20 dark:from-d-bg-dark/30 dark:via-d-bg/40 dark:to-d-bg-light/30"></div>

          {/* Grid pattern - increase opacity */}
          <div className="absolute inset-0 opacity-10 dark:opacity-10 home-grid-pattern"></div>

          {/* Subtle vignette only at edges - key change here */}
          <div className="absolute inset-0 home-vignette"></div>
        </div>

        {/* Animated floating icons - hiding on mobile, showing on md+ */}
        <div className="hidden md:block absolute top-10 right-1/5 w-16 h-16 opacity-70 dark:opacity-25 home-float-icon home-icon-car">
          <img
            src={car}
            alt=""
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>

        <div className="hidden md:block absolute top-20 left-20 w-14 h-14 opacity-65 dark:opacity-20 home-float-icon home-icon-bus">
          <img
            src={bus}
            alt=""
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>

        <div className="hidden md:block absolute bottom-15 right-1/3 w-12 h-12 opacity-50 dark:opacity-25 home-float-icon home-icon-motor">
          <img
            src={motor}
            alt=""
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>

        <div className="hidden md:block absolute bottom-40 left-20 w-14 h-14 opacity-65 dark:opacity-20 home-float-icon home-icon-truck">
          <img
            src={truck}
            alt=""
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>

        <div className="hidden md:block absolute top-1/4 right-20 w-10 h-10 opacity-75 dark:opacity-30 home-float-icon home-icon-fast">
          <img
            src={fast}
            alt=""
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>

        <div className="hidden md:block absolute top-30 left-2/5 w-12 h-12 opacity-50 dark:opacity-25 home-float-icon home-icon-petrol">
          <img
            src={petrol}
            alt=""
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>

        <div className="hidden md:block absolute bottom-1/4 right-24 w-11 h-11 opacity-65 dark:opacity-20 home-float-icon home-icon-maintenance">
          <img
            src={maintenance}
            alt=""
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>

        <div className="hidden md:block absolute top-1/3 left-28 w-13 h-13 opacity-70 dark:opacity-25 home-float-icon home-icon-bio">
          <img
            src={bio}
            alt=""
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>

        {/* Floating Hydrogen Particles Removed as per request */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-36 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            {/* Left Side - Text + CTA */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              {/* Headline */}
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-d-primary/10 border border-primary/20 dark:border-d-primary/20 rounded-full px-3 py-1.5 md:px-4 md:py-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-xs md:text-sm font-medium text-text dark:text-d-text">
                    Revolutionary Fuel Technology
                  </span>
                </div>

                <h1 className="font-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text dark:text-d-text leading-tight">
                  Efficiency,
                  <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-tertiary">
                    Unlocked.
                  </span>
                </h1>
              </div>

              {/* Subtext */}
              <p className="text-base md:text-xl text-text-para dark:text-d-text-para leading-relaxed max-w-xl mx-auto lg:mx-0">
                Neoplatron is a complete fuel optimizing system that reduces pollution,
                minimizes fuel loss, and maximizes vehicle efficiency, giving you cleaner,
                smarter, and more cost effective rides.
              </p>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-6 md:gap-8 pt-4">
                <Link to="/products/overview" className="group relative inline-flex items-center gap-3 bg-linear-to-r from-primary to-secondary hover:from-secondary hover:to-tertiary text-white font-button font-semibold px-6 py-3 md:px-8 md:py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105">
                  <span>View Products</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Secondary stats */}
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex flex-col items-center">
                    <div className="text-xl md:text-2xl font-bold font-title text-transparent bg-clip-text bg-linear-to-r from-success to-success/70">
                      70-100%
                    </div>
                    <div className="text-xs text-text-muted dark:text-d-text-muted">
                      Fuel Efficiency
                    </div>
                  </div>
                  <div className="w-px h-8 md:h-10 bg-border dark:bg-d-border"></div>
                  <div className="flex flex-col items-center">
                    <div className="text-xl md:text-2xl font-bold font-title text-transparent bg-clip-text bg-linear-to-r from-success to-success/70">
                      80-90%
                    </div>
                    <div className="text-xs text-text-muted dark:text-d-text-muted">
                      Less Emissions
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Visual Section */}
            <div className="relative flex items-center justify-center mt-8 lg:mt-0 min-h-[250px] md:min-h-[500px]">
              {/* Central NeoPlatron Logo */}
              <div className="relative z-20">
                {/* Arrow Line with "Before" and "After" labels */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none home-arrow-svg"
                  viewBox="0 0 200 200"
                >
                  {/* Zigzag arrow path */}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="12"
                      markerHeight="12"
                      refX="2"
                      refY="3"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 8 3, 0 6"
                        className="fill-primary dark:fill-d-primary"
                      />
                    </marker>
                  </defs>

                  {/* Longer zigzag line */}
                  <path
                    d="M 10 170 L 60 120 L 100 140 L 140 90 L 190 30"
                    className="stroke-primary/80 dark:stroke-d-primary/80"
                    strokeWidth="2.5"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                    strokeDasharray="4 4"
                  />
                </svg>

                {/* "Before" text - bottom left */}
                <div className="absolute left-0 bottom-4 md:bottom-8 transform -translate-x-8 md:-translate-x-12 translate-y-2 md:translate-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-error/20 dark:bg-error/10 blur-lg rounded-full"></div>
                    <span className="relative text-xs sm:text-sm font-semibold text-error dark:text-error/90 uppercase tracking-wider px-2 py-1 md:px-3 md:py-1 bg-bg/80 dark:bg-d-bg/80 backdrop-blur-sm rounded-full border border-error/30 dark:border-error/20">
                      Before
                    </span>
                  </div>
                </div>

                {/* "After" text - top right */}
                <div className="absolute right-0 top-4 md:top-8 transform translate-x-8 md:translate-x-12 -translate-y-8 md:-translate-y-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-success/20 dark:bg-success/10 blur-lg rounded-full"></div>
                    <span className="relative text-xs sm:text-sm font-semibold text-success dark:text-success/90 uppercase tracking-wider px-2 py-1 md:px-3 md:py-1 bg-bg/80 dark:bg-d-bg/80 backdrop-blur-sm rounded-full border border-success/30 dark:border-success/20">
                      After
                    </span>
                  </div>
                </div>

                {/* Glow effect - Removed as per request (Gradient behind mobile_logo) */}
                {/* <div className="absolute inset-0 bg-linear-to-r from-primary via-secondary to-tertiary rounded-full blur-xl md:blur-2xl opacity-30 animate-pulse"></div> */}

                {/* Logo */}
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 flex items-center justify-center">
                  <img
                    src={mobile_logo}
                    alt="NeoPlatron"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Left Cluster - Problems (Before) */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 sm:-translate-x-12 md:-translate-x-16 lg:-translate-x-8 space-y-4 md:space-y-6 lg:space-y-8">
                {/* Problem 1 - High Fuel Consumption */}
                <div className="group relative flex flex-col items-center gap-1 md:gap-2 transform -rotate-3 hover:rotate-0 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={left_fuel_consumption}
                      alt="High fuel consumption"
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 relative z-10 drop-shadow-xl group-hover:scale-110 transition-all duration-300 rounded-2xl md:rounded-3xl"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs md:text-sm font-body font-normal text-text dark:text-d-text whitespace-nowrap">
                      High Fuel Usage
                    </p>
                  </div>
                </div>

                {/* Problem 2 - Poor Mileage */}
                <div className="group relative flex flex-col items-center gap-1 md:gap-2 ml-4 md:ml-6 lg:ml-8 transform rotate-2 hover:rotate-0 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={left_mileage}
                      alt="Poor mileage"
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 relative z-10 drop-shadow-xl group-hover:scale-110 transition-all duration-300 rounded-2xl md:rounded-3xl"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs md:text-sm font-body font-normal text-text dark:text-d-text whitespace-nowrap">
                      Poor Mileage
                    </p>
                  </div>
                </div>

                {/* Problem 3 - High Pollution */}
                <div className="group relative flex flex-col items-center gap-1 md:gap-2 transform -rotate-2 hover:rotate-0 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={left_pollution}
                      alt="High pollution"
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 relative z-10 drop-shadow-xl group-hover:scale-110 transition-all duration-300 rounded-2xl md:rounded-3xl"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs md:text-sm font-body font-normal text-text dark:text-d-text whitespace-nowrap">
                      High Emissions
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Cluster - Solutions (After) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 sm:translate-x-12 md:translate-x-16 lg:translate-x-10 space-y-4 md:space-y-6 lg:space-y-8">
                {/* Solution 1 - Optimized Fuel Consumption */}
                <div className="group relative flex flex-col items-center gap-1 md:gap-2 transform rotate-3 hover:rotate-0 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={right_fuel_consumption}
                      alt="Optimized fuel consumption"
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 relative z-10 drop-shadow-xl group-hover:scale-110 transition-all duration-300 rounded-2xl md:rounded-3xl"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs md:text-sm font-body font-normal text-text dark:text-d-text whitespace-nowrap">
                      Optimized Fuel
                    </p>
                  </div>
                </div>

                {/* Solution 2 - Improved Mileage */}
                <div className="group relative flex flex-col items-center gap-1 md:gap-2 mr-4 md:mr-6 lg:mr-8 transform -rotate-2 hover:rotate-0 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={right_mileage}
                      alt="Improved mileage"
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 relative z-10 drop-shadow-xl group-hover:scale-110 transition-all duration-300 rounded-2xl md:rounded-3xl"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs md:text-sm font-body font-normal text-text dark:text-d-text whitespace-nowrap">
                      Better Mileage
                    </p>
                  </div>
                </div>

                {/* Solution 3 - Reduced Pollution */}
                <div className="group relative flex flex-col items-center gap-1 md:gap-2 transform rotate-2 hover:rotate-0 transition-all duration-300">
                  <div className="relative">
                    <img
                      src={right_pollution}
                      alt="Reduced pollution"
                      className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-28 lg:h-28 relative z-10 drop-shadow-xl group-hover:scale-110 transition-all duration-300 rounded-2xl md:rounded-3xl"
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs md:text-sm font-body font-normal text-text dark:text-d-text whitespace-nowrap">
                      Clean Emissions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}

      </section>

      {/* Our Achievements Section */}
      <section className="py-8 sm:py-16 lg:py-24 relative overflow-hidden bg-bg dark:bg-d-bg">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-primary/5 to-transparent skew-x-12"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-linear-to-r from-secondary/5 to-transparent -skew-x-12"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-16 lg:mb-20">
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text mb-4 sm:mb-6">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Achievements
              </span>
            </h2>
            <div className="w-24 h-1 bg-linear-to-r from-primary to-secondary mx-auto rounded-full"></div>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-text-para dark:text-d-text-para max-w-2xl mx-auto">
              Setting benchmarks in quality, safety, and innovation with
              internationally recognized certifications.
            </p>
          </div>

          <div className="block lg:hidden">
            <ThreeDCarousel items={achievements} />
          </div>

          <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {achievements.map((item, index) => (
              <div
                key={index}
                data-index={index}
                className={`achievement-card group relative bg-bg-light dark:bg-d-bg-light rounded-2xl shadow-lg border border-border dark:border-d-border p-6 sm:p-8 hover:shadow-xl hover:border-primary/50 dark:hover:border-d-primary/50 transition-all duration-300 opacity-0 ${visibleItems.includes(index) ? "animate-fade-in-up" : ""
                  } animate-float-subtle delay-${index * 100}`}
                style={{ animationDelay: `${index * 0.1}s, ${index * 1}s` }}
              >
                <div className="flex flex-col items-center text-center h-full">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 sm:mb-6 text-primary transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-title text-lg sm:text-xl font-bold text-text dark:text-d-text mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom stats */}
          <div className="mt-6 sm:mt-12 lg:mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 lg:gap-4 bg-linear-to-r from-primary/10 via-secondary/10 to-tertiary/10 dark:from-d-primary/10 dark:via-d-secondary/10 dark:to-d-tertiary/10 rounded-lg sm:rounded-xl lg:rounded-2xl px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 border border-border dark:border-d-border">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary dark:text-d-primary" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-text dark:text-d-text">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                    19+
                  </span>{" "}
                  Years of Excellence
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 sm:h-8 bg-border dark:bg-d-border"></div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary dark:text-d-secondary" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-text dark:text-d-text">
                  Leading{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-tertiary">
                    Green Innovation
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

      </section>

      <SavingsCalculator />
    </>
  );
};

export default Home;
