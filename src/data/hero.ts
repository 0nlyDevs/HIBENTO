export interface HeroContent {
  tagline: string;
  heading: string;
  subheading: string;
  description: string;
  cta: {
    primary: string;
    secondary: string;
  };
  bottomStrip: {
    categories: string;
    liveSessions: string;
  };
}

export const heroContent: HeroContent = {
  tagline: "HiBento, built for live rooms",
  heading: "Every event,",
  subheading: "live.",
  description: "HiBento turns any event into one live screen. Stream, ask, vote. No PDFs. No login walls. Just the room, in real time.",
  cta: {
    primary: "Try it free",
    secondary: "Browse events",
  },
  bottomStrip: {
    categories: "Tech · Workshops · Meetups · Summits",
    liveSessions: "Live sessions across multiple rooms, right now",
  },
};
