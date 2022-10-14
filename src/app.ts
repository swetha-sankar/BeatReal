import {Config} from './shared/config';
import { Application } from "./shared/application";
import { MainRouter } from './mainRouter';

class App extends Application {
    constructor(port:number) {
		super(port);
    }

    // setup routes for the express server.  Attaches a root router to the root of the api site.
    public buildRoutes(): void {
		const router:MainRouter=new MainRouter();
		this.addRouter("/",router);
    }
}

//get port from Config wrapper to check environment first
new App(Config.port).start('Test Server');
