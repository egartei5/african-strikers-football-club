import { useRef, useEffect, ReactNode } from 'react';
import VanillaTilt from 'vanilla-tilt';

interface Tilt3DCardProps {
    children: ReactNode;
    className?: string;
    tiltMaxX?: number;
    tiltMaxY?: number;
    perspective?: number;
    scale?: number;
    speed?: number;
    glare?: boolean;
    maxGlare?: number;
    disabled?: boolean;
}

export function Tilt3DCard({
    children,
    className = '',
    tiltMaxX = 8,
    tiltMaxY = 8,
    perspective = 1000,
    scale = 1.02,
    speed = 400,
    glare = true,
    maxGlare = 0.15,
    disabled = false,
}: Tilt3DCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled || !cardRef.current) return;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        if (isMobile) return; // Skip tilt on mobile for performance

        VanillaTilt.init(cardRef.current, {
            max: Math.max(tiltMaxX, tiltMaxY),
            perspective,
            scale,
            speed,
            glare,
            'max-glare': maxGlare,
            gyroscope: false,
        });

        return () => {
            if (cardRef.current?.vanillaTilt) {
                cardRef.current.vanillaTilt.destroy();
            }
        };
    }, [tiltMaxX, tiltMaxY, perspective, scale, speed, glare, maxGlare, disabled]);

    return (
        <div ref={cardRef} className={`tilt-card ${className}`}>
            {children}
        </div>
    );
}
