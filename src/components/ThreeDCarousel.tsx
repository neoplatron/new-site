import React from "react";

interface CarouselItem {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

interface ThreeDCarouselProps {
    items: CarouselItem[];
}

const ThreeDCarousel: React.FC<ThreeDCarouselProps> = ({ items }) => {
    const itemCount = items.length;
    const theta = 360 / itemCount;
    const cardWidth = 220; // Reduced from 280
    const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / itemCount));

    return (
        <div className={`scene-3d w-[220px] h-[260px] mx-auto perspective-1000 relative my-10`}>
            <div className="carousel-3d w-full h-full absolute transform-style-3d animate-rotate-3d">
                {items.map((item, index) => {
                    const angle = theta * index;
                    return (
                        <div
                            key={index}
                            className={`carousel-cell absolute left-0 top-0 w-[220px] h-[260px] bg-bg-light dark:bg-d-bg-light rounded-2xl shadow-lg border border-border dark:border-d-border p-5 flex flex-col items-center justify-center text-center backface-hidden opacity-95`}
                            style={{
                                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                            }}
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                                {item.icon}
                            </div>
                            <h3 className="font-title text-lg font-bold text-text dark:text-d-text mb-3">
                                {item.title}
                            </h3>
                            <p className="text-sm text-text-para dark:text-d-text-para leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ThreeDCarousel;
