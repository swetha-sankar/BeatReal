import express from "express";
import { Config } from "../shared/config";
import axios, { AxiosRequestConfig } from "axios";
import { MongoAtlasDB } from "../shared/MongoAtlasDb";
import querystring from "query-string";
// import fetch from "node-fetch";
import { URLSearchParams } from "url";


function makeid(length: number) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// const AUTH_URL: string = `https://accounts.spotify.com/authorize?client_id=3ecc3a4b5b974d02a9b9e12b7f2ace9b
//   &response_type=code&redirect_uri=http://localhost:3000/api/hello&scope=streaming%20user-read-email
//   %20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

export class SpotifyController {
  //   static baseURL: string = Config.databaseConfig.url;
  //   static apiKey: string = Config.databaseConfig.key;
  //   static data: any = {
  //     collection: "User",
  //     database: "BeatReal",
  //     dataSource: "Cluster0",
  //   };
  //   static config: AxiosRequestConfig = {
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Access-Control-Request-Headers": "*",
  //       "api-key": ApiController.apiKey,
  //     },
  //     data: null,
  //   };


  static login(req: express.Request, res: express.Response): void {
    let state = makeid(16);
    let scope = `streaming user-read-email user-read-private user-library-read user-library-modify
    user-read-playback-state user-modify-playback-state`;

    // res.send({ status: "ok", result: authorize_url });

    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: process.env.spotifyClientID
            ? process.env.spotifyClientID
            : "",
          scope: scope,
          redirect_uri: "http://localhost:3000/spotify/callback",
          // redirect_uri: process.env.spotifyRedirectURI
          //   ? process.env.spotifyRedirectURI
          //   : "",
          state: state,
          show_dialog: true, //false(by default). Whether or not to force the user to approve the app again if they’ve already done so
        })
    );
  }

    public static async link(req: express.Request, res: express.Response): Promise<void> {
      try {
        const db = new MongoAtlasDB(Config.databaseConfig.dataSource, "BeatReal");
        const userResult = await db.findOne("User", {
          _id: { $oid: req.params.posterId },
        });
  
        const userUpdated = {
          firstName: userResult.data.document.firstName,
          lastName: userResult.data.document.lastName,
          phoneNumber: userResult.data.document.phoneNumber,
          spotifyId: req.params.spotifyid,
          friendIds: userResult.data.document.friendIds,
          reels: userResult.data.document.reels,
          email: userResult.data.document.email,
          profilePic: userResult.data.document.profilePic,
          bio: userResult.data.document.bio
        };
        const putResult = await db.update(
          "User",
          req.params.userid,
          userUpdated
        );
        res.send({ status: "ok", data: putResult.data });
      } catch (e) {
        console.error(e);
        res.send({ status: "error", data: e });
      }
    };

  //Callback api from the redirect of login (in front-end)
  //Redirects to desired front end page
  static async callback(req: express.Request, res: express.Response): Promise<void> {
    console.log("callback req: " + JSON.stringify(req.query, null, 2));
    let code = req.query.code || null;
    let state = req.query.state || null;

    if (state === null) {
      console.log("error: state is null... handle later");
      // res.redirect('/#' +
      //   querystring.stringify({
      //     error: 'state_mismatch'
      //   }));
    } else {
      // let authOptions = {
      //   url: 'https://accounts.spotify.com/api/token',
      //   form: {
      //     code: code,
      //     redirect_uri: process.env.spotifyRedirectURI,
      //     grant_type: 'authorization_code'
      //   },
      //   headers: {
      //     'Authorization': 'Basic ' + (Buffer.from(process.env.spotifyClientID + ':' + process.env.spotifyClientSecret).toString('base64'))
      //   },
      //   json: true
      // };
      // console.log(authOptions);

      try {
        
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', `${code}`);
        params.append('redirect_uri', 'http://localhost:3000/spotify/callback');

        const response = await axios.post('https://accounts.spotify.com/api/token',
        params.toString(),
        //`grant_type=authorization_code&code=${code}&redirect_uri=http://localhost:3000/spotify/callback}`,
        {headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (Buffer.from(process.env.spotifyClientID + ':' + process.env.spotifyClientSecret).toString('base64'))
        }})
        console.log('access token: ' + response.data.access_token);

        const redirectParams = new URLSearchParams();
        redirectParams.append('access_token', `${response.data.access_token}`);
        redirectParams.append('token_type', `${response.data.token_type}`);
        redirectParams.append('scope', `${response.data.scope}`);
        redirectParams.append('expires_in', `${response.data.expires_in}`)
        redirectParams.append('refresh_token', `${response.data.refresh_token}`)
        res.redirect(`http://localhost:4200/feed?${redirectParams.toString()}`);

      } catch(e) {
        console.log(e);
        res.redirect('http://localhost:4200');
      }

      // ('https://accounts.spotify.com/api/token', {
      //   method: 'POST', 
      //   headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded',
      //     'Authorization': 'Basic ' + (Buffer.from(process.env.spotifyClientID + ':' + process.env.spotifyClientSecret).toString('base64'))
      //   },
      //   body: `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.spotifyRedirectURI}`
      // }).then(result => result.json()).then(data => console.log(data))
    }
  }
};
