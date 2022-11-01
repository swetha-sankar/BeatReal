import express from "express";
import { Config } from "../shared/config";
import axios, { AxiosRequestConfig } from "axios";
import { MongoAtlasDB } from "../shared/MongoAtlasDb";
import { Application } from "../shared/application";
import { ObjectId } from "mongodb";

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
      const result = await db.findOne("User", { _id: { $oid: req.params.id } });
      res.send({ status: "ok", result: result.data.document });
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

      const user = await db.findOne("User", { _id: { $oid: req.params.id } });
      const mappedUserIds = user.data.document.Friends.map((userId: String) => {
        return {
          $oid: userId,
        };
      });
      const result = await db.find("User", {
        _id: { $in: mappedUserIds },
      });
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

      const result = await db.findOne("User", { _id: { $oid: req.params.id } });
      res.send({ status: "ok", result: result.data.document.Reels });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  public static async getUserFriendReels(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const user = await db.findOne("User", { _id: { $oid: req.params.id } });
      const mappedUserIds = user.data.document.Friends.map((userId: String) => {
        return {
          $oid: userId,
        };
      });
      const result = await db.find("User", {
        _id: { $in: mappedUserIds },
      });

      // REPLACE WITH TYPE INTERFACE LATER
      const friendReels = result.data.documents
        .map((user: any) => user.Reels)
        .flat();

      res.send({ status: "ok", result: friendReels });
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

      const result = await db.findOne("User", { _id: { $oid: req.params.id } });

      res.send({
        status: "ok",
        result:
          result.data.document.Reels[result.data.document.Reels.length - 1],
      });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

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

  public static async postReel(req: express.Request, res: express.Response) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const reel = {
        PosterID: req.body.PosterID,
        Date: req.body.Date,
        Time: req.body.Time,
        Likes: req.body.Likes,
        Comments: req.body.Comments
      }
      /*
      let oid = new ObjectId();

      const reel = {
        _id: oid,
        PosterID: req.body._id,
        Date: "",
        Time: "",
        Likes: [],
        Comments: [],
      };

      const user = {
        Reels: [...req.body.Reels, reel],
      };

      */

      const userResult = await db.findOne("User", { _id: { $oid: req.body.PosterID } });
      const appendedReel = userResult.data.document.Reels.concat(reel);
      
      let result = await db.update("User", req.body.PosterID, {"Reels" : appendedReel});
      res.send({ status: "ok", data: result.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  public static async putUser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const newFields = {
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
      var putResult;

      //if can't find it in the db insert it, otherwise update it
      try {
        const findResult=await db.findOne("User", { _id: { $oid: req.params.id } });
        putResult = db.update("User", req.params.id, newFields);
      } catch (e) {
        putResult = await db.insert("User", newFields); //this.postReel(req,res);
      }

      res.send({ status: "ok", data: putResult.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  public static async putLike(
    req: express.Request,
    res: express.Response
  ): Promise<void> {

    //not done yet, going to look at ethan's push of silbers solution to unlike reel
    /* 
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
      const findReel=await db.findOne("User", { "Reels.reelID" : req.params.reelid});
        
      const putResult = db.update("User", req.params.reelid, Reels[req.params.likerid]);

      res.send({ status: "ok", data: putResult.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
    */
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
