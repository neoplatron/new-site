import React from "react";
import { Link } from "react-router-dom";
import FloatingParticles from "../components/FloatingParticles";
import {
  CheckCircle,
  Zap,
  Shield,
  TrendingDown,
  Wrench,
  Wind,
  Gauge,
  Leaf,
  Award,
  Factory,
  AlertTriangle,
} from "lucide-react";

const ProductOverview: React.FC = () => {
  const promises = [
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: "Fuel Efficiency",
      description: "Greater than 50% improvement",
      color: "from-tertiary to-warning",
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Pollution Reduction",
      description: "Greater than 90% reduction",
      color: "from-success to-success/80",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Increase Engine Life",
      description: "Up to 20% longer lifespan",
      color: "from-primary to-secondary",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Increase Pickup Power",
      description: "Up to 20% more power",
      color: "from-warning to-tertiary",
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: "Maintenance Reduction",
      description: "50-70% less maintenance",
      color: "from-info to-info/80",
    },
    {
      icon: <Wind className="w-6 h-6" />,
      title: "Quiet & Smooth Engine",
      description: "Quieter and smoother operation",
      color: "from-secondary to-primary",
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      title: "Engine Temperature",
      description: "Keeps engine cool (up to 10°)",
      color: "from-info to-secondary",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Easy Installation",
      description: "No alterations required",
      color: "from-success to-tertiary",
    },
  ];

  const drawbacks = [
    "Majority of Fuel remains unburnt resulting in low mileage and high maintenance",
    "Rise in Engine Temperature",
    "Exhaust emissions are very high",
    "Build up in Hydrocarbon deposits in the Engine",
  ];

  const emissions = [
    { name: "Hydrocarbons", symbol: "HC" },
    { name: "Carbon monoxide", symbol: "CO" },
    { name: "Nitrogen oxides", symbol: "NOx" },
    { name: "Sulfur dioxide", symbol: "SO2" },
    { name: "Particulate Matter", symbol: "PM2.5, PM10" },
  ];

  const healthEffects = [
    {
      pollutant: "Hydrocarbons (HC)",
      effects:
        "Respiratory issues, eye irritation, potential carcinogenic effects",
    },
    {
      pollutant: "Carbon Monoxide (CO)",
      effects:
        "Reduces oxygen delivery to organs, causes headaches, dizziness, can be fatal",
    },
    {
      pollutant: "Nitrogen Oxides (NOx)",
      effects: "Lung inflammation, reduced immunity, acid rain contributor",
    },
    {
      pollutant: "Sulfur Dioxide (SO2)",
      effects: "Respiratory problems, aggravates asthma, acid rain formation",
    },
    {
      pollutant: "Particulate Matter (PM)",
      effects:
        "Heart disease, lung cancer, premature death, respiratory diseases",
    },
  ];

  const products = [
    {
      name: "Platron 2W",
      capacity: "100 - 500cc",
      vehicles: "All Bikes & Scooters up to 550cc",
    },
    {
      name: "Platron 3W",
      capacity: "150 - 350cc",
      vehicles: "All Petrol, Diesel, CNG & LPG 3W Autos",
    },
    {
      name: "Platron 4W 1.8L",
      capacity: "600 - 1800cc",
      vehicles: "All 4W upto 1800cc",
    },
    {
      name: "Platron 4W 3L",
      capacity: "1900 - 3000cc",
      vehicles: "All 4-wheelers upto 3000cc",
    },
    {
      name: "Platron 6W 4.5L",
      capacity: "3100 - 4500cc",
      vehicles: "All Diesel & CNG Mini-Trucks, Buses",
    },
    {
      name: "Platron 6W 6L",
      capacity: "5750 - 7000cc",
      vehicles: "All Diesel & CNG Commercial Trucks, Buses",
    },
    {
      name: "Platron 9W",
      capacity: "7000 - 9000cc",
      vehicles: "All Commercial Vehicles upto 9000cc",
    },
    {
      name: "Platron 12W",
      capacity: "9000 - 12000cc",
      vehicles: "All Commercial Vehicles upto 12000cc",
    },
  ];

  const systemComponents = [
    "System consists of electronic module and fuel cells",
    "Electronic module helps maintain Stoichiometry hydroxy generation",
    "Fuel cell contains a reactor which produces hydroxy energy",
    "Power cable is connected with the battery",
    "Vacuum pipe is connected to engine manifold inlet from the equipment",
    "Helps to combust 100% fuel in combustion chamber, both petrol and diesel vehicles",
  ];

  const stats = [
    { value: "70-100%", label: "Fuel Efficiency" },
    { value: "80-90%", label: "Emission Reduction" },
    { value: "Upto 20%", label: "More Power" },
    { value: "23,000+", label: "Installations" },
  ];

  const coverage = [
    "Two Wheelers",
    "Three Wheelers",
    "Four Wheelers",
    "All Six Wheelers and Above",
    "Generators",
    "Motor Boats",
    "Earthmovers",
    "Commercial Vehicles",
  ];

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary via-secondary to-primary text-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-tertiary rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-tertiary" />
            <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-bg-light">
              Revolutionary Technology
            </span>
            <div className="h-px w-8 sm:w-12 bg-tertiary" />
          </div>

          <h1 className="font-title text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 leading-tight">
            Advanced Digital
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">
              Plasma Technology
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-2xl text-bg-light/90 mb-8 sm:mb-10 lg:mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Enhancing Performance of Internal Combustion Engines with Green
            Hydrogen Innovation
          </p>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto mt-8 sm:mt-12 lg:mt-16 pt-8 sm:pt-12 border-t border-white/20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-bg-light/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Hydrogen Icons */}
        <FloatingParticles />

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg to-transparent" />
      </section>

      {/* Introduction */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg dark:bg-d-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/5 dark:bg-d-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 dark:bg-d-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                About Platron
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text">
              Revolutionary{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Innovation
              </span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="group relative">
              <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 dark:from-d-primary/20 dark:to-d-secondary/20 rounded-2xl sm:rounded-3xl blur-2xl" />
              <div className="relative bg-bg-light dark:bg-d-bg-light rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-border dark:border-d-border shadow-lg">
                <p className="text-base sm:text-lg text-text-para dark:text-d-text-para leading-relaxed mb-5 sm:mb-6">
                  Neoplatron India Private Limited introduced "Platron" to the
                  world. Platron works on a revolutionary technology called{" "}
                  <span className="font-semibold text-primary dark:text-d-primary">
                    ADPT (Advanced Digital Plasma Technology)
                  </span>
                  , which enhances overall performance of Internal Combustion
                  Engines in Automobiles.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-lg sm:rounded-xl bg-linear-to-r from-tertiary/10 to-warning/10 dark:from-d-tertiary/10 dark:to-warning/10 border border-tertiary/20">
                  <Award className="w-10 h-10 sm:w-12 sm:h-12 text-tertiary dark:text-d-tertiary shrink-0" />
                  <p className="text-sm sm:text-base lg:text-lg text-text-para dark:text-d-text-para text-center sm:text-left">
                    With over{" "}
                    <span className="font-bold text-tertiary dark:text-d-tertiary">
                      23,000+ successful installations
                    </span>{" "}
                    and happy customers, our goal is to enroll 1% of all
                    potential customers (all Petrol & Diesel automobile users).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Science & Technology */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg dark:bg-d-bg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 dark:bg-d-primary/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-title text-3xl sm:text-4xl font-bold text-text dark:text-d-text mb-4">
              The Science Behind <span className="text-primary">Neoplatron</span>
            </h2>
            <p className="max-w-3xl mx-auto text-text-para dark:text-d-text-para leading-relaxed">
              Our proprietary <strong>ADPT (Advanced Digital Plasma Technology)</strong> utilizes the principles of
              stoichiometry to optimize combustion. By injecting precise amounts of hydrogen (Hydroxy Gas)
              into the air intake, we enhance the flame speed and combustion efficiency of the fuel-air mixture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-bg-light dark:bg-d-bg-light p-8 rounded-2xl border border-border dark:border-d-border">
              <h3 className="text-xl font-bold text-text dark:text-d-text mb-4 flex items-center gap-2">
                <Zap className="text-tertiary" /> Hydroxy Boost
              </h3>
              <p className="text-text-para dark:text-d-text-para mb-4">
                The device separates water into hydrogen and oxygen on-demand. This hydrogen gas acts as a catalyst,
                helping the primary fuel (petrol/diesel) burn more completely and quickly inside the engine cylinder.
              </p>
            </div>
            <div className="bg-bg-light dark:bg-d-bg-light p-8 rounded-2xl border border-border dark:border-d-border">
              <h3 className="text-xl font-bold text-text dark:text-d-text mb-4 flex items-center gap-2">
                <Gauge className="text-secondary" /> Stoichiometric Balance
              </h3>
              <p className="text-text-para dark:text-d-text-para mb-4">
                Our electronic control module ensures the air-fuel ratio remains ideal (Stoichiometry).
                This results in cooler exhaust temperatures and significant reduction in unburnt fuel,
                directly translating to higher mileage and lower emissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* System Components */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg-light dark:bg-d-bg-light relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-primary/10 dark:bg-d-primary/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-secondary/10 dark:bg-d-secondary/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Technology
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text">
              How It{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Works
              </span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {systemComponents.map((component, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10 dark:from-d-primary/10 dark:to-d-secondary/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-bg dark:bg-d-bg rounded-xl p-5 sm:p-6 border-2 border-border dark:border-d-border hover:border-primary/50 dark:hover:border-d-primary/50 transition-all duration-300 h-full shadow-md hover:shadow-xl">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-primary rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center font-bold font-title text-sm sm:text-base group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed pt-0.5 sm:pt-1">
                      {component}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platron Promises */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg dark:bg-d-bg relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-tertiary/5 dark:bg-d-tertiary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Our Promise
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text mb-3 sm:mb-4">
              Platron{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Benefits
              </span>
            </h2>
            <p className="text-base sm:text-lg text-text-para dark:text-d-text-para max-w-2xl mx-auto">
              Experience unprecedented performance improvements
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {promises.map((promise, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 dark:from-d-primary/20 dark:to-d-secondary/20 rounded-xl sm:rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-bg-light dark:bg-d-bg-light rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-border dark:border-d-border hover:border-primary/50 dark:hover:border-d-primary/50 h-full flex flex-col">
                  <div className="mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-linear-to-br ${promise.color} flex items-center justify-center text-white shadow-lg`}
                    >
                      {promise.icon}
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-text dark:text-d-text mb-1 sm:mb-2">
                    {promise.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-para dark:text-d-text-para">
                    {promise.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-block bg-linear-to-r from-success/10 to-success/5 dark:from-success/20 dark:to-success/10 rounded-lg sm:rounded-xl px-5 py-4 sm:px-8 sm:py-5 border border-success/20">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success shrink-0" />
                <p className="text-sm sm:text-base text-text dark:text-d-text">
                  <span className="font-semibold">Additional Benefit:</span>{" "}
                  Fights hydrocarbon deposits built up, keeps engine new
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg-light dark:bg-d-bg-light relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-error/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-warning/5 rounded-full blur-3xl -translate-y-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                The Problem
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text">
              Drawbacks of Normal{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-error to-warning">
                Combustion
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-error/5 rounded-2xl blur-2xl" />
              <div className="relative bg-bg dark:bg-d-bg rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-error/30 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-error/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-error" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-text dark:text-d-text">
                    Common Problems
                  </h3>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {drawbacks.map((drawback, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-bg-light dark:bg-d-bg-light border border-border-muted dark:border-d-border-muted"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-error shrink-0 mt-1.5 sm:mt-2" />
                      <span className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed">
                        {drawback}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-warning/5 rounded-2xl blur-2xl" />
              <div className="relative bg-bg dark:bg-d-bg rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-warning/30 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-warning/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Wind className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-text dark:text-d-text">
                    Major Emissions
                  </h3>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {emissions.map((emission, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-bg-light dark:bg-d-bg-light border border-border-muted dark:border-d-border-muted"
                    >
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-warning shrink-0 mt-1.5 sm:mt-2" />
                      <div>
                        <span className="font-semibold text-sm sm:text-base text-text dark:text-d-text">
                          {emission.symbol}
                        </span>
                        <span className="text-sm sm:text-base text-text-para dark:text-d-text-para">
                          {" "}
                          - {emission.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Health Effects */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg dark:bg-d-bg relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-error/5 dark:bg-error/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Health Impact
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text mb-3 sm:mb-4">
              Effects on{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-error to-warning">
                Human Health
              </span>
            </h2>
            <p className="text-base sm:text-lg text-text-para dark:text-d-text-para max-w-3xl mx-auto px-2">
              Understanding the impact of vehicle emissions on health is crucial
              for making informed decisions
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {healthEffects.map((effect, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-error/5 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-bg-light dark:bg-d-bg-light rounded-xl p-5 sm:p-6 shadow-md border-2 border-border dark:border-d-border hover:border-error/30 transition-all duration-300 h-full">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-error mt-1.5 sm:mt-2 group-hover:scale-150 transition-transform" />
                    <h3 className="text-base sm:text-lg font-bold text-error">
                      {effect.pollutant}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed">
                    {effect.effects}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-block bg-linear-to-r from-success/10 to-success/5 dark:from-success/20 dark:to-success/10 rounded-lg sm:rounded-xl px-5 py-4 sm:px-8 sm:py-5 border border-success/20">
              <div className="flex items-center gap-2 sm:gap-3 justify-center">
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-success shrink-0" />
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-success">
                  Platron reduces these harmful emissions by over 90%,
                  protecting your health and the environment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Range */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg-light dark:bg-d-bg-light relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-primary/5 dark:bg-d-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-secondary/5 dark:bg-d-secondary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Products
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text mb-3 sm:mb-4">
              Our Product{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Range
              </span>
            </h2>
            <p className="text-base sm:text-lg text-text-para dark:text-d-text-para px-2">
              Platron can be fitted to ALL PETROL / DIESEL / CNG / LPG engines
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {products.map((product, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 dark:from-d-primary/20 dark:to-d-secondary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-bg dark:bg-d-bg rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-border dark:border-d-border hover:border-primary dark:hover:border-d-primary h-full">
                  <div className="mb-4">
                    <h3 className="text-xl sm:text-2xl font-bold text-primary dark:text-d-primary mb-2 group-hover:text-secondary dark:group-hover:text-d-secondary transition-colors font-title">
                      {product.name}
                    </h3>
                    <div className="inline-block bg-tertiary/10 dark:bg-d-tertiary/10 px-3 py-1.5 rounded-full border border-tertiary/20">
                      <p className="text-xs sm:text-sm font-semibold text-tertiary dark:text-d-tertiary">
                        {product.capacity}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-text-para dark:text-d-text-para leading-relaxed">
                    <span className="font-semibold text-text dark:text-d-text">
                      Suitable for:{" "}
                    </span>
                    {product.vehicles}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom info */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 bg-linear-to-r from-primary/10 via-secondary/10 to-tertiary/10 dark:from-d-primary/10 dark:via-d-secondary/10 dark:to-d-tertiary/10 rounded-lg sm:rounded-xl px-5 py-4 sm:px-8 sm:py-5 border border-border dark:border-d-border">
              <div className="flex items-center gap-2">
                <Factory className="w-5 h-5 sm:w-6 sm:h-6 text-primary dark:text-d-primary" />
                <span className="text-sm sm:text-base font-semibold text-text dark:text-d-text">
                  Universal Compatibility
                </span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-border dark:bg-d-border" />
              <span className="text-sm sm:text-base text-text-para dark:text-d-text-para text-center sm:text-left">
                Compatible with all engine capacities from 100cc to 12000cc
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Market Coverage */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg dark:bg-d-bg relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/5 dark:bg-d-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-tertiary/5 dark:bg-d-tertiary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Coverage
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text">
              Extensive Market{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Coverage
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {coverage.map((vehicle, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-primary/5 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-bg-light dark:bg-d-bg-light rounded-lg p-4 sm:p-5 text-center border-2 border-border dark:border-d-border hover:border-primary dark:hover:border-d-primary transition-all duration-300 hover:shadow-lg h-full flex items-center justify-center">
                  <p className="font-semibold text-sm sm:text-base text-text dark:text-d-text group-hover:text-primary dark:group-hover:text-d-primary transition-colors">
                    {vehicle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-block bg-linear-to-r from-primary/10 via-secondary/10 to-tertiary/10 dark:from-d-primary/10 dark:via-d-secondary/10 dark:to-d-tertiary/10 rounded-lg sm:rounded-xl px-5 py-4 sm:px-8 sm:py-5 border border-border dark:border-d-border">
              <p className="text-sm sm:text-base lg:text-lg text-text-para dark:text-d-text-para">
                Every person who owns a vehicle in the above categories is a
                potential customer - from individuals to large organizations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-bg-light dark:bg-d-bg-light relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-error/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-success/5 rounded-full blur-3xl -translate-y-1/2" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-text-muted dark:text-d-text-muted">
                Comparison
              </span>
              <div className="h-px w-6 sm:w-8 bg-tertiary" />
            </div>
            <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text">
              Before & After{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
                Platron
              </span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 dark:from-d-primary/20 dark:to-d-secondary/20 rounded-2xl sm:rounded-3xl blur-2xl" />
            <div className="relative bg-bg dark:bg-d-bg rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-border dark:border-d-border shadow-xl">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Before */}
                <div className="group">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="inline-flex items-center gap-2 sm:gap-3 bg-error/10 dark:bg-error/20 rounded-lg sm:rounded-xl px-5 py-3 sm:px-6 sm:py-4 border border-error/20">
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-error" />
                      <h3 className="text-lg sm:text-xl font-bold text-error">
                        Before PLATRON
                      </h3>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-error/5 rounded-xl blur-xl" />
                    <div className="relative bg-bg-light dark:bg-d-bg-light rounded-xl p-5 sm:p-6 border border-border-muted dark:border-d-border-muted">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-error mt-1.5 sm:mt-2" />
                          <span className="text-sm sm:text-base text-text-para dark:text-d-text-para">
                            Incomplete combustion leads to wasted fuel
                          </span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-error mt-1.5 sm:mt-2" />
                          <span className="text-sm sm:text-base text-text-para dark:text-d-text-para">
                            High emissions harm environment and health
                          </span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-error mt-1.5 sm:mt-2" />
                          <span className="text-sm sm:text-base text-text-para dark:text-d-text-para">
                            Reduced engine performance over time
                          </span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-error mt-1.5 sm:mt-2" />
                          <span className="text-sm sm:text-base text-text-para dark:text-d-text-para">
                            Frequent maintenance required
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* After */}
                <div className="group">
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="inline-flex items-center gap-2 sm:gap-3 bg-success/10 dark:bg-success/20 rounded-lg sm:rounded-xl px-5 py-3 sm:px-6 sm:py-4 border border-success/20">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                      <h3 className="text-lg sm:text-xl font-bold text-success">
                        After PLATRON
                      </h3>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-success/5 rounded-xl blur-xl" />
                    <div className="relative bg-bg-light dark:bg-d-bg-light rounded-xl p-5 sm:p-6 border border-border-muted dark:border-d-border-muted">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success mt-0.5 shrink-0" />
                          <span className="text-sm sm:text-base text-text-para dark:text-d-text-para">
                            Complete combustion for maximum efficiency
                          </span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success mt-0.5 shrink-0" />
                          <span className="text-sm sm:text-base text-text-para dark:text-d-text-para">
                            90%+ reduction in harmful emissions
                          </span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success mt-0.5 shrink-0" />
                          <span className="text-sm sm:text-base text-text-para dark:text-d-text-para">
                            Enhanced power and smoother operation
                          </span>
                        </li>
                        <li className="flex items-start gap-2 sm:gap-3">
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success mt-0.5 shrink-0" />
                          <span className="text-sm sm:text-base text-text-para dark:text-d-text-para">
                            50% reduction in maintenance costs
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Transform Your Vehicle?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-bg-light/90 mb-6 sm:mb-8 lg:mb-10">
            Join 23,000+ satisfied customers and experience the power of ADPT
            technology
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/products/kits"
              className="bg-white text-primary px-6 sm:px-7 lg:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-bg-light transition-colors text-sm sm:text-base inline-block"
            >
              View Product Kits
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
    </div>
  );
};

export default ProductOverview;
