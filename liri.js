var input = process.argv;
var actionCall = input[2];
var searchTerm = input.slice(3);
var keys = require('./keys');

switch(actionCall) {

    case 'my-tweets':
        showTweets();
        break;

    case 'spotify-this-song':
        getSpotifyInfo();
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
    var twitter = require('twitter');
    var twitterClient = new twitter(keys.twitterKeys);
    var parameters = {
        screen_name: 'kathy_bootcamp',
        count: 20
    };
    //fetch tweets
    twitterClient.get('statuses/user_timeline', parameters, function (error, list, response) {

        if(!error){
            //write tweets
            for (var i = 0; i < list.length; i++) {
                var currentText = list[i].text;
                console.log(currentText);
                console.log(' ');
            }
        } else {console.log(error)}
    })
}

function getSpotifyInfo() {
    var spotify = require('node-spotify-api');
    var spotifyClient = new spotify(keys.spotifyKeys);

    if (searchTerm.length === 0) {searchTerm = '"The Sign" Ace of Base'}

    var parameters = {
        type: 'track',
        query: searchTerm,
        limit: 1
    };

    spotifyClient.search(parameters, function (err, data) {
        if (!err) {
            var result = data.tracks.items[0];

            console.log(`Artist: ${result.artists[0].name}`);
            console.log(`Track: ${result.name}`);
            console.log(`Album: ${result.album.name}`)
            console.log(`Preview on Spotify: ${result.preview_url}`)


        } else {console.log(err); console.log('error')}
    })

}