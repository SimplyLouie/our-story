import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { SiteContent, RSVP, RSVPStatus, MeetingNote, GuestbookEntry } from './types';
import { INITIAL_CONTENT } from './constants';
import OpeningScreen from './components/OpeningScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sections from './components/Sections';
import RSVPForm from './components/RSVPForm';
import AdminPanel from './components/AdminPanel';
import GuestDashboard from './components/GuestDashboard';
import FloatingParticles from './components/FloatingParticles';
import Footer from './components/Footer';
import { dbService, authService } from './firebase';
import EmailService from './components/EmailService';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showGuestDashboard, setShowGuestDashboard] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Admin email - change this to match your Firebase user
  const ADMIN_EMAIL = 'admin@simplylouie.com';

  const [initialGuestName, setInitialGuestName] = useState<string>('');
  const [isMuted, setIsMuted] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [content, setContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('wedding_content');
    return saved ? JSON.parse(saved) : INITIAL_CONTENT;
  });
  const [rsvps, setRsvps] = useState<RSVP[]>(() => {
    const saved = localStorage.getItem('wedding_rsvps');
    return saved ? JSON.parse(saved) : [];
  });
  const [notes, setNotes] = useState<MeetingNote[]>(() => {
    const saved = localStorage.getItem('wedding_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Branding Migration: Ensure "Louie & Florie" order
    const isLegacy =
      content.coupleNames === "Florie & Louie" ||
      content.openingScreen?.brand === "Florie & Louie" ||
      content.coupleNames === "Simply Louie" ||
      content.openingScreen?.brand === "Simply Louie";

    if (isLegacy) {
      const updated = {
        ...content,
        coupleNames: "Louie & Florie",
        heroTitle: "Louie & Florie",
        openingScreen: {
          ...content.openingScreen,
          title: "Louie & Florie",
          brand: "Louie & Florie",
          sealInitials: "LF"
        },
        adminPanelTitle: "Louie & Florie CMS"
      };
      setContent(updated);
      dbService.updateContent(updated);
    }
  }, [content]);

  useEffect(() => {
    // Firebase Subscriptions
    const unsubContent = dbService.subscribeToContent((remoteContent) => {
      setContent(remoteContent);
      localStorage.setItem('wedding_content', JSON.stringify(remoteContent));
    });

    const unsubRSVPs = dbService.subscribeToRSVPs((remoteRSVPs) => {
      setRsvps(remoteRSVPs);
      localStorage.setItem('wedding_rsvps', JSON.stringify(remoteRSVPs));
    });

    const unsubNotes = dbService.subscribeToNotes((remoteNotes) => {
      setNotes(remoteNotes);
      localStorage.setItem('wedding_notes', JSON.stringify(remoteNotes));
    });

    const unsubGuestbook = dbService.subscribeToGuestbook((remoteEntries) => {
      setGuestbookEntries(remoteEntries);
    });

    return () => {
      unsubContent();
      unsubRSVPs();
      unsubNotes();
      unsubGuestbook();
    };
  }, []);

  useEffect(() => {
    // Keep local storage as backup
    localStorage.setItem('wedding_content', JSON.stringify(content));
    localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps));
    localStorage.setItem('wedding_notes', JSON.stringify(notes));
  }, [content, rsvps, notes]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  };

  const toggleTheme = () => {
    // Use requestAnimationFrame to prevent UI freeze on mobile
    requestAnimationFrame(() => {
      setIsDarkMode(prev => !prev);
    });
  };

  const handleAddRSVP = (newRSVP: RSVP) => {
    setRsvps(prev => [...prev, newRSVP]);
    dbService.saveRSVP(newRSVP);

    // Optional: Open email confirmation draft (user can choose to send or not)
    if (newRSVP.email && newRSVP.status !== RSVPStatus.UNDECIDED) {
      EmailService.sendRSVPConfirmation(newRSVP);
    }

    setTimeout(() => {
      setInitialGuestName(newRSVP.name);
      setShowGuestDashboard(true);
    }, 2500);
  };

  const handleUpdateRSVP = (updatedRSVP: RSVP) => {
    setRsvps(prev => prev.map(r => r.id === updatedRSVP.id ? updatedRSVP : r));
    return dbService.saveRSVP(updatedRSVP);
  };

  const handleUpdateContent = (newContent: SiteContent) => {
    setContent(newContent);
    dbService.updateContent(newContent).catch(console.error);
  };

  const handleSendReminder = (rsvpId: string) => {
    const rsvp = rsvps.find(r => r.id === rsvpId);
    if (rsvp) {
      EmailService.sendFollowUpReminder(rsvp);
      setRsvps(prev => prev.map(r => r.id === rsvpId ? { ...r, reminderSent: true } : r));
    }
  };

  const handleBatchReminders = (ids: string[]) => {
    const selectedRsvps = rsvps.filter(r => ids.includes(r.id));
    EmailService.sendBatchReminders(selectedRsvps);
    setRsvps(prev => prev.map(r => ids.includes(r.id) ? { ...r, reminderSent: true } : r));
  };

  const handleDeleteRSVP = (id: string) => {
    if (window.confirm("Are you sure you want to delete this guest? This cannot be undone.")) {
      setRsvps(prev => prev.filter(r => r.id !== id));
      dbService.deleteRSVP(id);
    }
  };

  const handleAddNote = (content: string) => {
    const newNote: MeetingNote = {
      id: Date.now().toString(),
      content,
      date: new Date().toLocaleDateString()
    };
    setNotes(prev => [newNote, ...prev]);
    dbService.saveNote(newNote);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    dbService.deleteNote(id);
  };

  // Firebase Auth State Observer
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      if (user) {
        setIsAdmin(true);
        setShowAdminLogin(false);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAdminAuth = () => {
    setShowAdminLogin(true);
    setLoginError('');
    setPasswordInput('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      // Use hardcoded admin email with user-entered password
      await authService.login(ADMIN_EMAIL, passwordInput);
      setIsAdmin(true);
      setShowAdminLogin(false);
      window.scrollTo(0, 0);
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setLoginError('Incorrect password');
      } else if (error.code === 'auth/user-not-found') {
        setLoginError('Admin account not configured');
      } else if (error.code === 'auth/too-many-requests') {
        setLoginError('Too many failed attempts. Try again later.');
      } else {
        setLoginError('Authentication failed. Please try again.');
      }
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAdmin(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <OpeningScreen content={content} onComplete={() => setLoading(false)} />;
  }

  return (
    <div className={`min-height-screen transition-colors duration-700 relative overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] text-white/90' : 'bg-[#fcfaf7] text-gray-800'}`}>
      <FloatingParticles count={25} type="petals" />
      <audio ref={audioRef} loop preload="auto" key={content.musicUrl}>
        <source src={content.musicUrl} type="audio/mpeg" />
      </audio>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gold z-[100] origin-left"
        style={{ scaleX }}
      />

      <div className="flex flex-col">
        <Navbar
          onAdminClick={handleAdminAuth}
          onGuestDashboardClick={() => { setInitialGuestName(''); setShowGuestDashboard(true); }}
          isMuted={isMuted}
          onToggleMusic={toggleMusic}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          hidden={isAdmin || showGuestDashboard || showAdminLogin}
        />
        <Hero content={content} />



        <main className="flex-grow">
          <Sections
            content={content}
            isDarkMode={isDarkMode}
          />
          <div id="rsvp" className={`py-20 relative transition-colors duration-300 ${isDarkMode ? 'bg-black/20' : 'bg-champagne/10'}`}>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
            <RSVPForm onAddRSVP={handleAddRSVP} isDarkMode={isDarkMode} />
          </div>
        </main>
        <Footer content={content} onAdminClick={handleAdminAuth} isDarkMode={isDarkMode} />

        {/* Scroll To Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-8 left-8 z-40 w-12 h-12 bg-white text-gold rounded-full shadow-lg border border-gold/20 flex items-center justify-center hover:bg-gold hover:text-white transition-colors duration-300"
            >
              <i className="fa-solid fa-arrow-up"></i>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showGuestDashboard && (
            <GuestDashboard
              content={content}
              rsvps={rsvps}
              initialName={initialGuestName}
              onClose={() => setShowGuestDashboard(false)}
              onUpdateRSVP={handleUpdateRSVP}
              isDarkMode={isDarkMode}
            />
          )}
        </AnimatePresence>

        {/* Admin Login Modal */}
        <AnimatePresence>
          {showAdminLogin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setShowAdminLogin(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className={`p-8 md:p-12 rounded-sm shadow-2xl max-w-md w-full relative border-t-4 border-gold ${isDarkMode ? 'bg-[#262626] text-white' : 'bg-white text-gray-800'}`}
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setShowAdminLogin(false)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-lock text-3xl text-gold"></i>
                  </div>
                  <h3 className={`text-2xl font-serif ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Admin Access</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Enter Your Password</p>
                </div>
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider font-bold block mb-2">Password</label>
                    <input
                      autoFocus
                      type="password"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      placeholder="Enter your admin password"
                      required
                      className={`w-full text-center border-2 py-4 px-4 text-lg outline-none focus:border-gold transition-all rounded-xl font-body bg-transparent placeholder:text-gray-400 ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-800'}`}
                    />
                  </div>
                  {loginError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <p className="text-red-600 text-xs text-center font-bold flex items-center justify-center gap-2">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        {loginError}
                      </p>
                    </div>
                  )}
                  <button type="submit" className="w-full bg-gold text-white py-4 rounded-xl text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-[#b8962d] transition-all shadow-lg shadow-gold/20 flex items-center justify-center gap-2">
                    <i className="fa-solid fa-unlock"></i>
                    Unlock Admin Panel
                  </button>
                  <div className="text-center pt-2">
                    <p className="text-xs text-gray-400">
                      <i className="fa-solid fa-shield-halved mr-1"></i>
                      Secured with Firebase Authentication
                    </p>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Panel Modal */}
        <AnimatePresence>
          {isAdmin && (
            <motion.div
              key="admin-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
              onClick={() => setIsAdmin(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="w-full max-w-[90vw] h-[90vh] rounded-3xl shadow-2xl relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <AdminPanel
                  content={content}
                  onUpdateContent={handleUpdateContent}
                  rsvps={rsvps}
                  notes={notes}
                  onAddNote={handleAddNote}
                  onDeleteNote={handleDeleteNote}
                  onSendReminder={handleSendReminder}
                  onBatchReminders={handleBatchReminders}
                  onDeleteRSVP={handleDeleteRSVP}
                  guestbookEntries={guestbookEntries}
                  onDeleteGuestbookEntry={(id) => dbService.deleteGuestbookEntry(id)}
                  onClose={handleLogout}
                  isDarkMode={isDarkMode}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
