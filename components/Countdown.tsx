import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CountdownProps {
    weddingDate?: Date;
    isDarkMode?: boolean;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const Countdown: React.FC<CountdownProps> = ({
    weddingDate = new Date('2026-07-04T00:00:00'),
    isDarkMode = false
}) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = (): TimeLeft => {
            const now = new Date().getTime();
            const weddingTime = weddingDate.getTime();
            const difference = weddingTime - now;

            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            };
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [weddingDate]);

    const handleHover = () => {
        setIsHovered(true);
        // Trigger confetti effect
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#f7e7ce', '#ffffff']
        });
    };

    const TimeUnit: React.FC<{ value: number; label: string; index: number }> = ({
        value,
        label,
        index
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="flex flex-col items-center"
        >
            <motion.div
                key={value}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`relative ${isDarkMode
                        ? 'bg-[#262626] border border-gold/30'
                        : 'bg-white border border-gold/20'
                    } rounded-lg shadow-lg p-4 md:p-6 min-w-[70px] md:min-w-[100px]`}
            >
                <div className={`text-3xl md:text-5xl font-serif-sc font-bold text-gold text-center`}>
                    {value.toString().padStart(2, '0')}
                </div>
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent`}></div>
            </motion.div>
            <div className={`mt-3 text-xs md:text-sm uppercase tracking-[0.2em] font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                {label}
            </div>
        </motion.div>
    );

    return (
        <motion.div
            className="flex flex-col items-center justify-center py-8 md:py-12"
            onMouseEnter={handleHover}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {/* Heading */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h3 className={`text-sm md:text-base uppercase tracking-[0.3em] font-bold mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Counting Down To
                </h3>
                <div className="flex items-center justify-center gap-2">
                    <div className="h-px w-8 md:w-16 bg-gradient-to-r from-transparent to-gold/50"></div>
                    <i className="fa-solid fa-heart text-gold text-xs md:text-sm"></i>
                    <div className="h-px w-8 md:w-16 bg-gradient-to-l from-transparent to-gold/50"></div>
                </div>
            </motion.div>

            {/* Countdown Display */}
            <div className="flex gap-3 md:gap-6">
                <TimeUnit value={timeLeft.days} label="Days" index={0} />
                <TimeUnit value={timeLeft.hours} label="Hours" index={1} />
                <TimeUnit value={timeLeft.minutes} label="Minutes" index={2} />
                <TimeUnit value={timeLeft.seconds} label="Seconds" index={3} />
            </div>

            {/* Wedding Date Display */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`mt-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
            >
                <p className="text-xs md:text-sm font-body">
                    <i className="fa-regular fa-calendar mr-2 text-gold"></i>
                    {weddingDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </motion.div>

            {/* Hover hint */}
            {!isHovered && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-4 text-xs text-gray-400 italic"
                >
                    Hover for a surprise ✨
                </motion.p>
            )}
        </motion.div>
    );
};

export default Countdown;
