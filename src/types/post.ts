import { Reel } from "./reel";

export interface Post {
  username: string;
  profilePic: string | null;
  reel: Reel;
}
