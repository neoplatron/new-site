import {
  Leaf,
  Target,
  Award,
  Factory,
  Globe,
  TrendingUp,
  CheckCircle,
  Zap,
  Calendar,
  // Car,
  // Briefcase,
} from "lucide-react";
// import React from "react";
import { Link } from "react-router-dom";
import { our_mission, our_vision } from "../constants/images";
import FloatingParticles from "../components/FloatingParticles";

const AboutUs = () => {
  const milestones = [
    {
      year: "2007",
      event: "Research & Development began on hydrogen technology",
    },
    {
      year: "2012",
      event: "First concept device launched after extensive testing",
    },
    {
      year: "2016",
      event: "Company transitioned to NEOPLATRON India Private Limited",
    },
    {
      year: "2017",
      event:
        "First ICAT Certification, ISO Certification, Patent applications filed",
    },
    { year: "2025", event: "23,000+ installations completed across India" },
  ];



  const stats = [
    { value: "19+", label: "Years of Research" },
    { value: "70% - 100%", label: "Fuel Efficiency" },
    { value: "80% - 90%", label: "Emission Reduction" },
    { value: "23,000+", label: "Installations" },
  ];

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary via-secondary to-primary text-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-tertiary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Accent line above heading */}
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-bg-light">
                Industry Leader
              </span>
              <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
            </div>

            <h1 className="font-title text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
              Revolutionizing
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
                Green Mobility
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-2xl text-bg-light/90 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Leading the world towards a net zero-emission future powered by
              innovation, technology, and responsibility
            </p>

            {/* Stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto mt-8 sm:mt-12 lg:mt-16 pt-8 sm:pt-12 border-t border-white/20">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-d-text dark:text-d-primary mb-1 sm:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm lg:text-base text-d-text-muted dark:text-d-text-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Hydrogen Icons */}
        <FloatingParticles />

        {/* Bottom linear fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg to-transparent"></div>
      </section>

      {/* Company Story Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg dark:bg-d-bg relative overflow-hidden">
        {/* Background accent elements */}
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/5 dark:bg-d-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 dark:bg-d-primary/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                About Us
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Story
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
            {/* Story content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="relative">
                <div className="absolute -left-3 sm:-left-4 top-0 w-0.5 sm:w-1 h-full bg-lienar-to-b from-primary via-secondary to-tertiary rounded-full"></div>
                <div className="pl-6 sm:pl-8 space-y-5 sm:space-y-6">
                  <div className="group">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary mt-1.5 sm:mt-2 group-hover:scale-150 transition-transform"></div>
                      <h3 className="font-title text-lg sm:text-xl font-semibold text-text dark:text-d-text">
                        Innovation Born from Vision
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-text-para dark:text-d-text-para">
                      NEOPLATRON India Private Limited is at the forefront of
                      revolutionizing green mobility through cutting-edge
                      hydrogen technology. Founded on 19+ years of dedicated
                      research and innovation, we manufacture the Advanced
                      Digital Plasma Technology (ADPT) device a breakthrough
                      solution that transforms vehicle efficiency and
                      environmental impact.
                    </p>
                  </div>

                  <div className="group">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary mt-1.5 sm:mt-2 group-hover:scale-150 transition-transform"></div>
                      <h3 className="font-title text-lg sm:text-xl font-semibold text-text dark:text-d-text">
                        Combating Climate Crisis
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-text-para dark:text-d-text-para">
                      Our journey began with a vision to combat the devastating
                      effects of fossil fuel consumption that has damaged our
                      environment for over 200 years. From the Industrial
                      Revolution to today, reliance on coal, oil, and gas has
                      led to unprecedented carbon emissions, pushing global
                      temperatures to alarming levels.
                    </p>
                  </div>

                  <div className="group">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-tertiary mt-1.5 sm:mt-2 group-hover:scale-150 transition-transform"></div>
                      <h3 className="font-title text-lg sm:text-xl font-semibold text-text dark:text-d-text">
                        Expert Leadership
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-text-para dark:text-d-text-para">
                      Under the leadership of Mr. V.Aditya Kishore Kumar, our
                      Managing Director with 30+ years of automotive and
                      alternative fuels experience, we've developed a unique
                      product using plasma technology that improves mileage for
                      diesel and petrol vehicles from 2-wheelers to trucks,
                      covering engine capacities from 100cc to 6000cc.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6">
                <div className="bg-linear-to-br from-primary/10 to-secondary/10 dark:from-d-primary/10 dark:to-d-secondary/10 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-primary/20 dark:border-d-primary/20">
                  <div className="text-2xl sm:text-3xl font-bold font-title text-primary dark:text-d-primary mb-0.5 sm:mb-1">
                    19+
                  </div>
                  <div className="text-xs sm:text-sm text-text-muted dark:text-d-text-muted uppercase tracking-wide">
                    Years Research
                  </div>
                </div>
                <div className="bg-linear-to-br from-secondary/10 to-tertiary/10 dark:from-d-secondary/10 dark:to-d-tertiary/10 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-secondary/20 dark:border-d-secondary/20">
                  <div className="text-2xl sm:text-3xl font-bold font-title text-secondary dark:text-d-secondary mb-0.5 sm:mb-1">
                    30+
                  </div>
                  <div className="text-xs sm:text-sm text-text-muted dark:text-d-text-muted uppercase tracking-wide">
                    Years Expertise
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features card */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 dark:from-d-primary/20 dark:to-d-secondary/20 rounded-2xl sm:rounded-3xl"></div>
              <div className="relative bg-bg-light dark:bg-d-bg-light rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-border dark:border-d-border shadow-sm">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br from-primary to-secondary flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="font-title text-2xl sm:text-3xl font-bold text-text dark:text-d-text">
                    Key Features
                  </h3>
                </div>

                <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-bg dark:bg-d-bg border border-border-muted dark:border-d-border-muted hover:border-success dark:hover:border-success transition-colors group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-success/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-text dark:text-d-text mb-0.5 sm:mb-1">
                        Fuel Efficiency
                      </div>
                      <div className="text-xs sm:text-sm text-text-para dark:text-d-text-para">
                        Improves fuel efficiency by greater than 70% - 100%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-bg dark:bg-d-bg border border-border-muted dark:border-d-border-muted hover:border-success dark:hover:border-success transition-colors group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-success/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-text dark:text-d-text mb-0.5 sm:mb-1">
                        Emission Reduction (Non Generative type)
                      </div>
                      <div className="text-xs sm:text-sm text-text-para dark:text-d-text-para">
                        Reduces emissions by greater than 80% - 90%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-bg dark:bg-d-bg border border-border-muted dark:border-d-border-muted hover:border-success dark:hover:border-success transition-colors group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-success/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-text dark:text-d-text mb-0.5 sm:mb-1">
                        Temperature Control
                      </div>
                      <div className="text-xs sm:text-sm text-text-para dark:text-d-text-para">
                        Lowers exhaust temperatures upto 10 degrees
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-bg dark:bg-d-bg border border-border-muted dark:border-d-border-muted hover:border-success dark:hover:border-success transition-colors group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-success/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-text dark:text-d-text mb-0.5 sm:mb-1">
                        Performance Boost
                      </div>
                      <div className="text-xs sm:text-sm text-text-para dark:text-d-text-para">
                        Up to 50% increase in engine pickup and performance
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-bg dark:bg-d-bg border border-border-muted dark:border-d-border-muted hover:border-success dark:hover:border-success transition-colors group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-success/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-text dark:text-d-text mb-0.5 sm:mb-1">
                        Lower Maintenance
                      </div>
                      <div className="text-xs sm:text-sm text-text-para dark:text-d-text-para">
                        Reduces maintenance by 50-70%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-bg dark:bg-d-bg border border-border-muted dark:border-d-border-muted hover:border-success dark:hover:border-success transition-colors group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-success/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-text dark:text-d-text mb-0.5 sm:mb-1">
                        Universal Compatibility
                      </div>
                      <div className="text-xs sm:text-sm text-text-para dark:text-d-text-para">
                        Compatible with all engine and fuel types
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Vision & Mission Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg-light dark:bg-d-bg-light relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 dark:bg-d-primary/10 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute top-1/2 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-secondary/10 dark:bg-d-secondary/10 rounded-full blur-3xl -translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Our Purpose
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text">
              Vision &{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Mission
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Vision Card */}
            <div className="group relative">
              <div className="relative bg-bg dark:bg-d-bg rounded-xl sm:rounded-2xl overflow-hidden border-2 border-border dark:border-d-border shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-bg dark:to-d-bg z-10"></div>
                  <img
                    src={our_vision}
                    alt="Our Vision"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 lg:p-8">
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text mb-2">
                      Our Vision
                    </h3>
                    <div className="h-1 w-12 sm:w-16 bg-linear-to-r from-primary to-secondary rounded-full"></div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed">
                      To lead the world towards a{" "}
                      <span className="font-semibold text-primary dark:text-d-primary">
                        net zero emission future
                      </span>{" "}
                      powered by innovation, technology, and responsibility. We
                      envision a better world with a pollution-free environment,
                      achieved by reducing emissions from vehicles with our
                      advanced technology.
                    </p>
                    <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed">
                      Our goal is to make the world a better place to live in
                      while enjoying the luxury of traveling in vehicles,
                      completely reducing pollution and the health issues caused
                      by harmful emissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Card */}
            <div className="group relative">
              <div className="relative bg-bg dark:bg-d-bg rounded-xl sm:rounded-2xl overflow-hidden border-2 border-border dark:border-d-border shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                {/* Image Section */}
                <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-bg dark:to-d-bg z-10"></div>
                  <img
                    src={our_mission}
                    alt="Our Mission"
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/90 backdrop-blur-sm rounded-lg flex items-center justify-center">
                      <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 sm:p-6 lg:p-8">
                  <div className="mb-4 sm:mb-6">
                    <h3 className="font-title text-xl sm:text-2xl font-bold text-text dark:text-d-text mb-2">
                      Our Mission
                    </h3>
                    <div className="h-1 w-12 sm:w-16 bg-linear-to-r from-secondary to-tertiary rounded-full"></div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed">
                      In India, over 32 crore vehicles are currently on the
                      road, contributing massively to air pollution. At
                      NEOPLATRON, we aim to solve this challenge through an
                      affordable and portable retrofitting solution that can be
                      adopted by anyone. With our low-cost, easy-to-install
                      technology, we help eliminate harmful emissions and make
                      clean mobility accessible to all. Through this approach,
                      achieving Net Zero becomes simple, practical, and within
                      everyone’s reach.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom impact statement */}
          <div className="mt-8 sm:mt-12 lg:mt-16 text-center">
            <div className="inline-block bg-linear-to-r from-primary/10 via-secondary/10 to-tertiary/10 dark:from-d-primary/10 dark:via-d-secondary/10 dark:to-d-tertiary/10 rounded-lg sm:rounded-xl px-5 py-4 sm:px-8 sm:py-6 border border-border dark:border-d-border">
              <p className="text-sm sm:text-base lg:text-lg font-medium text-text dark:text-d-text">
                Committed to{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-tertiary font-bold">
                  transforming mobility
                </span>{" "}
                for a sustainable tomorrow
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Technology Section */}

      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-bg dark:bg-d-bg relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 dark:bg-d-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-tertiary/5 dark:bg-d-tertiary/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header - Reduced spacing on mobile */}
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Technology
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
            </div>
            <h2 className="font-title text-2xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text mb-3 sm:mb-6 px-2">
              Advanced Digital{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-br from-primary to-secondary">
                Plasma Technology
              </span>
            </h2>
            <p className="text-base sm:text-xl text-text-para dark:text-d-text-para max-w-3xl mx-auto leading-relaxed px-2">
              Our patented ADPT system uses green hydrogen technology,
              compatible with any engine and fuel type
            </p>
          </div>

          {/* Main content card */}
          <div className="relative">
            {/* Card glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-secondary/20 to-tertiary/20 dark:from-d-primary/20 dark:via-d-secondary/20 dark:to-d-tertiary/20 rounded-2xl sm:rounded-3xl blur-2xl"></div>

            <div className="relative bg-linear-to-br from-bg-light/50 to-bg/50 dark:from-d-bg-light/50 dark:to-d-bg/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-10 border-2 border-border dark:border-d-border shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-12">
                {/* How It Works */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary rounded-lg sm:rounded-xl blur-md opacity-50"></div>
                      <div className="relative w-10 h-10 sm:w-14 sm:h-14 bg-linear-to-br from-primary to-secondary rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Zap className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-title text-xl sm:text-3xl font-bold text-text dark:text-d-text">
                        How It Works
                      </h3>
                      <div className="h-0.5 sm:h-1 w-16 sm:w-20 bg-linear-to-br from-primary to-secondary rounded-full mt-1 sm:mt-2"></div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-5">
                    {[
                      {
                        number: 1,
                        text: "Uses controlled/regulated electrolysis process to generate",
                        highlight: "Hydrogen Energy",
                      },
                      {
                        number: 2,
                        text: "Generated Hydrogen is connected to the manifold air inlet and enters the",
                        highlight: "combustion chamber",
                      },
                      {
                        number: 3,
                        text: "Helps combust more fuel in less time, producing more",
                        highlight: "thermal and kinetic energy",
                      },
                      {
                        number: 4,
                        text: "100% safe with on-demand generation no hydrogen storage required",
                        highlight: null,
                        special: "success",
                      },
                      {
                        number: 5,
                        text: "No engine modifications needed—suitable for any IC engine using fossil fuels",
                        highlight: "No engine modifications",
                      },
                    ].map((item) => (
                      <div
                        key={item.number}
                        className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-bg dark:bg-d-bg border border-border-muted dark:border-d-border-muted hover:border-primary dark:hover:border-d-primary transition-all duration-300"
                      >
                        <div className="relative shrink-0">
                          <div className="absolute inset-0 bg-primary rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
                          <div className="relative w-7 h-7 sm:w-10 sm:h-10 bg-linear-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center font-bold font-title text-sm sm:text-lg group-hover:scale-110 transition-transform">
                            {item.number}
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed pt-0.5 sm:pt-1">
                          {item.special === "success" ? (
                            <>
                              <span className="font-semibold text-success">
                                100% safe
                              </span>{" "}
                              with on-demand generation—no hydrogen storage
                              required
                            </>
                          ) : item.highlight ? (
                            <>
                              {item.text}{" "}
                              <span className="font-semibold text-text dark:text-d-text">
                                {item.highlight}
                              </span>
                            </>
                          ) : (
                            item.text
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Environmental Impact */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-success rounded-lg sm:rounded-xl blur-md opacity-50"></div>
                      <div className="relative w-10 h-10 sm:w-14 sm:h-14 bg-linear-to-br from-success to-success/80 rounded-lg sm:rounded-xl flex items-center justify-center">
                        <Leaf className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-title text-xl sm:text-3xl font-bold text-text dark:text-d-text">
                        Environmental Impact
                      </h3>
                      <div className="h-0.5 sm:h-1 w-16 sm:w-20 bg-linear-to-br from-success to-success/60 rounded-full mt-1 sm:mt-2"></div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-5">
                    {[
                      {
                        text: "Eliminates non-generative emissions by up to",
                        value: "80% - 90%",
                      },
                      {
                        text: "Consumes",
                        value: "31%",
                        suffix: "less oxygen from the atmosphere",
                      },
                      {
                        text: "Reduces exhaust temperature by up to",
                        value: "10°C",
                      },
                      {
                        text: "Directly addresses",
                        value: "global warming concerns",
                        noHighlight: true,
                      },
                      {
                        text: "Compatible with all fossil fuel types:",
                        value: "Petrol, Diesel, CNG, LPG",
                        noHighlight: true,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="group flex items-start gap-3 sm:gap-4 p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-bg dark:bg-d-bg border border-border-muted dark:border-d-border-muted hover:border-success dark:hover:border-success transition-all duration-300"
                      >
                        <div className="relative shrink-0">
                          <div className="absolute inset-0 bg-success/20 rounded-lg sm:rounded-xl blur group-hover:blur-md transition-all"></div>
                          <div className="relative w-9 h-9 sm:w-12 sm:h-12 bg-success/10 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-success" />
                          </div>
                        </div>
                        <div className="pt-1 sm:pt-2">
                          <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed">
                            {item.text}{" "}
                            <span
                              className={`font-${item.noHighlight ? "semibold" : "bold"
                                } ${item.noHighlight
                                  ? "text-text dark:text-d-text"
                                  : "text-success"
                                } ${item.noHighlight ? "" : "text-lg sm:text-xl"
                                }`}
                            >
                              {item.value}
                            </span>
                            {item.suffix && ` ${item.suffix}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom feature highlight - Optimized for mobile */}
              <div className="mt-6 sm:mt-12 pt-6 sm:pt-10 border-t border-border dark:border-d-border">
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl font-bold font-title text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-0.5 sm:mb-1">
                      Patented
                    </div>
                    <div className="text-xs sm:text-sm text-text-muted dark:text-d-text-muted uppercase tracking-wide">
                      Technology
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-border dark:bg-d-border"></div>
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl font-bold font-title text-transparent bg-clip-text bg-linear-to-br from-secondary to-tertiary mb-0.5 sm:mb-1">
                      Universal
                    </div>
                    <div className="text-xs sm:text-sm text-text-muted dark:text-d-text-muted uppercase tracking-wide">
                      Compatibility
                    </div>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-border dark:bg-d-border"></div>
                  <div className="text-center">
                    <div className="text-xl sm:text-3xl font-bold font-title text-success mb-0.5 sm:mb-1">
                      Zero Storage
                    </div>
                    <div className="text-xs sm:text-sm text-text-muted dark:text-d-text-muted uppercase tracking-wide">
                      100% Safe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-8 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg dark:bg-d-bg relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-tertiary/5 dark:bg-d-tertiary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-secondary/5 dark:bg-d-secondary/5 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-6 sm:mb-12 lg:mb-20">
            <div className="inline-flex items-center justify-center mb-2 sm:mb-3 lg:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Timeline
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
            </div>
            <h2 className="font-title text-2xl sm:text-3xl lg:text-5xl font-bold text-text dark:text-d-text mb-2 sm:mb-3 lg:mb-4">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Journey
              </span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-text-para dark:text-d-text-para max-w-2xl mx-auto px-2">
              Tracking our path of innovation and groundbreaking achievements
            </p>
          </div>

          <div className="relative">
            {/* Timeline line - hidden on mobile for cleaner look */}
            <div className="absolute left-12 top-0 bottom-0 w-1 bg-linear-to-b from-primary via-secondary to-tertiary rounded-full hidden sm:block shadow-lg"></div>

            <div className="space-y-4 sm:space-y-8 lg:space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start group">
                  {/* Timeline dot - hidden on mobile */}
                  <div className="absolute left-12 -translate-x-1/2 hidden sm:block z-10">
                    <div className="relative">
                      <div className="absolute inset-0 w-6 h-6 bg-primary rounded-full animate-ping opacity-20"></div>
                      <div className="absolute inset-0 w-6 h-6 bg-primary rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative w-6 h-6 bg-linear-to-br from-primary to-secondary rounded-full border-4 border-bg dark:border-d-bg shadow-xl group-hover:scale-125 transition-transform duration-300"></div>
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="sm:ml-24 w-full group">
                    <div className="relative">
                      {/* Card glow effect */}
                      <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 dark:from-d-primary/20 dark:to-d-secondary/20 rounded-lg sm:rounded-xl lg:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <div className="relative bg-bg-light dark:bg-d-bg-light rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 border-2 border-border dark:border-d-border hover:border-primary/50 dark:hover:border-d-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl">
                        {/* Year badge */}
                        <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
                          <div className="relative inline-block">
                            <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary rounded-md sm:rounded-lg lg:rounded-xl blur opacity-50"></div>
                            <div className="relative bg-linear-to-r from-primary to-secondary text-white px-3 sm:px-4 lg:px-6 py-1 sm:py-1.5 lg:py-2 rounded-md sm:rounded-lg lg:rounded-xl text-base sm:text-lg lg:text-2xl font-bold shadow-lg">
                              {milestone.year}
                            </div>
                          </div>

                          {/* Number indicator */}
                          <div className="hidden sm:flex w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-linear-to-br from-primary/10 to-secondary/10 dark:from-d-primary/10 dark:to-d-secondary/10 items-center justify-center border border-primary/20 dark:border-d-primary/20">
                            <span className="text-xs lg:text-sm font-bold text-primary dark:text-d-primary">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>
                        </div>

                        {/* Event description */}
                        <p className="text-xs sm:text-sm lg:text-lg text-text-para dark:text-d-text-para leading-snug sm:leading-relaxed">
                          {milestone.event}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom summary */}
          <div className="mt-6 sm:mt-12 lg:mt-20 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 lg:gap-6 bg-linear-to-r from-primary/10 via-secondary/10 to-tertiary/10 dark:from-d-primary/10 dark:via-d-secondary/10 dark:to-d-tertiary/10 rounded-lg sm:rounded-xl lg:rounded-2xl px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-6 border border-border dark:border-d-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary dark:text-d-primary" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-text dark:text-d-text">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                    {milestones.length}
                  </span>{" "}
                  Major Milestones
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 sm:h-8 bg-border dark:bg-d-border"></div>
              <div className="flex items-center gap-2 sm:gap-3">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary dark:text-d-secondary" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-text dark:text-d-text">
                  Continuous{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-tertiary">
                    Innovation
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Founders & Investors Section */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 bg-bg-light dark:bg-d-bg-light relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 dark:bg-d-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/3 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/5 dark:bg-d-secondary/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Our Pillars
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary"></div>
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text mb-6">
              Leadership &{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Backers
              </span>
            </h2>
          </div>

          <div className="space-y-20">
            {/* The Team */}
            <div>
              <h3 className="text-2xl font-bold text-text dark:text-d-text mb-10 text-center flex items-center justify-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                The Team
              </h3>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Mr. V. Adhitya Kishor Kumar */}
                <div className="bg-bg dark:bg-d-bg p-6 rounded-2xl border border-border dark:border-d-border shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-primary/10 mb-5 flex items-center justify-center text-2xl font-bold text-primary">
                    A
                  </div>
                  <h4 className="text-xl font-bold text-text dark:text-d-text mb-2">Mr. V. Adhitya Kishor Kumar</h4>
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                    {/* Founder, CMD, MD, CEO & CTO */}
                    Founder, CMD
                  </div>
                  <div className="text-text-para dark:text-d-text-para text-sm space-y-3">
                    <p><strong>Experience:</strong> Extensive experience in LPG/CNG conversion technologies and automotive projects.</p>
                    <p><strong>Role:</strong> Leadership, strategic direction, and overall management of the company.</p>
                  </div>
                </div>

                {/* Ms. V. Kiran Kumari */}
                <div className="bg-bg dark:bg-d-bg p-6 rounded-2xl border border-border dark:border-d-border shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-linear-to-br from-tertiary/20 to-tertiary/10 mb-5 flex items-center justify-center text-2xl font-bold text-tertiary">
                    K
                  </div>
                  <h4 className="text-xl font-bold text-text dark:text-d-text mb-2">Ms. V. Kiran Kumari</h4>
                  <div className="inline-block px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-sm font-semibold mb-4">
                    Director, CFO
                  </div>
                  <div className="text-text-para dark:text-d-text-para text-sm space-y-3">
                    <p><strong>Experience:</strong> Expertise in management roles such as purchase, stores, and production.</p>
                    <p><strong>Role:</strong> Operational management and process optimization within the company.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advisors */}
            <div>
              <h3 className="text-2xl font-bold text-text dark:text-d-text mb-10 text-center flex items-center justify-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                Advisors
              </h3>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Dr. Janardhan Gude */}
                <div className="bg-bg-light dark:bg-d-bg-light p-8 rounded-2xl border border-border dark:border-d-border flex flex-col md:flex-row gap-6 items-start">
                  <div className="shrink-0 w-16 h-16 rounded-xl bg-white dark:bg-d-bg shadow-sm flex items-center justify-center text-2xl font-bold text-text-muted">
                    JG
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-text dark:text-d-text">Dr. Janardhan Gude</h4>
                    <div className="text-secondary font-medium text-sm mb-3">Co-Founder, MicroSynbiotiX, Ireland</div>
                    <div className="text-text-para dark:text-d-text-para text-sm space-y-2">
                      <p><strong>Advisor Role:</strong> Technical Advisor, specialising in biotechnology and fermentation processes.</p>
                      <p className="opacity-80">Co-founder of MicroSynbiotiX focused on biotechnology and fermentation technology.</p>
                    </div>
                  </div>
                </div>

                {/* Dr. Rajendra Kumar Sharma */}
                <div className="bg-bg-light dark:bg-d-bg-light p-8 rounded-2xl border border-border dark:border-d-border flex flex-col md:flex-row gap-6 items-start">
                  <div className="shrink-0 w-16 h-16 rounded-xl bg-white dark:bg-d-bg shadow-sm flex items-center justify-center text-2xl font-bold text-text-muted">
                    RS
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-text dark:text-d-text">Dr. Rajendra Kumar Sharma</h4>
                    <div className="text-secondary font-medium text-sm mb-3">Technical Advisor</div>
                    <div className="text-text-para dark:text-d-text-para text-sm space-y-3">
                      {/* <p><strong>Advisor Role:</strong> Business development and strategic growth.</p> */}
                      <ul className="list-disc pl-4 space-y-1 opacity-80 text-xs">
                        <li>Director, Spel Technologies Pvt. Ltd., Pune (First Supercapacitor facility in India).</li>
                        <li>Recognized as the "Father of Supercapacitors" in the energy domain.</li>
                        <li>Advisory roles in Ministry of Electronics & IT, etc.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Manufacturing Story Section */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-title text-2xl sm:text-3xl lg:text-4xl font-bold text-text dark:text-d-text mb-3 sm:mb-4 lg:mb-6">
                Complete In-House Manufacturing
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-text-para dark:text-d-text-para leading-relaxed mb-3 sm:mb-4 lg:mb-6">
                Our state-of-the-art manufacturing facility in Hyderabad, India,
                represents the culmination of years of research and development.
                Since becoming a Private Limited company in 2016, we've built a
                complete in-house manufacturing unit that ensures quality
                control at every stage of production.
              </p>
              <p className="text-sm sm:text-base lg:text-lg text-text-para dark:text-d-text-para leading-relaxed mb-3 sm:mb-4 lg:mb-6">
                From initial concept in 2012 to sophisticated modern devices,
                our manufacturing capabilities have evolved to meet growing
                demand while maintaining the highest standards of quality and
                innovation.
              </p>
              <div className="flex items-center space-x-3 sm:space-x-4 text-text-para dark:text-d-text-para">
                <Factory className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-primary shrink-0" />
                <span className="text-sm sm:text-base lg:text-lg font-semibold">
                  Manufacturing Capacity: Up to 100,000 units annually
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-primary/10 dark:bg-d-primary/20 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-primary/20">
                <Globe className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-primary dark:text-d-primary mb-2 sm:mb-3 lg:mb-4" />
                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-text dark:text-d-text mb-1 sm:mb-2">
                  Made in India
                </h4>
                <p className="text-xs sm:text-sm lg:text-base text-text-para dark:text-d-text-para">
                  Supporting local manufacturing and innovation
                </p>
              </div>
              <div className="bg-secondary/10 dark:bg-d-secondary/20 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-secondary/20">
                <Award className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-secondary dark:text-d-secondary mb-2 sm:mb-3 lg:mb-4" />
                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-text dark:text-d-text mb-1 sm:mb-2">
                  Quality Assured
                </h4>
                <p className="text-xs sm:text-sm lg:text-base text-text-para dark:text-d-text-para">
                  ISO & NSIC certified processes
                </p>
              </div>
              <div className="bg-tertiary/10 dark:bg-d-tertiary/20 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-tertiary/20">
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-tertiary dark:text-d-tertiary mb-2 sm:mb-3 lg:mb-4" />
                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-text dark:text-d-text mb-1 sm:mb-2">
                  ICAT Tested
                </h4>
                <p className="text-xs sm:text-sm lg:text-base text-text-para dark:text-d-text-para">
                  Certified for safety and efficiency
                </p>
              </div>
              <div className="bg-success/10 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border border-success/20">
                <TrendingUp className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-success mb-2 sm:mb-3 lg:mb-4" />
                <h4 className="text-base sm:text-lg lg:text-xl font-bold text-text dark:text-d-text mb-1 sm:mb-2">
                  Scalable
                </h4>
                <p className="text-xs sm:text-sm lg:text-base text-text-para dark:text-d-text-para">
                  Expanding to 300,000 units capacity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Call to Action */}
      <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 lg:mb-6">
            Let's Reclaim a Healthier Earth with NEOPLATRON
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-4 sm:mb-6 lg:mb-8 text-bg">
            Join us in driving towards a cleaner, greener, and more sustainable
            future. This is the dawn of sustainable mobility.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/products/overview"
              className="bg-white text-primary px-6 sm:px-7 lg:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-bg-light transition-colors text-sm sm:text-base"
            >
              Explore Our Products
            </Link>
            <a
              href="/contact"
              className="bg-transparent border-2 border-white text-white px-6 sm:px-7 lg:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div >
  );
};

export default AboutUs;
