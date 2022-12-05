import { Reel } from "./reel";

export interface User {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  updateDate: Date;
  spotifyId: string;
  friendNames: string[];
  reels: Reel[];
  email: string;
  profilePic: string | null;
  bio: string;
}
