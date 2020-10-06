'use strict';
import Controller from './controller.class';
(function(){
  let controller = new Controller(
    1601528496000, 1605502776000, {
    styleURL: 'mapbox://styles/mapbox',
    mapContainer: 'map',
    geocoder: false,
    baseLayers: {
      street: 'streets-v10',
      satellite: 'cj774gftq3bwr2so2y6nqzvz4'
    },
    center: [-83.10, 42.36],
    zoom: 10.75,
    boundaries: {
      sw: [-83.3437,42.2102],
      ne: [-82.8754,42.5197]
    },
    sources: [
      {
        id: "companies",
        type: "geojson",
        data: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/2018_Hydrant_Survey_Companies/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=geojson'
      },
      {
        id: "companies-labels",
        type: "geojson",
        data: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Fire_Company_Labels_2018/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson'
      },
      {
        id: "districts",
        type: "geojson",
        data: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/2018FireHydrantDistricts/FeatureServer/0/query?where=fire_compa+%3D+%27E44%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson'
      },
      {
        id: "districts-labels",
        type: "geojson",
        data: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Fire_Company_District_Labels_2018/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token='
      }
    ],
    layers: [
      {
        "id": "companies-fill",
        "type": "fill",
        "source": "companies",
        "maxzoom": 12.5,
        "layout": {},
        "paint": {
          "fill-color": '#9FD5B3',
          "fill-opacity": .5
        }
      },
      {
        "id": "companies-borders",
        "type": "line",
        "source": "companies",
        "maxzoom": 12.5,
        "layout": {},
        "paint": {
          "line-color": "#004544",
          "line-width": 3
        }
      },
      {
        "id": "companies-hover",
        "type": "fill",
        "source": "companies",
        "maxzoom": 12.5,
        "layout": {},
        "paint": {
          "fill-color": '#23A696',
          "fill-opacity": .5
        },
        "filter": ["==", "fire_compa", ""]
      },
      {
        'id': 'companies-labels',
        'type': 'symbol',
        'source': 'companies-labels',
        "maxzoom": 12.5,
        'layout': {
          "text-font": ["Mark SC Offc Pro Bold"],
          "text-field": "{fire_compa}",
          "symbol-placement": "point",
          "text-size": 22
        },
        'paint': {
          'text-color': '#004544'
        }
      },
      {
        "id": "districts-fill",
        "type": "fill",
        "source": "districts",
        "minzoom": 13,
        "maxzoom": 15,
        "layout": {},
        "paint": {
          "fill-color": '#9FD5B3',
          "fill-opacity": .5
        }
      },
      {
        "id": "districts-borders",
        "type": "line",
        "source": "districts",
        "minzoom": 13,
        "maxzoom": 15,
        "layout": {},
        "paint": {
          "line-color": "#004544",
          "line-width": 3
        }
      },
      {
        "id": "districts-hover",
        "type": "fill",
        "source": "districts",
        "minzoom": 13,
        "maxzoom": 15,
        "layout": {},
        "paint": {
          "fill-color": '#23A696',
          "fill-opacity": .5
        },
        "filter": ["==", "company_di", ""]
      },
      {
        'id': 'districts-labels',
        'type': 'symbol',
        "minzoom": 13,
        "maxzoom": 15,
        'source': 'districts-labels',
        'layout': {
          "text-font": ["Mark SC Offc Pro Bold"],
          "text-field": "{company_di}",
          "symbol-placement": "point",
          "text-size": 22
        },
        'paint': {
          'text-color': '#004544'
        }
      }
    ]
  });
  controller.map.map.on("mousemove", function(e, parent = this) {
    // console.log(this);
    try {
      var features = this.queryRenderedFeatures(e.point, {
        layers: ["companies-fill"]
      });
      // console.log(features);
      if (features.length) {
        // console.log(features);
        this.setFilter("companies-hover", ["==", "fire_compa", features[0].properties.fire_compa]);
      }else{
        this.setFilter("companies-hover", ["==", "fire_compa", ""]);
        if (this.getLayer("districts-fill")) {
          features = this.queryRenderedFeatures(e.point, {
            layers: ["districts-fill"]
          });
          if (features.length) {
            // console.log(features);
            this.setFilter("districts-hover", ["==", "company_di", features[0].properties.company_di]);
          }else{
            this.setFilter("districts-hover", ["==", "company_di", ""]);
            if (this.getLayer("not-inspected-hydrants")) {
              features = this.queryRenderedFeatures(e.point, {
                layers: ["not-inspected-hydrants"]
              });
              if (!features.length) {
                features = this.queryRenderedFeatures(e.point, {
                  layers: ["inspected-hydrants"]
                });
                if (!features.length) {
                  features = this.queryRenderedFeatures(e.point, {
                    layers: ["not-workin-hydrants"]
                  });
                }
              }
            }
          }
        }
      }
      this.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    } catch (e) {
      console.log("Error: " + e);
    }
  });
  controller.map.map.on("click", function(e, parent = this) {
    try {
      var features = this.queryRenderedFeatures(e.point, {
        layers: ["companies-fill"]
      });
      // console.log(e);
      if (features.length) {
        // console.log(features);
        controller.filterData(features, controller);
      }else{
        if (this.getLayer("districts-fill")) {
          features = this.queryRenderedFeatures(e.point, {
            layers: ["districts-fill"]
          });
          if (features.length) {
            // console.log(features);
            controller.filterData(features, controller);
          }else{
            if (this.getLayer("not-inspected-hydrants")) {
              features = this.queryRenderedFeatures(e.point, {
                layers: ["not-inspected-hydrants"]
              });
              if (features.length) {
                // console.log(features);
                controller.filterData(features, controller);
              }else{
                features = this.queryRenderedFeatures(e.point, {
                  layers: ["inspected-hydrants"]
                });
                if (features.length) {
                  // console.log(features);
                  controller.filterData(features, controller);
                }else{
                  features = this.queryRenderedFeatures(e.point, {
                    layers: ["not-workin-hydrants"]
                  });
                  if (features.length) {
                    // console.log(features);
                    controller.filterData(features, controller);
                  }else{
                    console.log('no feature');
                  }
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.log("Error: " + e);
    }
  });
  document.getElementById('query').addEventListener('click', function(e){
    controller.filterData(e, controller);
  });
  let closeAlertBtns = document.querySelectorAll('.close');
  closeAlertBtns.forEach(function(btn){
    btn.addEventListener('click', function(ev){
        controller.closeAlert(ev)
    });
  });

  $( "#start-date" ).datepicker();
  $( "#end-date" ).datepicker();
})(window);
