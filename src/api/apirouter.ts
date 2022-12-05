import { Router } from "../shared/router";
//import { SecUtils } from "../shared/secutils";
import { ApiController } from "./apicontroller";

//defines the routes for the api module and attaches them to the controller.
export class ApiRouter extends Router {
  public createRouter(): void {
    this.router.get("/users", ApiController.getUsers);
    this.router.get("/users/:userName", ApiController.getUserName);
    this.router.get(
      "/users/:userName/friendNames",
      ApiController.getUserFriends
    );
    this.router.get("/users/:userName/reels", ApiController.getUserReels);
    this.router.get("/users/:userName/feed", ApiController.getUserFeed);
    this.router.get(
      "/users/:userName/currentReel",
      ApiController.getUserCurrReel
    );
    // this.router.post("/insertUser", ApiController.postUser);
    this.router.put("/likeReel", ApiController.putLike);
    this.router.patch("/unlikeReel", ApiController.unlikeReel);
    this.router.delete("/deleteUser", ApiController.deleteUser);
    this.router.patch("/editUser", ApiController.patchUser);
    this.router.patch("/deleteReel", ApiController.deleteReel);
    this.router.patch("/insertReel", ApiController.patchReel);
    this.router.patch("/users/id/likes", ApiController.unlikeReel);
    this.router.patch("/commentReel", ApiController.commentReel);
    this.router.patch("/deleteComment", ApiController.deleteComment);
  }
}
