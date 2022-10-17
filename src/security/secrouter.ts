import { Router } from "../shared/router";
import { SecUtils } from "../shared/secutils";
import { SecController } from "./seccontroller";

export class SecRouter extends Router{
	public createRouter(): void {
		this.router.post('/token',SecController.login);
		this.router.post('/register',SecController.register);
		this.router.post('/changepwd',SecUtils.middleware,SecController.changePwd);
	}
}
