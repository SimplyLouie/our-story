
import React from 'react';
import { SiteContent } from '../types';

interface FooterProps {
  content: SiteContent;
  onAdminClick?: () => void;
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ content, onAdminClick, isDarkMode }) => {
  // Helper to determine icon based on label/url
  const getSocialIcon = (label: string, url: string) => {
    const l = label.toLowerCase();
    const u = url.toLowerCase();
    if (l.includes('instagram') || u.includes('instagram')) return 'fa-brands fa-instagram';
    if (l.includes('facebook') || u.includes('facebook')) return 'fa-brands fa-facebook';
    if (l.includes('pinterest') || u.includes('pinterest')) return 'fa-brands fa-pinterest';
    if (l.includes('twitter') || u.includes('twitter') || l.includes('x')) return 'fa-brands fa-x-twitter';
    if (l.includes('tiktok') || u.includes('tiktok')) return 'fa-brands fa-tiktok';
    return 'fa-solid fa-link';
  };

  const socialLinks = Array.isArray(content.socialLinks) ? content.socialLinks : [];

  return (
    <footer className={`py-24 border-t text-center relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
      {/* Background Ornament */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gold/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-5xl md:text-6xl font-serif text-gold mb-8 italic tracking-widest">
          {content.coupleNames ? content.coupleNames.split('&').map(n => n.trim().charAt(0)).join(' & ') : 'A & I'}
        </div>
        <p className="max-w-md mx-auto text-gray-400 uppercase tracking-[0.4em] text-[10px] font-bold mb-12">
          {content.weddingDate} <span className="mx-3 text-gold/30">•</span> {content.venues && content.venues.length > 0 ? content.venues[0].name : 'Location TBD'}
        </p>

        <div className="flex justify-center flex-wrap gap-10 mb-20">
          {socialLinks.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-gold transition-all transform hover:scale-125"
              title={link.label}
            >
              <i className={`${getSocialIcon(link.label, link.url)} text-xl`}></i>
            </a>
          ))}
        </div>

        <div className="space-y-4">
          <div className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-medium">
            {content.footerText || `Handcrafted with love for the ${content.coupleNames ? content.coupleNames.split('&')[1]?.trim() : 'Couple'}`}
          </div>
          <div className="flex justify-center items-center gap-4 text-[9px] uppercase tracking-widest text-gray-300">
            <span>© 2026 {content.openingScreen?.brand || content.coupleNames}</span>
            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
            <button
              onClick={onAdminClick}
              className="hover:text-gold transition-colors font-bold flex items-center gap-1"
            >
              <i className="fa-solid fa-lock text-[8px]"></i> Management
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
