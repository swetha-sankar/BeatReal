import { BRComment } from "./brcomment";

export interface Reel {
	_id: string;
	posterId: string;
	songId: string;
	date: Date;
	time: Date;
	likes: string[]; // List of ID's
	comments: BRComment[];
}
