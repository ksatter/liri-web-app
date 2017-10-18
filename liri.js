//Accces files
const fs = require('fs');
// Get Keys
const keys = require('./keys');
// Module to remove puntuation from search
const removePunctuation = require('remove-punctuation');
//module to remove indentation
const dedent = require('dedent-js');

//Parse input
let input = process.argv;
//Get action call
let actionCall = input[2].toLowerCase();
//get search term as string with punctuation removed
let searchTerm = input.splice(3);
searchTerm = searchTerm.join(" ");
searchTerm = removePunctuation(searchTerm);

// Determine what command was entered and run appropriate function
function doWhat() {
    //write input to log for debugging
    log(`**********************
        Timestamp: ${new Date().toLocaleString('en-US')} 
        Command: ${actionCall} ${searchTerm}
        **********************`);
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
    twitterClient.get('statuses/user_timeline', parameters, function (error, tweets) {
        writeToLogs(`
        ====================
        `);

        if(!error){
            //write tweets
            for (let i = 0; i < tweets.length; i++) {
                writeToLogs(`
                
                ${tweets[i].created_at}
                
                ${tweets[i].text}
                
                ====================
                `)
            }

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
                //console.log(result);
                //write song info
                writeToLogs(`
                    ====================
                    
                    Artist: ${result.artists[0].name}
                    Track: ${result.name}
                    Album: ${result.album.name}
                    Preview on Spotify: ${result.preview_url}
                    
                    ====================
                `);
            } else {
                // No results found
                writeToLogs(`I'm so sorry, Spotify couldn't find any songs titled "${query}".`);
            }
        } else {writeToLogs(err)}
    })
}

function getMovieData() {
    //replace spaces with +'s
    searchTerm = searchTerm.split(" ").join('+');
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
                writeToLogs(`
                    ====================
                    
                    Title: ${movie.Title}
                    Release Year: ${movie.Year} 
                    IMDB Rating: ${movie.Ratings[0].Value} 
                    Rotten Tomatoes Rating: ${movie.Ratings[1].Value} 
                    Produced In: ${movie.Country} 
                    Language: ${movie.Language} 
                    Plot: ${movie.Plot} 
                    Starring: ${movie.Actors}
                    
                    ====================
                    `)
            } else {
                // No results found
                writeToLogs(`I'm so sorry, OMDB couldn't find any movies titled "${searchTerm}".`)
            }
        } else {
            writeToLogs(error)
        }
    });
}

function getCommandFromFile() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (!error) {
            input = data.split(",");
            actionCall = input[0];
            searchTerm = input[1];
            doWhat()
        } else {writeToLogs(error)}input.splice(3);
    })
}


function writeToLogs(dataToLog) {
   log(dedent(dataToLog));
   console.log(dedent(dataToLog));
}

function log(dataToLog) {
    fs.appendFile('log.txt', '\n' + dedent(dataToLog) + '\n', function (error) {
        if(error) console.log(error);
    })
}

doWhat();