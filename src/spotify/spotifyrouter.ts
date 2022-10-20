import { Router } from "../shared/router";
import { SpotifyController } from "./spotifycontroller";

//defines the routes for the api module and attaches them to the controller.
export class SpotifyRouter extends Router {
  public createRouter(): void {
    this.router.get("/login", SpotifyController.login);
  }
}
