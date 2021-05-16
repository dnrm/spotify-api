require('dotenv').config()
const request = require('request');

const postRequest = (options) => {
    return new Promise((resolve, reject) => {
        request.post(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(body.access_token)
            } else {
                reject(error)
            }
        })
    })
}

const searchTrack = (query, token) => {
    let options = {
        url: `https://api.spotify.com/v1/search?q=${query}&type=track&limit=5`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }

    return new Promise((resolve, reject) => {
        request.get(options, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                resolve(JSON.parse(body))
            } else {
                reject(error)
            }
        })
    })
}

module.exports = { postRequest, searchTrack };