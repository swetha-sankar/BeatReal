import express from "express";
import { Config } from "../shared/config";
import axios, { AxiosRequestConfig } from "axios";
import { MongoAtlasDB } from "../shared/MongoAtlasDb";
import { Application } from "../shared/application";

export class ApiController {
  static baseURL: string = Config.databaseConfig.url;
  static apiKey: string = Config.databaseConfig.key;
  static data: any = {
    collection: "User",
    database: "BeatReal",
    dataSource: "Cluster0",
  };
  static config: AxiosRequestConfig = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": ApiController.apiKey,
    },
    data: null,
  };
  /*
  public static async getData(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const result = await db.find("itemlist", { hello: "world" });
      res.send({ status: "ok", result: result.data.documents });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }
  */

  public static async getUsers(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const result = await db.find("User", {});
      res.send({ status: "ok", result: result.data.documents });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  public static async getUserId(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const result = await db.find("User", {});
      res.send({ status: "ok", result: result.data.documents });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  public static async getUserFriends(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const result = await db.find("User", {});
      res.send({ status: "ok", result: result.data.documents });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  public static async getUserReels(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const result = await db.find("User", {});
      res.send({ status: "ok", result: result.data.documents });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  public static async getUserCurrReel(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const result = await db.find("User", {});
      res.send({ status: "ok", result: result.data.documents });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  /*
  //returns whatever you post to it.  You can use the contents of req.body to extract information being sent to the server
  static postHello(req: express.Request, res: express.Response): void {
    ApiController.config.url = ApiController.baseURL + "/action/insertOne";
    ApiController.config.data = { ...ApiController.data, document: req.body };
    axios(ApiController.config)
      .then((result) => res.send(result))
      .catch((err) => res.send(err));
  }
  */

  public static async postUser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const newUser = {
      FirstName: req.body.FirstName,
      LastName: req.body.LastName,
      PhoneNumber: req.body.PhoneNumber,
      Spotify: req.body.Spotify,
      Friends: req.body.Friends,
      Reels: req.body.Reels,
      Email: req.body.Email,
      ProfilePic: req.body.ProfilePic,
      Bio: req.body.Bio 
    };
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const result = await db.insert("User", newUser);
      res.send({ status: "ok", data: result.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  public static async deleteUser(req: express.Request, res: express.Response) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const result = await db.deleteOne("User", req.body._id);
      res.send({ status: "ok", data: result.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  public static async postReel(req: express.Request, res: express.Response) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      //const grabUser = await db.findOne('User', req.body._id);

      const reel = {
        PosterID: req.body._id,
        Date: "",
        Time: "",
        Likes: [],
        Comments: [],
      };

      let result = await db.insert("Reel", reel);
      console.log(result.data.insertedId);

      result = await db.find("Reel", { "_id": {"$oid": result.data.insertedId} });
      console.log(result.data);

      const user = {
        Reels: [...req.body.Reels, result.data],
      };

      result = await db.update("User", req.body._id, user);

      //let userReplacement = JSON.parse(JSON.stringify(grabUser.data.documents));
      //console.log(userReplacement);
      //const length: number = userReplacement.Reels.length;
      //userReplacement.Reels.splice(length-1, 0, reel);
      //const result = await db.update('User', req.body._id, user);
      //const result = await db.find('User', {});

      res.send({ status: "ok", data: result.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  // Will most definitely be changed as Reels will be embedded in users
  // and we need to figure out how to access data from database rather than just using
  // Postman to input JSON data.
  public static async unlikeReel(req: express.Request, res: express.Response) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const unlike = [...req.body.likes];
      unlike.filter((userId) => userId == req.body.userId);

      const newObj = { ...req.body, likes: unlike };

      const result = await db.update("Reel", req.body.ReelId, newObj);

      res.send({ status: "ok", data: result.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }
}
