import Logo from "../Logo";

// Branded loading state: logo, a progress shimmer and a short message.
export default function BrandLoader({ fullScreen = false, text = "Loading your dashboard..." }: { fullScreen?: boolean; text?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-5 text-center px-6 ${
        fullScreen ? "min-h-screen bg-bg dark:bg-d-bg" : "py-20"
      }`}
    >
      <div className="animate-pulse">
        <Logo logoHeight={44} logo2Height={32} mobileHeight={64} />
      </div>
      <div className="w-40 h-1 rounded-full bg-border/60 dark:bg-d-border overflow-hidden">
        <div className="h-full w-1/3 rounded-full bg-primary animate-[brandload_1.2s_ease-in-out_infinite]" />
      </div>
      <p className="text-sm text-text-muted dark:text-d-text-muted">{text}</p>
      <style>{`@keyframes brandload{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
}
