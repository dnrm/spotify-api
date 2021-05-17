// Import spotify api functions
const spotify = require("./spotify");

exports.handler = async (event) => {
    
    let response
    
        if (!event.pathParameters) {
            response = {
                statusCode: 404,
                    body: JSON.stringify({
                    message: "Missing query",
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }),
            };
            return response;
        }
    
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
    
        let token = await spotify.postRequest(tokenOptions);
    
        let trackInfo = await spotify.searchTrack(event.pathParameters.query, token);
    
        let items = [];
        trackInfo["tracks"]["items"].forEach(async (i) => {
            items.push({
                name: i.name,
                album: {
                    name: i.album.name,
                    type: i.album.album_type,
                    release_date: i.album.release_date,
                },
                id: i.id,
                image: i.album.images[0].url,
            });
        });
        if (items.length == 0) {
            response = {
                statusCode: 404,
                body: JSON.stringify({
                    message: "Not found",
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            };
            return
        } else {
            response = {
                statusCode: 200,
                body: JSON.stringify(items),
                headers: {
                    'Access-Control-Allow-Origin': '*'
                }
            };
        }
        
        return response;
};
