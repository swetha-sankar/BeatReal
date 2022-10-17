//this is just a wrapper class to pull values from the environment or replace them with default values.
require('dotenv').config();
export class Config{
	static get port():number{return process.env.serverPort?+process.env.serverPort:3000;}
	static get tokenSecret():string{return process.env.tokenSecret?process.env.tokenSecret:'';}
	
	static get databaseConfig():{key:string,url:string,dataSource:string}{
		return {
			key:process.env.dataApiKey?process.env.dataApiKey:'',
			url:process.env.dataApiUrl?process.env.dataApiUrl:'',
			dataSource:process.env.dataApiSrc?process.env.dataApiSrc:'Cluster0'
		};
	}
}
