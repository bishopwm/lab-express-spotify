require('dotenv').config();


const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

app.get("/", (req, res) => {
    res.render('home.hbs');
  });

app.get("/artist-search", (req, res) => {
    console.log(req.query)
    spotifyApi
    .searchArtists(req.query.artist)
    .then(data => {
      console.log(data.body.artists.items[0])
      let artistName=data.body.artists.items[0].name;
      let artistImage=data.body.artists.items[0].images[0].url
      let artistUrl=data.body.artists.items[0].href
      let artistId=data.body.artists.items[0].id
      
      res.render('artist-search-results.hbs', {artistName, artistImage, artistUrl, artistId})
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get("/albums/:artistId", (req, res) => {

    spotifyApi.getArtistAlbums(req.params.artistId).then(
        function(data) {
          console.log('Artist albums', data.body);

          let albums=data.body.items;
        
          res.render('albums.hbs', {albums} )
        },
        function(err) {
          console.error(err);
        }
      );

   
})
app.get("/tracks/:albumId", (req, res) => {
    spotifyApi.getAlbumTracks(req.params.albumId, { limit : 5, offset : 1 })
        .then(function(data) {
            console.log(data.body);

            let tracks = data.body.items

            res.render('tracks.hbs', {tracks})
        }, function(err) {
            console.log('Something went wrong!', err);
        });

    
})