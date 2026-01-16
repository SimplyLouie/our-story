import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { SiteContent } from '../types';
import Guestbook from './Guestbook';

interface SectionsProps {
  content: SiteContent;
  isDarkMode: boolean;
}

// Section wrapper with scroll-triggered animation
const AnimatedSection = ({ children, id }: { children: React.ReactNode; id: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
};

const GalleryImage = ({ src, index, setSelectedImageIndex }: { src: string, index: number, setSelectedImageIndex: (i: number) => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={() => !hasError && setSelectedImageIndex(index)}
      className={`aspect-square overflow-hidden relative shadow-lg rounded-sm bg-gray-100 ${hasError ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
      )}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <i className="fa-solid fa-image-slash text-3xl mb-2"></i>
          <span className="text-xs">Image unavailable</span>
        </div>
      ) : (
        <>
          <img
            src={src}
            alt={`Gallery ${index}`}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gold/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <i className="fa-solid fa-expand text-white text-2xl"></i>
          </div>
        </>
      )}
    </motion.div>
  );
};

const Sections: React.FC<SectionsProps> = ({ content, isDarkMode }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'Escape') setSelectedImageIndex(null);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex]);

  const nextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % content.galleryImages.length);
  };

  const prevImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + content.galleryImages.length) % content.galleryImages.length);
  };

  return (
    <div className="space-y-24">
      {/* Our Story */}
      <AnimatedSection id="story">
        <div className={`py-20 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#fcfaf7]'}`}>
          <div className="container mx-auto max-w-4xl text-center">
            <span className="text-gold text-[10px] uppercase tracking-[0.6em] font-black mb-4 block font-body">Chapter One</span>
            <h2 className={`text-4xl md:text-5xl font-serif italic mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Our Story</h2>
            <div className="w-16 h-px bg-gold/30 mx-auto mb-10"></div>
            <p className={`text-lg md:text-xl leading-relaxed font-light ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ whiteSpace: 'pre-line' }}>
              {content.ourStory}
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Timeline */}
      <AnimatedSection id="timeline">
        <div className={`py-20 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#262626]' : 'bg-white'}`}>
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <span className="text-gold text-[10px] uppercase tracking-[0.6em] font-black mb-4 block font-body">The Grand Affair</span>
              <h2 className={`text-4xl md:text-5xl font-serif italic mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Timeline</h2>
              <div className="w-16 h-px bg-gold/30 mx-auto"></div>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-gold/20"></div>
              {content.timelineItems && content.timelineItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center mb-16 ${index % 2 === 0 ? 'md:flex-row-reverse md:text-left' : 'md:flex-row md:text-right'}`}
                >
                  <div className="w-full md:w-5/12 px-6">
                    <div className={`p-6 rounded-lg border ${isDarkMode ? 'bg-[#1a1a1a] border-gold/20' : 'bg-champagne/10 border-gold/30'} backdrop-blur-sm`}>
                      <span className="text-gold text-xs uppercase tracking-widest font-bold font-body block mb-2">{item.time}</span>
                      <h3 className={`text-2xl font-cursive mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.event}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                    </div>
                  </div>
                  <div className={`w-4 h-4 rounded-full bg-gold border-4 absolute left-1/2 transform -translate-x-1/2 z-10 ${isDarkMode ? 'border-[#262626]' : 'border-white'}`}></div>
                  <div className="hidden md:block w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Gallery */}
      <AnimatedSection id="gallery">
        <div className={`py-20 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-[#fcfaf7]'}`}>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="text-gold text-[10px] uppercase tracking-[0.6em] font-black mb-4 block font-body">Captured Moments</span>
              <h2 className={`text-4xl md:text-5xl font-serif italic mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Gallery</h2>
              <div className="w-16 h-px bg-gold/30 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {content.galleryImages.map((img, idx) => (
                <GalleryImage key={idx} src={img} index={idx} setSelectedImageIndex={setSelectedImageIndex} />
              ))}
            </div>
            {content.googlePhotosLink && (
              <div className="text-center mt-12">
                {content.googlePhotosLinkEnabled !== false ? (
                  <a
                    href={content.googlePhotosLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gold text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gold/20 hover:bg-gold/90 transition-all"
                  >
                    <i className="fa-brands fa-google mr-2"></i>
                    View Shared Album
                  </a>
                ) : (
                  <motion.button
                    whileTap={{ x: [-10, 10, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                    className="inline-block bg-gray-400 text-gray-600 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg cursor-not-allowed opacity-60"
                    title="Album is currently locked"
                  >
                    <i className="fa-solid fa-lock mr-2"></i>
                    Shared Album Locked
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* Guestbook */}
      <Guestbook isDarkMode={isDarkMode} />

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImageIndex(null)} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4">
            <button onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(null); }} className="absolute top-4 right-4 text-white text-4xl hover:text-gold transition-colors z-10">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 text-white text-4xl hover:text-gold transition-colors z-10">
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 text-white text-4xl hover:text-gold transition-colors z-10">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
            <img
              src={content.galleryImages[selectedImageIndex]}
              alt={`Gallery ${selectedImageIndex}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sections;
