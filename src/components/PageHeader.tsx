import { motion } from 'motion/react';
import { ParticleField } from './ParticleField';

interface PageHeaderProps {
    badge: string;
    title: string;
    subtitle: string;
    backgroundImage?: string;
}

export function PageHeader({
    badge,
    title,
    subtitle,
    backgroundImage = 'https://images.unsplash.com/photo-1518605368461-1ee7e161328e?q=80&w=2000&auto=format&fit=crop',
}: PageHeaderProps) {
    return (
        <section className="relative py-24 overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 z-0">
                <img
                    src={backgroundImage}
                    alt="Background"
                    className="w-full h-full object-cover object-center opacity-20 grayscale"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-[#050505]" />
            </div>

            <ParticleField count={12} className="z-[1]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center perspective-container">
                <motion.div
                    initial={{ opacity: 0, y: 30, rotateX: 15 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-900/30 border border-teal-500/20 mb-8">
                        <span className="text-xs font-bold uppercase tracking-widest text-teal-400">
                            {badge}
                        </span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40, rotateX: 10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                    className="font-display text-6xl md:text-8xl uppercase tracking-tighter text-white mb-6"
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
                >
                    {subtitle}
                </motion.p>
            </div>
        </section>
    );
}
