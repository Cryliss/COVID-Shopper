// This sample uses the Place Autocomplete widget to allow the user to search
// for and select a place. The sample then displays an info window containing
// the place ID and other information about the place that the user has
// selected.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
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
  var map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.23833238, lng: -118.523664572 },
    zoom: 13
  });

  var input = document.getElementById("pac-input");

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo("bounds", map);

  // Specify just the place data fields that you need.
  autocomplete.setFields(["place_id", "geometry", "name"]);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById("infowindow-content");
  infowindow.setContent(infowindowContent);

  var marker = new google.maps.Marker({ map: map });

  marker.addListener("click", function() {
    infowindow.open(map, marker);
  });

  autocomplete.addListener("place_changed", function() {
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
    request.open("GET", `http://127.0.0.1:5000/getPopularity?placeid=${place.place_id}`);
    request.send();
    request.onload = () => {
      var data = JSON.parse(request.response)['Response']
      var popularTimes = data['populartimes'][0]['data']
      for(let i=0; i < popularTimes.length; i++){
        time[i+1][1] = popularTimes[i]
      }
      chartTitle.innerHTML = data['name']
      chartPhone.innerHTML = `Phone: ${data['international_phone_number']}`
      chartAddress.innerHTML = `Address: ${data['address']}`
      chartRating.innerHTML = `Rating: ${data['rating']}/5`
      chartReviews.innerHTML = `Reviews: ${data['rating_n']}`

      drawStuff()
    }

    request.open("GET", `http://127.0.0.1:5000/getRecommendations?pluscode=${place.plus_code.compound_code}`);
    request.send();
    request.onload = () => {
      var data = JSON.parse(request.response)['Response']
      console.log(data)
    }

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
