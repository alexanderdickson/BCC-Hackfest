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
      
      geolocation.watchPosition(function(position) {          
        callback.apply(null, [position.coords.latitude, position.coords.longitude]);
      }, function() {
        util.userMessage('Problem bro, you\'re on your own.');
      });

    }
  }


  // Send user location to server.
  var getData = function(lat, lon) {
      
      var post = {
        location: [lat, lon],
        urgency: urgency.slider('value')
      };

      $.post('receive-location.php', JSON.stringify(post), function(points) {

        renderMap(points);

      });

  }

  // Draw points on map.
  var renderMap = function(points) {
    var markerBounds = new google.maps.LatLngBounds(),
         infoWindows = [];
    
    var getIcon = function(color) {
      return MapIconMaker.createMarkerIcon({width: 20, height: 34, primaryColor: color, cornercolor:color});
    }

    $.each(points, function(i, point) {

      var position = new google.maps.LatLng(point.latitude, point.longitude);

      var marker = new google.maps.Marker({
        map: map,
        position: position,
        icon: getIcon('#000000')
        
      });

      var infoWindow = new google.maps.InfoWindow();

      infoWindows.push(infoWindow);

      google.maps.event.addListener(marker, 'click', function() {

        infoWindow.setContent(point.toilet_name);

        $.each(infoWindows, function(i, infoWindow) {
          infoWindow.close();
        });

        infoWindow.open(map, marker);

      });

      markerBounds.extend(position);
           

    });
    
    map.fitBounds(markerBounds);
    

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
      max: 100,
      min: 0,
      orientation: 'horizontal',
      slide: function(event, ui) {
         
         var value = (ui.value / $(event.target).slider('option', 'max')) * 200;

         $(event.target)
          .find('.ui-slider-handle')
          .css('backgroundColor', 'rgb(' + value + ', ' + (200 - value) + ', 0)'); 

      }
    });

    // Get user location.
    getUserLocation(function(lat, lon) {
      
      // Post to server.
      getData(lat, lon);
      
      map = new google.maps.Map($('#map')[0],
          {
          zoom: 18,
          center: new google.maps.LatLng(lat, lon),
          mapTypeId: google.maps.MapTypeId.ROADMAP

        });


      new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(lat, lon),
        //icon: ''
      });




    });
    
  }

 
  $(init);


})(jQuery);
