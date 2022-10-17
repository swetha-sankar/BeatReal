import { ApiRouter } from "./api/apirouter"
import { SecRouter } from "./security/secrouter";
import { Router } from "./shared/router"

//a derived router to be attached to the root of the site.
export class MainRouter extends Router{
	//attaches sub-routers off the root which internally will have there own routing.  This is to support modularization of the code.
	public createRouter(): void {
		//add routers
		this.addRouter("/api",new ApiRouter());
		this.addRouter("/security",new SecRouter());
		
		//add paths to this router if you need to add them directly
		//this.router.get("/hello",(req,res)=>res.send('hello'));
	}

}
