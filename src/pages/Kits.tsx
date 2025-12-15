import {
  Zap,
  Cog,
  Gauge,
  Package,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

import { platron1, platron2, platron3 } from "../constants/images";
import FloatingParticles from "../components/FloatingParticles";

const Kits = () => {

  const products = [
    {
      id: 1,
      name: "PLATRON 4W 1.8",
      category: "ENGINE CATEGORY - (600 – 1800 CC)",
      image: platron1,
      vehicles:
        "Tata Nano, Maruti 800/Alto to Corolla, Octavia",
      features: [
        "Consists of Electronic Modules and Fuel Cells",
        "Maintains Stoichiometry hydroxy generation",
        "Fuel Cells contain reactors generating Hydroxy Energy",
        "Power Cable connects directly to battery",
        "Prevents hydrocarbon deposits and increases engine life",
        "Vacuum Pipe connected to Engine Manifold Inlet",
        "Supports 100% efficient fuel combustion",
        "Compatible with both Petrol & Diesel engines",
      ],
    },
    {
      id: 2,
      name: "PLATRON 4W 3.0",
      category: "ENGINE CATEGORY - (1900 – 3000 CC)",
      image: platron2,
      vehicles:
        "Innova, Scorpio, XUV500, Mercedes Benz, Audi, BMW, Jaguar, Volvo",
      features: [
        "Consists of Electronic Modules and Fuel Cells",
        "Maintains Stoichiometry hydroxy generation",
        "Reactor-based Hydroxy Energy generation",
        "Battery-powered via Power Cable",
        "Vacuum Pipe connected to Engine Manifold",
        "Supports complete fuel combustion",
        "Compatible with both Petrol & Diesel engines",
      ],
    },
    {
      id: 3,
      name: "PLATRON 2W/3W",
      category: "P2W (100 – 550CC) | P3W (150 – 350CC)",
      image: platron3,
      vehicles:
        "All Bikes/Scooters up to 550cc | All Petrol & Diesel 3W Autorickshaws",
      features: [
        "Consists of Electronic Modules and Fuel Cells",
        "Maintains Stoichiometry hydroxy generation",
        "Hydroxy Energy generation via internal reactors",
        "Battery-powered via Power Cable",
        "Increases engine life by reducing deposits",
        "Vacuum Pipe connected to Engine Manifold",
        "Supports complete fuel combustion",
        "Compatible with both Petrol & Diesel engines",
      ],
    },
  ];

  const icons = [Zap, Cog, Gauge];

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-primary text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-tertiary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* Accent line above heading */}
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
              <span className="px-3 sm:px-4 text-xs sm:text-sm font-medium tracking-widest uppercase text-bg-light">
                Product Range
              </span>
              <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
            </div>

            <h1 className="font-title text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
              Our Product{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-tertiary to-bg-light">
                Kits
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-bg-light/90 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              Advanced hydroxy energy solutions for vehicles of all sizes
            </p>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto pt-4 sm:pt-6 border-t border-white/20">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-1">3</div>
                <div className="text-xs sm:text-sm text-bg-light/80">Product Variants</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-1">100+</div>
                <div className="text-xs sm:text-sm text-bg-light/80">Vehicle Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold mb-1">Universal</div>
                <div className="text-xs sm:text-sm text-bg-light/80">Compatibility</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Hydrogen Icons */}
        <FloatingParticles />

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg to-transparent"></div>
      </section>

      {/* PRODUCTS */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 bg-bg dark:bg-d-bg">
        <div className="max-w-7xl mx-auto">

          {/* SECTION HEADER */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center mb-4">
              <div className="h-px w-8 bg-tertiary" />
              <span className="px-4 text-sm tracking-widest uppercase">Our Products</span>
              <div className="h-px w-8 bg-tertiary" />
            </div>

            <h2 className="font-title text-4xl lg:text-5xl font-bold">
              Product{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Lineup
              </span>
            </h2>
          </div>

          {/* PRODUCT BLOCKS */}
          <div className="space-y-16">
            {products.map((product, index) => {
              const isEven = index % 2 === 0;
              const Icon = icons[index % icons.length];

              return (
                <div key={product.id} className="relative">

                  <div
                    className={`absolute ${isEven ? "left-0" : "right-0"} top-1/2 -translate-y-1/2 w-40 h-40 sm:w-56 sm:h-56 bg-${isEven ? "primary" : "secondary"
                      }/5 rounded-full blur-3xl`}
                  />

                  <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-center`}>

                    {/* IMAGE */}
                    <div className="w-full lg:w-5/12">
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-secondary/15 rounded-2xl blur-xl" />

                        <div className="relative overflow-hidden rounded-2xl  shadow-lg">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-[350px] object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-secondary text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow">
                            Product {product.id}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="w-full lg:w-7/12 space-y-4">

                      {/* HEADER */}
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold uppercase">Product {product.id}</span>
                        </div>

                        <h2 className="font-title text-2xl lg:text-3xl font-bold leading-tight">{product.name}</h2>

                        <p className="text-xs sm:text-sm text-secondary font-semibold">{product.category}</p>
                      </div>

                      {/* VEHICLES */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-tertiary/10 to-secondary/10 rounded-lg" />
                        <div className="relative bg-bg-light rounded-lg p-3 border-l-4 border-tertiary">
                          <h3 className="text-xs font-semibold uppercase mb-1 flex items-center gap-2">
                            <Package className="w-3 h-3" />
                            Compatible Vehicles
                          </h3>
                          <p className="text-xs sm:text-sm leading-snug">{product.vehicles}</p>
                        </div>
                      </div>

                      {/* ⭐ UPDATED KEY FEATURES — THIN LINE ⭐ */}
                      <div className="space-y-3">
                        <h3 className="text-sm sm:text-base font-bold flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          Key Features
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {product.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-3 p-3 rounded-xl bg-bg-light/70 dark:bg-d-bg-light/40 backdrop-blur border border-border-muted hover:border-primary/40 transition-all"
                            >
                              {/* THIN PROFESSIONAL LINE */}
                              <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-secondary"></div>

                              <p className="text-xs sm:text-sm leading-snug font-medium text-text-para dark:text-d-text-para">
                                {feature}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all text-sm">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 bg-primary text-white relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="font-title text-4xl font-bold">Ready to Upgrade Your Vehicle?</h2>

          <p className="text-lg text-bg-light/90">
            Contact us today to find the perfect Platron kit for your vehicle.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary rounded-xl font-semibold shadow-xl hover:scale-105 transition-all"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </a>

            <a
              href="/products"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Kits;
