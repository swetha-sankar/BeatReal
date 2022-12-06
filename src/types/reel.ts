import { BRComment } from "./brcomment";

export interface Reel {
  reelId: string;
  posterName: string;
  songId: string;
  date: Date;
  likes: string[]; // List of userNames's
  comments: BRComment[];
}
