import express from "express";

const client_id = "3ecc3a4b5b974d02a9b9e12b7f2ace9b";
const redirect_uri = "http://localhost:3000/BeatReal";

const AUTH_URL = `https://accounts.spotify.com/authorize?cliend_id=3ecc3a4b5b974d02a9b9e12b7f2ace9b
&response_type=&redirect_uri=http://localhost:3000/BeatReal&scope=streaming%20user-read-email
%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

var app = express();

app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  var scope = `streaming user-read-email user-read-private user-library-read user-library-modify
   user-read-playback-state user-modify-playback-state`;

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});
