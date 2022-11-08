import { ObjectId } from "mongodb";

export interface BRComment {
  _id: ObjectId;
  commenterId: string;
  textContent: string;
}
