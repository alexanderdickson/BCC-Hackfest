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
        markers = [];

    $.each(points, function(i, point) {

      var position = new google.maps.LatLng(point.latitude, point.longitude);

      var disabledAccess = point.disabled_access.toLowerCase(),
          hasDisabledAccess = disabledAccess == 'fully accessible' || disabledAccess.indexOf('wheelchair') !== -1,
          originalImgSrc = 'images/toilets' + (hasDisabledAccess ? '-disability' : '') + '.png';


      

      var marker = new google.maps.Marker({
        map: map,
        position: position,
        icon: originalImgSrc,
        title: point.toilet_name
      });
      
      markers.push({
        marker: marker,
        img: originalImgSrc
      });

      google.maps.event.addListener(marker, 'click', function() {
        
        $.each(markers, function(i, thisMarker) {
          if (marker === thisMarker.marker) {
            return true;
          }
          thisMarker.marker.setIcon(thisMarker.img);
        });

        marker.setIcon(originalImgSrc.replace(/\.\w{3}$/, '-active$&'));

      });

      console.log(point);

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
        icon: 'images/start.png',
        title: 'You are here'
      });




    });
    
  }

 
  $(init);


})(jQuery);
