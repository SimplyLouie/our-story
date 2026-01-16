
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SiteContent, RSVP, RSVPStatus } from '../types';

interface GuestDashboardProps {
  content: SiteContent;
  rsvps: RSVP[];
  initialName?: string;
  onClose: () => void;
  isDarkMode: boolean;
}

const GuestDashboard: React.FC<GuestDashboardProps> = ({ content, rsvps, initialName, onClose, isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState(initialName || '');
  const [foundRSVP, setFoundRSVP] = useState<RSVP | null>(null);

  useEffect(() => {
    if (initialName) {
      handleSearch(initialName);
    }
  }, [initialName]);

  const handleSearch = (nameInput?: string) => {
    const query = nameInput || searchTerm;
    const rsvp = rsvps.find(r => r.name.toLowerCase().includes(query.toLowerCase().trim()));
    if (rsvp) {
      setFoundRSVP(rsvp);
    } else if (!nameInput) {
      alert("No RSVP found for that name. Have you responded yet?");
    }
  };

  const getCalendarLink = () => {
    const date = new Date(content.countdownDate);
    const startDate = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const endDate = new Date(date.getTime() + 6 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, ""); // Assume 6 hours
    const title = encodeURIComponent(`${content.coupleNames}'s Wedding`);
    // Use first venue address
    const mainVenue = content.venues?.[0];
    const location = encodeURIComponent(mainVenue ? `${mainVenue.name}, ${mainVenue.address}` : "Venue TBD");
    const details = encodeURIComponent("Join us for a beautiful celebration of love.");

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
  };

  const venues = content.venues || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex items-center justify-center p-3 md:p-8"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] border ${isDarkMode ? 'bg-[#1a1a1a] border-white/5' : 'bg-white border-gold/10'}`}
      >
        <div className="bg-neutral-900 px-6 py-10 md:p-12 text-white relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-gold via-[#f7e7ce] to-gold"></div>
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-gold hover:bg-white/10 transition-all z-10">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>

          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shadow-inner">
              <i className="fa-solid fa-unlock-keyhole text-2xl"></i>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-1 uppercase tracking-tight">Guest Portal</h2>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span className="h-px w-6 bg-gold/50"></span>
                <p className="text-gold uppercase tracking-[0.5em] text-[10px] font-black">Private Invitation</p>
                <span className="h-px w-6 bg-gold/50"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-12">
          {!foundRSVP ? (
            <div className="text-center py-6 md:py-10">
              <h3 className={`text-2xl font-serif mb-4 tracking-wide ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Verify Invitation</h3>
              <p className="text-gray-400 mb-10 text-[11px] uppercase tracking-[0.2em] leading-relaxed max-w-xs mx-auto">Please enter your full name exactly as it appears on your formal invitation.</p>

              <div className="flex flex-col gap-8 max-w-sm mx-auto">
                <div className="relative group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Invitation Name"
                    className={`w-full bg-transparent border-b-2 outline-none py-4 px-2 transition-all font-serif text-2xl text-center placeholder:opacity-30 ${isDarkMode ? 'border-white/10 text-white focus:border-gold' : 'border-gray-100 text-gray-800 focus:border-gold'}`}
                  />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold group-hover:w-full transition-all duration-500"></div>
                </div>

                <button
                  onClick={() => handleSearch()}
                  className="bg-gold text-white px-10 py-5 rounded-2xl uppercase tracking-[0.4em] text-[11px] font-black hover:bg-[#b8962d] transition-all shadow-xl shadow-gold/20 hover:scale-[1.02] active:scale-95"
                >
                  Confirm Identity
                </button>
              </div>

              <p className="mt-12 text-[10px] text-gray-500 italic opacity-60">Having trouble? Please reach out to the couple directly.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start text-center md:text-left gap-6 border-b pb-10 border-gray-100 dark:border-white/5">
                <div>
                  <div className="text-gold font-cursive text-3xl mb-1">Welcome</div>
                  <h3 className={`text-4xl font-serif ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{foundRSVP.name}</h3>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                    <span className={`text-[10px] uppercase font-black px-5 py-2 rounded-full tracking-widest shadow-sm ${foundRSVP.status === RSVPStatus.ATTENDING ? 'bg-green-600 text-white' :
                      foundRSVP.status === RSVPStatus.NOT_ATTENDING ? 'bg-red-600 text-white' :
                        'bg-amber-500 text-white'
                      }`}>
                      {foundRSVP.status.replace('_', ' ')}
                    </span>
                    {foundRSVP.plusOne && (
                      <span className="text-[10px] text-gold font-black uppercase tracking-[0.2em] bg-gold/5 px-5 py-2 rounded-full border border-gold/10">
                        Guest Included
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setFoundRSVP(null)}
                  className="text-gray-400 text-[10px] uppercase tracking-widest border border-gray-100 dark:border-white/10 px-6 py-3 rounded-full hover:bg-gold/5 hover:text-gold transition-all font-bold"
                >
                  <i className="fa-solid fa-arrow-left-long mr-2"></i> Switch User
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="space-y-6">
                  <div className="text-[11px] uppercase font-black text-gray-400 tracking-[0.4em] flex items-center gap-3">
                    <span className="w-8 h-px bg-gray-200 dark:bg-white/10"></span>
                    Logistics
                  </div>
                  <ul className="space-y-6">
                    <li className="flex gap-5 items-center group">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-gold shadow-sm transition-transform group-hover:scale-110 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <i className="fa-solid fa-calendar-heart text-lg"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Wedding Date</span>
                        <span className={`font-serif text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{content.weddingDate}</span>
                      </div>
                    </li>
                    <li className="flex gap-5 items-center group">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-gold shadow-sm transition-transform group-hover:scale-110 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                        <i className="fa-solid fa-clock-three text-lg"></i>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Ceremony Time</span>
                        <span className={`font-serif text-lg ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>{content.weddingTime} Lineup</span>
                      </div>
                    </li>
                    {venues.length > 0 ? venues.map((v, i) => (
                      <li key={i} className="flex gap-5 items-start group">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-gold shadow-sm mt-1 transition-transform group-hover:scale-110 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                          <i className="fa-solid fa-location-dot text-lg"></i>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-0.5">Location</span>
                          <span className={`text-sm md:text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            <strong className={`${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{v.name}</strong><br />
                            <span className="opacity-70">{v.address}</span>
                          </span>
                        </div>
                      </li>
                    )) : (
                      <li className="flex gap-5 items-center">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-gold opacity-50 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                          <i className="fa-solid fa-map-pin"></i>
                        </div>
                        <span className="text-gray-400 text-sm italic">Details to follow.</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex flex-col gap-6">
                  <div className={`p-8 rounded-3xl border flex-grow flex flex-col justify-center relative overflow-hidden ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gold/5 border-gold/10'}`}>
                    <div className="absolute -right-4 -top-4 text-gold/5 text-8xl transform rotate-12">
                      <i className="fa-solid fa-quote-right"></i>
                    </div>
                    <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-gold mb-6 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                      Ceremony Note
                    </h4>
                    <p className={`text-base italic leading-relaxed font-serif relative z-10 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {foundRSVP.status === RSVPStatus.UNDECIDED
                        ? "Your celebration status is still pending. We've reserved a tentative place for you and cannot wait to celebrate together."
                        : foundRSVP.status === RSVPStatus.ATTENDING
                          ? "We are delighted to confirm your presence. Our finest arrangements are being tailored for your arrival at the estate."
                          : "We have received your regrets. While your presence will be missed, we remain deeply grateful for your warmth and well wishes."}
                    </p>
                  </div>

                  {foundRSVP.status === RSVPStatus.ATTENDING && (
                    <a
                      href={getCalendarLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-neutral-900 text-white py-5 rounded-2xl uppercase tracking-[0.4em] text-[11px] font-black hover:bg-black transition-all text-center flex items-center justify-center gap-4 shadow-xl active:scale-95 group"
                    >
                      <i className="fa-solid fa-calendar-circle-plus text-gold text-lg group-hover:scale-125 transition-transform"></i>
                      Add to Registry
                    </a>
                  )}
                </div>
              </div>

              <div className="text-center pt-8 border-t border-gray-100 dark:border-white/5">
                <div className="font-cursive text-2xl text-gold mb-2">Louie & Florie</div>
                <div className="text-[10px] text-gray-400 uppercase tracking-[0.6em] font-medium leading-loose">
                  — July 4, 2026 • New York City —
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GuestDashboard;
