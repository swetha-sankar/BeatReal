import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Config } from './config';


export class SecUtils{
	static SALT_ROUNDS=10;

	//converts the object to a jwt token
	public static getToken(obj:any):string{
		return jwt.sign(obj,Config.tokenSecret);
	}
	
	//validates token and returns encoded data (or null on verification failure)
	public static verifyToken(token:string|undefined):any{
		if (!token||token.length==0)
			return null;
		try{
			//in production I would take the value of verify,
			//extract the user and make sure they are still
			//valid in the database by doing a db lookup
			return jwt.verify(token,Config.tokenSecret);
		}catch(e){
			console.error(e);
			return null;
		}
	}

	//takes a request and verifies
	//responds on failure, calls next function (controller function) on success
	//populates body.user with the contents of the token expected in the Authentication header
	public static middleware(req:express.Request,res:express.Response,next:express.NextFunction){
		const token=req.headers.authorization;
		const result=SecUtils.verifyToken(token);
		if (result){
			req.body.user=result;
			return next();
		}
        res.send({status:'error',data:'Security error'});
	}

	//compares a string and it's hashed equivalent
	public static async compareToHash(password:string,hash:string):Promise<boolean>{
		return await bcrypt.compare(password,hash);
	}

	//creates a hash for a string
	public static async createHash(input:string):Promise<string>{
		const salt=await bcrypt.genSalt(SecUtils.SALT_ROUNDS);
		return await bcrypt.hash(input,salt);
	}
}
