
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface FloatingParticlesProps {
    count?: number;
    type?: 'petals' | 'sparkles' | 'dust';
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
    count = 20,
    type = 'petals'
}) => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const particles = useMemo(() => {
        if (prefersReducedMotion) return [];

        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * (type === 'sparkles' ? 4 : 15) + (type === 'sparkles' ? 2 : 5),
            duration: Math.random() * 20 + 20,
            delay: Math.random() * 20,
            rotate: Math.random() * 360,
        }));
    }, [count, type, prefersReducedMotion]);

    if (prefersReducedMotion) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute"
                    initial={{
                        x: `${p.x}vw`,
                        y: '-10vh',
                        rotate: p.rotate,
                        opacity: 0
                    }}
                    animate={{
                        y: '110vh',
                        x: [`${p.x}vw`, `${p.x + (Math.random() * 10 - 5)}vw`],
                        rotate: p.rotate + (Math.random() * 360 + 360),
                        opacity: [0, 0.4, 0.4, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear"
                    }}
                    style={{
                        width: p.size,
                        height: p.size,
                    }}
                >
                    {type === 'petals' && (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-rose-200/40">
                            <path d="M12 2C12 2 15 7 15 12C15 17 12 22 12 22C12 22 9 17 9 12C9 7 12 2 12 2Z" fill="currentColor" />
                        </svg>
                    )}
                    {type === 'sparkles' && (
                        <div className="w-full h-full bg-gold/30 rounded-full blur-[1px]" />
                    )}
                    {type === 'dust' && (
                        <div className="w-full h-full bg-white/20 rounded-full" />
                    )}
                </motion.div>
            ))}
        </div>
    );
};

export default FloatingParticles;
