'use strict';
import Controller from './controller.class.js';
import Connector from './connector.class.js';
(function(){
  let controller = new Controller(
    1506830400, 1512104400, {
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
        data: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/HydrantCompanies/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=geojson'
      },
      {
        id: "companies-labels",
        type: "geojson",
        data: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/CompanyLabels/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=5So00jOfZyq3hcqvFzBlBd_84UfknMx26gj_s3tPSj0L1_yGnn6qcd_WvnNH6U-OiQzdYIqbk76nk76R_RJAkZSoYMDo2zPcXla9gGDcRha7mxvAt6ACpKgLMzgz7BLNWSrdgw9gIxTlKquL4OJMON6ukWwdIuKiztmQ5CTFLR0nVLdEpCkfzI912F5iLTFmHvrO7vDU6YklT1t4XBtfIQ2Y57xdJvcCNQE3qbqR2ESwldHo60rS5xEgVh-mg0np'
      },
      {
        id: "districts",
        type: "geojson",
        data: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/2017FireHydrantDistricts/FeatureServer/0/query?where=fire_compa+%3D+%27E44%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson'
      },
      {
        id: "districts-labels",
        type: "geojson",
        data: 'https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/HydrantLabels/FeatureServer/0/query?where=fire_compa+%3D+%27E44%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=q_I5u9NsU394TD1r8ivM2ABFGzDSpV4syF8RUojmiorqWmE1ILksZgi8homADnEBeGiCt0t5C1pzmyTbcj3_aNrpby5e_WK5zOz3lLi6vbmYHy7K4bXrCfRY0iDdv8FgWtP--BSlb6BEurVx3jaYtfl1BwsjCxMfaAgqhU9sm1RtQNyzj56zdjfXjQNb298d-1nBIaZDZ4JWYvzX1zwW_DiZ0paiP7zZElRxGsKrnWeu9oYjY-OtaAUYtPR9E-Zk'
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
        "filter": ["==", "new_engine", ""]
      },
      {
        'id': 'companies-labels',
        'type': 'symbol',
        'source': 'companies-labels',
        "maxzoom": 12.5,
        'layout': {
          "text-font": ["Mark SC Offc Pro Bold"],
          "text-field": "{new_engine}",
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
        this.setFilter("companies-hover", ["==", "new_engine", features[0].properties.new_engine]);
      }else{
        this.setFilter("companies-hover", ["==", "new_engine", ""]);
        if (this.getLayer("districts-fill")) {
          features = this.queryRenderedFeatures(e.point, {
            layers: ["districts-fill"]
          });
          if (features.length) {
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
      if (features.length) {
        console.log(features);
        controller.filterData(features, controller);
      }else{
        if (this.getLayer("districts-fill")) {
          features = this.queryRenderedFeatures(e.point, {
            layers: ["districts-fill"]
          });
          if (features.length) {
            console.log(features);
            controller.filterData(features, controller);
          }else{
            if (this.getLayer("not-inspected-hydrants")) {
              features = this.queryRenderedFeatures(e.point, {
                layers: ["not-inspected-hydrants"]
              });
              if (features.length) {
                console.log(features);
                controller.filterData(features, controller);
              }else{
                features = this.queryRenderedFeatures(e.point, {
                  layers: ["inspected-hydrants"]
                });
                if (features.length) {
                  console.log(features);
                  controller.filterData(features, controller);
                }else{
                  console.log('no feature');
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
  document.querySelector('.close').addEventListener('click', controller.closeAlert);
  $( "#start-date" ).datepicker();
  $( "#end-date" ).datepicker();
})(window);
