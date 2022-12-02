import { Request, Response } from "express";
import { Config } from "../shared/config";
import { MongoAtlasDB } from "../shared/MongoAtlasDb";
import { SecUtils } from "../shared/secutils";

export class SecController {
  // /token
  //takes a login request with body containing {username:string,password:string}
  //returns status ok, with a token in data if successfull
  //returns status error on failure with msg in data
  public static async login(req: Request, res: Response): Promise<void> {
    const userName: string = req.body.username;
    const password: string = req.body.password;
    if (!userName || !password) {
      res.send({ status: "error", data: "username and password required" });
      return;
    }
    try {
      const db = new MongoAtlasDB(
        Config.databaseConfig.dataSource,
        "BeatReal"
      );
      const result = await db.findOne("User", { username: userName });
      if (!result.data.document) {
        res.send({ status: "error", data: "Invalid login" });
        return;
      }
      if (
        !(await SecUtils.compareToHash(password, result.data.document.password))
      ) {
        res.send({ status: "error", data: "Invalid login" });
        return;
      }
      const token = SecUtils.getToken({
        _id: result.data.document._id,
        username: userName,
      });
      res.send({ status: "ok", data: { token: token } });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }
  // /register
  //takes a register request with body containing {username:string,password:string}
  //returns status ok, inserted id in data if successfull
  //returns status error on failure with msg in data
  public static async register(req: Request, res: Response): Promise<void> {
    const userName: string = req.body.username;
    const password: string = req.body.password;
    const phoneNumber: string = req.body.phoneNumber;
    const firstName: string = req.body.firstName;
    const lastName: string = req.body.lastName;
		const email: string = req.body.email;


    if (!userName || !password || !phoneNumber || !firstName || !lastName || !email) {
      res.send({ status: "error", data: "username, password, phone number, first name, last name, and email required" });
      return;
    }

    try {
      const hash: string = await SecUtils.createHash(password);

      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
      let result = await db.findOne("User", { username: userName });
      if (result.data.document) {
        res.send({ status: "error", data: "Username in use" });
        return;
      }
      let phoneResult = await db.findOne("User", { phoneNumber: phoneNumber });
      if (phoneResult.data.document) {
        res.send({ status: "error", data: "Phone number in use" });
        return;
      }
      const userRecord = {
        firstName: firstName,
        lastName: lastName,
        username: userName,
        password: hash,
        email: email,
        phoneNumber: phoneNumber,
        updateDate: new Date(),
        spotifyId: "",
        friendIds:[],
        reels: [],
        profilePic: null,
        bio: "",
      };
      result = await db.insert("User", userRecord);
      res.send({ status: "ok", data: result.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }
  // /changePwd
  //takes a changePwd request with body containing {password:string}
  //returns status ok, matchedcount and modified count in data if successful
  //returns status error on failure with msg in data
  //user populated by middleware.  This will not be called if token is invalid
  //we pull all other data from the token (including the id)
  public static async changePwd(req: Request, res: Response): Promise<void> {
    const user = req.body.user;
    const newPass = req.body.password;
    if (!user || !newPass) {
      res.send({ status: "error", data: "invalid request" });
      return;
    }
    const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
    try {
      const hash = await SecUtils.createHash(newPass);
      const userRecord = {
        username: user.username,
        password: hash,
        updateDate: new Date(),
      };
      const result = await db.update("User", user._id, userRecord);
      if (result.data.matchedCount > 0)
        res.send({ status: "ok", data: result.data });
      else
        res.send({
          status: "error",
          data: "Error updating password, record not found",
        });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }
}
