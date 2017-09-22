"use strict";
// ================ variables ======================


var bounds = [
    [		-83.3437, 	42.2102], // Southwest coordinates
    [		-82.8754, 	42.5197]  // Northeast coordinates
];
var baseMapStyles = [
  'ciymfavyb00072sqe0bu9rwht',
  'cj2m1f9k400132rmr1jhjq2gn'
];
var parcelData = {
  'rental-status'     : null,
  'parcel-data'       : null
};
var currentURLParams = {
  'zoom'        : 0,
  'lng'         : 0,
  'lat'         : 0,
  'parcel'      : '',
  'district'    : '',
  'neighborhood': '',
  'survey'      : ''
};
mapboxgl.accessToken = 'pk.eyJ1Ijoic2x1c2Fyc2tpZGRldHJvaXRtaSIsImEiOiJjaXZsNXlwcXQwYnY5MnlsYml4NTJ2Mno4In0.8wKUnlMPIlxq-eWH0d10-Q';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/slusarskiddetroitmi/' + baseMapStyles[0], //stylesheet location
  center: [-83.15, 42.36], // starting position
  zoom: 11.5, // starting zoom
  keyboard : true
});
var markerSource = {
  type: "geojson",
  data: {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [12.695600612967427, 56.04351888068181]
    },
    properties: {}
  }
};
var mly = new Mapillary.Viewer(
  "survey",
  "WGl5Z2dkVHEydGMwWlNMOHUzVHR4QToyMmQ4OTRjYzczZWFiYWVi",
  null
);
var marker;
var currentToggleID = 'c-w-vernor';
// ================== functions =====================
map.on("style.load", function() {
  map.addSource("markers", markerSource);
  map.addLayer({
    id: "markers",
    type: "symbol",
    source: "markers",
    layout: {
      "icon-image": "car-15"
    }
  });
});
mly.on(Mapillary.Viewer.nodechanged, function(node) {
  updateURLParams(['','','','','','',node.key]);
  document.querySelector('#survey-note-card > .street-name > h1').innerHTML = 'LOADING<span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span>';
  var lngLat = [node.latLon.lon, node.latLon.lat];
  var data = {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: lngLat
    },
    properties: {
      "marker-symbol": "marker"
    }
  };
  map.getSource("markers").setData(data);
  setTimeout(function() {
    map.flyTo({
        center: lngLat,
        zoom: 17,
        bearing: 0,

        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        speed: 2, // make the flying slow
        curve: 1, // change the speed at which it zooms out

        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: function (t) {
            return t;
        }
    });
  }, 700);
  survey.getParcelData(lngLat);
});
window.addEventListener('resize', function() { mly.resize(); map.resize(); });
window.onload = function(){
  console.log(getQueryVariable('zoom'));
  console.log(getQueryVariable('lat'));
  console.log(getQueryVariable('lng'));
  console.log(getQueryVariable('parcel'));
  console.log(getQueryVariable('neighborhood'));
  console.log(getQueryVariable('district'));
  if(getQueryVariable('zoom')){
    if (getQueryVariable('lat') && (getQueryVariable('lat') !== '0')) {
      switch (true) {
        case getQueryVariable('district') !== false:
          console.log('load district panel');
          updateURLParams([getQueryVariable('zoom'),getQueryVariable('lng'),getQueryVariable('lat'),'',getQueryVariable('district')]);
          console.log(currentURLParams);
          mapPanel.createFeatureData();
          break;
        case getQueryVariable('neighborhood') !== false:
          console.log('load neighborhood panel');
          updateURLParams([getQueryVariable('zoom'),getQueryVariable('lng'),getQueryVariable('lat'),'','',getQueryVariable('neighborhood')]);
          mapPanel.createFeatureData();
          break;
        case getQueryVariable('parcel') !== false:
          updateURLParams([getQueryVariable('zoom'),getQueryVariable('lng'),getQueryVariable('lat'),getQueryVariable('parcel'),'','']);
          mapPanel.createFeatureData();
          break;
        default:
          mapPanel.createPanel('city');
          map.flyTo({
              center: [getQueryVariable('lng'),getQueryVariable('lat')],
              zoom: getQueryVariable('zoom'),
              bearing: 0,
              // These options control the flight curve, making it move
              // slowly and zoom out almost completely before starting
              // to pan.
              speed: 2, // make the flying slow
              curve: 1, // change the speed at which it zooms out
              // This can be any easing function: it takes a number between
              // 0 and 1 and returns another number between 0 and 1.
              easing: function (t) {
                  return t;
              }
          });
      }
    }else{
      map.flyTo({
          center: [-83.15, 42.36],
          zoom: getQueryVariable('zoom'),
          bearing: 0,
          // These options control the flight curve, making it move
          // slowly and zoom out almost completely before starting
          // to pan.
          speed: 2, // make the flying slow
          curve: 1, // change the speed at which it zooms out
          // This can be any easing function: it takes a number between
          // 0 and 1 and returns another number between 0 and 1.
          easing: function (t) {
              return t;
          }
      });
      updateURLParams([getQueryVariable('zoom'),-83.15, 42.36]);
      if(getQueryVariable('parcel')){
        console.log('there is parcel');
      }else{
        console.log('no parcel');
      }
    }
  }else{
    if (getQueryVariable('lat')) {
      map.flyTo({
          center: [getQueryVariable('lng'),getQueryVariable('lat')],
          zoom: 11.5,
          bearing: 0,
          // These options control the flight curve, making it move
          // slowly and zoom out almost completely before starting
          // to pan.
          speed: 2, // make the flying slow
          curve: 1, // change the speed at which it zooms out
          // This can be any easing function: it takes a number between
          // 0 and 1 and returns another number between 0 and 1.
          easing: function (t) {
              return t;
          }
      });
      updateURLParams([11.5,getQueryVariable('lat'),getQueryVariable('lng')]);
      if(getQueryVariable('parcel')){
        console.log('there is parcel');
      }else{
        console.log('no parcel');
        if(getQueryVariable('district')){
          console.log('there is district');
        }else{
          console.log('no district');
          if(getQueryVariable('neighborhood')){
            console.log('there is neighborhood');
          }else{
            console.log('no neighborhood - loading city');
            mapPanel.createPanel('city');
          }
        }
      }
    }else{
      mapPanel.createPanel('city');
    }
  }
};
var getQueryVariable = function getQueryVariable(variable){
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
     var pair = vars[i].split("=");
     if(pair[0] == variable){
       if(pair[1] !== ''){
        return pair[1];
       }
     }
   }
   return(false);
};
var updateURLParams = function updateURLParams(params){
  // console.log(params);
  // console.log(params.length);
  switch (true) {
    case params.length === 1:
      currentURLParams.zoom = params[0];
      break;
    case params.length === 2:
      currentURLParams.lng = params[0];
      currentURLParams.lat = params[1];
      break;
    case params.length === 3:
      currentURLParams.zoom = params[0];
      currentURLParams.lng = params[1];
      currentURLParams.lat = params[2];
      break;
    case params.length === 4:
      currentURLParams.lng = params[1];
      currentURLParams.lat = params[2];
      currentURLParams.parcel = params[3];
      break;
    case params.length === 5:
      currentURLParams.zoom = params[0];
      currentURLParams.lng = params[1];
      currentURLParams.lat = params[2];
      currentURLParams.district = params[4];
      break;
    case params.length === 6:
      currentURLParams.zoom = params[0];
      currentURLParams.lng = params[1];
      currentURLParams.lat = params[2];
      currentURLParams.parcel = params[3];
      currentURLParams.district = params[4];
      currentURLParams.neighborhood = params[5];
      break;
    default:
      currentURLParams.survey = params[6];
  }
  // console.log(currentURLParams);
  var newTempURL = '';
  for (var property in currentURLParams) {
      if (currentURLParams.hasOwnProperty(property)) {
          // console.log(property);
          // console.log(currentURLParams[property]);
          switch (true) {
            case property !== 0:
              newTempURL += property + '=' + currentURLParams[property] + '&'
              break;
            default:

          }
      }
  }
  // console.log(newTempURL);
  if (history.pushState) {
      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + newTempURL;
      window.history.pushState({path:newurl},'',newurl);
  }
};
var startGeocoderResults = function startGeocoderResults(ev){
  document.querySelector('.overall-number').innerHTML = '';
  document.querySelector('.parcel-info').innerHTML = '';
  document.querySelector('.info-container > .not-rental').innerHTML = '';
  document.querySelector('.info-container > .rental').innerHTML = '';
  document.querySelector('.info-container > .total-rentals').innerHTML = '';
  document.querySelector('.parcel-data.owner').innerHTML = '';
  document.querySelector('.parcel-data.building').innerHTML = '';
  document.querySelector('.parcel-info.display-section').innerHTML = '';
  // console.log(ev.result.geometry);
  map.flyTo({
      center: [ev.result.geometry.coordinates[0], ev.result.geometry.coordinates[1]],
      zoom: 16,
      bearing: 0,

      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      speed: 2, // make the flying slow
      curve: 1, // change the speed at which it zooms out

      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: function (t) {
          return t;
      }
  });
  updateURLParams([ev.result.geometry.coordinates[0],ev.result.geometry.coordinates[1]]);
  var tempInputList = document.querySelectorAll('.mapboxgl-ctrl-geocoder.mapboxgl-ctrl > input');
  var tempAddr = '';
  for (var i = 0; i < tempInputList.length; i++) {
    if (tempInputList[i].value.split(',')[0] !== '') {
      // console.log(tempInputList[i].value.split(',')[0]);
      tempAddr = tempInputList[i].value.split(',')[0];
      tempAddr = tempAddr.split(' ');
      break;
    }else {
      // console.log("Empty input");
    }
  }
  var newTempAddr = '';
  var size = tempAddr.length;
  tempAddr.forEach(function(item, index) {
    newTempAddr += item;
    ((index < size) && (index + 1) !== size) ? newTempAddr += '+': 0;
  });
  // console.log(newTempAddr);
  //================ get parcel data ==========================
  $.getJSON('https://gis.detroitmi.gov/arcgis/rest/services/DoIT/CompositeGeocoder/GeocodeServer/findAddressCandidates?Street=&City=&ZIP=&SingleLine='+ newTempAddr +'&category=&outFields=User_fld&maxLocations=&outSR=&searchExtent=&location=&distance=&magicKey=&f=pjson' , function( data ) {
    //console.log(data.candidates[0].attributes.User_fld);
    map.setFilter("parcel-fill-hover", ["==", "parcelno", data.candidates[0].attributes.User_fld]);
    $.getJSON("https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Rental_Inspections/FeatureServer/0/query?where="+ encodeURI('ParcelNo=\''+data.candidates[0].attributes.User_fld+'\'')+"&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=ACTION_DESCRIPTION%2C+ParcelNo%2C+CSM_RECD_DATE&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=pjson&token=", function( Rental_Inspections ) {
      console.log(Rental_Inspections);
      var tempParcelDataHTML = '';
      if(Rental_Inspections.features.length){
        tempParcelDataHTML += '<article class="info-items"><span>RENTAL STATUS</span> ';
        switch (Rental_Inspections.features[0].attributes.ACTION_DESCRIPTION) {
          case 'Issue Initial Registration ':
            tempParcelDataHTML += '<initial><strong>Certificate of Registration</strong></initial></article>';
            break;
          case 'Issue Renewal Registration':
            tempParcelDataHTML += '<initial><strong>Certificate of Registration</strong></initial></article>';
            break;
          default:
            tempParcelDataHTML += '<cofc><strong>Certificate of Compliance</strong></cofc></article>';
        }
        document.querySelector('.parcel-info.rental-info').innerHTML = tempParcelDataHTML;
        document.querySelector('.info-container > .rental').innerHTML = '<a href="https://app.smartsheet.com/b/form?EQBCT=91c0d55e47064373835ce198802764e2" target="_blank"><article class="form-btn">SUBMIT A RENTER\'S COMPLAINT</article></a>';
        document.querySelector('.info-container > .not-rental').innerHTML = '';
        parcelData['rental-status'] = Rental_Inspections.features[0].attributes.ACTION_DESCRIPTION;
      }else{
        document.querySelector('.parcel-info.rental-info').innerHTML = '<article class="info-items"><span>RENTAL STATUS</span> Not a Rental</article>';
        document.querySelector('.info-container > .not-rental').innerHTML = '<a href="https://app.smartsheet.com/b/form?EQBCT=7b3746bd20a048a5919ae07bd9ed89de" target="_blank"><article class="form-btn">REGISTER MY RENTAL</article></a>';
        parcelData['rental-status'] = 'Not a Rental';
      }
      $.getJSON("https://apis.detroitmi.gov/assessments/parcel/"+data.candidates[0].attributes.User_fld.replace(/\./g,'_')+"/", function( parcel ) {
        //console.log(parcel);
        document.querySelector('.info-container > .street-name').innerHTML = parcel.propstreetcombined;
        // parcelData['owner-display'] += '<article class="info-items"><span>OWNER</span> ' + parcel.ownername1 + '</article>';
        // parcelData['building-display'] += '<article class="info-items"><span>BUILDING TYPE</span> ' + parcel.resb_style + '</article>';
        // parcelData['building-display'] += '<article class="info-items"><span>PARCEL NUMBER</span> ' + parcel.pnum + '</article>';
        // parcelData['building-display'] += '<article class="info-items"><span>YEAR BUILT</span> ' + parcel.resb_yearbuilt + '</article>';
        // document.querySelector('.parcel-info').innerHTML = tempParcelDataHTML;
        document.querySelector('.parcel-data.owner').innerHTML = '<div class="data-view-btn" data-view="owner" onclick="switchParcelDataViews(this)">OWNER INFORMATION <span>&#10095;</span></div>';
        document.querySelector('.parcel-data.building').innerHTML = '<div class="data-view-btn" data-view="building" onclick="switchParcelDataViews(this)">PROPERTY INFORMATION <span>&#10095;</span></div>';
        parcelData['parcel-data'] = parcel;
      });
    });
    var allGeocoders = document.querySelectorAll('.mapboxgl-ctrl-geocoder input[type="text"]');
    for (var t = 0; t < allGeocoders.length; t++) {
      allGeocoders[t].value = "";
    }
  });
  (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
};
var toggleBaseMap = function toggleBaseMap(e) {
  //console.log(e);
  if(e.target.className !== ''){
    //console.log(e.target.className);
    (e.target.className === 'map-view')? map.setStyle('mapbox://styles/slusarskiddetroitmi/' + baseMapStyles[0]) : map.setStyle('mapbox://styles/slusarskiddetroitmi/' + baseMapStyles[1]);
  }else{
    //console.log(e.target.parentElement);
    (e.target.parentElement.className === 'map-view')? map.setStyle('mapbox://styles/slusarskiddetroitmi/' + baseMapStyles[0]) : map.setStyle('mapbox://styles/slusarskiddetroitmi/' + baseMapStyles[1]);
  }
};
var closeInfo = function closeInfo() {
  //console.log('closing');
  // (document.querySelector('#info').className === 'active') ? document.querySelector('#info').className = '' : document.querySelector('#info').className = 'active';
  mapPanel.createPanel('city');
  document.querySelector('.mapboxgl-ctrl-geocoder > input[type="text"]').value = '';
  //console.log('going back to city view');
  map.flyTo({
      center: [-83.15, 42.36], // starting position
      zoom: 11.5,
      bearing: 0,

      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      speed: 2, // make the flying slow
      curve: 1, // change the speed at which it zooms out

      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: function (t) {
          return t;
      }
  });
  updateURLParams(['',-83.15,42.36,'','','']);
};
var closeSurvey = function closeSurvey() {
  console.log('closing survery');
  if(document.querySelector('#info').className !== 'active'){
    document.querySelector('#info').className = 'active';
    mapPanel.createPanel('city');
  }
  console.log(document.querySelector('#info').className === 'active');
  (document.querySelector('#survey').className === 'active') ? document.querySelector('#survey').className = '' : 0;
  (document.querySelector('#survey-note-card').className === '') ? 0 : document.querySelector('#survey-note-card').className = '';
  (document.querySelector('#map').className === 'mapboxgl-map') ? 0 : document.querySelector('#map').className = 'mapboxgl-map';
  (document.querySelector('#legend').className === 'survey-on') ? document.querySelector('#legend').className = '' : 0;
  (document.querySelector('.mapboxgl-control-container').className === 'mapboxgl-control-container') ? 0 : document.querySelector('.mapboxgl-control-container').className = 'mapboxgl-control-container';
  document.querySelector('.mapboxgl-ctrl-geocoder > input[type="text"]').value = '';
  setTimeout(function() {
    mly.resize();
    map.resize();
  }, 500);
  //console.log('going back to city view');
  map.flyTo({
      center: [-83.15, 42.36], // starting position
      zoom: 11.5,
      bearing: 0,

      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      speed: 2, // make the flying slow
      curve: 1, // change the speed at which it zooms out

      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: function (t) {
          return t;
      }
  });
  updateURLParams(['','','','','','','']);
  updateURLParams(['',-83.15,42.36,'','','']);
  survey.clearSurvey();
};
var verifySurveyClose = function verifySurveyClose(action){
  console.log(action.target.id);
  (action.target.id === 'end-survey-btn') ? closeSurvey() : 0;
  (document.querySelector('#end-survey-popup').className === 'active') ? document.querySelector('#end-survey-popup').className = '' : 0;
};
var showSurveyClose = function showSurveyClose(){
  (document.querySelector('#end-survey-popup').className === 'active') ? 0 : document.querySelector('#end-survey-popup').className = 'active';
};
document.getElementById('close-survey-btn').addEventListener('click',showSurveyClose);
document.querySelectorAll('.end-survey-buttons > span').forEach(function(item){
  item.addEventListener('click', function(action){
    verifySurveyClose(action);
  });
});
var changeToggleLayer = function changeToggleLayer(id){
  currentToggleID = id;
  map.removeLayer('need-survey');
  addToggleLayer();
};
document.querySelectorAll('.layer-controller-toggle').forEach(function(item){
  item.addEventListener('click', function(toggle){
    currentToggleID = toggle.target.id;
    addToggleLayer();
  });
});
var addToggleLayer = function addToggleLayer(){
  var corridorName = '';
  switch (currentToggleID) {
    case "c-w-vernor":
      corridorName = 'W+Vernor';
      break;
    case "c-e-vernor":
      corridorName = 'E+Vernor';
      break;
    case "c-michigan":
      corridorName = 'Michigan';
      break;
    case "c-woodward":
      corridorName = 'Woodward';
      break;
    case "c-livernois":
      corridorName = 'Livernois';
      break;
    case "c-grand-river":
      corridorName = 'Grand+River';
      break;
    case "c-seven-mile":
      corridorName = 'Seven+Mile';
      break;
    case "c-mcnichols":
      corridorName = 'McNichols';
      break;
    case "c-gratiot":
      corridorName = 'Gratiot';
      break;
    case "c-jefferson":
      corridorName = 'Jefferson';
      break;
    case "c-warren":
      corridorName = 'Warren';
      break;
    default:

  }
  console.log(encodeURI(corridorName));
  $.getJSON("https://gis.detroitmi.gov/arcgis/rest/services/DoIT/Corridor_Boundaries/MapServer/0/query?where=Corridor%3D%27"+ corridorName +"%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson", function( corridor ) {
    console.log(corridor);
    var simplifiedCorridor = turf.simplify(corridor.features[0], 0.003, false);
    console.log(simplifiedCorridor);
    var arcCorridorPolygon = Terraformer.ArcGIS.convert(simplifiedCorridor.geometry);
    console.log(arcCorridorPolygon);
     $.getJSON("https://gis.detroitmi.gov/arcgis/rest/services/DoIT/Commercial/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry="+ encodeURI(JSON.stringify(arcCorridorPolygon))+"&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=json", function( data ) {
       console.log(data);
       var new_Filter = ["in",'parcelno'];
       for (var i = 0; i < data.features.length; i++) {
         new_Filter.push(data.features[i].attributes.PARCELNO);
       }
       map.addLayer({
        "id": "need-survey",
        "type": "fill",
        "source": "parcels",
        'source-layer': 'parcelsgeojson',
        'filter': new_Filter,
        "paint": {
          "fill-color":"#DF5800",
          "fill-opacity":0.3
        }
      });
     });
  });
};
var addDataLayers = function addDataLayers(){
  map.addSource('parcels', {
    type: 'vector',
    url: 'mapbox://slusarskiddetroitmi.cwobdjn0'
  });
  map.addSource('councils', {
    type: 'geojson',
    data: "https://gis.detroitmi.gov/arcgis/rest/services/NeighborhoodsApp/council_district/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson"
  });
  map.addSource('councils_labels', {
    type: 'geojson',
    data: "https://gis.detroitmi.gov/arcgis/rest/services/NeighborhoodsApp/council_district/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson"
  });
  map.addSource('neighborhoods', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/NeighborhoodsApp/Neighborhoods/MapServer/1/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=2898&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
  });
  map.addSource('neighborhoods-labels', {
    type: 'geojson',
    data: 'https://gis.detroitmi.gov/arcgis/rest/services/NeighborhoodsApp/Neighborhoods/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=2898&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson'
  });
  map.addLayer({
    'id': 'councils_labels',
    'type': 'symbol',
    'source': 'councils_labels', maxzoom: 12,
    'layout': {
      "text-font": ["Mark SC Offc Pro Bold"],
      "text-field": "{name}",
      "symbol-placement": "point",
      "text-size": 22
    },
    'paint': {
      'text-color': 'black'
    }
  });
  map.addLayer({
    "id": "council-borders",
    "type": "line",
    "source": "councils", maxzoom: 12,
    "layout": {},
    "paint": {
      "line-color": "#004b90",
      "line-width": 3
    }
  });
  map.addLayer({
    "id": "council-fill",
    "type": "fill",
    "source": "councils",  maxzoom: 12,
    "layout": {},
    "paint": {
      "fill-color": '#0065c3',
      "fill-opacity": 0
    }
  });
  map.addLayer({
    "id": "council-fill-hover",
    "type": "fill",
    "source": "councils",  maxzoom: 12,
    "layout": {},
    "paint": {
      "fill-color": '#0065c3',
      "fill-opacity": .5
    },
    "filter": ["==", "name", ""]
  });
  map.addLayer({
    "id": "neighborhoods-borders",
    "type": "line",
    "source": "neighborhoods",  minzoom: 12,maxzoom:15.5,
    "layout": {},
    "paint": {
      "line-color": "#004b90",
      "line-width": 3
    }
  });
  map.addLayer({
    "id": "neighborhoods-fill",
    "type": "fill",
    "source": "neighborhoods",  minzoom: 12,maxzoom:15.5,
    "paint":{
      "fill-color": '#fff',
      'fill-opacity': 0
    },
  });
  map.addLayer({
    'id': 'neighborhoods-labels',
    'type': 'symbol',
    'source': 'neighborhoods-labels',
            'minzoom': 12,maxzoom:15.5,
    'layout': {
      "text-font": ["Mark SC Offc Pro Bold"],
      'text-field': '{name}'
    },
    'paint': {
      'text-color': 'black'
    }
  });
  map.addLayer({
      "id": "parcel-fill",
      "type": "fill",
      "source": "parcels", minzoom: 15.5,
      "layout": {
      },
      "paint": {
           "fill-color":"#fff",
           "fill-opacity":0
      },
      'source-layer': 'parcelsgeojson'
   });
   map.addLayer({
      "id": "parcel-line",
      "type": "line",
      "source": "parcels", minzoom: 15.5,
      "layout": {
      },
      "paint": {
           "line-color":"#cbcbcb",
      },
      'source-layer': 'parcelsgeojson'
   });
   map.addLayer({
     "id": "parcel-fill-hover",
     "type": "line",
     "source": "parcels",  minzoom: 15.5,
     "layout": {},
     "paint": {
       "line-color": '#BD0019',
       "line-width": 3
     },
     'source-layer': 'parcelsgeojson',
     "filter": ["==", "parcelno", ""]
   });
   addToggleLayer();
};
map.on('style.load', function(){
  addDataLayers();
  map.resize();
});
map.on('load', function(window) {
  map.on("mousemove", function(e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ["council-fill"]
    });
    if (features.length) {
      map.setFilter("council-fill-hover", ["==", "districts", features[0].properties.districts]);
    }else{
      map.setFilter("council-fill-hover", ["==", "districts", ""]);
      features = map.queryRenderedFeatures(e.point, {
        layers: ["neighborhoods-fill"]
      });
      if (!features.length) {
        features = map.queryRenderedFeatures(e.point, {
          layers: ["parcel-fill"]
        });
        // console.log(features);
        // if (features.length) {
        //   map.setFilter("parcel-fill-hover", ["==", "parcelno", features[0].properties.parcelno]);
        // }else{
        //   map.setFilter("parcel-fill-hover", ["==", "parcelno", ""]);
        // }
      }
    }
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  });
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    bbox: [
        -83.3437,42.2102,
        -82.8754, 42.5197
      ]
  });
  map.addControl(geocoder, 'top-left');
  var sideBarGeocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    bbox: [
        -83.3437,42.2102,
        -82.8754, 42.5197
      ]
  });
  document.getElementById('geocoder').appendChild(sideBarGeocoder.onAdd(map));
  var allGeocoders = document.querySelectorAll('.mapboxgl-ctrl-geocoder input[type="text"]');
  for (var i = 0; i < allGeocoders.length; i++) {
    allGeocoders[i].placeholder = "Lookup an address";
  }
  geocoder.on('result', function(ev) {
    startGeocoderResults(ev);
  });
  sideBarGeocoder.on('result', function(ev) {
    startGeocoderResults(ev);
  });
});
map.on('zoom', function() {
  // console.log(map.getZoom());
  updateURLParams([map.getZoom()]);
});
document.getElementById('close-emergency-modal-btn').addEventListener('click',closeInfo);
var toggleBaseMapBtns = document.querySelectorAll('#basemap-toggle > article');
for (var i = 0; i < toggleBaseMapBtns.length; i++) {
  toggleBaseMapBtns[i].addEventListener('click',function(e){
    toggleBaseMap(e);
  });
}
