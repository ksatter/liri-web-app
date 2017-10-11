const input = process.argv;
const actionCall = input[2];
const searchTerm = input.splice(3);
const keys = require('./keys');

switch(actionCall) {

    case 'my-tweets':
        showTweets();
        break;

    case 'spotify-this-song':
        getSongInfo();
        break;

    case 'movie-this':
        console.log('OMDB');
        break;

    case 'do-what-it-says':
        console.log('Spotify');
        break;

    default:
        console.log('error');
}

function showTweets() {
    //Set up twitter client
    const twitter = require('twitter');
    const twitterClient = new twitter(keys.twitterKeys);
    const parameters = {
        screen_name: 'kathy_bootcamp',
        count: 20
    };
    //fetch tweets
    twitterClient.get('statuses/user_timeline', parameters, function (error, list) {

        if(!error){
            //write tweets
            for (let i = 0; i < list.length; i++) {
                let currentText = list[i].text;
                console.log(currentText);
                console.log(' ');
            }
        } else {console.log(error)}
    })
}

function getSongInfo() {
    // Get search term
    let query = searchTerm;
    //Default serch term if blank
    if (query.length === 0) {query = '"The Sign" Ace of Base'}
    //set up spotify client
    const spotify = require('node-spotify-api');
    const spotifyClient = new spotify(keys.spotifyKeys);
    const parameters = {
        type: 'track',
        query: query,
        limit: 1
    };
    //fetch song info
    spotifyClient.search(parameters, function (err, data) {
        if (!err) {
            //verify that a result was returned
            if (data.tracks.items.length > 0) {
                let result = data.tracks.items[0];
                //write song info
                console.log(`Artist: ${result.artists[0].name}`);
                console.log(`Track: ${result.name}`);
                console.log(`Album: ${result.album.name}`);
                console.log(`Preview on Spotify: ${result.preview_url}`)
            } else {
                // No results found
                console.log(`I'm so sorry, spotify couldn't find any songs titled "${query}".`)
            }
        } else {console.log(err)}
    })

}