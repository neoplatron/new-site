import { useState, useEffect } from "react";
import { Folder, ArrowLeft, Image as ImageIcon, ZoomIn, X, ChevronLeft, ChevronRight, Home, Car } from "lucide-react";
import galleryDataRaw from "../data/galleryData.json";

// Types based on the generated JSON
type GalleryNode = {
  name: string;
  thumbnail?: string | null;
  children?: GalleryNode[] | ModelContent;
};

type ModelContent = {
  type: "model_content";
  images: string[];
};

// Root data is an array of Category Nodes
const galleryData: GalleryNode[] = (galleryDataRaw || []) as GalleryNode[];

export default function Gallery() {
  if (!galleryData || galleryData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg dark:bg-d-bg text-text dark:text-d-text">
        <div className="text-center">
          <Folder className="w-12 h-12 mx-auto text-text-muted mb-4" />
          <h2 className="text-xl font-bold">Gallery Data loading or empty</h2>
          <p className="text-text-muted">Please ensure data builds correctly.</p>
        </div>
      </div>
    );
  }

  const [path, setPath] = useState<GalleryNode[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sync with browser history for back gesture support
  useEffect(() => {
    const handlePopState = () => {
      setPath((prev) => {
        if (prev.length > 0) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Helper to determine what to show
  const currentNode = path.length > 0 ? path[path.length - 1] : null;

  // Determine if we are at the leaf (Model) level
  const isLeaf = currentNode && currentNode.children && !Array.isArray(currentNode.children) && (currentNode.children as ModelContent).type === "model_content";

  const currentItems = isLeaf
    ? (currentNode!.children as ModelContent).images
    : (currentNode ? (currentNode.children as GalleryNode[]) : galleryData);

  // Handlers
  const handleNodeClick = (node: GalleryNode) => {
    window.history.pushState(null, "");
    setPath([...path, node]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBreadcrumbClick = (index: number) => {
    // Determine how many steps back we need to go
    // Current path length vs target index
    // If we are at length 3 (index 0,1,2) and want to go to index 0 (length 1)
    // We need to pop 2 times.

    const currentLength = path.length;
    const targetLength = index + 1; // index -1 (home) => target 0

    const delta = currentLength - targetLength;

    if (delta > 0) {
      window.history.go(-delta);
    }
    // If delta <= 0, we are already there or its invalid, do nothing (or reset if 0?)
    // Actually if index is same as current leaf, do nothing.
  };

  const goBack = () => {
    // Use history back to trigger popstate listener
    window.history.back();
  };

  // Lightbox Handlers
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLeaf) return;
    const images = (currentNode!.children as ModelContent).images;
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLeaf) return;
    const images = (currentNode!.children as ModelContent).images;
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-d-bg pt-20 pb-12 font-body transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Section */}
        <div className="bg-linear-to-r from-blue-50 to-purple-50 dark:from-d-bg-light dark:to-d-bg p-8 rounded-3xl mb-8 border border-border dark:border-d-border shadow-xs">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white dark:bg-d-bg rounded-xl shadow-xs">
                <ImageIcon className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-text dark:text-d-text">Vehicle Gallery</h1>
            </div>
            <p className="text-text-muted dark:text-d-text-muted">Browse our collection of vehicles by category</p>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 text-sm whitespace-nowrap scrollbar-hide">
          <button
            onClick={() => handleBreadcrumbClick(-1)}
            className={`flex items-center gap-1 hover:text-primary transition-colors ${path.length === 0 ? "text-primary font-bold" : "text-text-muted"}`}
          >
            <Home className="w-4 h-4" />
            Home
          </button>

          {path.map((node, index) => (
            <div key={index} className="flex items-center gap-2 text-text-muted">
              <ChevronRight className="w-4 h-4" />
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`hover:text-primary transition-colors ${index === path.length - 1 ? "text-text dark:text-d-text font-bold" : ""}`}
              >
                {node.name}
              </button>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {isLeaf ? (
            // LEAF VIEW: IMAGES
            <div>
              <button
                onClick={goBack}
                className="mb-6 flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to {currentNode?.name}
              </button>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {(currentItems as string[]).map((src, idx) => (
                  <div
                    key={idx}
                    onClick={() => openLightbox(idx)}
                    className="group relative aspect-video bg-bg-light dark:bg-d-bg-light rounded-xl overflow-hidden cursor-pointer border border-border dark:border-d-border shadow-xs hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                  >
                    <img
                      src={src}
                      alt={`Installation ${idx + 1}`}
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
            // FOLDER VIEW: CATEGORIES / BRANDS / MODELS
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {(currentItems as GalleryNode[]).map((node, idx) => (
                <div
                  key={idx}
                  onClick={() => handleNodeClick(node)}
                  className="group relative bg-white dark:bg-d-bg-light rounded-2xl overflow-hidden cursor-pointer border border-border dark:border-d-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-64"
                >
                  {/* Thumbnail Background */}
                  {node.thumbnail ? (
                    <div className="absolute inset-0">
                      <img
                        src={node.thumbnail}
                        alt={node.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                      <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                      <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Thumbnail Here</span>
                    </div>
                  )}

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg backdrop-blur-md border border-white/20 ${node.thumbnail ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                          {path.length === 0 ? <Car className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                        </div>
                      </div>
                      <h3 className={`text-xl font-bold line-clamp-1 ${node.thumbnail ? 'text-white' : 'text-text dark:text-d-text'}`}>
                        {node.name}
                      </h3>
                      <p className={`text-sm mt-1 ${node.thumbnail ? 'text-white/80' : 'text-text-muted'}`}>
                        View all companies
                      </p>
                    </div>

                    <div className={`p-3 rounded-full backdrop-blur-md transition-colors ${node.thumbnail ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
                      <ArrowLeft className="w-5 h-5 rotate-180" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {(!currentItems || (Array.isArray(currentItems) && currentItems.length === 0)) && (
          <div className="text-center py-20 bg-bg-light dark:bg-d-bg-light rounded-2xl border border-border dark:border-d-border border-dashed">
            <Folder className="w-16 h-16 mx-auto text-text-muted mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-text dark:text-d-text mb-2">No Items Found</h3>
            <p className="text-text-muted">This folder is empty.</p>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && isLeaf && (
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
            <div className="relative group">
              <img
                src={(currentNode!.children as ModelContent).images[currentImageIndex]}
                alt="Full screen view"
                className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
              />

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

            <div className="absolute -bottom-12 left-0 right-0 text-center text-white">
              <p className="font-semibold text-lg">{currentNode?.name}</p>
              <p className="text-white/60 text-sm">Image {currentImageIndex + 1} of {(currentNode!.children as ModelContent).images.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
