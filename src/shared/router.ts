import express from "express";

//Build routers from this abstract base class.  Simply overwrite createRouter and either add direct routes, or use addRouter to add
//additional routes to your application.
export abstract class Router{
    private _router:express.Router=express.Router();

	//access to underlying express router object
    public get router():express.Router{return this._router;}

    public constructor(){
        this.createRouter();
    }

	//call this to attach a sub-router under this one in the hierarchy
	//path: the relative path for this router to exist under
	//routerObj: a class derived from this one that you wish to attach under the current router.
	public addRouter(path:string,routerObj:Router):void{
		this._router.use(path,routerObj.router);
	}
	// Creates the routes for this router and returns a populated router object
	// implement and fill in derived classes.  A series of calls to addRouter, or directly attaching get/post/etc to this.router
    public abstract createRouter():void;    
}
