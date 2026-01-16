import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue, off, DataSnapshot, remove } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseConfig } from './firebase-config';
import { RSVP, SiteContent, MeetingNote, GuestbookEntry } from './types';


const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Set auth persistence to local
setPersistence(auth, browserLocalPersistence);

export const authService = {
    // Login with email and password
    login: async (email: string, password: string): Promise<User> => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    },

    // Logout
    logout: async (): Promise<void> => {
        await signOut(auth);
    },

    // Login with Google
    loginWithGoogle: async (): Promise<User> => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        return userCredential.user;
    },

    // Get current user
    getCurrentUser: (): User | null => {
        return auth.currentUser;
    },

    // Subscribe to auth state changes
    onAuthStateChange: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    }
};


export const dbService = {
    // Save RSVP
    saveRSVP: async (rsvp: RSVP) => {
        const rsvpRef = ref(db, `rsvps/${rsvp.id}`);
        await set(rsvpRef, rsvp);
    },

    // Listen for RSVPs
    subscribeToRSVPs: (callback: (rsvps: RSVP[]) => void) => {
        const rsvpsRef = ref(db, 'rsvps');
        onValue(rsvpsRef, (snapshot: DataSnapshot) => {
            const data = snapshot.val();
            const rsvpList = data ? Object.values(data) as RSVP[] : [];
            callback(rsvpList);
        });
        return () => off(rsvpsRef);
    },

    // Delete RSVP
    deleteRSVP: async (rsvpId: string) => {
        const rsvpRef = ref(db, `rsvps/${rsvpId}`);
        await remove(rsvpRef);
    },

    // Update Content
    updateContent: async (content: SiteContent) => {
        const contentRef = ref(db, 'content');
        await set(contentRef, content);
    },

    // Listen for Content
    subscribeToContent: (callback: (content: SiteContent) => void) => {
        const contentRef = ref(db, 'content');
        onValue(contentRef, (snapshot: DataSnapshot) => {
            const data = snapshot.val();
            if (data) callback(data as SiteContent);
        });
        return () => off(contentRef);
    },

    // Save Note
    saveNote: async (note: MeetingNote) => {
        const noteRef = ref(db, `notes/${note.id}`);
        await set(noteRef, note);
    },

    // Delete Note
    deleteNote: async (noteId: string) => {
        const noteRef = ref(db, `notes/${noteId}`);
        await set(noteRef, null);
    },

    // Listen for Notes
    subscribeToNotes: (callback: (notes: MeetingNote[]) => void) => {
        const notesRef = ref(db, 'notes');
        onValue(notesRef, (snapshot: DataSnapshot) => {
            const data = snapshot.val();
            const notesList = data ? Object.values(data) as MeetingNote[] : [];
            callback(notesList);
        });
        return () => off(notesRef);
    },

    // Guestbook
    saveGuestbookEntry: async (entry: GuestbookEntry) => {
        const entryRef = ref(db, `guestbook/${entry.id}`);
        await set(entryRef, entry);
    },

    deleteGuestbookEntry: async (entryId: string) => {
        const entryRef = ref(db, `guestbook/${entryId}`);
        await remove(entryRef);
    },

    subscribeToGuestbook: (callback: (entries: GuestbookEntry[]) => void) => {
        const guestbookRef = ref(db, 'guestbook');
        onValue(guestbookRef, (snapshot: DataSnapshot) => {
            const data = snapshot.val();
            const entryList = data ? Object.values(data) as GuestbookEntry[] : [];
            // Sort by date descending
            entryList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            callback(entryList);
        });
        return () => off(guestbookRef);
    }
};

export default db;
