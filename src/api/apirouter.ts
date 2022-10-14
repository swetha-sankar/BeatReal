import { Router } from "../shared/router";
//import { SecUtils } from "../shared/secutils";
import { ApiController } from "./apicontroller";

//defines the routes for the api module and attaches them to the controller.
export class ApiRouter extends Router{
	public createRouter(): void {
		this.router.get("/hello",ApiController.getHello);
		this.router.post("/hello",ApiController.postHello);
		//this.router.get("/private/hello",SecUtils.middleware,ApiController.getPrivateHello)
	}
}
