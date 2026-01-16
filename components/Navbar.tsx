
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onAdminClick: () => void;
  onGuestDashboardClick: () => void;
  isMuted: boolean;
  onToggleMusic: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onBack?: () => void;
  hidden?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  onAdminClick,
  onGuestDashboardClick,
  isMuted,
  onToggleMusic,
  isDarkMode,
  onToggleTheme,
  onBack,
  hidden
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navLinks = [
    { name: 'Story', href: '#story' },
    { name: 'Timeline', href: '#timeline' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Guestbook', href: '#guestbook' },
    { name: 'RSVP', href: '#rsvp' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Active Section Logic
      const sections = navLinks.map(link => link.href.substring(1));
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = 'auto';
  };


  return (
    <>
      {/* Desktop Navigation - Hidden on Mobile */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] hidden lg:block transition-all duration-500 ${hidden ? 'opacity-0 pointer-events-none translate-y-[-100%]' : 'opacity-100'} ${scrolled ? (isDarkMode ? 'bg-[#1a1a1a]/80' : 'bg-white/80') + ' backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className={`font-serif text-3xl tracking-[0.2em] transition-all duration-500 cursor-default relative z-[70] ${scrolled ? 'text-gold' : 'text-white'}`}>
            L <span className="font-cursive text-4xl text-gold mx-2">&</span> F
          </div>

          <div className="flex space-x-8 items-center">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-[10px] font-bold uppercase tracking-[0.3em] hover:text-gold transition-all duration-300 relative group ${activeSection === item.href.substring(1) ? 'text-gold' : (scrolled ? (isDarkMode ? 'text-gray-300' : 'text-gray-500') : 'text-white')
                  }`}
              >
                {item.name}
                <span className={`absolute -bottom-2 left-0 h-[2px] bg-gold transition-all duration-300 ${activeSection === item.href.substring(1) ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </a>
            ))}

            <div className="h-4 w-px bg-gray-300/30 mx-2"></div>

            <button
              onClick={onToggleMusic}
              className="flex items-center gap-2 group px-2 py-1"
              title={isMuted ? "Play Music" : "Mute Music"}
            >
              <div className="flex items-center gap-[3px] h-3">
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: isMuted ? 2 : [4, 12, 6, 12, 4],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                    className={`w-[2px] rounded-full ${scrolled ? 'bg-gold' : 'bg-white'}`}
                  />
                ))}
              </div>
            </button>

            <button
              onClick={onToggleTheme}
              className={`text-sm hover:text-gold transition-colors px-2 ${scrolled ? (isDarkMode ? 'text-white' : 'text-gray-600') : 'text-white'}`}
            >
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>

            <button
              onClick={onGuestDashboardClick}
              className={`text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full border transition-all duration-300 ${scrolled ? 'border-gold text-gold hover:bg-gold hover:text-white shadow-lg shadow-gold/10' : 'border-white/40 text-white hover:border-white hover:bg-white/10'}`}
            >
              Guest Portal
            </button>

            <button
              onClick={onAdminClick}
              className={`group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg border border-transparent transition-all ${scrolled ? (isDarkMode ? 'text-white/40 hover:text-gold hover:border-gold/20' : 'text-gray-400 hover:text-gold hover:border-gold/20') : 'text-white/60 hover:text-white hover:border-white/20'}`}
            >
              <i className="fa-solid fa-crown text-sm"></i>
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Bottom Navigation */}
      <div className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-md transition-all duration-500 ${(hidden && !onBack) ? 'opacity-0 pointer-events-none translate-y-20' : 'opacity-100 translate-y-0'}`}>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`relative ${isDarkMode ? 'bg-[#1a1a1a]/80' : 'bg-white/80'} backdrop-blur-2xl border ${isDarkMode ? 'border-white/10' : 'border-gold/15'} rounded-[2.5rem] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between overflow-hidden`}
        >
          {/* Back Button for Portals in Bottom Nav */}
          {onBack ? (
            <motion.button
              onClick={onBack}
              whileTap={{ scale: 0.95 }}
              className="flex-grow flex items-center justify-center gap-3 py-3 text-gold font-black uppercase tracking-[0.2em] text-[10px]"
            >
              <i className="fa-solid fa-arrow-left-long"></i>
              Back to Website
            </motion.button>
          ) : (
            <>
              {/* Animated Active Indicator Pill */}
              <AnimatePresence>
                {['story', 'timeline', 'gallery', 'guestbook', 'rsvp'].includes(activeSection) && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute h-12 rounded-2xl bg-gold/10 border border-gold/20 z-0"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    style={{
                      width: 'calc(100% / 6 - 8px)',
                      left: `calc((${['story', 'timeline', 'gallery', 'guestbook', 'rsvp'].indexOf(activeSection)} * (100% / 6)) + 4px)`
                    }}
                  />
                )}
              </AnimatePresence>

              <div className="flex-grow flex items-center justify-between px-1">
                {[
                  { id: 'story', icon: 'fa-book-open', label: 'Story' },
                  { id: 'timeline', icon: 'fa-clock', label: 'Time' },
                  { id: 'gallery', icon: 'fa-images', label: 'Gallery' },
                  { id: 'guestbook', icon: 'fa-pen-fancy', label: 'Signed' },
                ].map((item) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    whileTap={{ scale: 0.9 }}
                    className={`relative z-10 flex flex-col items-center justify-center w-full py-2.5 transition-all duration-300 ${activeSection === item.id
                      ? 'text-gold'
                      : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                      }`}
                  >
                    <i className={`fa-solid ${item.icon} text-base mb-1.5`} />
                    <span className="text-[8px] font-black uppercase tracking-[0.1em]">{item.label}</span>
                  </motion.a>
                ))}

                {/* RSVP Aligned with Story/Time */}
                <motion.a
                  href="#rsvp"
                  whileTap={{ scale: 0.9 }}
                  className={`relative z-10 flex flex-col items-center justify-center w-full py-2.5 transition-all duration-300 ${activeSection === 'rsvp'
                    ? 'text-gold'
                    : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
                    }`}
                >
                  <i className="fa-solid fa-paper-plane text-base mb-1.5" />
                  <span className="text-[8px] font-black uppercase tracking-[0.1em]">RSVP</span>
                </motion.a>
              </div>
            </>
          )}

          {/* Menu Button Aligned with Story/Time */}
          <motion.button
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.9 }}
            className={`relative z-10 flex flex-col items-center justify-center w-[calc(100%/6)] py-2.5 transition-all duration-300 ${isMobileMenuOpen
              ? 'text-gold'
              : (isDarkMode ? 'text-gray-400' : 'text-gray-500')
              }`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center mb-1.5 transition-all duration-500 ${isMobileMenuOpen ? 'bg-gold text-white rotate-180 shadow-lg shadow-gold/30' : (isDarkMode ? 'bg-white/5 text-gold' : 'bg-gold/10 text-gold')}`}>
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-[10px]`} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-[0.1em]">{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Top Banner for Mobile (Logo & Quick Actions) */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-[100] px-6 py-3 flex justify-between items-center transition-all duration-500 ${(hidden && !onBack) ? 'opacity-0 pointer-events-none -translate-y-full' : 'opacity-100'} ${scrolled || onBack ? (isDarkMode ? 'bg-[#1a1a1a]/85' : 'bg-white/85') + ' backdrop-blur-lg border-b border-white/5 shadow-md' : 'bg-transparent'}`}>
        <div className={`font-serif text-lg tracking-[0.25em] transition-colors duration-500 ${scrolled || onBack ? 'text-gold' : 'text-white'}`}>
          L <span className="font-cursive text-2xl text-gold mx-0.5">&</span> F
        </div>
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="bg-gold text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-lg shadow-gold/20 active:scale-95 transition-transform"
            >
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-arrow-left"></i>
                Back
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay - Updated for staggered entry */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[65] flex flex-col justify-end p-6 pb-32 ${isDarkMode ? 'bg-[#000]/95' : 'bg-[#fff]/95'} backdrop-blur-3xl`}
          >
            <motion.div
              layout
              className="space-y-4 max-w-sm mx-auto w-full"
            >
              <div className="flex flex-col gap-6">
                {/* Modern Control Center */}
                <div className={`p-4 rounded-[2rem] ${isDarkMode ? 'bg-white/[0.03] border-white/10' : 'bg-gold/[0.03] border-gold/10'} border`}>
                  <div className="flex flex-col gap-4">
                    {/* Theme Toggle Switch */}
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gold/10' : 'bg-gold/10'}`}>
                          <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'} text-gold text-xs`}></i>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gold/80">Appearance</span>
                          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tight">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                        </div>
                      </div>
                      <button
                        onClick={onToggleTheme}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 relative ${isDarkMode ? 'bg-gold shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]' : 'bg-gray-200'}`}
                      >
                        <motion.div
                          animate={{ x: isDarkMode ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-6 h-6 rounded-full shadow-lg flex items-center justify-center bg-white"
                        >
                          <i className={`fa-solid ${isDarkMode ? 'fa-moon' : 'fa-sun'} text-[10px] text-gold`}></i>
                        </motion.div>
                      </button>
                    </div>

                    <div className={`h-px w-full ${isDarkMode ? 'bg-white/5' : 'bg-gold/10'}`}></div>

                    {/* Music Toggle Switch */}
                    <div className="flex items-center justify-between px-2 py-1">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gold/10">
                          <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'} text-gold text-xs`}></i>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gold/80">Ambient Music</span>
                          <span className="text-[8px] text-gray-500 font-bold uppercase tracking-tight">{isMuted ? 'Muted' : 'Playing'}</span>
                        </div>
                      </div>
                      <button
                        onClick={onToggleMusic}
                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 relative ${!isMuted ? 'bg-gold shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]' : 'bg-gray-200'}`}
                      >
                        <motion.div
                          animate={{ x: !isMuted ? 24 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="w-6 h-6 rounded-full shadow-lg flex items-center justify-center bg-white"
                        >
                          <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'} text-[10px] text-gold`}></i>
                        </motion.div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Portal Access - Guest beside Admin */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => { handleMobileLinkClick(); onGuestDashboardClick(); }}
                    className={`group py-5 rounded-[2rem] border flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-gold/10 bg-gold/5 text-gray-800'}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
                      <i className="fa-solid fa-user text-sm"></i>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Guest Portal</span>
                  </motion.button>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => { handleMobileLinkClick(); onAdminClick(); }}
                    className={`group py-5 rounded-[2rem] border flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${isDarkMode ? 'border-white/10 bg-white/5 text-white' : 'border-gold/10 bg-gold/5 text-gray-800'}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:text-white transition-colors">
                      <i className="fa-solid fa-crown text-sm"></i>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">Admin Panel</span>
                  </motion.button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className={`p-10 rounded-[3rem] ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gold/[0.03] border-gold/10'} text-center border relative overflow-hidden group`}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                <h4 className="font-serif text-3xl text-gold mb-3 tracking-tight">Our Story</h4>
                <p className="text-[9px] text-gray-400 uppercase tracking-[0.4em] font-black mb-1">July 4, 2026</p>
                <p className="text-[8px] text-gold/60 uppercase font-black">Cebu City, Philippines</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
