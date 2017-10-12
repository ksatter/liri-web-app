// Get Keys
const keys = require('./keys');
// Set up logger
const log4js = require('log4js');
//format text
const dedent = require('dedent-js');
log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'log.txt' }
    },
    categories: {
        default: { appenders: [ 'everything' ], level: 'debug' }
    }
});
const logger = log4js.getLogger();
function writeToLogs(dataToLog) {
    console.log(dedent(dataToLog));
    logger.info(dedent(dataToLog));
}
//Parse input
let input = process.argv;
let actionCall = input[2];
let searchTerm = input.splice(3);


doWhat();


function doWhat() {

    switch(actionCall) {

        case 'my-tweets':
            showTweets();
            break;

        case 'spotify-this-song':
            getSongInfo();
            break;

        case 'movie-this':
            getMovieData();
            break;

        case 'do-what-it-says':
            getCommandFromFile();
            break;

        default:
            console.log('error');
    }

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
    //Default search term if blank
    if (searchTerm.length === 0) {searchTerm = '"The Sign" Ace of Base'}
    //set up spotify client
    const spotify = require('node-spotify-api');
    const spotifyClient = new spotify(keys.spotifyKeys);
    const parameters = {
        type: 'track',
        query: searchTerm,
        limit: 1
    };
    //fetch song info
    spotifyClient.search(parameters, function (err, data) {
        if (!err) {
            //verify that a result was returned
            if (data.tracks.items.length > 0) {
                let result = data.tracks.items[0];
                //write song info
                writeToLogs(`
                    Artist: ${result.artists[0].name}
                    Track: ${result.name}
                    Album: ${result.album.name}
                    Preview on Spotify: ${result.preview_url}
                `);
            } else {
                // No results found
                console.log(`I'm so sorry, Spotify couldn't find any songs titled "${query}".`)
            }
        } else {console.log(err)}
    })
}

function getMovieData() {
    //get search term
    searchTerm = searchTerm.join('+');
    //default search term if empty
    if (searchTerm.length === 0) {searchTerm = 'mr+nobody'}
    //set up OMDB search
    const request = require('request');
    const queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=" + keys.omdbKey;
    //fetch movie data
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            let movie = JSON.parse(body);
            //verify that result was returned
            if (movie.Title) {
                writeToLogs(`\n
                    Title: ${movie.Title} 
                    Release Year: ${movie.Year} 
                    IMDB Rating: ${movie.Ratings[0].Value} 
                    Rotten Tomatoes Rating: ${movie.Ratings[1].Value} 
                    Produced In: ${movie.Country} 
                    Language: ${movie.Language} 
                    Plot: ${movie.Plot} 
                    Starring: ${movie.Actors}
                    \n`)
            } else {
                // No results found
                console.log(`I'm so sorry, OMDB couldn't find any movies titled "${searchTerm.join(' ')}".`)
            }
        } else {console.log(err)}

});
}




