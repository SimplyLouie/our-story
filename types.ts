
export enum RSVPStatus {
  ATTENDING = 'ATTENDING',
  NOT_ATTENDING = 'NOT_ATTENDING',
  UNDECIDED = 'UNDECIDED'
}

export interface RSVP {
  id: string;
  name: string;
  email?: string;
  status: RSVPStatus;
  plusOne: boolean;
  plusOneName?: string;
  followUpDate?: string;
  notes?: string;
  dietary?: string;
  songRequest?: string;
  timestamp: string;
  reminderSent?: boolean;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
  isApproved: boolean;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface Venue {
  name: string;
  address: string;
  mapUrl: string;
}

export interface BridalPartyMember {
  name: string;
  role: string;
  image: string;
}

export interface MenuItem {
  course: string;
  dish: string;
  description: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface SiteContent {
  openingScreen: {
    welcome: string;
    title: string;
    subtitle: string;
    brand: string;
    sealInitials: string;
  };
  coupleNames: string;
  heroTitle: string;
  heroImageUrl: string; // New field
  adminPanelTitle: string;
  adminPanelSubtitle: string;
  weddingDate: string;
  weddingTime: string;
  countdownDate: string;
  venues: Venue[];
  heroTagline: string;
  ourStory: string;
  registryInfo: string;
  registryLinks: LinkItem[];
  socialLinks: LinkItem[];
  galleryImages: string[];
  googlePhotosLink: string; // New field
  googlePhotosLinkEnabled?: boolean; // Toggle for showing/hiding the album link
  timelineItems: Array<{ time: string; event: string; description: string }>;
  checklist: ChecklistItem[]; // New field
  musicUrl: string;
  dressCode: string;
  bridalParty: BridalPartyMember[];
  footerText?: string;
  menu: MenuItem[];
}

export interface MeetingNote {
  id: string;
  content: string;
  date: string;
}
