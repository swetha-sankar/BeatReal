import express from "express";
import { Config } from "../shared/config";
import { AxiosRequestConfig } from "axios";
import { MongoAtlasDB } from "../shared/MongoAtlasDb";
import { ObjectId } from "mongodb";
import { User } from "../types/types";
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
      Bio: req.body.Bio,
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

  public static async patchReel(req: express.Request, res: express.Response) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      let reelOID = new ObjectId();
      let datetime = new Date();

      const reel = {
        _id: reelOID,
        PosterID: req.body.PosterID,
        Song: req.body.Song,
        Date: datetime.toLocaleDateString(),
        Time: datetime.toLocaleTimeString(),
        Likes: [], //likes and comments start at 0
        Comments: [],
      };

      const userResult = await db.findOne("User", {
        _id: { $oid: req.body.PosterID },
      });
      const appendedReel = userResult.data.document.Reels.concat(reel);

      const userUpdated = {
        FirstName: userResult.data.document.FirstName,
        LastName: userResult.data.document.LastName,
        PhoneNumber: userResult.data.document.PhoneNumber,
        Spotify: userResult.data.document.Spotify,
        Friends: userResult.data.document.Friends,
        Reels: appendedReel,
        Email: userResult.data.document.Email,
        ProfilePic: userResult.data.document.ProfilePic,
        Bio: userResult.data.document.Bio,
      };

      let result = await db.update("User", req.body.PosterID, userUpdated);
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
      Bio: req.body.Bio,
    };
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
      var putResult;

      //if can't find it in the db insert it, otherwise update it
      try {
        const findResult = await db.findOne("User", {
          _id: { $oid: req.params.id },
        });
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
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
      const userResult = await db.findOne("User", {
        _id: { $oid: req.params.posterid },
      });
      const reel = userResult.data.document.Reels.find(
        (reel: any) => reel._id == req.params.reelid
      );
      const appendedLikes = reel.likes.concat(req.params.likerid);

      const reelUpdated = {
        PosterID: reel.PosterID,
        Date: reel.Date,
        Time: reel.Time,
        Likes: appendedLikes,
        Comments: reel.Comments,
      };

      const userUpdated = {
        FirstName: userResult.data.document.FirstName,
        LastName: userResult.data.document.LastName,
        PhoneNumber: userResult.data.document.PhoneNumber,
        Spotify: userResult.data.document.Spotify,
        Friends: userResult.data.document.Friends,
        Reels: reelUpdated,
        Email: userResult.data.document.Email,
        ProfilePic: userResult.data.document.ProfilePic,
        Bio: userResult.data.document.Bio,
      };

      const putResult = await db.update(
        "User",
        req.params.posterid,
        userUpdated
      );
      res.send({ status: "ok", data: putResult.data });
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

  // Body requires: userId and ReelId
  // will remove a reel from a user by finding that user, finding that reel, and
  // then filtering out that reel from the reels list
  public static async deleteReel(req: express.Request, res: express.Response) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
      //let result = await db.deleteOne('User', req.body.reelId);
      let result = await db.findOne("User", { _id: { $oid: req.body.userId } });

      let updatedReels = [...result.data.document.Reels];
      updatedReels = updatedReels.filter(
        (element: any) => element._id !== req.body.reelId
      );
      let user = {
        Reels: updatedReels,
      };
      result = await db.update("User", req.body.userId, user);
      res.send({ status: "ok", data: result.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  /**
   * {userid: GUID, textContent: nvarchar}
   * @param req
   * @param res
   */
  public static async commentReel(req: express.Request, res: express.Response) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const userResult = await db.findOne("User", {
        _id: { $oid: req.body.PosterID },
      });
      const reelsWithComment = userResult.data.document.Reels.map(
        (reel: any) => {
          if (req.body.ReelID == reel._id) {
            const newComments = [
              ...reel.comments,
              { userid: req.body.UserID, textContent: req.body.Comment },
            ];
            return { ...reel, comments: newComments };
          }
          return reel;
        }
      );

      const userUpdated = {
        FirstName: userResult.data.document.FirstName,
        LastName: userResult.data.document.LastName,
        PhoneNumber: userResult.data.document.PhoneNumber,
        Spotify: userResult.data.document.Spotify,
        Friends: userResult.data.document.Friends,
        Reels: reelsWithComment,
        Email: userResult.data.document.Email,
        ProfilePic: userResult.data.document.ProfilePic,
        Bio: userResult.data.document.Bio,
      };

      let result = await db.update("User", req.body.UserID, userUpdated);
      res.send({ status: "ok", data: result.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }
}
