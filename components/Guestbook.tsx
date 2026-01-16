import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GuestbookEntry } from '../types';
import { dbService } from '../firebase';

interface GuestbookProps {
    isDarkMode: boolean;
}

const Guestbook: React.FC<GuestbookProps> = ({ isDarkMode }) => {
    const [entries, setEntries] = useState<GuestbookEntry[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const unsub = dbService.subscribeToGuestbook(setEntries);
        return () => unsub();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !message) return;

        setIsSubmitting(true);
        const newEntry: GuestbookEntry = {
            id: Date.now().toString(),
            name,
            message,
            date: new Date().toISOString(),
            isApproved: true // Auto-approve for now
        };

        try {
            await dbService.saveGuestbookEntry(newEntry);
            setName('');
            setMessage('');
            setShowForm(false);
        } catch (error) {
            console.error("Error saving guestbook entry:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="guestbook" className="container mx-auto px-6 max-w-5xl">
            <div className="text-center mb-16">
                <span className="text-gold text-[10px] uppercase tracking-[0.6em] font-black mb-4 block font-body">Words of Love</span>
                <h2 className={`text-4xl md:text-5xl font-serif-sc uppercase transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Guestbook</h2>
                <div className="w-16 h-px bg-gold/30 mx-auto mt-4 mb-8"></div>

                {!showForm ? (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(true)}
                        className="bg-gold text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-gold/20"
                    >
                        Leave a Message
                    </motion.button>
                ) : (
                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className={`max-w-xl mx-auto p-8 border border-gold/10 rounded-sm shadow-xl ${isDarkMode ? 'bg-[#262626]' : 'bg-white'}`}
                    >
                        <div className="space-y-6">
                            <input
                                required
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Your Name"
                                className={`w-full border-b py-2 focus:border-gold outline-none transition-all font-body bg-transparent ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-100'}`}
                            />
                            <textarea
                                required
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Your message for the couple..."
                                rows={4}
                                className={`w-full border-b py-2 focus:border-gold outline-none transition-all font-body bg-transparent resize-none ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-100'}`}
                            />
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 bg-gold text-white py-3 rounded-full text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Sending...' : 'Post Message'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-400'}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.form>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {entries.map((entry) => (
                        <motion.div
                            key={entry.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`p-8 rounded-sm border-l-4 border-gold shadow-sm transition-all hover:shadow-md ${isDarkMode ? 'bg-[#262626]' : 'bg-gold/5'}`}
                        >
                            <p className={`text-sm italic mb-6 leading-relaxed font-body ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                "{entry.message}"
                            </p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="font-serif text-gold text-lg">{entry.name}</h4>
                                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                                        {new Date(entry.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </span>
                                </div>
                                {entry.reaction === 'heart' ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="flex flex-col items-center gap-1"
                                    >
                                        <i className="fa-solid fa-heart text-red-500 text-xl drop-shadow-[0_0_8px_rgba(239,68,68,0.4)] animate-pulse"></i>
                                        <span className="text-[8px] font-black uppercase tracking-tighter text-red-500/80">Loved</span>
                                    </motion.div>
                                ) : (
                                    <i className="fa-solid fa-quote-right text-gold/20 text-2xl"></i>
                                )}
                            </div>

                            {entry.reply && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-6 p-4 rounded-sm border-l-2 border-gold/40 relative group ${isDarkMode ? 'bg-black/20' : 'bg-white'}`}
                                >
                                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-gold rounded-full flex items-center justify-center shadow-sm">
                                        <i className="fa-solid fa-crown text-[10px] text-white"></i>
                                    </div>
                                    <div className="text-gold text-[8px] font-black uppercase tracking-widest mb-1 pl-2">The Couple's Reply</div>
                                    <p className={`text-xs italic font-body ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        "{entry.reply}"
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {entries.length === 0 && !showForm && (
                <div className="text-center py-20 opacity-30">
                    <i className="fa-solid fa-feather-pointed text-4xl text-gold mb-4"></i>
                    <p className="text-sm italic uppercase tracking-widest">No messages yet. Be the first!</p>
                </div>
            )}
        </section>
    );
};

export default Guestbook;
