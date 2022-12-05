import { Reel } from "./reel";

export interface Post {
  posterId: string;
  profilePic: string;
  username: string;
  reel: Reel;
}
