import { BRComment } from "./comment";

export interface Reel {
    id: string;
    posterId: string;
    date: Date;
    time: Date;
    likes: string[];
    comments: BRComment[];
}