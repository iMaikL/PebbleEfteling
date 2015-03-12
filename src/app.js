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
var parseFeed = function(data, quantity, type) {
  var items = [];
  
  for(var i=0; i < data.AttractionInfo.length; i++){
    var AttractionInfo = data.AttractionInfo[i];
    
    //console.log(JSON.stringify(AttractionInfo));
    if(type != AttractionInfo.Type) {
      continue;
    }
    
    var attraction = AttractionInfo.Id;
    
    //Hernoem attracties met nettere namen
    switch(AttractionInfo.id) {
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
    
    // Always upper case the description string
    attraction = attraction.charAt(0).toUpperCase() + attraction.substring(1);

    // Get waitingtimes
    var waitingtime = AttractionInfo.State;
    
    // If statement. Als de attractie gesloten is, laat "gesloten" zien. Anders laat de wachttijd zien.
    if (AttractionInfo.State == 'gesloten') {
      waitingtime = AttractionInfo.State;
    }else{
      waitingtime = AttractionInfo.WaitingTime + " minutes";
    }
    // If statement. Als de attractie geen WaitingTime heeft, laat "State" zien.
    if (!AttractionInfo.WaitingTime) {
      waitingtime = AttractionInfo.State;
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
  text: 'Ophalen wachttijden...',
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
    console.log(JSON.stringify(data));
    // Success!
    console.log("Successfully fetched wachttijden data!");
    
    // Create an array of Menu items
    var attractionItems = parseFeed(data, 32, 'Attraction');
    var showItems = parseFeed(data, 8, 'Show');
    var horecaItems = parseFeed(data, 32, 'Horeca');
    
    // Construct main menu
    var mainMenu = new UI.Menu({
      sections: [{
        title: 'Main Menu',
        items: [{
          title: 'Attracties',
          icon: 'images/efteling_logo.png'
        }, {
          title: 'Shows',
          icon: 'images/icon_ticket.png'
        }, {
          title: 'Horeca',
          icon: 'images/icon_coffee.png'
        }, {
          title: 'Park Info',
          icon: 'images/icon_informatie.png'
        }]
      }]
    });
    
    //Variabelen voor gebruik in cards en menus 
    var drukte = data.OpeningHours.BusyIndication;
    drukte = drukte.charAt(0).toUpperCase() + drukte.substring(1);
    
    var OpenVan = data.OpeningHours.HourFrom;
    OpenVan = OpenVan.substring(OpenVan.indexOf('T') + 1, OpenVan.indexOf(':') + 3);
    var OpenTot = data.OpeningHours.HourTo;
    OpenTot = OpenTot.substring(OpenTot.indexOf('T') + 1, OpenTot.indexOf(':') + 3);
    
    
    var openingstijdPark = OpenVan + ' tot ' + OpenTot;
    
    // Construct Menu to show to user when attractions is chosen in main menu
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Huidige Wachttijden',
        items: attractionItems
      }]
    });
    // Construct Menu to show to user when shows is chosen in main menu
    var showsMenu = new UI.Menu({
      sections: [{
        title: 'Huidige Wachttijden',
        items: showItems
      }]
    });
    // Construct Menu to show to user when horeca is chosen in main menu
    var horecaMenu = new UI.Menu({
      sections: [{
        title: 'Huidige Wachttijden',
        items: horecaItems
      }]
    });
    // Construct Menu to show to user info about Efteling
    var aboutMenu = new UI.Card({
      title: 'Park Info',
      subtitle: drukte,
      body: openingstijdPark
    });

    // Show the mainMenu, hide the splash
    splashWindow.hide(); 
    mainMenu.show();
    
    // Add an action for SELECT
    mainMenu.on('select', function(e) {
    if(e.itemIndex === 0) {
    resultsMenu.show();
    } else if(e.itemIndex == 1) {
    showsMenu.show();
    } else if(e.itemIndex == 2) {
    horecaMenu.show();
    } else if(e.itemIndex == 3) {
    aboutMenu.show();
    }
      
    });
    
  },
  function(error) {
    // Failure!
    console.log('Download failed' + error);
  }
);