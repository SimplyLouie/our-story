
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RSVP, RSVPStatus } from '../types';

interface RSVPFormProps {
  onAddRSVP: (rsvp: RSVP) => void;
  isDarkMode: boolean;
}

const RSVPForm: React.FC<RSVPFormProps> = ({ onAddRSVP, isDarkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: RSVPStatus.ATTENDING,
    plusOne: false,
    plusOneName: '',
    followUpDate: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const triggerLuxuryConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      const colors = ['#d4af37', '#f7e7ce', '#ffffff', '#e5e7eb'];

      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors });
    }, 250);

    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#d4af37', '#f7e7ce', '#ffffff'] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRSVP: RSVP = {
      id: Date.now().toString(),
      ...formData,
      timestamp: new Date().toISOString()
    };
    onAddRSVP(newRSVP);
    setSubmitted(true);
    if (formData.status === RSVPStatus.ATTENDING) triggerLuxuryConfetti();
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      status: RSVPStatus.ATTENDING,
      plusOne: false,
      plusOneName: '',
      followUpDate: '',
    });
    setSubmitted(false);
  };

  return (
    <div className="container mx-auto px-6 max-w-2xl">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            className={`p-10 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative border border-gold/5 rounded-sm overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#262626]' : 'bg-white'}`}
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>

            <div className="text-center mb-12">
              <span className="text-gold text-[10px] uppercase tracking-[0.6em] font-black mb-4 block font-body">The Union of Souls</span>
              <h2 className={`text-4xl md:text-5xl font-serif mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Reservation</h2>
              <div className="w-12 h-px bg-gold/30 mx-auto mb-4"></div>
              <p className="text-gray-400 text-[10px] uppercase tracking-widest italic font-body">Kindly respond by July 15, 2025</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="group">
                <label className="block text-[10px] uppercase tracking-[0.3em] mb-3 font-black text-gray-400 group-focus-within:text-gold transition-colors font-body">Guest Full Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full border-b-2 py-3 focus:border-gold outline-none transition-all text-lg font-serif bg-transparent placeholder:text-gray-500 ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-100'}`}
                  placeholder="e.g. Julianna Vancer"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] mb-4 font-black text-gray-400 font-body">Attendance Selection</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'With Pleasure', value: RSVPStatus.ATTENDING, icon: 'fa-heart' },
                    { label: 'With Regret', value: RSVPStatus.NOT_ATTENDING, icon: 'fa-envelope-open' },
                    { label: 'Undecided', value: RSVPStatus.UNDECIDED, icon: 'fa-hourglass' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: opt.value }))}
                      className={`flex flex-col items-center justify-center py-6 px-4 border-2 transition-all duration-300 rounded-sm group ${formData.status === opt.value ? 'bg-gold border-gold text-white shadow-lg scale-105' : (isDarkMode ? 'bg-[#1a1a1a] border-gray-700 text-gray-400 hover:border-gold/30 hover:text-gold' : 'bg-white border-gray-50 text-gray-400 hover:border-gold/30 hover:text-gold')}`}
                    >
                      <i className={`fa-solid ${opt.icon} mb-3 text-lg ${formData.status === opt.value ? 'text-white' : 'text-gold/30 group-hover:text-gold'}`}></i>
                      <span className="text-[10px] uppercase font-bold tracking-widest font-body">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] uppercase tracking-[0.3em] mb-3 font-black text-gray-400 group-focus-within:text-gold transition-colors font-body">
                  Email Address {formData.status === RSVPStatus.UNDECIDED && <span className="text-red-500">*</span>}
                </label>
                <input
                  required={formData.status === RSVPStatus.UNDECIDED}
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full border-b-2 py-3 focus:border-gold outline-none transition-all text-lg font-serif bg-transparent placeholder:text-gray-500 ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-100'}`}
                  placeholder="your.email@example.com"
                />
                {formData.status === RSVPStatus.UNDECIDED && (
                  <p className="text-xs text-gray-400 mt-2 italic">Required for follow-up</p>
                )}
              </div>

              {formData.status === RSVPStatus.ATTENDING && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                >
                  <div
                    className={`flex items-center gap-3 p-6 border-l-4 border-gold rounded-sm ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}
                  >
                    <input
                      type="checkbox"
                      id="plusOne"
                      checked={formData.plusOne}
                      onChange={e => setFormData(prev => ({ ...prev, plusOne: e.target.checked }))}
                      className="accent-gold h-5 w-5 cursor-pointer"
                    />
                    <label htmlFor="plusOne" className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 cursor-pointer font-body">
                      I will be accompanied by a guest (+1)
                    </label>
                  </div>

                  {formData.plusOne && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group pl-6"
                    >
                      <label className="block text-[10px] uppercase tracking-[0.3em] mb-3 font-black text-gray-400 group-focus-within:text-gold transition-colors font-body">Plus One Name</label>
                      <input
                        required
                        type="text"
                        value={formData.plusOneName}
                        onChange={e => setFormData(prev => ({ ...prev, plusOneName: e.target.value }))}
                        className={`w-full border-b-2 py-2 focus:border-gold outline-none transition-all text-base font-serif bg-transparent placeholder:text-gray-500 ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-100'}`}
                        placeholder="Companion's full name"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {formData.status === RSVPStatus.NOT_ATTENDING && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 border-l-4 border-gold/30 rounded-sm italic text-gray-400 text-sm font-body ${isDarkMode ? 'bg-black/20' : 'bg-gray-50'}`}
                >
                  <p className="leading-relaxed">
                    "We'll miss you, but we'll carry your well-wishes in our hearts. Pour a glass for us at home! 🥂"
                  </p>
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-6 bg-gold text-white uppercase tracking-[0.5em] font-black hover:bg-[#b8962d] shadow-[0_20px_40px_rgba(212,175,55,0.3)] transition-all transform hover:-translate-y-1 rounded-sm text-xs flex items-center justify-center gap-4 font-body"
              >
                Submit Response <i className="fa-solid fa-arrow-right-long"></i>
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-16 shadow-[0_50px_100px_rgba(212,175,55,0.2)] border border-gold/30 text-center rounded-sm relative overflow-hidden ${isDarkMode ? 'bg-[#262626]' : 'bg-white'}`}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-gold/20"
            >
              <i className="fa-solid fa-crown text-gold text-4xl"></i>
            </motion.div>

            <h2 className={`text-4xl font-serif mb-6 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Response Recorded</h2>
            <div className="w-12 h-px bg-gold mx-auto mb-8"></div>

            <p className="text-gray-500 mb-10 leading-relaxed font-light italic max-w-sm mx-auto font-body">
              {formData.status === RSVPStatus.ATTENDING
                ? "We are delighted to have you join us. Your seat in the Grand Ballroom has been reserved with honor."
                : "We are sorry you can't make it. Your well wishes are deeply appreciated and will be shared with the couple."}
            </p>

            <div className="flex flex-col items-center gap-6">
              <div className="text-[10px] uppercase tracking-[0.4em] text-gold font-black flex items-center gap-3 font-body">
                <span className="w-2 h-2 bg-gold rounded-full animate-ping"></span>
                Invitation Status Updated
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="bg-gold text-white px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all font-body"
                >
                  Enter Portal
                </button>
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Florie+%26+Louie%27s+Wedding&dates=20260704T150000Z/20260704T230000Z&details=A+Celebration+of+Love&location=Archdiocesan+Shrine+of+St.+Therese,+Cebu+City`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black text-white px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all font-body flex items-center gap-2"
                >
                  <i className="fa-brands fa-google"></i> Add to Calendar
                </a>
                <button
                  onClick={handleReset}
                  className="bg-transparent border border-gold/20 text-gold px-8 py-3 rounded-sm text-[10px] font-black uppercase tracking-widest hover:bg-gold/5 transition-all font-body"
                >
                  Edit Response
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RSVPForm;
