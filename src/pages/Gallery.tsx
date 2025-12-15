
import { useState } from "react";
import { Folder, ArrowLeft, Image as ImageIcon, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import galleryDataRaw from "../data/galleryData.json";

// Type definition for Gallery Data
type GalleryData = {
  [category: string]: {
    [model: string]: string[];
  };
};

const galleryData: GalleryData = galleryDataRaw;

export default function Gallery() {
  const categories = Object.keys(galleryData).sort((a, b) => {
    // Custom sort order: 4W, 2W, 3W, 6W, Uncategorized
    const order = ["4 Wheelers", "2 Wheelers", "3 Wheelers", "6 Wheelers", "Uncategorized"];
    return order.indexOf(a) - order.indexOf(b);
  });

  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [activeModel, setActiveModel] = useState<string | null>(null);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const models = activeCategory ? galleryData[activeCategory] : {};
  const modelNames = Object.keys(models).sort();

  const handleModelClick = (model: string) => {
    setActiveModel(model);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToFolders = () => {
    setActiveModel(null);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevent scrolling
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCategory || !activeModel) return;
    const images = galleryData[activeCategory][activeModel];
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!activeCategory || !activeModel) return;
    const images = galleryData[activeCategory][activeModel];
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-title text-4xl sm:text-5xl font-bold text-text dark:text-d-text mb-4">
            Installation <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Gallery</span>
          </h1>
          <p className="text-lg text-text-muted dark:text-d-text-muted max-w-2xl mx-auto">
            Browse our extensive collection of installation examples across different vehicle types.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActiveModel(null); }}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${activeCategory === cat
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-bg-light dark:bg-d-bg-light text-text-muted dark:text-d-text-muted hover:bg-bg-subtle dark:hover:bg-d-bg-subtle border border-border dark:border-d-border"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          {activeModel ? (
            // MODEL VIEW (IMAGES)
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleBackToFolders}
                  className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors group"
                >
                  <div className="p-2 rounded-full bg-bg-light dark:bg-d-bg-light border border-border dark:border-d-border group-hover:border-primary/50 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Back to Folders</span>
                </button>
                <div className="h-6 w-px bg-border dark:bg-d-border" />
                <h2 className="text-2xl font-bold text-text dark:text-d-text flex items-center gap-2">
                  <Folder className="w-6 h-6 text-tertiary" />
                  {activeModel}
                </h2>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  {galleryData[activeCategory][activeModel].length} Photos
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryData[activeCategory][activeModel].map((src, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(idx)}
                    className="group relative aspect-video bg-bg-light dark:bg-d-bg-light rounded-xl overflow-hidden cursor-pointer border border-border dark:border-d-border shadow-xs hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                  >
                    <img
                      src={src}
                      alt={`${activeModel} installation ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 dark:bg-black/80 p-2 rounded-full">
                        <ZoomIn className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // FOLDER VIEW (CATEGORIES)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {modelNames.map((model) => {
                const images = models[model];
                const thumbnail = images[0];
                const count = images.length;

                return (
                  <div
                    key={model}
                    onClick={() => handleModelClick(model)}
                    className="group bg-bg-light dark:bg-d-bg-light rounded-2xl overflow-hidden cursor-pointer border border-border dark:border-d-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Folder Preview Stack Effect */}
                    <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-800">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={model}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-muted">
                          <ImageIcon className="w-12 h-12 opacity-50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                      {/* Badge */}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 text-xs font-bold rounded-full border border-white/20">
                        {count} Items
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                          <Folder className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-text dark:text-d-text mb-1 group-hover:text-primary transition-colors line-clamp-1">
                            {model}
                          </h3>
                          <p className="text-sm text-text-muted dark:text-d-text-muted">
                            View Gallery
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Empty State */}
        {modelNames.length === 0 && (
          <div className="text-center py-20 bg-bg-light dark:bg-d-bg-light rounded-2xl border border-border dark:border-d-border border-dashed">
            <Folder className="w-16 h-16 mx-auto text-text-muted mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-text dark:text-d-text mb-2">No Items Found</h3>
            <p className="text-text-muted">There are no installation photos in this category yet.</p>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && activeModel && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Main Image */}
            <div className="relative group">
              <img
                src={galleryData[activeCategory][activeModel][currentImageIndex]}
                alt="Full screen view"
                className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
              />

              {/* Navigation Buttons (Hover Only for Desktop) */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </div>

            {/* Caption / Counter */}
            <div className="absolute -bottom-12 left-0 right-0 text-center text-white">
              <p className="font-semibold text-lg">{activeModel}</p>
              <p className="text-white/60 text-sm">Image {currentImageIndex + 1} of {galleryData[activeCategory][activeModel].length}</p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
