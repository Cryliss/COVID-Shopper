"use strict";

// Default arrray of values to load into our popular times graph
let time = [
  ['Move', 'Percentage'],
    ["12 am", 0],
    ["1 am", 0],
    ["2 am", 0],
    ["3 am", 0],
    ["4 am", 0],
    ["5 am", 0],
    ["6 am", 0],
    ["7 am", 0],
    ["8 am", 0],
    ["9 am", 0],
    ["10 am", 0],
    ["11 am", 0],
    ["12 pm", 0],
    ["1 pm", 0],
    ["2 pm", 0],
    ["3 pm", 0],
    ["4 pm", 0],
    ["5 pm", 0],
    ["6 pm", 0],
    ["7 pm", 0],
    ["8 pm", ],
    ["9 pm", 0],
    ["10 pm", 0],
    ["11 pm", 0]
]

// Create our base map on start
function initMap() {
   var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 34.23833238, lng: -118.523664572},
      zoom: 13,
      mapTypeId: 'roadmap',
      styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    });

   // Get the element for our searchbox so we can listen for input.
   var input = document.getElementById('pac-input');
   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
   var autocomplete = new google.maps.places.Autocomplete(input);

   // Bind the map's bounds (viewport) property to the autocomplete object,
   // so that the autocomplete requests use the current map bounds for the
   // bounds option in the request.
   autocomplete.bindTo('bounds', map);

   // Set the data fields to return when the user selects a place.
   autocomplete.setFields(["place_id", "geometry", "name", "plus_code", "types"]);

   // Get the element for the info window we'll be feeding our place information to.
   var infowindow = new google.maps.InfoWindow();
   var infowindowContent = document.getElementById('infowindow-content');
   infowindow.setContent(infowindowContent);

   // Create our marker that will open our infowindow for us on click.
   var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
   });

   marker.addListener("click", function() {
      infowindow.open(map, marker);
   });

   // A new search was just entered, let's handle it --
   autocomplete.addListener('place_changed', function() {
      infowindow.close();

      var place = autocomplete.getPlace();

      if (!place.geometry) {
         return;
      }

      if (place.geometry.viewport) {
         map.fitBounds(place.geometry.viewport);
      } else {
         map.setCenter(place.geometry.location);
         map.setZoom(17);
      }
      getAlternatices(place);

      // Set the position of the marker using the place ID and location.
      marker.setPlace({
         placeId: place.place_id,
         location: place.geometry.location
      });

      marker.setVisible(true);

      infowindowContent.children["place-name"].textContent = place.name;

      // Make a request to main.py's function getPopularity to get the live times
      // Add the current live time to the infowindow and update the graph
      const request = new XMLHttpRequest();
      request.open("GET", `http://127.0.0.1:8080/getPopularity?placeid=${place.place_id}`);
      request.send();
      console.log("sent!");
      request.onload = () => {
         var data = JSON.parse(request.response)['Response'];
         console.log(data);
         var popularTimes = data['populartimes'][0]['data'];
         for(let i=0; i < popularTimes.length; i++){
           time[i+1][1] = popularTimes[i];
         }
         infowindowContent.children["current-popularity"].textContent = data['current_popularity'];
         document.getElementById('chart-title').innerHTML = data['name'];
         document.getElementById('chart-phone').innerHTML = `Phone: ${data['international_phone_number']}`;
         document.getElementById('chart-address').innerHTML = `Address: ${data['address']}`;
         updateGraph();

       }

       // Get the COVID precautions for the place
       getPrecautions(infowindowContent, place);
       infowindow.open(map, marker);
   });
}

// Make an XMLHttpRequest to main.py's getPrecautions method
// Display the resulting precautions in the inforwindow
function getPrecautions(infowindowContent, place) {
   const precRequest = new XMLHttpRequest();
   precRequest.open("GET", `http://127.0.0.1:8080/getPrecautions?pluscode=${place.plus_code.compound_code}`);
   precRequest.send();
   console.log("sent -- precautions!");
   precRequest.onload = () => {
      var data = JSON.parse(precRequest.response)['Response'];
      infowindowContent.children['masks'].textContent = data['masks'];
      infowindowContent.children['limited-entry'].textContent = data['limited_entry'];
      infowindowContent.children['early-close'].textContent = data['early_close'];
      infowindowContent.children['has-early'].textContent = data['has_early'];
      infowindowContent.children['delivery'].textContent =  data['delivery'];
      console.log(data);
   }
}

// Make an XMLHttpRequest to main.py's getRecommendations method
// Display the resulting data to the console
function getAlternatices(place) {
   var data;
   const altsRequest = new XMLHttpRequest();
   altsRequest.open("GET", `http://127.0.0.1:8080/getRecommendations?loc=${place.geometry.location}`);
   altsRequest.send();
   console.log("sent -- getAlternatices!");
   altsRequest.onload = () => {
      var d = JSON.parse(altsRequest.response)['Response'];
      console.log(d);
      data = d[0];
      document.getElementById('name-1').innerHTML = data['populartimes']['name'] + " | ";
      document.getElementById('address-1').innerHTML = data['populartimes']['address'] + " | ";
      document.getElementById('live-1').innerHTML = data['populartimes']['current_popularity'] + " | ";
      if (data['covid']) {
         document.getElementById('masks-1').innerHTML = data['covid']['masks'] + " | ";
         document.getElementById('lim-entry-1').innerHTML = data['covid']['limited_entry'] + " | ";
         document.getElementById('close-early-1').innerHTML = data['covid']['early_close'] + " | ";
         document.getElementById('open-early-1').innerHTML = data['covid']['has_early'] + " | ";
         document.getElementById('delivery-1').innerHTML = data['covid']['delivery'] + " | ";
      }
      data = d[1];
      document.getElementById('name-2').innerHTML = data['populartimes']['name'] + " | ";
      document.getElementById('address-2').innerHTML = data['populartimes']['address'] + " | ";
      document.getElementById('live-2').innerHTML = data['populartimes']['current_popularity'] + " | ";
      if (data['covid']) {
         document.getElementById('masks-2').innerHTML = data['covid']['masks'] + " | ";
         document.getElementById('lim-entry-2').innerHTML = data['covid']['limited_entry'] + " | ";
         document.getElementById('close-early-2').innerHTML = data['covid']['early_close'] + " | ";
         document.getElementById('open-early-2').innerHTML = data['covid']['has_early'] + " | ";
         document.getElementById('delivery-2').innerHTML = data['covid']['delivery'] + " | ";
      }
      data = d[2];
      document.getElementById('name-3').innerHTML = data['populartimes']['name'] + " | ";
      document.getElementById('address-3').innerHTML = data['populartimes']['address'] + " | ";
      document.getElementById('live-3').innerHTML = data['populartimes']['current_popularity'] + " | ";
      if (data['covid']) {
         document.getElementById('masks-3').innerHTML = data['covid']['masks'] + " | ";
         document.getElementById('lim-entry-3').innerHTML = data['covid']['limited_entry'] + " | ";
         document.getElementById('close-early-3').innerHTML = data['covid']['early_close'] + " | ";
         document.getElementById('open-early-3').innerHTML = data['covid']['has_early'] + " | ";
         document.getElementById('delivery-3').innerHTML = data['covid']['delivery'] + " | ";
      }
      data = d[3]
      document.getElementById('name-4').innerHTML = data['populartimes']['name'] + " | ";
      document.getElementById('address-4').innerHTML = data['populartimes']['address'] + " | ";
      document.getElementById('live-4').innerHTML = data['populartimes']['current_popularity'] + " | ";
      if (data['covid']) {
         document.getElementById('masks-4').innerHTML = data['covid']['masks'] + " | ";
         document.getElementById('lim-entry-4').innerHTML = data['covid']['limited_entry'] + " | ";
         document.getElementById('close-early-4').innerHTML = data['covid']['early_close'] + " | ";
         document.getElementById('open-early-4').innerHTML = data['covid']['has_early'] + " | ";
         document.getElementById('delivery-4').innerHTML = data['covid']['delivery'] + " | ";
      }
      data = d[4]
      document.getElementById('name-5').innerHTML = data['populartimes']['name'] + " | ";
      document.getElementById('address-5').innerHTML = data['populartimes']['address'] + " | ";
      document.getElementById('live-5').innerHTML = data['populartimes']['current_popularity'] + " | ";
      if (data['covid']) {
         document.getElementById('masks-5').innerHTML = data['covid']['masks'] + " | ";
         document.getElementById('lim-entry-5').innerHTML = data['covid']['limited_entry'] + " | ";
         document.getElementById('close-early-5').innerHTML = data['covid']['early_close'] + " | ";
         document.getElementById('open-early-5').innerHTML = data['covid']['has_early'] + " | ";
         document.getElementById('delivery-5').innerHTML = data['covid']['delivery'] + " | ";
      }
   }

}

// Update our bar graph with the new COVID precautions.
function updateGraph() {
   var data = new google.visualization.arrayToDataTable(time);

   var options = {
      width: 600,
      chartArea: {'backgroundColor': '#313b47'},
      backgroundColor: {
         fill: '#313b47'
      },
      legend: { position: 'none' },
      axes: {
         x: {
            0: { side: 'top', label: 'Daily traffic'} // Top x-axis.
         }
      },
      bar: { groupWidth: "50%" }
   };

   var chart = new google.charts.Bar(document.getElementById('top_x_div'));
   // Convert the Classic options to Material options.
   chart.draw(data, google.charts.Bar.convertOptions(options));

};
