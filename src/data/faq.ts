export interface FAQItem {
  q: string;
  a: string;
}

export const faqItems: FAQItem[] = [
  { q: "Do attendees need an account?", a: "Nope. Schedule, live sessions, Q&A, all public with no sign-up. Just a link." },
  { q: "Who needs to log in?", a: "Only organisers, to create events, manage sessions, and assign speakers. Everyone else just shows up." },
  { q: "How is a session marked 'live'?", a: "Automatically. If the current time is between a session's start and end, it lights up across the whole app." },
  { q: "Are questions moderated?", a: "Not in this version. The crowd self-regulates with upvotes. Best questions rise, the rest fade." },
  { q: "Where are favourites stored?", a: "Locally, in the attendee's browser. Nothing leaves their phone. No tracking, no login." },
  { q: "Can I theme it for my event?", a: "Not yet. Custom branding is on the roadmap. For now, HiBento ships with a single clean theme that works for any event type." },
];
