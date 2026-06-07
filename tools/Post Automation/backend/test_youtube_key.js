const { google } = require('googleapis');
require('dotenv').config();

const apiKey = process.env.YOUTUBE_API_KEY;

const youtube = google.youtube({
    version: 'v3',
    auth: apiKey
});

async function testKey() {
    try {
        const response = await youtube.videos.list({
            part: ['snippet'],
            id: ['dQw4w9WgXcQ'] // Rick Astley - Never Gonna Give You Up
        });
        console.log("SUCCESS");
        console.log(response.data.items[0].snippet.title);
    } catch (err) {
        console.error("FAILED");
        console.error(err.message);
    }
}

testKey();
