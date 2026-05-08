export interface CTAItem {
  n: string;
  l: string;
}

export interface CTAConfig {
  tagline: string;
  heading: string;
  subheading: string;
  description: string;
  buttonText: string;
  doneText: string;
  items: CTAItem[];
}

export const ctaConfig: CTAConfig = {
  tagline: "§ 06 — Get in",
  heading: "Your next event,",
  subheading: "already live.",
  description: "HiBento is invite-only while we onboard our first cohort of organisers. Drop your email and we'll set you up with a private demo.",
  buttonText: "Request access →",
  doneText: "✓ On the list",
  items: [
    { n: "04", l: "Roles supported" },
    { n: "∞",  l: "Parallel tracks" },
    { n: "0",  l: "Attendee logins" },
  ],
};
