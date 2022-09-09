require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: "9f53ac8b0fae425f8b6705189af4039a",//process.env.CLIENT_ID,
    clientSecret: "28793167a50748e0a46522cf40334b76" //process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/artist-search", (request, response) => {
    spotifyApi.searchArtists(request.query.artist)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    response.render("artist-search", {
        artist: request.query.artist,
        result: data.body.artists.items,
    });
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get("/albums/:artistId", (request, response) => {
    spotifyApi.getArtistAlbums(request.params.artistId)
            .then(result => {
                //console.log(result.body.items);
                response.render("albums", {
                    albums: result.body.items,
                })
            })
            .catch(error => {
                console.log(error);
                response.render("error", {
                    message: "Something went wrong",
                })
            })
})

app.get("/tracks/:albumId", (request, response) => {
    spotifyApi.getAlbumTracks(request.params.albumId)
            .then(result => {
                console.log(result.body.items);
                response.render("tracks", {
                    tracks: result.body.items,
                })
            })
            .catch(error => {
                console.log(error);
                response.render("error", {
                    message: "Something went wrong",
                })
            })
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
