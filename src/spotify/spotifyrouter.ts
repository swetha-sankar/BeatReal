import { Router } from "../shared/router";
import { SpotifyController } from "./spotifycontroller.js";

//defines the routes for the api module and attaches them to the controller.
export class SpotifyRouter extends Router {
  public createRouter(): void {
    this.router.get("/login", SpotifyController.login);
    this.router.get("/callback", SpotifyController.callback);
    this.router.post("/link/:userid/:spotifyid", SpotifyController.link);
  }
}
