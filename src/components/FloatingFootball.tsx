import { useRef, useEffect } from 'react';

interface FloatingFootballProps {
    className?: string;
    size?: number;
}

export function FloatingFootball({ className = '', size = 120 }: FloatingFootballProps) {
    return (
        <div className={`relative ${className}`} style={{ width: size, height: size + 40 }}>
            {/* Football */}
            <div
                className="float-3d preserve-3d relative"
                style={{ width: size, height: size }}
            >
                <div
                    className="rounded-full relative overflow-hidden"
                    style={{
                        width: size,
                        height: size,
                        background: `
              radial-gradient(ellipse at 30% 30%, #ffffff 0%, #e8e8e8 20%, #d4d4d8 40%, #a1a1aa 70%, #71717a 100%)
            `,
                        boxShadow: `
              inset -${size / 6}px -${size / 6}px ${size / 3}px rgba(0,0,0,0.3),
              inset ${size / 8}px ${size / 8}px ${size / 4}px rgba(255,255,255,0.3),
              0 0 ${size / 3}px rgba(20, 184, 166, 0.2)
            `,
                    }}
                >
                    {/* Pentagon pattern - classic football look */}
                    <svg
                        viewBox="0 0 100 100"
                        className="absolute inset-0 w-full h-full"
                        style={{ opacity: 0.7 }}
                    >
                        {/* Center pentagon */}
                        <polygon
                            points="50,30 62,40 58,55 42,55 38,40"
                            fill="#1a1a2e"
                            stroke="#333"
                            strokeWidth="0.5"
                        />
                        {/* Top pentagon */}
                        <polygon
                            points="50,5 62,15 58,28 42,28 38,15"
                            fill="#1a1a2e"
                            stroke="#333"
                            strokeWidth="0.5"
                        />
                        {/* Top-right pentagon */}
                        <polygon
                            points="75,20 85,35 78,48 65,42 65,27"
                            fill="#1a1a2e"
                            stroke="#333"
                            strokeWidth="0.5"
                        />
                        {/* Top-left pentagon */}
                        <polygon
                            points="25,20 35,27 35,42 22,48 15,35"
                            fill="#1a1a2e"
                            stroke="#333"
                            strokeWidth="0.5"
                        />
                        {/* Bottom-right pentagon */}
                        <polygon
                            points="72,65 80,55 90,60 85,78 75,78"
                            fill="#1a1a2e"
                            stroke="#333"
                            strokeWidth="0.5"
                        />
                        {/* Bottom-left pentagon */}
                        <polygon
                            points="28,65 25,78 15,78 10,60 20,55"
                            fill="#1a1a2e"
                            stroke="#333"
                            strokeWidth="0.5"
                        />
                        {/* White panel lines */}
                        <line x1="50" y1="5" x2="50" y2="30" stroke="#555" strokeWidth="0.3" />
                        <line x1="62" y1="40" x2="78" y2="48" stroke="#555" strokeWidth="0.3" />
                        <line x1="38" y1="40" x2="22" y2="48" stroke="#555" strokeWidth="0.3" />
                        <line x1="58" y1="55" x2="72" y2="65" stroke="#555" strokeWidth="0.3" />
                        <line x1="42" y1="55" x2="28" y2="65" stroke="#555" strokeWidth="0.3" />
                    </svg>

                    {/* Shine overlay */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: `
                radial-gradient(ellipse at 35% 25%, rgba(255,255,255,0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 70%, rgba(0,0,0,0.15) 0%, transparent 50%)
              `,
                        }}
                    />
                </div>
            </div>

            {/* Shadow */}
            <div
                className="football-shadow absolute left-1/2 -translate-x-1/2"
                style={{
                    bottom: 0,
                    width: size * 0.6,
                    height: size * 0.1,
                    borderRadius: '50%',
                    background: 'radial-gradient(ellipse, rgba(20, 184, 166, 0.3) 0%, transparent 70%)',
                }}
            />
        </div>
    );
}
