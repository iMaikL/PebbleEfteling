/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 *
 * Efteling app for waiting times
 */

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    // Always upper case the description string
    var attraction = data.AttractionInfo[i].Id;
    attraction = attraction.charAt(0).toUpperCase() + attraction.substring(1);

    // Get waitingtimes
    var waitingtime = data.AttractionInfo[i].Type;
    //waitingtime = waitingtime.substring(waitingtime.indexOf('-') + 1, waitingtime.indexOf(':') + 3);

    // Add to menu items array
    items.push({
      title:attraction,
      subtitle:waitingtime
    });
  }

  // Finally return whole array
  return items;
};

// Splash screen while waiting for data
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144.168),
  text: 'Downloading wachttijden...',
  font: 'GOTHIC_28_BOLD',
  color: 'black',
  textOverflow: 'wrap',
  textAlign: 'center',
  backgroundColor: 'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

//START OF DATA//

// Make the request
ajax(
  {
    url: 'http://www.nickd.nl/maik/efteling.php',
    type: 'json'
  },
  function(data) {
    // Success!
    console.log("Successfully fetched wachttijden data!");
    
    // Create an array of Menu items
    var menuItems = parseFeed(data, 10);
    
    // Check the items are extracted OK
    for(var i = 0; i < menuItems.length; i++) {
      console.log(menuItems[i].title + ' | ' + menuItems[i].subtitle);
    }

    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Current Waitingtimes',
        items: menuItems
      }]
    });

    // Show the Menu, hide the splash
    resultsMenu.show();
    splashWindow.hide();   
  },
  function(error) {
    // Failure!
    console.log('Download failed' + error);
  }
);