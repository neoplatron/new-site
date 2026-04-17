import { MapPin, Phone, Globe } from "lucide-react";
import SEO from "../components/SEO";

const ChannelPartners = () => {
  const partners = [
    {
      id: 1,
      name: "Jaybalan",
      role: "Regional Partner",
      location: "India - Chennai",
      phone: "+91 9600038588",
      address: "Chennai, India",
      images: ["/assets/partners/1000099161.png"],
      isLogo: true,
    },
    {
      id: 2,
      name: "Ansari",
      role: "Global Partner",
      location: "Bangladesh",
      phone: "+8801861650017",
      address: "Flat A3, 32 GARIB-E-NEWAZ AVENUE, SECTOR 11, UTRARA, DHAKA-1230",
      images: [
        "/assets/partners/1000099159.jpg",
        "/assets/partners/1000098825.jpg",
      ],
      isLogo: false,
    },
  ];

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg">
      <SEO
        title="Channel Partners - Neoplatron"
        description="Meet our global channel partners who represent Neoplatron and distribute our Advanced Digital Plasma Technology devices across different regions."
        canonical="/partners"
        keywords="channel partners, Neoplatron partners, global partners, regional partner india, bangladesh partner"
      />

      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary via-secondary to-primary text-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-tertiary rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
            <span className="px-3 sm:px-4 text-xs font-medium tracking-widest uppercase text-bg-light">
              Global Network
            </span>
            <div className="h-px w-8 sm:w-12 bg-tertiary"></div>
          </div>

          <h1 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Our Channel <span className="text-transparent bg-clip-text bg-linear-to-r from-tertiary to-bg-light">Partners</span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-bg-light/90 mb-4 max-w-2xl mx-auto leading-relaxed font-light">
            Connecting our innovative green mobility solutions with communities around the world through our dedicated regional and global partners.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-bg to-transparent"></div>
      </section>

      {/* Partners List Section */}
      <section className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="bg-bg-light dark:bg-d-bg-light rounded-2xl border border-border dark:border-d-border shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group flex flex-col"
              >
                {/* Image Gallery Header */}
                <div className={`relative h-64 sm:h-80 flex ${partner.isLogo ? 'bg-white dark:bg-white' : 'bg-bg-dark/50 dark:bg-d-bg-dark/50'}`}>
                  {partner.images.length === 1 ? (
                    <img
                      src={partner.images[0]}
                      alt={partner.name}
                      className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${partner.isLogo ? 'object-contain p-8 pb-24' : 'object-cover'}`}
                    />
                  ) : (
                    partner.images.map((img, idx) => (
                      <div key={idx} className="flex-1 border-r border-border dark:border-d-border last:border-r-0 relative overflow-hidden">
                        <img
                          src={img}
                          alt={`${partner.name} - image ${idx + 1}`}
                          className={`w-full h-full group-hover:scale-105 transition-transform duration-500 ${partner.isLogo ? 'object-contain p-8 pb-24' : 'object-cover'}`}
                        />
                      </div>
                    ))
                  )}
                  {/* Overlay Gradient */}
                  <div className={`absolute inset-0 bg-linear-to-t from-black/80 ${partner.isLogo ? 'via-black/5' : 'via-black/20'} to-transparent`}></div>
                  
                  {/* Name and Role Overlay */}
                  <div className="absolute bottom-4 left-6 right-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider bg-primary/90 text-white rounded-full">
                        {partner.role}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-title text-white">
                      {partner.name}
                    </h2>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col space-y-5">
                  
                  {/* Location Info */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-bg dark:bg-d-bg border border-border/50 dark:border-d-border/50">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Globe className="w-5 h-5 text-secondary dark:text-d-secondary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-muted dark:text-d-text-muted mb-1">Region</h4>
                      <p className="font-medium text-text dark:text-d-text">{partner.location}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-bg dark:bg-d-bg border border-border/50 dark:border-d-border/50">
                    <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-tertiary dark:text-d-tertiary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-text-muted dark:text-d-text-muted mb-1">Phone</h4>
                      <a href={`tel:${partner.phone}`} className="font-medium text-text dark:text-d-text hover:text-primary transition-colors">
                        {partner.phone}
                      </a>
                    </div>
                  </div>

                  {/* Address Info */}
                  {partner.address && (
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-bg dark:bg-d-bg border border-border/50 dark:border-d-border/50">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary dark:text-d-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-text-muted dark:text-d-text-muted mb-1">Address</h4>
                        <p className="font-medium text-text dark:text-d-text">{partner.address}</p>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChannelPartners;
