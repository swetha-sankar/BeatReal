import axios, { AxiosRequestConfig } from 'axios';
import { Config } from './config';

export class MongoAtlasDB {

	//Create an atlas request using data from configuration and request
	//options is specific to the request type and is merged with the data member
	//action is the relative path to the action from the stored url from config
	private getRequestObject(collection: string, action:string,options: any={}): AxiosRequestConfig {
		return {
			method: 'post',
			url: Config.databaseConfig.url+action,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Request-Headers': '*',
				'api-key': Config.databaseConfig.key
			},
			data: {
				database: this.database,
				dataSource: this.dataSource,
				collection: collection,
				...options
			}
		}
	}
	constructor(private dataSource: string, private database: string) {
	}
	//find a record in colleciton matching query of the form {field:value} 
	public async findOne(collection: string, query: any): Promise<any> {
		const requestObject=this.getRequestObject(collection,'/action/findOne',{filter:query});
		return axios(requestObject);
	}
	//find all records in colleciton matching query of the form {field:value} 
	public async find(collection: string,query:any={}): Promise<any> {
		const requestObject=this.getRequestObject(collection,'/action/find',{filter:query});
		return axios(requestObject);
	}
	//insert obj into colleciton
	public async insert(collection: string, obj: any): Promise<any> {
		const requestObject=this.getRequestObject(collection,'/action/insertOne',{document:obj});
		
		return axios(requestObject);
	}
	//update record in collection with _id=id and replace it with updateObj
	public async update(collection: string, id: string, updateObj: any): Promise<any> {
		const requestObject=this.getRequestObject(collection,'/action/replaceOne',{filter:{'_id': { "$oid":id}},replacement:updateObj});
		return axios(requestObject);
	}
}
