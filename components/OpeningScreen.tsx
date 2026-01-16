
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiteContent } from '../types';

interface OpeningScreenProps {
  onComplete: () => void;
  content: SiteContent;
}

const OpeningScreen: React.FC<OpeningScreenProps> = ({ onComplete, content }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    setIsOpening(true);
    setTimeout(onComplete, 2500); // Slightly longer for the new animation
  };

  const screenText = content.openingScreen || {
    welcome: "You are cordially invited to",
    title: "Louie & Florie",
    subtitle: content.coupleNames || "A Celebration of Love",
    brand: "Louie & Florie"
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, pointerEvents: 'none' }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[100] bg-[#fcfaf7] flex items-center justify-center overflow-hidden"
    >
      <div className="relative w-full h-full flex items-center justify-center">

        {/* Left Gate */}
        <motion.div
          animate={isOpening ? { x: '-100%' } : { x: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 left-0 w-1/2 h-full bg-[#fcfaf7] z-20 border-r border-gold/20 flex items-center justify-end pr-1 shadow-2xl"
        />

        {/* Right Gate */}
        <motion.div
          animate={isOpening ? { x: '100%' } : { x: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 right-0 w-1/2 h-full bg-[#fcfaf7] z-20 border-l border-gold/20 flex items-center justify-start pl-1 shadow-2xl"
        />

        {/* Content Container (Floating above gates) */}
        {!isOpening && (
          <motion.div
            key="invitation-card"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="z-30 text-center px-4 relative w-full h-full flex flex-col justify-center items-center py-10 pointer-events-none gap-8"
          >
            <div className="flex-none">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold/80 font-bold font-body"
              >
                {screenText.welcome}
              </motion.div>
            </div>

            {/* Seal Break Button - Centered and Interactive */}
            <div className="flex-none flex items-center justify-center pointer-events-auto">
              <button
                onClick={handleOpen}
                className="relative w-48 h-48 flex items-center justify-center group"
                aria-label="Enter"
              >
                {/* Ripple effects */}
                <div className="absolute inset-0 rounded-full border border-gold/20 group-hover:border-gold/40 transition-all duration-700 scale-110 animate-ping"></div>
                <div className="absolute inset-4 rounded-full border border-gold/10 group-hover:border-gold/30 transition-all duration-500 scale-125"></div>

                {/* The Wax Seal (visual) */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative w-24 h-24 bg-[#a12d2d] rounded-full shadow-2xl border-4 border-[#801e1e] flex items-center justify-center z-40"
                >
                  <div className="absolute inset-1 rounded-full border border-white/10"></div>
                  <span className="font-serif text-white text-4xl drop-shadow-md">
                    {content.openingScreen?.sealInitials || "LF"}
                  </span>

                  {/* Interactive Hint */}
                  <div className="absolute -bottom-16 w-max left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-gold font-bold">Tap to Open</span>
                  </div>
                </motion.div>
              </button>
            </div>

            <div className="mb-6 pb-4">
              <div className="text-lg md:text-xl font-cursive text-gold mb-4 tracking-widest">
                {screenText.subtitle}
              </div>

              <div className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold text-gray-400 font-body">
                The Celebration Awaits
              </div>
            </div>
          </motion.div>
        )
        }

        {/* Post-Gate Reveal - Elegant Tagline */}
        <AnimatePresence>
          {isOpening && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="fixed inset-0 flex flex-col items-center justify-center z-50 p-10 bg-[#fcfaf7]"
            >
              {/* Gold Dust Particles (Original Light Theme) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 0,
                      x: Math.random() * 100 + '%',
                      y: Math.random() * 100 + '%'
                    }}
                    animate={{
                      opacity: [0, 0.4, 0],
                      y: [null, '-=100'],
                      x: [null, (Math.random() - 0.5) * 50]
                    }}
                    transition={{
                      duration: Math.random() * 3 + 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                    className="absolute w-1 h-1 bg-gold rounded-full blur-[1px]"
                  />
                ))}
              </div>

              {/* Tagline with Elegant Typography (New Size & Font) */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                className="text-center relative z-20"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 1.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="text-xl md:text-3xl font-sans tracking-[0.2em] leading-loose text-gray-500 uppercase font-light">
                    Two hearts <span className="font-cursive text-3xl md:text-5xl text-gold lowercase bg-clip-text capitalize mx-2">one journey</span>
                    <br />
                    <span className="text-gold font-bold scale-110 inline-block mt-6 tracking-[0.3em] text-sm md:text-xl border-t border-b border-gold/30 py-4 px-8">a lifetime of love</span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div >
    </motion.div >
  );
};

export default OpeningScreen;
