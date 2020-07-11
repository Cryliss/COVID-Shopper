"use strict";

let chartTitle = document.getElementById('chart-title')
let chartAddress = document.getElementById('chart-address')
let chartPhone = document.getElementById('chart-phone')
let chartRating = document.getElementById('chart-rating')
let chartReviews = document.getElementById('chart-reviews')

let time = [
  ['Move', 'Percentage'],
    ["12 am", 100],
    ["1 am", 31],
    ["2 am", 12],
    ["3 am", 10],
    ["4 am", 3],
    ["5 am", 31],
    ["6 am", 12],
    ["7 am", 10],
    ["8 am", 3],
    ["9 am", 10],
    ["10 am", 44],
    ["11 am", 31],
    ["12 pm", 12],
    ["1 pm", 10],
    ["2 pm", 3],
    ["3 pm", 10],
    ["4 pm", 44],
    ["5 pm", 31],
    ["6 pm", 12],
    ["7 pm", 10],
    ["8 pm", 3],
    ["9 pm", 10],
    ["10 pm", 3],
    ["11 pm", 10]
]

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
   var input = document.getElementById('pac-input');
   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
   var autocomplete = new google.maps.places.Autocomplete(input);

   // Bind the map's bounds (viewport) property to the autocomplete object,
   // so that the autocomplete requests use the current map bounds for the
   // bounds option in the request.
   autocomplete.bindTo('bounds', map);

   // Set the data fields to return when the user selects a place.
   autocomplete.setFields(["place_id", "geometry", "name", "plus_code"]);

   var infowindow = new google.maps.InfoWindow();
   var infowindowContent = document.getElementById('infowindow-content');
   infowindow.setContent(infowindowContent);

   var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
   });

   marker.addListener("click", function() {
      infowindow.open(map, marker);
   });

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

      // Set the position of the marker using the place ID and location.
      marker.setPlace({
         placeId: place.place_id,
         location: place.geometry.location
      });

      marker.setVisible(true);

      infowindowContent.children["place-name"].textContent = place.name;
      infowindowContent.children["place-id"].textContent = place.place_id;

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
         document.getElementById('chart-rating').innerHTML = `Rating: ${data['rating']}/5`;
         document.getElementById('chart-reviews').innerHTML = `Reviews: ${data['rating_n']}`;
         drawStuff();

       }

       getPrecautions(place);
       infowindow.open(map, marker);
   });
}

function drawStuff() {
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

function getPrecautions(place) {
   const precreq = new XMLHttpRequest();
   precreq.open("GET", `http://127.0.0.1:8080/getPrecautions?pluscode=${place.plus_code.compound_code}`);
   precreq.send();
   console.log("sent -- precautions!");
   precreq.onload = () => {
      var data = JSON.parse(precreq.response)['Response'];
      console.log(data);
   }
}
