(function($) {
  
  // Globals.
  // jQuery collections.
  var throbber,
      urgency;


  // Utility belt.
  var util = {
    userMessage: function(msg) {
      var msg =  $('#message');

      if ( ! msg.length) {
        msg = $('<div id="message" />');
        $('body').prepend(msg);
      }

      msg.html(msg);

    }

  }

  // Get the user's location via the Geolocation API.
  var getUserLocation = function() {
    var geolocation = navigator.geolocation;
    
    if ( ! geolocation) {
      util.userMessage('Your browser does not support Geolocation.');
      return false;
    } else {
      
      geolocation.getCurrentLocation(function(position) {          
        return [position.coords.latitude, position.coords.longitude];
      }, function() {
        util.userMessage('Problem bro, you\'re on your own.');
      });

    }
  }


  // Send user location to server.
  var getData = function(location) {
      
      

      var post = {
        location: location,
        urgency: urgency.slider('value')
      };

      $.post('receive-location.php', post, function(response) {
        
        renderMap();

      });

  }

  // Draw points on map.
  var renderMap = function(points) {


  }

  // Initialise.
  var init = function() {

    // Set up jQuery collections.
    throbber = $('<div id="throbber">Receiving data</div>');
    throbber.appendTo('body');

    urgency = $('#urgency');

    // Set up jQuery UI slider.

    urgency.slider({
      animate: true,
      max: 5,
      min: 0,
      orientation: 'vertical',
      slide: function(event, ui) {
         console.log(event, ui, ui.value)
        

      }
    });

    // Get user location.
    var location = getUserLocation();

    // Post to server.
    $('#action').click(function() {
      getData(location);
    });
   }

 
  $(init);


})(jQuery);
