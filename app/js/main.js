'use strict';
import Controller from './controller.class.js';
import Connector from './connector.class.js';
(function(){
  let controller = new Controller({
    styleURL: 'mapbox://styles/cityofdetroit',
    mapContainer: 'map',
    geocoder: false,
    baseLayers: {
      street: 'cj7w0s5do3kj82rpcsqovntai',
      satellite: 'cj774gftq3bwr2so2y6nqzvz4'
    },
    center: [-83.15, 42.36],
    zoom: 11.5,
    boundaries: {
      sw: [-83.3437,42.2102],
      ne: [-82.8754,42.5197]
    },
    sources: [
    ],
    layers: [
    ]
  });
  Connector.getData('../private/login.json', function(response){
    console.log(JSON.parse(response));
    Connector.postData("https://cors-anywhere.herokuapp.com/"+"https://gisweb.glwater.org/arcgis/tokens/generateToken", JSON.parse(response), function(response){
      console.log(response);
      Controller.setToken(response);
    });
  });
  document.getElementById('query').addEventListener('click', controller.filterData);
  document.querySelector('.close').addEventListener('click', controller.closeAlert);
  $( "#start-date" ).datepicker();
  $( "#end-date" ).datepicker();
})(window);
