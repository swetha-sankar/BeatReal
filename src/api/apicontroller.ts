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
      const db = new MongoAtlasDB(
        Config.databaseConfig.dataSource,
        "BeatReal"
      );

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
      const db = new MongoAtlasDB(
        Config.databaseConfig.dataSource,
        "BeatReal"
      );

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
      const db = new MongoAtlasDB(
        Config.databaseConfig.dataSource,
        "BeatReal"
      );

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
      const db = new MongoAtlasDB(
        Config.databaseConfig.dataSource,
        "BeatReal"
      );

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
      const db = new MongoAtlasDB(
        Config.databaseConfig.dataSource,
        "BeatReal"
      );

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
      const db = new MongoAtlasDB(
        Config.databaseConfig.dataSource,
        "BeatReal"
      );

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
    console.log("inside postUser");
    try {
      const db = new MongoAtlasDB(
        Config.databaseConfig.dataSource,
        "BeatReal"
      );

      const exampleUser = {
        FirstName: "testing",
        LastName: "testing",
        PhoneNumber: "11111111",
        Spotify: 1,
        Friends: [2,3],
        Reels: [],
        Email: "testing@gmail.com",
        ProfilePic: null,
        Bio: "example bio" 
      };

      const result = await db.insert('User', exampleUser);
      res.send({ status: "ok", data: result.data});
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  public static async deleteUser(req: express.Request, res: express.Response){
    try {
      const db = new MongoAtlasDB(
        Config.databaseConfig.dataSource,
        "BeatReal"
      );

      const result = await db.deleteOne('User', req.body._id);
      res.send({ status: "ok", data: result.data});
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }
}
