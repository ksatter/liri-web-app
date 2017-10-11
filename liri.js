var input = process.argv;
var actionCall = input[2];
var searchTerm = input.slice(3);

switch(actionCall) {

    case 'my-tweets':
        showTweets();
        break;

    case 'spotify-this-song':
        console.log('Spotify');
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
    var twitterKeys = require('./keys');
    var client = new twitter(twitterKeys);

    var parameters = {
        screen_name: 'kathy_bootcamp',
        count: 20
    };
    //fetch tweets
    client.get('statuses/user_timeline', parameters, function (error, list, response) {
        console.log(list);

        if(!error){
            //write tweets
            for (var i = 0; i < list.length; i++) {
                var currentText = list[i].text;
                console.log(currentText)
            }
        } else {console.log(error)}
    })
}