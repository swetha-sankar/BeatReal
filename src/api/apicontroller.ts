import express from "express";
import { Config } from "../shared/config";
import { AxiosRequestConfig } from "axios";
import { MongoAtlasDB } from "../shared/MongoAtlasDb";
import { Post, Reel, User } from "../types/types";
import { BRComment } from "../types/brcomment";
import crypto from "crypto";

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
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);
			const result: User[] = (await db.find("User", {})).data.documents;
			res.send({ status: "ok", result: result });
		} catch (e) {
			console.error(e);
			res.send({ status: "error", data: e });
		}
	}

	/**
	 * @param req : get request, doesn't have a body, username is stored in uri
	 * @param res : User
	 */
	public static async getUserName(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);
			const result: User = (
				await db.findOne("User", { username: req.params.username })
			).data.document;
			res.send({ status: "ok", result: result });
		} catch (e) {
			console.error(e);
			res.send({ status: "error", data: e });
		}
	}

	/**
	 * @param req : get request, doesn't have a body, username is stored in uri
	 * @param res : User[] - their friends
	 */
	public static async getUserFriends(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const user: User = (
				await db.findOne("User", { username: req.params.username })
			).data.document;
			const result: User[] = (
				await db.find("User", { username: { $in: user.friendNames } })
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
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const user: User = (
				await db.findOne("User", { username: req.params.username })
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
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const user: User = (
				await db.findOne("User", { username: req.params.username })
			).data.document;

			const friends: User[] = (
				await db.find("User", { username: { $in: user.friendNames } })
			).data.documents;

			const friendPosts: Post[] = friends.map((user: User) => ({
				username: user.username,
				profilePic: user.profilePic,
				reel: user.reels[user.reels.length - 1],
			}));

			res.send({ status: "ok", result: friendPosts });
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
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const user: User = (
				await db.findOne("User", { username: req.params.username })
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

	/*
	 * req: { username: string, friendName: string }
	 * res: Nothing
	 *
	 */
	public static async addFriend(req: express.Request, res: express.Response) {
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const user: User = (
				await db.findOne("User", {
					username: req.body.username,
				})
			).data.document;

			const updatedUser: User = {
				...user,
				friendNames: [...user.friendNames, req.body.friendName],
			};

			delete updatedUser._id;

			const response = await db.update(
				"User",
				{ username: req.body.username },
				updatedUser
			);
			res.send({ status: "ok", data: response.data });
		} catch (e) {
			res.send({ status: "error", data: e });
		}
	}

	/*
	 * req: { username: string, friendName: string }
	 * res: Nothing
	 */
	public static async removeFriend(
		req: express.Request,
		res: express.Response
	) {
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const user: User = (
				await db.findOne("User", {
					username: req.body.username,
				})
			).data.document;

			const filteredFriends = user.friendNames.filter(
				(username: string) => username !== req.body.friendName
			);

			const updatedUser: User = {
				...user,
				friendNames: filteredFriends,
			};

			delete updatedUser._id;

			const response = await db.update(
				"User",
				{ username: req.body.username },
				updatedUser
			);
			res.send({ status: "ok", data: response.data });
		} catch (e) {
			res.send({ status: "error", data: e });
		}
	}

	/**
	 *
	 * @param req - PATCH request, JSON body
	 * {
	 * posterName: string,
	 * songId: string
	 * }
	 * @param res - User with reels updated
	 */
	public static async patchReel(req: express.Request, res: express.Response) {
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			let reelOID = crypto.randomUUID();
			let datetime = new Date();

			const reel: Reel = {
				reelId: reelOID,
				posterName: req.body.posterName,
				songId: req.body.songId,
				date: datetime,
				likes: [], //likes and comments start at 0
				comments: [],
			};

			const user: User = (
				await db.findOne("User", { username: req.body.posterName })
			).data.document;

			const appendedReel = [...user.reels, reel];

			const userUpdated: User = {
				...user,
				reels: appendedReel,
			};

			delete userUpdated._id;

			let result = await db.update(
				"User",
				{ username: req.body.posterName },
				userUpdated
			);
			res.send({ status: "ok", data: result.data });
		} catch (e) {
			console.error(e);
			res.send({ status: "error", data: e });
		}
	}

	/**
   * 
   * @param req - JSON body is a User type excluding passowrk
   * {
    oldUserName: req.body.oldUserName,
    newUserName: req.body.newUserName,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    // spotifyId: string,
    email: string,
    profilePic: string | null,
    bio: string
    }
   * @param res - User - new or updated
   */
	public static async patchUser(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		const newFields = {
			username: req.body.newUserName,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phoneNumber: req.body.phoneNumber,
			// spotifyId: req.body.spotifyId,
			email: req.body.email,
			profilePic: req.body.profilePic,
			bio: req.body.bio,
		};
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const usernameInUse = await db.findOne("User", {
				username: req.body.newUserName,
			});
			if (usernameInUse.data.document) {
				throw "Username in use";
			}

			const user: User = (
				await db.findOne("User", { username: req.body.oldUserName })
			).data.document;

			const patchedReels: Reel[] = user.reels.map((reel: Reel) => ({
				...reel,
				posterName: newFields.username,
			}));

			const patchedUser: User = {
				...user,
				...newFields,
				reels: patchedReels,
			};

			delete patchedUser._id;

			let result = await db.update(
				"User",
				{ username: req.body.oldUserName },
				patchedUser
			);
			res.send({ status: "ok", data: result.data });
		} catch (e) {
			console.error(e);
			res.send({ status: "error", data: e });
		}
	}

	/**
	 *
	 * @param req -
	 * {
	 *  posterName: string,
	 *  reelId: string,
	 *  likerName: string
	 * }
	 * @param res - User with reel likes updated
	 */
	public static async putLike(
		req: express.Request,
		res: express.Response
	): Promise<void> {
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);
			if (req.body.likerName == null) {
				throw "Liker name not defined, fill out likerName";
			}

			const user: User = (
				await db.findOne("User", {
					username: req.body.posterName,
				})
			).data.document;

			const reelsUpdated = user.reels.map((reel: Reel) => {
				if (reel.reelId === req.body.reelId) {
					// remove disliker name
					if (req.body.likerName in reel.likes) {
						return reel;
					}
					const appendedLikes: string[] = [
						...reel.likes,
						req.body.likerName,
					];

					const reelUpdated = {
						...reel,
						likes: appendedLikes,
					};
					return reelUpdated;
				} else {
					return reel;
				}
			});

			const userUpdated = {
				...user,
				reels: reelsUpdated,
			};

			delete userUpdated._id;

			const result = await db.update(
				"User",
				{ username: req.body.posterName },
				userUpdated
			);
			res.send({ status: "ok", data: result.data });
		} catch (e) {
			console.error(e);
			res.send({ status: "error", data: e });
		}
	}

	/**
	 *
	 * @param req -
	 * {
	 *  username: string
	 * }
	 * @param res
	 */
	public static async deleteUser(
		req: express.Request,
		res: express.Response
	) {
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const result = await db.deleteOne("User", {
				username: req.body.username,
			});
			res.send({ status: "ok", data: result.data });
		} catch (e) {
			console.error(e);
			res.send({ status: "error", data: e });
		}
	}

	/**
	 *
	 * @param req -
	 * {
	 *  posterName: string,
	 *  reelId: string,
	 *  dislikerName: string
	 * }
	 * @param res - User with reel likes updated
	 */
	public static async unlikeReel(
		req: express.Request,
		res: express.Response
	) {
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);
			const user: User = (
				await db.findOne("User", {
					username: req.body.posterName,
				})
			).data.document;

			const reelsUpdated = user.reels.map((reel: Reel) => {
				if (reel.reelId === req.body.reelId) {
					// remove disliker name
					const removedLikes = reel.likes.filter(
						(username: string) => username !== req.body.dislikerName
					);

					const reelUpdated = {
						...reel,
						likes: removedLikes,
					};
					return reelUpdated;
				} else {
					return reel;
				}
			});

			const userUpdated = {
				...user,
				reels: reelsUpdated,
			};

			delete userUpdated._id;

			const result = await db.update(
				"User",
				{ username: req.body.posterName },
				userUpdated
			);
			res.send({ status: "ok", data: result.data });
		} catch (e) {
			console.error(e);
			res.send({ status: "error", data: e });
		}
	}

	/**
	 *
	 * @param req -
	 * {
	 *  username: string
	 *  reelId: string
	 * }
	 * @param res
	 */
	public static async deleteReel(
		req: express.Request,
		res: express.Response
	) {
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const user: User = (
				await db.findOne("User", { username: req.body.username })
			).data.document;

			const reelsUpdated: Reel[] = user.reels.filter(
				(reel: Reel) => reel.reelId !== req.body.reelId
			);

			const updatedUser: User = {
				...user,
				reels: reelsUpdated,
			};

			delete updatedUser._id;

			const result = await db.update(
				"User",
				{ username: req.body.username },
				updatedUser
			);
			res.send({ status: "ok", data: result.data });
		} catch (e) {
			console.error(e);
			res.send({ status: "error", data: e });
		}
	}

	/*
	 * req: { username: string, reelId: string, commentId: string }
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
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const user: User = (
				await db.findOne("User", {
					username: req.body.posterName,
				})
			).data.document;

			const reelsUpdated: Reel[] = user.reels.map((reel: Reel) => {
				if (reel.reelId === req.body.reelId) {
					const removedComments = reel.comments.filter(
						(comment: BRComment) =>
							comment.commentId !== req.body.commentId
					);

					const reelUpdated = {
						...reel,
						comments: removedComments,
					};
					return reelUpdated;
				} else {
					return reel;
				}
			});

			const updatedUser: User = {
				...user,
				reels: reelsUpdated,
			};

			delete updatedUser._id;

			const response = await db.update(
				"User",
				{ username: req.body.username },
				updatedUser
			);
			res.send({ status: "ok", data: response.data });
		} catch (e) {
			res.send({ status: "error", data: e });
		}
	}

	/**
	 *:@param req: { posterName: string, reelId: string, commenterName: string, textContent: string}
	 * @param res: Nothing
	 */
	public static async commentReel(
		req: express.Request,
		res: express.Response
	) {
		try {
			const db = new MongoAtlasDB(
				Config.databaseConfig.dataSource,
				"BeatReal"
			);

			const user: User = (
				await db.findOne("User", {
					username: req.body.posterName,
				})
			).data.document;

			const reelsUpdated: Reel[] = user.reels.map((reel: Reel) => {
				if (reel.reelId === req.body.reelId) {
					const newComment: BRComment = {
						commentId: crypto.randomUUID(),
						commenterName: req.body.commenterName,
						textContent: req.body.textContent,
					};
					const addedComments = [...reel.comments, newComment];

					const reelUpdated = {
						...reel,
						comments: addedComments,
					};
					return reelUpdated;
				} else {
					return reel;
				}
			});

			const updatedUser: User = {
				...user,
				reels: reelsUpdated,
			};

			delete updatedUser._id;

			const response = await db.update(
				"User",
				{ username: req.body.posterName },
				updatedUser
			);
			res.send({ status: "ok", data: response.data });
		} catch (e) {
			console.error(e);
			res.send({ status: "error", data: e });
		}
	}
}
