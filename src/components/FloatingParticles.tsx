import { useMemo } from 'react';
import { hydrogen_icon_1 } from '../constants/images';

const FloatingParticles = () => {
    // Generate particles only once
    const particles = useMemo(() => {
        return Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            icon: hydrogen_icon_1,
            // Random position between 5% and 95%
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            // Random size for depth effect
            width: Math.random() * 40 + 20 + 'px',
            // Random animation delay and duration for natural feel
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 10 + 10}s`,
            // Random opacity for visual hierarchy
            opacity: Math.random() * 0.3 + 0.1,
            // Select random animation class
            animationClass: `animate-float-${Math.floor(Math.random() * 3) + 1}`,
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className={`absolute ${p.animationClass}`}
                    style={{
                        left: p.left,
                        top: p.top,
                        width: p.width,
                        height: p.width, // Keep aspect ratio
                        opacity: p.opacity,
                        animationDelay: p.animationDelay,
                        animationDuration: p.animationDuration,
                    }}
                >
                    <img
                        src={p.icon}
                        alt=""
                        className="w-full h-full object-contain filter drop-shadow-lg"
                    />
                </div>
            ))}
        </div>
    );
};

export default FloatingParticles;
