# tinder-super-api

The most complete Tinder API to date (11/2015).

## Features

- Get Tinder User Recommendations
- Get Messages and new Matches since last Login
- Get & Set your own Profile
- ~~Get Moments shared by Matches (deprecated by Tinder)~~
- Get User data including photos and real birth date (thanks, Tinder!)
- Set Location to Coordinates
- Send Like / Pass / Super Like
- Send Messages

## Getting started

### Prerequisites

- Get your Facebook Auth Token. You might want to use some sort of HTTPS proxy to sniff it as described [here](http://words.alx.red/tinder-api-1-authorization/). Note: As of 10/2015, you only need your Facebook Auth Token and not your Facebook ID any more.

### Do Stuff

```javascript
const TinderApi = require('tinder-api-super');
const tinderLocale = 'en';
const tinderFbAuthToken = 'YOUR_FB_AUTH_TOKEN';

TinderApi.authorize(tinderFbAuthToken, tinderLocale,
  function() {
    // Auth successful
    TinderApi.getRecs(function(err, recs) {
      if(!err) {
        console.log(recs); // Log some Tinder User Recommendations
      }
    })
  });

```

## To Do

- [] Actually write some documentation
- [] Test the functions more thoroughly
- [] Fetch Facebook Auth Token in a more User friendly manner. [Tinderbot (Ruby)](https://github.com/jvenezia/tinderbot/blob/master/lib/tinderbot/facebook.rb) does this quite elegantly via a Browser Window.

## Note & Disclaimer

Tinder might not be happy about you using this. You might get banned. I can not accept any responsibility for your usage of the API. Also, I haven't tested it very much. :)
