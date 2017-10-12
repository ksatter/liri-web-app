
// Get Keys
const keys = require('./keys');
// Set up logger
const log4js = require('log4js');
const logger = log4js.getLogger();
log4js.configure({
    appenders: {
        everything: { type: 'file', filename: 'log.txt' }
    },
    categories: {
        default: { appenders: [ 'everything' ], level: 'debug' }
    }
});

//format text
const dedent = require('dedent-js');
const removePunctuation = require('remove-punctuation');

//Parse input
let input = process.argv;
let actionCall = input[2].toLowerCase();
let searchTerm = input.splice(3);
searchTerm = searchTerm.join(" ");
searchTerm = removePunctuation(searchTerm);

doWhat();


function doWhat() {
    //log inputs
    logger.info(`${actionCall} ${searchTerm.toString(" ")}`);
    //choose which function to call
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
            writeToLogs(`
                I'm so sorry, I didn't understand that! 
                Try:
                "my-tweets" to view Kathy's last 20 tweets,;
                "spotify-this-song [Song Name]" to get info about a song;
                "movie-this [Movie Name]" to get info about a movie;
                "do-what-it-says" to see what Kathy thinks you should
            `);
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
            const tweetList = [];

            for (let i = 0; i < list.length; i++) {
                let currentText = list[i].text;
                tweetList.push(currentText)
            }
            writeToLogs(`
                ${tweetList.join('\n')}
                `)
        } else {writeToLogs(error)}
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
                writeToLogs(`I'm so sorry, Spotify couldn't find any songs titled "${query}".`);
            }
        } else {writeToLogs(err)}
    })
}

function getMovieData() {
    //get formatted search term
    searchTerm = searchTerm.split(" ");
    searchTerm = searchTerm.join('+');
    //default search term if empty
    if (searchTerm.length === 0) {
        searchTerm = 'mr+nobody'
    }
    //set up OMDB search
    const request = require('request');
    const queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=" + keys.omdbKey;
    console.log(queryUrl);
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
                writeToLogs(`I'm so sorry, OMDB couldn't find any movies titled "${searchTerm}".`)
            }
        } else {
            writeToLogs(err)
        }
    });
}

function getCommandFromFile() {
    const fs = require('fs');
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (!error) {
            input = data.split(",");
            actionCall = input[0];
            searchTerm = input[1].split(",");
            doWhat()
        } else {writeToLogs(error)}
    })
}

function writeToLogs(dataToLog) {

    console.log(dedent(dataToLog));
    logger.info(dedent(dataToLog));

}





