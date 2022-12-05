import express from "express";
import { Config } from "../shared/config";
import { AxiosRequestConfig } from "axios";
import { MongoAtlasDB } from "../shared/MongoAtlasDb";
import { ObjectId } from "mongodb";
import { Post, Reel, User } from "../types/types";
import { BRComment } from "../types/brcomment";

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

  /**
   * @param req : GET REQUEST, NO BODY
   * @param res : USER[]
   */
  public static async getUsers(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
      const result: User[] = (await db.find("User", {})).data.documents;
      res.send({ status: "ok", result: result });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  /**
   * @param req : get request, doesn't have a body, id is stored in uri
   * @param res : User
   */
  public static async getUserId(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
      const result: User = (
        await db.findOne("User", { _id: { $oid: req.params.id } })
      ).data.document;
      res.send({ status: "ok", result: result });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  /**
   * @param req : get request, doesn't have a body, id is stored in uri
   * @param res : User[] - their friends
   */
  public static async getUserFriends(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const user: User = (
        await db.findOne("User", { _id: { $oid: req.params.id } })
      ).data.document;
      const mappedUserIds = user.friendIds.map((userId: String) => {
        return {
          $oid: userId,
        };
      });
      const result: User[] = (
        await db.find("User", {
          _id: { $in: mappedUserIds },
        })
      ).data.documents;
      res.send({ status: "ok", result: result });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  /**
   * Returns all reels posted by user
   * @param req - Get request, no body.
   * @param res - Reel[]
   */
  public static async getUserReels(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const user: User = (
        await db.findOne("User", { _id: { $oid: req.params.id } })
      ).data.document;
      res.send({ status: "ok", result: user.reels });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  /**
   *
   * @param req get request, no body
   * @param res - Reel[]
   */
  public static async getUserFeed(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const user: User = (
        await db.findOne("User", { _id: { $oid: req.params.id } })
      ).data.document;
      const mappedUserIds = user.friendIds.map((userId: String) => {
        return {
          $oid: userId,
        };
      });
      const friends: User[] = (
        await db.find("User", {
          _id: { $in: mappedUserIds },
        })
      ).data.documents;

      const friendPosts: Post[] = friends.map((user: User) => ({
        posterId: user.reels.posterId,
        profilePic: user.profilePic,
        username: user.userName,
        reel: user.reels[user.reels.length - 1],
      }));

      res.send({ status: "ok", result: friendReels });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  /**
   *
   * @param req
   * @param res - Reel
   */
  public static async getUserCurrReel(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const user: User = (
        await db.findOne("User", { _id: { $oid: req.params.id } })
      ).data.document;

      res.send({
        status: "ok",
        result: user.reels[user.reels.length - 1],
      });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  //   /**
  //    *
  //    * @param req -  POST request, JSON body
  //    * {
  //     firstName: string,
  //     lastName: string,
  //     phoneNumber: string,
  //     spotifyId: string,
  //     friendIds: string[],
  //     reels: Reel[],
  //     email: string,
  //     profilePic: string | null,
  //     bio: string
  //     }
  //    * @param res - User
  //    */
  //   public static async postUser(
  //     req: express.Request,
  //     res: express.Response
  //   ): Promise<void> {
  //     const newUser = {
  //       firstName: req.body.firstName,
  //       lastName: req.body.lastName,
  //       phoneNumber: req.body.phoneNumber,
  //       spotifyId: req.body.spotifyId,
  //       friendIds: req.body.friendIds,
  //       reels: req.body.reels,
  //       email: req.body.email,
  //       profilePic: req.body.profilePic,
  //       bio: req.body.bio,
  //     };
  //     try {
  //       const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

  //       const result = await db.insert("User", newUser);
  //       res.send({ status: "ok", data: result.data });
  //     } catch (e) {
  //       console.error(e);
  //       res.send({ status: "error", data: e });
  //     }
  //   }

  /**
   *
   * @param req - PATCH request, JSON body
   * {
   * posterId: string,
   * songId: string
   * }
   * @param res - User with reels updated
   */
  public static async patchReel(req: express.Request, res: express.Response) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      let reelOID = new ObjectId();
      let datetime = new Date();

      const reel = {
        _id: reelOID,
        posterId: req.body.posterId,
        songId: req.body.songId,
        date: datetime.toLocaleDateString(),
        time: datetime.toLocaleTimeString(),
        likes: [], //likes and comments start at 0
        comments: [],
      };

      const userResult = await db.findOne("User", {
        _id: { $oid: req.body.posterId },
      });
      const appendedReel = userResult.data.document.reels.concat(reel);

      const userUpdated = {
        firstName: userResult.data.document.firstName,
        lastName: userResult.data.document.lastName,
        phoneNumber: userResult.data.document.phoneNumber,
        spotifyId: userResult.data.document.spotifyId,
        friendIds: userResult.data.document.friendIds,
        reels: appendedReel,
        email: userResult.data.document.email,
        profilePic: userResult.data.document.profilePic,
        bio: userResult.data.document.bio,
      };

      let result = await db.update("User", req.body.posterId, userUpdated);
      res.send({ status: "ok", data: result.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  /**
   * 
   * @param req - id in URL and PUT request, JSON body
   * {
    firstName: string,
    lastName: string,
    phoneNumber: string,
    spotifyId: string,
    friendIds: string[],
    reels: Reel[],
    email: string,
    profilePic: string | null,
    bio: string
    }
   * @param res - User - new or updated
   */
  public static async putUser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    const newFields = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      spotifyId: req.body.spotifyId,
      friendIds: req.body.friendIds,
      reels: req.body.reels,
      email: req.body.email,
      profilePic: req.body.profilePic,
      bio: req.body.bio,
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

  /**
   *
   * @param req - :posterId/:reelId/:likerId in URL and PUT request, no body
   * @param res - User with reel likes updated
   */
  public static async putLike(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
      const userResult = await db.findOne("User", {
        _id: { $oid: req.params.posterId },
      });
      const reel = userResult.data.document.Reels.find(
        (reel: any) => reel._id == req.params.reelId
      );
      const appendedLikes = reel.likes.concat(req.params.likerId);

      const reelUpdated = {
        posterId: reel.posterId,
        songId: reel.songId,
        date: reel.date,
        time: reel.time,
        likes: appendedLikes,
        comments: reel.comments,
      };

      const userUpdated = {
        firstName: userResult.data.document.firstName,
        lastName: userResult.data.document.lastName,
        phoneNumber: userResult.data.document.phoneNumber,
        spotifyId: userResult.data.document.spotifyId,
        friendIds: userResult.data.document.friendIds,
        reels: reelUpdated,
        email: userResult.data.document.email,
        profilePic: userResult.data.document.profilePic,
        bio: userResult.data.document.bio,
      };

      const putResult = await db.update(
        "User",
        req.params.posterId,
        userUpdated
      );
      res.send({ status: "ok", data: putResult.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  //deletes a user from Collections
  //JSON body requires: "_id": "string", this will be the user to be deleted
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

  // JSON Body requires: userId and ReelId
  // userId is the user of which the reel will be removed
  // and reelId is the reel to be removed
  public static async deleteReel(req: express.Request, res: express.Response) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
      //let result = await db.deleteOne('User', req.body.reelId);
      let result: User = (
        await db.findOne("User", { _id: { $oid: req.body.userId } })
      ).data.document;
      let updatedReels: Reel[] = [...result.reels];
      updatedReels = updatedReels.filter(
        (element: any) => element._id !== req.body.reelId
      );
      let user: User = {
        firstName: result.firstName,
        lastName: result.lastName,
        phoneNumber: result.phoneNumber,
        spotifyId: result.spotifyId,
        friendIds: result.friendIds,
        reels: updatedReels,
        email: result.email,
        profilePic: result.profilePic,
        bio: result.bio,
      };
      result = await db.update("User", req.body.userId, user);
      res.send({ status: "ok", data: result });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }

  /*
   * req: { userId: string, reelId: string, commentId: string }
   * res: Nothing
   *
   * This method will delete a comment but jSON body needs the comment's id, parent reel id,
   * and userId of that reel
   */
  public static async deleteComment(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
      let response = await db.findOne("User", {
        _id: { $oid: req.body.userId },
      });
      let user: User = response.data.document;
      console.log("Hello");
      let reelsList: Reel[] = [...user.reels];
      const findReel: Reel[] = reelsList.filter(
        (reel: Reel) => req.body.reelId === reel._id
      );
      let currentReel: Reel = findReel[0];
      let updatedComments: BRComment[] = currentReel.comments.filter(
        (comment: BRComment) => req.body.commentId !== comment._id
      );
      currentReel.comments = updatedComments;
      reelsList = reelsList.map((element: Reel) => {
        if (element._id === currentReel._id) {
          return currentReel;
        } else {
          return element;
        }
      });
      console.log("Hello2");
      const updateUser: User = {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        spotifyId: user.spotifyId,
        friendIds: user.friendIds,
        reels: reelsList,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
      };
      console.log("Hello3");
      response = await db.update("User", req.body.userId, updateUser);
      res.send({ status: "ok", data: response.data });
    } catch (e) {
      res.send({ status: "error", data: e });
    }
  }

  /**
   *:@param req: { posterId: string, postId: string, commenterId: string, textContent: string}
   * @param res: Nothing
   */
  public static async commentReel(req: express.Request, res: express.Response) {
    try {
      const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");

      const response = await db.findOne("User", {
        _id: { $oid: req.body.posterId },
      });
      let user: User = response.data.document;
      let commentOID = new ObjectId();

      const reelsWithComment: Reel[] = user.reels.map((reel: Reel) => {
        if (req.body.postId == reel._id) {
          const newComments = [
            ...reel.comments,
            {
              _id: commentOID,
              commenterId: req.body.commenterId as string,
              textContent: req.body.textContent as string,
            } as BRComment,
          ];
          return { ...reel, comments: newComments };
        }
        return reel;
      });

      /* const userUpdated = {
				...user,
				reels: reelsWithComment,
			}; */

      const userUpdated = {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        spotifyId: user.spotifyId,
        friendIds: user.friendIds,
        reels: reelsWithComment,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
      };

      let result = await db.update("User", req.body.posterId, userUpdated);
      res.send({ status: "ok", data: response.data });
    } catch (e) {
      console.error(e);
      res.send({ status: "error", data: e });
    }
  }
}
