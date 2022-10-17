import express from "express";
import { Router } from "./router";

//base class for the application which takes care of alot of the housekeeping and setup
export abstract class Application {
    private app: express.Application=express();

	//pass in the port to listen on
    constructor(private port:number) {
        this.initCors(this.app);
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.buildRoutes();
    }

    // Starts the server on the port specified in the environment or on port 3000 if none specified.
	// label: string to display on the console (optional)
    public start(label:string='Server'): void {
        this.app.listen(this.port, () => console.log(label+" listening on port " + this.port + "!"));
    }

    // sets up to allow cross-origin support from any host.  You can change the options to limit who can access the api.
    // This is not a good security measure as it can easily be bypassed,
    // but should be setup correctly anyway.  Without this, angular would not be able to access the api it it is on
    // another server.  Can be overridden to change the behavior
    public initCors(app:express.Application): void {
        app.use(function(req: express.Request, res: express.Response, next: any) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
            res.header("Access-Control-Allow-Credentials", "true");
            next();
        });
    }

	//adds a router on the given path to the root of the application
	//path: the absolute path on the site to the router object
	//routerObj: a router derived class that contains routes or other routers
	public addRouter(path:string,routerObj:Router):void{
		this.app.use(path,routerObj.router);
	}
    // setup routes for the express server by calling addRouter.  Implement in derived class to add routers to the application
	// by calling addRouter 1 or more times and passing in a Router derived class
    public abstract buildRoutes(): void;
}
