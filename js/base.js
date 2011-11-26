(function($) {
  
  // Globals.
  // jQuery collections.
  var throbber,
      urgency;

  // Map object.
  var map;


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
  var getUserLocation = function(callback) {
    var geolocation = navigator.geolocation;
    
    if ( ! geolocation) {
      util.userMessage('Your browser does not support Geolocation.');
      return false;
    } else {
      
      geolocation.getCurrentPosition(function(position) {          
        callback.apply(null, [position.coords.latitude, position.coords.longitude]);
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
         //console.log(event, ui)
         
         var value = ($(event.srcElement).slider('option', 'max') / 100) * ui.value;

         $(event.srcElement)
          .find('.ui-slider-handle')
          .css('backgroundColor', 'rgb(' + value + '%, 0, 0)'); 
      }
    });

    // Get user location.
    getUserLocation(function(lat, lon) {
      
      console.log(arguments);

      // Post to server.
      $('#action').click(function() {
        getData(lat, lon);
      });

      
      map = new google.maps.Map($('#map')[0],
          {
          zoom: 4,
          center: new google.maps.LatLng(lat, lon),
          mapTypeId: google.maps.MapTypeId.ROADMAP

        });




    });
    
      }

 
  $(init);


})(jQuery);
