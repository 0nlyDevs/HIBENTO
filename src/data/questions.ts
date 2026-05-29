export interface Question {
  id: string;
  content: string;
  authorName: string;
  upvotes: number;
  voted?: boolean;
  isNew?: boolean;
}

export const initialQuestions: Question[] = [
  { id: "1", content: "How does HiBento handle last-minute schedule changes without breaking the live view for attendees?", authorName: "Mara C.", upvotes: 47 },
  { id: "2", content: "Can the Q&A be moderated before questions go public, or is it always open?", authorName: "Aarav S.", upvotes: 34 },
  { id: "3", content: "Is there a speaker-facing view that's different from what the audience sees?", authorName: "Anonymous", upvotes: 21 },
  { id: "4", content: "What happens to all the questions and upvotes after the event ends?", authorName: "Iris M.", upvotes: 12 },
];
