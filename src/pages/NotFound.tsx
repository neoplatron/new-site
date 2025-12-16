import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="bg-primary/5 p-6 rounded-full mb-6 animate-fade-up">
                <Home className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-6xl font-bold font-title text-primary mb-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
                404
            </h1>
            <h2 className="text-2xl font-bold text-text dark:text-d-text mb-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
                Page Not Found
            </h2>
            <p className="text-text-muted max-w-md mb-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors animate-fade-up"
                style={{ animationDelay: "400ms" }}
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
            </Link>
        </div>
    );
}
