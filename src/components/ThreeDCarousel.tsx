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
    const cardWidth = 220;
    const gap = 40; // space between neighbouring cards on the ring
    const radius = Math.round(((cardWidth + gap) / 2) / Math.tan(Math.PI / itemCount));

    return (
        <div className="relative mt-14 mb-20">
            <div className="scene-3d w-[220px] h-[280px] mx-auto perspective-1200 relative">
                <div className="carousel-3d w-full h-full absolute transform-style-3d animate-rotate-3d">
                    {items.map((item, index) => {
                        const angle = theta * index;
                        return (
                            <div
                                key={index}
                                className="carousel-cell apple-card absolute left-0 top-0 w-[220px] h-[280px] backface-hidden rounded-[28px] px-6 py-8 flex flex-col items-center justify-center text-center"
                                style={{
                                    transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                                }}
                            >
                                <div className="apple-icon w-[72px] h-[72px] rounded-[22px] flex items-center justify-center text-primary mb-5">
                                    {item.icon}
                                </div>
                                <h3 className="text-[17px] font-semibold tracking-tight text-text dark:text-d-text mb-1.5 leading-snug">
                                    {item.title}
                                </h3>
                                <p className="text-[13px] text-text-para dark:text-d-text-para leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ThreeDCarousel;
