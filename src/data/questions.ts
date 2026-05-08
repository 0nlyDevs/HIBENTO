export interface Question {
  id: string;
  text: string;
  author: string;
  votes: number;
  voted?: boolean;
  emoji?: string;
}

export const initialQuestions: Question[] = [
  { id: "1", text: "How do you handle late submissions in the multi-track schedule?", author: "Anonymous", votes: 42, emoji: "" },
  { id: "2", text: "Will the upvote system be open-source for self-hosters?", author: "Marie L.", votes: 31, emoji: "" },
  { id: "3", text: "Can speakers reply to questions directly from their dashboard?", author: "Anonymous", votes: 18, emoji: "" },
  { id: "4", text: "Is there a way to export questions after the session ends?", author: "Tom R.", votes: 9, emoji: "" },
];
