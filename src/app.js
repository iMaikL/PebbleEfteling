/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 *
 * Efteling app for waiting times
 */

var UI = require('ui');
var ajax = require('ajax');
var Accel = require('ui/accel');
var Vibe = require('ui/vibe');
//var Vector2 = require('vector2');
var parseFeed = function(data, quantity, type, rijk) {
  var items = [];
  
  for(var i=0; i < data.AttractionInfo.length; i++){
    var AttractionInfo = data.AttractionInfo[i];
    
    if(type != AttractionInfo.Type) {
      continue;
    }
    
    var locatie;
    
    //Bouw de rijken op zodat hierop gefilterd kan worden in het attractie menu
    if (AttractionInfo.MapLocation > 0 && AttractionInfo.MapLocation < 13) {
      locatie = 'marerijk';
    } else if (AttractionInfo.MapLocation > 12 && AttractionInfo.MapLocation < 21) {
      locatie = 'reizenrijk';
    } else if (AttractionInfo.MapLocation > 20 && AttractionInfo.MapLocation < 30) {
      locatie = 'ruigrijk';
    } else if (AttractionInfo.MapLocation > 29 && AttractionInfo.MapLocation < 36) {
      locatie = 'anderrijk';
    }
    
    if(rijk && rijk != locatie) {
      continue;
    }
    
    var attraction = AttractionInfo.Id;
    
    var skip = false;
    
////////////////    
/*BEGIN SWITCHES*/    
//////////////// 
    //Haal spaties weg in namen
    AttractionInfo.Id = AttractionInfo.Id.trim();
    switch(AttractionInfo.Id) {
      //Hernoem attracties met nettere namen
      case 'bobsingleriders':
        attraction = 'Bob Singleriders';
        break;
      case 'monsieurcannibale':
        attraction = 'Monsieur Cannibale';
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
      case 'polkamarina':
        attraction = 'Polka Marina';
        break;
      case 'stoomtreinm':
        attraction = 'Trein Marerijk';
        break;
      case 'stoomtreinr':
        attraction = 'Trein Reizenrijk';
        break;
      case 'fatamorgana':
        attraction = 'Fata Morgana';
        break;
      case 'stoomcarrousel':
        attraction = 'Stoom Caroussel';
        break;
      case 'villavolta':
        attraction = 'Villa Volta';
        break;
      case 'volkvanlaafmonorail':
        attraction = 'Monorail Volk van Laaf';
        break;
      case 'carrouselsantonpieckplein':
        attraction = 'Caroussel';
        break;
        
      //Hernoem horeca met nettere namen
      case 'casacaracol':
        attraction = 'Casa Caracol';
        break;
      case 'hetwapenvanraveleijn':
        attraction = 'Wapen van Raveleijn';
        break;
      case 'tpoffertje':
        attraction = 't Poffertje';
        break;
      case 'hetwittepaard':
        attraction = 'Het Witte Paard';
        break;
      case 'globetrotter':
        attraction = 'Globetrotter';
        break;
      case 'rondjevandemolen':
        attraction = 'Rondje Van De Molen ';
        break;
      case 'degebrandeboon':
        attraction = 'De Gebrande Boon';
        break;
      case 'polleskeuken':
        attraction = 'Polles Keuken';
        break;
      case 'tokopagode':
        attraction = 'Toko Pagode';
        break;
      case 'demeermin':
        attraction = 'De Meermin';
        break;
      case 'oase':
        attraction = 'Oase';
        break;
      case 'dekombuys':
        attraction = 'De Kombuys';
        break;
      case 'octopus':
        attraction = 'Octopus';
        break;
      case 'devrolijkenoot':
        attraction = 'De Vrolijke Noot';
        break;
      case 'desteenbok':
        attraction = 'De Steenbok';
        break;
      case 'burgerbackerij':
        attraction = 'Burgerbackerij ';
        break;
      case 'wittewalvis':
        attraction = 'Witte Walvis';
        break;
      case 'hetseylendfregat':
        attraction = 'Het Seylend Fregat';
        break;
      case 'smulpaap':
        attraction = 'Smulpaap';
        break;
      case 'denguldengaarde':
        attraction = 'De Gulden Gaarde';
        break;
      case 'grootmoederskeuken':
        attraction = 'Grootmoeders Keuken';
        break;
      case 'gelaarsdekat':
        attraction = 'Gelaarsde Kat';
        break;
      case 'hoorndesovervloeds':
        attraction = 'Hoorn Des Overvloeds ';
        break;
      case 'kleyneklaroen':
        attraction = 'Kleyne Klaroen ';
        break;
      case 'theaterrestaurantapplaus':
        attraction = 'Theater Restaurant Applaus';
        break;
        
      //Hernoem shows met nettere namen
      case 'sprookjesboomerwaseens':
        attraction = 'Sprookjesboom';
        break;
        
      //Skip shows die niet van toegevoegde waarde zijn
      case 'eftelingmuziekanten':
        skip = true;
        break;
      case 'jokieenjet':
        skip = true;
        break;
      case 'pardoesdetovernar':
        skip = true;
        break;
      case 'zanggelukkig':
        skip = true;
        break;
      case 'sprookjessprokkelaar':
        skip = true;
        break;
        
      //Skip attracties die niet van toegevoegde waarde zijn
      case 'sprookjesbos':
        skip = true;
        break;
      case 'kindervreugd':
        skip = true;
        break;
      case 'diorama':
        skip = true;
        break;
      case 'avonturendoolhof':
        skip = true;
        break;
      case 'kleuterhof':
        skip = true;
        break;
      case 'eftelingmuseum':
        skip = true;
        break;
        
      //Skip horeca die niet van toegevoegde waarde is
      case 'loreleyaquanuraarrangement':
        skip = true;
        break;
      case 'welkom':
        skip = true;
        break;
      case 'happinessstationpk':
        skip = true;
        break;
      case 'happinessstationwp':
        skip = true;
        break;
      case 'hollandsegebakskraam':
        skip = true;
        break;
    }
    
    if(skip) {
      continue;
    }
    
    // Always upper case the description string
    attraction = attraction.charAt(0).toUpperCase() + attraction.substring(1);

    // Get waitingtimes
    var waitingtime = AttractionInfo.State;
    var waitingnumber = AttractionInfo.WaitingTime;
    
    // If statement. Als de attractie gesloten is, laat "gesloten" zien. Anders laat de wachttijd zien.
    if (AttractionInfo.State == 'gesloten') {
      waitingtime = AttractionInfo.State;
      waitingnumber = 0;
    }else{
      waitingtime = AttractionInfo.WaitingTime + " minutes";
    }
    // If statement. Als de attractie geen WaitingTime heeft, laat "State" zien.
    if (!AttractionInfo.WaitingTime) {
      waitingtime = AttractionInfo.State;
    }
    
    if (AttractionInfo.State == 'open' && !AttractionInfo.WaitingTime && AttractionInfo.Type == 'Attraction') {
      waitingtime = '0 minuten';
    }
    
    // Always upper case the description string
    waitingtime = waitingtime.charAt(0).toUpperCase() + waitingtime.substring(1);
   
    // Add to menu items array
    items.push({
      title:attraction,
      subtitle:waitingtime,
      waitingnumber: waitingnumber
    });
  }
  
  //sorteer items hoog naar laag
  items.sort(function(a,b) {
    return b.waitingnumber - a.waitingnumber;
  });
  // Finally return whole array
  return items;
};

// Splash screen while waiting for data
var splashWindow = new UI.Card({
  banner: 'images/efteling_banner.png',
  body: 'Ophalen data...'
});
                               
splashWindow.show();

////////////////    
/*START OF DATA*/    
//////////////// 

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
    var attractionItems = parseFeed(data, 50, 'Attraction');
    var showItems = parseFeed(data, 10, 'Show');
    var horecaItems = parseFeed(data, 50, 'Horeca');
    var marerijkItems = parseFeed(data, 20, 'Attraction', 'marerijk');
    var anderrijkItems = parseFeed(data, 20, 'Attraction', 'anderrijk');
    var reizenrijkItems = parseFeed(data, 20, 'Attraction', 'reizenrijk');
    var ruigrijkItems = parseFeed(data, 20, 'Attraction', 'ruigrijk');
    
    // Construct main menu
    var mainMenu = new UI.Menu({
      sections: [{
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
    
    // Construct rijken menu
    var rijkenMenu = new UI.Menu({
      sections: [{
        items: [{
          title: 'Alle Attracties'
        }, {
          title: 'Marerijk'
        }, {
          title: 'Reizenrijk'
        }, {
          title: 'Ruigrijk'
        }, {
          title: 'Anderrijk'
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
    
    // Construct Menu to show to user when marerijk is chosen in main menu
    var marerijkMenu = new UI.Menu({
      sections: [{
        title: 'Huidige Wachttijden',
        items: marerijkItems
      }]
    });
    // Construct Menu to show to user when marerijk is chosen in main menu
    var anderrijkMenu = new UI.Menu({
      sections: [{
        title: 'Huidige Wachttijden',
        items: anderrijkItems
      }]
    });
    // Construct Menu to show to user when marerijk is chosen in main menu
    var ruigrijkMenu = new UI.Menu({
      sections: [{
        title: 'Huidige Wachttijden',
        items: ruigrijkItems
      }]
    });
    // Construct Menu to show to user when marerijk is chosen in main menu
    var reizenrijkMenu = new UI.Menu({
      sections: [{
        title: 'Huidige Wachttijden',
        items: reizenrijkItems
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
    rijkenMenu.show();
    } else if(e.itemIndex == 1) {
    showsMenu.show();
    } else if(e.itemIndex == 2) {
    horecaMenu.show();
    } else if(e.itemIndex == 3) {
    aboutMenu.show();
    }
    });
      
    // Add an action for SELECT on the rijkenmenu
    rijkenMenu.on('select', function(e) {
    if(e.itemIndex === 0) {
    resultsMenu.show();
    }
    if(e.itemIndex === 1) {
    marerijkMenu.show();
    } else if(e.itemIndex == 2) {
    reizenrijkMenu.show();
    } else if(e.itemIndex == 3) {
    ruigrijkMenu.show();
    } else if(e.itemIndex == 4) {
    anderrijkMenu.show();
    }
    });
    
////////////////    
/*TAP EVENT*////    
//////////////// 
    
    // Register for 'tap' events
    mainMenu.on('accelTap', function(e) {
    // Make another request to data for the 'tap' event
      ajax(
        {
          url: 'http://www.nickd.nl/maik/efteling.php',
          type: 'json'
        },
        function(data) {
          // Splash screen while waiting for data
          var SuccessWindow = new UI.Card({
            banner: 'images/success_banner.png',
          });
          
          // Display the screen
          SuccessWindow.show();
          
          // Create an array of Menu items
          var newItems = parseFeed(data, 100);
          
          // Update the Menu's first section
          mainMenu.items(4, newItems);
          console.log('Geupdate!');
          console.log(newItems);
                                                 
          // Notify the user
          Vibe.vibrate('short');
          
          //laat een popup zien dat t goed is gegaan
          setTimeout(function() {
          // Hide the screen
          SuccessWindow.hide();
          }, 1500);

        },
        function(error) {
          console.log('Download failed: ' + error);
        }
      );
    });
    // end tap event
  
  },
  function(error) {
    // Failure!
    console.log('Download failed' + error);
  }
);

// Prepare the accelerometer
Accel.init();
