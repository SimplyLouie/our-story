
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onAdminClick: () => void;
  onGuestDashboardClick: () => void;
  isMuted: boolean;
  onToggleMusic: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAdminClick, onGuestDashboardClick, isMuted, onToggleMusic, isDarkMode, onToggleTheme }) => {
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

  // Stagger animation variants for mobile menu items
  const menuVariants = {
    closed: { opacity: 0 },
    open: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  return (
    <>
      {/* Desktop Navigation - Hidden on Mobile */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] hidden lg:block transition-all duration-500 ${scrolled ? (isDarkMode ? 'bg-[#1a1a1a]/80' : 'bg-white/80') + ' backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-8'}`}>
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
              <span>Admin</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Floating Bottom Navigation */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-md">
        <div className={`${isDarkMode ? 'bg-[#1a1a1a]/90' : 'bg-white/90'} backdrop-blur-xl border ${isDarkMode ? 'border-white/10' : 'border-gold/20'} rounded-3xl p-2 shadow-2xl flex items-center justify-between relative`}>
          {/* Main Nav Links Icon-style */}
          {[
            { id: 'story', icon: 'fa-book', label: 'Story' },
            { id: 'timeline', icon: 'fa-clock', label: 'Timeline' },
            { id: 'gallery', icon: 'fa-images', label: 'Gallery' },
            { id: 'rsvp', icon: 'fa-pen-nib', label: 'RSVP' },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`flex-1 flex flex-col items-center py-2 transition-all gap-1 ${activeSection === item.id ? 'text-gold' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}`}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
              {activeSection === item.id && (
                <motion.div layoutId="active-nav-dot" className="w-1 h-1 bg-gold rounded-full absolute -bottom-1" />
              )}
            </a>
          ))}

          {/* Portal / More Button */}
          <button
            onClick={toggleMobileMenu}
            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all shadow-lg ${isMobileMenuOpen ? 'bg-gold text-white' : (isDarkMode ? 'bg-white/5 text-gold' : 'bg-gold/10 text-gold')}`}
          >
            <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-xl`}></i>
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">Menu</span>
          </button>
        </div>
      </div>

      {/* Top Banner for Mobile (Logo & Quick Actions) */}
      <div className={`lg:hidden fixed top-0 left-0 right-0 z-[60] p-4 flex justify-between items-center transition-all ${scrolled ? (isDarkMode ? 'bg-[#1a1a1a]/80' : 'bg-white/80') + ' backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className={`font-serif text-xl tracking-[0.2em] ${scrolled ? 'text-gold' : 'text-white'}`}>
          L <span className="font-cursive text-2xl text-gold">&</span> F
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMusic}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${scrolled ? (isDarkMode ? 'bg-white/5' : 'bg-gold/10') : 'bg-black/20 text-white'}`}
          >
            <i className={`fa-solid ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} ${scrolled ? 'text-gold' : 'text-white'}`}></i>
          </button>
          <button
            onClick={onGuestDashboardClick}
            className="bg-gold text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold/20"
          >
            Guest
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Updated to match new bottom nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`fixed inset-0 z-[65] flex flex-col justify-end p-6 pb-28 ${isDarkMode ? 'bg-[#000]/95' : 'bg-[#fff]/95'} backdrop-blur-xl`}
          >
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="space-y-4"
            >
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => { onToggleTheme(); setIsMobileMenuOpen(false); }}
                  className={`w-full py-5 rounded-3xl border-2 flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-100 text-gray-800 hover:bg-gray-50'}`}
                >
                  <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-gold`}></i>
                  {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
                </button>

                <button
                  onClick={() => { handleMobileLinkClick(); onAdminClick(); }}
                  className={`w-full py-5 rounded-3xl border-2 flex items-center justify-center gap-4 text-sm font-bold uppercase tracking-widest transition-all ${isDarkMode ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-100 text-gray-800 hover:bg-gray-50'}`}
                >
                  <i className="fa-solid fa-crown text-gold"></i>
                  Admin Panel
                </button>
              </div>

              <div className={`p-8 rounded-[40px] ${isDarkMode ? 'bg-white/5' : 'bg-gold/5'} text-center border ${isDarkMode ? 'border-white/5' : 'border-gold/10'}`}>
                <h4 className="font-serif text-2xl text-gold mb-2">Our Celebration</h4>
                <p className="text-xs text-gray-500 uppercase tracking-[0.2em] font-bold">July 4, 2026 • New York</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
