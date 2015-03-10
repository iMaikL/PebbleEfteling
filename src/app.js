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
var i = 0;
var parseFeed = function(data, quantity, type) {
  var items = [];
  while(items.length < quantity || data.length < i) {
    i++;
    
    console.log(data.AttractionInfo.length);
    
    if(type != data.AttractionInfo[i].Type) {
      continue;
    }
    
    // Always upper case the description string
    var attraction = data.AttractionInfo[i].Id;
    
    //Hernoem attracties met nettere namen
    switch(data.AttractionInfo[i].Id) {
      case 'stoomtreinr':
        attraction = 'Stoomtreintjes';
        break;
      case 'devliegendehollander':
        attraction = 'Vliegende Hollander';
        break;
      case 'jorisendedraak':
        attraction = 'Joris en de Draak';
        break;
      case 'carnavalfestival':
        attraction = 'Carnaval Festival';
        break;
      case 'doudetuffer':
        attraction = 'De Oude Tuffer';
        break;
      case 'halvemaen':
        attraction = 'Halve Maen';
        break;
      case 'baron1898':
        attraction = 'Baron 1898';
        break;
    }
    
    attraction = attraction.charAt(0).toUpperCase() + attraction.substring(1);

    // Get waitingtimes
    var waitingtime = data.AttractionInfo[i].State;
    
    // If statement. Als de attractie gesloten is, laat "gesloten" zien. Anders laat de wachttijd zien.
    if (data.AttractionInfo[i].State == 'gesloten') {
      waitingtime = data.AttractionInfo[i].State;
    }else{
      waitingtime = data.AttractionInfo[i].WaitingTime + " minutes";
    }
    // If statement. Als de attractie geen WaitingTime heeft, laat "State" zien.
    if (!data.AttractionInfo[i].WaitingTime) {
      waitingtime = data.AttractionInfo[i].State;
    }
    
    // Always upper case the description string
    waitingtime = waitingtime.charAt(0).toUpperCase() + waitingtime.substring(1);

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
    var menuItems = parseFeed(data, 10, 'Attraction');
    
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