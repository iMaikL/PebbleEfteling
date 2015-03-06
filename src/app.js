/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 *
 * Efteling app for waiting times
 */

var UI = require('ui');
var ajax = require('ajax');

// Create the Loading Card with title and subtitle
var card = new UI.Card({
  //title:'Efteling',
  subtitle:'Ophalen wachttijden...'
});

card.banner('images/efteling_banner.png');
card.style('small');

// Display the Card
card.show();

//END OF LOADING CARD//
//START OF WEATHER DATA CARD//

// Construct URL
var apiKey = '...';
var URL = 'api.eftelstats.nl/V1/wachttijden?key=' + apiKey;

// Make the request
ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    // Success!
    console.log("Successfully fetched wachttijden data!");

    // Extract data
    var location = data.name;
    var temperature = Math.round(data.main.temp - 273.15) + "C";

    // Always upper-case first letter of description
    var description = data.weather[0].description;
    description = description.charAt(0).toUpperCase() + description.substring(1);

    // Show to user
    card.subtitle(location + ", " + temperature);
    card.body(description);
  },
  function(error) {
    // Failure!
    console.log('Failed fetching wachttijden data: ' + error);
  }
);