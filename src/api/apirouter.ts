import { Router } from "../shared/router";
//import { SecUtils } from "../shared/secutils";
import { ApiController } from "./apicontroller";

//defines the routes for the api module and attaches them to the controller.
export class ApiRouter extends Router {
  public createRouter(): void {
    this.router.get("/users", ApiController.getUsers);
    this.router.get("/users/:id", ApiController.getUserId);
    this.router.get("/users/:id/friendids", ApiController.getUserFriends);
    this.router.get("/users/:id/reels", ApiController.getUserReels);
    this.router.get("/users/:id/friendReels", ApiController.getUserFriendReels);
    this.router.get("/users/:id/currentReel", ApiController.getUserCurrReel);
    this.router.post("/insertUser", ApiController.postUser);
    this.router.put("/editUser/:id", ApiController.putUser);
    this.router.put(
      "/likeReel/:posterid/:reelid/:likerid",
      ApiController.putLike
    );
    this.router.delete("/deleteUser", ApiController.deleteUser);
    this.router.patch("/deleteReel", ApiController.deleteReel);
    this.router.patch("/unlikeReel", ApiController.unlikeReel);
    this.router.patch("/insertReel", ApiController.patchReel);
    this.router.patch("/users/id/likes", ApiController.unlikeReel);
    this.router.patch("/commentReel", ApiController.commentReel);
  }
}
