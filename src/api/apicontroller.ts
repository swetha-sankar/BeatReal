import express from 'express';
import { Config } from '../shared/config';
import axios, { AxiosRequestConfig } from "axios";

export class ApiController{
    static baseURL: string = Config.databaseConfig.url;
	static apiKey:string= Config.databaseConfig.key;
    static data: any = ({
        "collection": "itemlist",
        "database": "exercise3",
        "dataSource": "Cluster0"
	})
	static config: AxiosRequestConfig = {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			'Access-Control-Request-Headers': '*',
			'api-key': ApiController.apiKey
		},
		data: null
	};

	//returns something.
	static getHello(req: express.Request, res: express.Response): void {
		ApiController.config.url = ApiController.baseURL + '/action/find'
		ApiController.config.data = ApiController.data
		axios(ApiController.config)
			.then(response => res.send(JSON.stringify(response.data)))
			.catch(error => res.send(error));
	}

	//returns whatever you post to it.  You can use the contents of req.body to extract information being sent to the server
	static postHello(req: express.Request, res: express.Response): void {
		ApiController.config.url = ApiController.baseURL + '/action/insertOne';
		ApiController.config.data = { ...ApiController.data, document: req.body };
		axios(ApiController.config).then(
			result => res.send(result)
		).catch(err => res.send(err))
	}
}

