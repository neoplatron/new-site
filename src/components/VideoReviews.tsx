import { Play } from "lucide-react";

export default function VideoReviews() {
  // Using the same link 3 times as requested
  // Original link: https://youtube.com/shorts/ga_RmMxtL0Q?si=5HJS4wEKwALZXU8O
  // Embed format for Shorts is typically: https://www.youtube.com/embed/ga_RmMxtL0Q
  const videos = [
    {
      id: 1,
      title: "Customer Review 1",
      embedUrl: "https://www.youtube.com/embed/xJwKC9lfZt4?rel=0",
    },
    {
      id: 2,
      title: "Customer Review 2",
      embedUrl: "https://www.youtube.com/embed/ga_RmMxtL0Q",
    },
    {
      id: 3,
      title: "Customer Review 3",
      embedUrl: "https://www.youtube.com/embed/Otxlahn03Vs?rel=0",
    },
  ];

  return (
    <section className="py-12 sm:py-20 lg:py-28 relative overflow-hidden bg-bg dark:bg-d-bg">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-linear-to-bl from-primary/5 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-full bg-linear-to-tr from-secondary/5 to-transparent blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-d-primary/10 border border-primary/20 dark:border-d-primary/20 rounded-full px-4 py-2 mb-4">
            <Play className="w-4 h-4 text-primary dark:text-d-primary" />
            <span className="text-sm font-medium text-text dark:text-d-text uppercase tracking-wider">
              Real Experiences
            </span>
          </div>
          <h2 className="font-title text-3xl sm:text-4xl lg:text-5xl font-bold text-text dark:text-d-text mb-4">
            Hear From Our{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              Customers
            </span>
          </h2>
          <div className="w-24 h-1 bg-linear-to-r from-primary to-secondary mx-auto rounded-full"></div>
          <p className="mt-6 text-base sm:text-lg text-text-para dark:text-d-text-para max-w-2xl mx-auto">
            Discover how NeoPlatron is transforming vehicles across the country with enhanced performance, better mileage, and reduced emissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {videos.map((video) => (
            <div 
              key={video.id} 
              className="group relative bg-bg-light dark:bg-d-bg-light rounded-[2rem] shadow-xl border border-border dark:border-d-border p-3 hover:shadow-2xl hover:border-primary/50 dark:hover:border-d-primary/50 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center mx-auto w-full max-w-[360px]"
            >
              {/* Decorative corner glows */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 dark:bg-d-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-secondary/20 dark:bg-d-secondary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              <div className="relative w-full aspect-[9/16] rounded-3xl overflow-hidden shadow-inner border border-border/50 dark:border-d-border/50 bg-black">
                <iframe
                  className="absolute inset-0 w-full h-full object-cover"
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
