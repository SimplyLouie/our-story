import { SiteContent } from './types';

export const INITIAL_CONTENT: SiteContent = {
  openingScreen: {
    welcome: "You are cordially invited to",
    title: "Louie & Florie",
    subtitle: "A Celebration of Love",
    brand: "Louie & Florie",
    sealInitials: "LF"
  },
  coupleNames: "Louie & Florie",
  heroTitle: "Louie & Florie",
  heroImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920",
  adminPanelTitle: "Louie & Florie CMS",
  adminPanelSubtitle: "Wedding Management",
  weddingDate: "July 4, 2026",
  weddingTime: "3:00 PM",
  // Ensure valid ISO format for consistent countdown across browsers
  countdownDate: "2026-07-04T15:00:00",
  venues: [
    {
      name: "Archdiocesan Shrine of St. Thérèse of the Child Jesus",
      address: "Gorordo Ave, Lahug, Cebu City",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5218.1810181073815!2d123.89791887503557!3d10.331064989791887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999269b2146d5%3A0x462d30e860ab63f2!2sArchdiocesan%20Shrine%20of%20St.%20Th%C3%A9r%C3%A8se%20of%20the%20Child%20Jesus!5e1!3m2!1sen!2sph!4v1768570025254!5m2!1sen!2sph"
    },
    {
      name: "Chateau de Busay Inn & Restaurant",
      address: "Lower Busay, Cebu City",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5217.661214066814!2d123.87666848669632!3d10.362327840313117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99f4c07b55c0f%3A0x990d6bedbcf8c0c7!2sChateau%20de%20Busay%20Inn%20%26%20Restaurant!5e1!3m2!1sen!2sph!4v1768572532024!5m2!1sen!2sph"
    }
  ],
  heroTagline: "Together with their families, invite you to celebrate the union of their souls in an evening of timeless elegance.",
  ourStory: "Our journey began with a simple hello and blossomed into a lifetime of love. We are so excited to share this new chapter with those who have shaped us.",
  registryInfo: "Your presence is the greatest gift we could receive. If you wish to honor us with a gift, we are registered at Williams Sonoma and Pottery Barn, or you may contribute to our honeymoon fund for our first trip as husband and wife.",
  registryLinks: [
    { label: "Williams Sonoma", url: "#" },
    { label: "Honeymoon Fund", url: "#" }
  ],
  socialLinks: [
    { label: "Instagram", url: "https://instagram.com" },
    { label: "Facebook", url: "https://facebook.com" },
    { label: "Pinterest", url: "https://pinterest.com" }
  ],
  galleryImages: [
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1522673607200-164883214cde?auto=format&fit=crop&q=80&w=1200"
  ],
  googlePhotosLink: "https://photos.google.com",
  googlePhotosLinkEnabled: true,
  timelineItems: [
    { time: "3:00 PM", event: "The Ceremony", description: "Shrine of St. Thérèse" },
    { time: "5:30 PM", event: "Cocktail Hour", description: "Chateau de Busay Inn" },
    { time: "7:00 PM", event: "Dinner & Toasts", description: "Chateau de Busay Inn" },
    { time: "9:00 PM", event: "Dancing", description: "Under the Stars" }
  ],
  checklist: [
    { id: '1', text: 'Confirm floral arrangements', completed: false },
    { id: '2', text: 'Finalize seating chart', completed: true },
    { id: '3', text: 'Pick up wedding rings', completed: false }
  ],
  menu: [
    { course: "Amuse-Bouche", dish: "Truffle Arancini", description: "Wild mushroom risotto spheres with a molten fontina center." },
    { course: "First Course", dish: "Burrata & Heirloom Tomato", description: "Creamy burrata, balsamic pearls, and micro-basil on a bed of gold-flecked heirloom tomatoes." },
    { course: "Main Course", dish: "Wagyu Filet Mignon", description: "Gently seared, served with a bordelaise sauce, asparagus tips, and velvet potato purée." },
    { course: "Dessert", dish: "Midnight Chocolate Dome", description: "Dark Valrhona chocolate, salted caramel core, and edible gold leaf." }
  ],
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  dressCode: "Black Tie Optional: We kindly request our guests to dress in formal attire. Gentlemen in tuxedos or dark suits, and ladies in evening gowns or cocktail dresses. Warm champagne and gold tones are encouraged.",
  bridalParty: [
    { name: "Julianna Vance", role: "Maid of Honor", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2" },
    { name: "Marcus Thorne", role: "Best Man", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d" },
    { name: "Chloe Bennett", role: "Bridesmaid", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" },
    { name: "Julian Pierce", role: "Groomsman", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" }
  ],
  footerText: "Handcrafted with love for the celebration of a lifetime"
};
