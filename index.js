require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8080;
const app = express();
const cors = require('cors');
const domain = process.env.DOMAIN || 'http://localhost:3000'

// ! Import spotify api functions
const spotify = require("./spotify");

// ! Allow requests from domain specified in .env file
app.use(cors({
    origin: domain
}));

let tokenOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
        Authorization: `Basic ${process.env.TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
        grant_type: "client_credentials",
    },
    json: true,
};

app.get('/search', (req, res) => {
    res.send({
        message: 'Missing query'
    })
})

app.get('/search/:query', async (req, res) => {
    let token = await spotify.postRequest(tokenOptions);

    let trackInfo = await spotify.searchTrack(req.params.query, token);

    let response = [];
    trackInfo["tracks"]["items"].forEach(async (i) => {
        response.push({
            id: i.id,
            name: i.name,
            album: {
                id: i.album.id,
                name: i.album.name,
                type: i.album.album_type,
                release_date: i.album.release_date
            },
            artist: i.artists[0].name,
            id: i.id,
            image: i.album.images[0].url,
            preview_url: i.preview_url,
            spotify_uri: i.uri,
            song_url: i.external_urls.spotify
        })
    });
    if (response.length == 0) {
        res.status(404).send({
            message: 'Not found'
        })
    } else {
        res.status(200).send(response)
    }
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
