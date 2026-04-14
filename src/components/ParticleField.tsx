import { useMemo } from 'react';

interface ParticleFieldProps {
    count?: number;
    className?: string;
}

export function ParticleField({ count = 20, className = '' }: ParticleFieldProps) {
    const particles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 10,
            duration: 8 + Math.random() * 12,
            size: 2 + Math.random() * 4,
            opacity: 0.2 + Math.random() * 0.5,
        }));
    }, [count]);

    return (
        <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: `${p.left}%`,
                        bottom: '-10px',
                        width: p.size,
                        height: p.size,
                        opacity: 0,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}
