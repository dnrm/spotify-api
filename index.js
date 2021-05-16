require("dotenv").config();
const express = require("express");
const port = process.env.PORT || 8080;
const app = express();
const cors = require('cors');

// Import spotify api functions
const spotify = require("./spotify");

app.use(cors({
    origin: 'react.danielmedina.dev'
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
            name: i.name,
            album: {
                name: i.album.name,
                type: i.album.album_type,
                release_date: i.album.release_date
            },
            id: i.id,
            image: i.album.images[0].url
        })
    });
    res.status(200).send(response)
});

app.listen(port, () => console.log(`listening on http://localhost:${port}`));
