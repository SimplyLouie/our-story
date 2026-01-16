
import React, { useState, useEffect, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { SiteContent } from '../types';

interface HeroProps {
  content: SiteContent;
}

const Hero: React.FC<HeroProps> = ({ content }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]); // Parallax effect
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const calculateTimeLeft = useCallback(() => {
    try {
      if (!content.countdownDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      const targetDate = new Date(content.countdownDate);
      // Get current time in Asia/Manila timezone
      const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" }));
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      }
    } catch (e) {
      console.error("Countdown error:", e);
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }, [content.countdownDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [hasCelebrated, setHasCelebrated] = useState(false);

  // Celebration confetti when countdown reaches zero
  const triggerCelebration = useCallback(() => {
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      const colors = ['#d4af37', '#f7e7ce', '#ffffff', '#e5e7eb'];

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors
      });
    }, 250);

    // Big celebration burst
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#f7e7ce', '#ffffff']
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Trigger celebration when countdown reaches zero (only once)
      if (!hasCelebrated && newTimeLeft.days === 0 && newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setHasCelebrated(true);
        triggerCelebration();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, hasCelebrated, triggerCelebration]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center text-center min-w-[60px] md:min-w-[80px]">
      <div className="text-3xl md:text-5xl font-bold text-gold font-serif leading-none mb-1">
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-champagne/80 font-body font-bold">
        {label}
      </div>
    </div>
  );

  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <motion.div
        style={{ y: y1, scale: 1.1 }}
        initial={{ scale: 1.2 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${content.heroImageUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </motion.div>

      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center text-white px-4 w-full max-w-5xl mt-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="text-[10px] md:text-xl uppercase tracking-[0.5em] md:tracking-[0.8em] mb-6 md:mb-12 font-medium text-white/70 font-body drop-shadow-lg">
            The Wedding Of
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.8,
              duration: 1,
            }}
            className="leading-none drop-shadow-2xl flex flex-col items-center mb-8 sm:mb-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6">
              <span
                className="font-cursive text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white font-normal tracking-wide"
                style={{
                  textShadow: '0 0 40px rgba(212, 175, 55, 0.6), 0 4px 20px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '0.05em'
                }}
              >
                Louie
              </span>
              <span
                className="font-cursive text-gold text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal opacity-90"
                style={{
                  textShadow: '0 0 30px rgba(212, 175, 55, 0.8)',
                  transform: 'translateY(-4px)'
                }}
              >
                &
              </span>
              <span
                className="font-cursive text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white font-normal tracking-wide"
                style={{
                  textShadow: '0 0 40px rgba(212, 175, 55, 0.6), 0 4px 20px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '0.05em'
                }}
              >
                Florie
              </span>
            </div>
          </motion.div>

          <div className="text-lg md:text-3xl font-cursive tracking-widest text-gold mb-12 md:mb-16 drop-shadow-lg">
            {content.weddingDate}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex justify-center items-center mb-12 md:mb-20 bg-black/30 backdrop-blur-md px-3 py-4 md:px-8 md:py-6 rounded-2xl md:rounded-full border border-white/10 shadow-3xl inline-flex mx-auto scale-90 md:scale-100"
          >
            <TimeUnit value={timeLeft.days} label="Days" />
            <div className="text-lg md:text-xl text-gold/40 pb-3 md:pb-4 self-center mx-1 font-serif">:</div>
            <TimeUnit value={timeLeft.hours} label="Hrs" />
            <div className="text-lg md:text-xl text-gold/40 pb-3 md:pb-4 self-center mx-1 font-serif">:</div>
            <TimeUnit value={timeLeft.minutes} label="Mins" />
            <div className="text-lg md:text-xl text-gold/40 pb-3 md:pb-4 self-center mx-1 font-serif">:</div>
            <TimeUnit value={timeLeft.seconds} label="Secs" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="max-w-xl mx-auto text-xs md:text-base font-light tracking-[0.2em] leading-loose opacity-90 px-4 font-body text-champagne"
          >
            {content.heroTagline}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <div className="text-[9px] uppercase tracking-[0.4em] text-white/70 mb-2 font-bold">Scroll</div>
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold via-white to-transparent"></div>
        </motion.div>
      </motion.div>
    </div >
  );
};

export default Hero;
