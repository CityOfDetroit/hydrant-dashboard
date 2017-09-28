'use strict';
import Map from './map.class.js';
import Connector from './connector.class.js';
import mapboxgl from 'mapbox-gl';
const turf = require('@turf/simplify');
const arcGIS = require('terraformer-arcgis-parser');
export default class Controller {
  constructor(init) {
    this.map = new Map(init);
    this.state = {
      viewType: null,
      selectedItem: null,
    };
    this.validation = null;
    this.token = null;
    Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/2017FireHydrantDistricts/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=fire_compa&returnHiddenFields=false&returnGeometry=false&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=true&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=4Rx_VuUQZQPhiWemwNAgOcRksv1y0y1msq9vLpeCMRUPMYwj18g_DbD0g0uz1A1tDmfudKNi7erXHX4PnW-obE1B0Pa7fzxe_T2dAUV2zMtpdrpoeCCvgZ-8cXl8Jg-oSfsc91c_pOmEd2frk5rLu6b5MbnL3dx1wnD2bm5oLQVCPGlm-NQNXc_GJswNWRAJYvIWLrXaF_1UW670M4xpFT9JKxgQe8-9oi-mjOGozGkdhjBlXwPAoR5KcOsQ_gEr', function(response){
      console.log(JSON.parse(response));
      var tempHTML = "";
      JSON.parse(response).features.forEach(function(company){
        tempHTML += '<option value="' + company.attributes.fire_compa + '"></option>';
      });
      document.getElementById("company-list").innerHTML = tempHTML;
    });
  }
  filterData(e, controller){
    console.log(e);
    console.log(controller);
    console.log(Controller.getToken());
    let startDate = document.getElementById('start-date').value;
    let endDate = document.getElementById('end-date').value;
    let company = document.getElementById('company').value;
    console.log('moving');
    switch (true) {
      case startDate === '':
        document.querySelector('#alert-overlay div').innerHTML = "Need start date.";
        document.getElementById('alert-overlay').className = 'active';
        break;
      case endDate === '':
        document.querySelector('#alert-overlay div').innerHTML = "Need end date.";
        document.getElementById('alert-overlay').className = 'active';
        break;
      case company === '':
        document.querySelector('#alert-overlay div').innerHTML = "Need company.";
        document.getElementById('alert-overlay').className = 'active';
        break;
      default:
        console.log(startDate + ',' + endDate + ',' + company);
        console.log(Controller.getToken());
        let temp = startDate.split('/');
        startDate = temp[2] + '-' + temp[0] + '-' + temp[1];
        temp = endDate.split('/');
        endDate = temp[2] + '-' + temp[0] + '-' + temp[1];
        document.querySelector('.data-panel').className = "data-panel active";
        document.querySelector('.map-panel').className = "map-panel active";
        controller.map.map.resize();
        Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/CompanyLabels/FeatureServer/0/query?where=new_engine+%3D+%27' + company + '%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=json&token=5So00jOfZyq3hcqvFzBlBd_84UfknMx26gj_s3tPSj0L1_yGnn6qcd_WvnNH6U-OiQzdYIqbk76nk76R_RJAkZSoYMDo2zPcXla9gGDcRha7mxvAt6ACpKgLMzgz7BLNWSrdgw9gIxTlKquL4OJMON6ukWwdIuKiztmQ5CTFLR0nVLdEpCkfzI912F5iLTFmHvrO7vDU6YklT1t4XBtfIQ2Y57xdJvcCNQE3qbqR2ESwldHo60rS5xEgVh-mg0np', function(response){
            let centerPoint = JSON.parse(response);
            console.log(centerPoint);
            console.log(controller.map.map);
            controller.map.map.flyTo({
                center: [centerPoint.features[0].geometry.x, centerPoint.features[0].geometry.y],
                zoom: 13,
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
        });
        document.querySelector('.cf').innerHTML = '<li><a href="#"><span>1</span><span>City</span></a></li><li><a href="#"><span>2</span><span>Company</span></a></li>';
        Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/2017FireHydrantDistricts/FeatureServer/0/query?where=fire_compa+%3D+%27' + company + '%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=', function(response){
          let responseObj = JSON.parse(response);
          console.log(responseObj);
          document.querySelector('.tabular-titles').innerHTML = "<div>District</div><div>Surveyed</div><div>Need Survey</div>";
          document.querySelector('.tabular-body').innerHTML = "Loading ...";

          controller.map.removeLayers(['districs-fill','districs-borders','districs-hover']);

          controller.map.updateSources([{
            id: "districts",
            type: "geojson",
            data: responseObj
          }]);
          controller.map.updateLayers([
            {
              "id": "districs-fill",
              "type": "fill",
              "source": "districts",
              "minzoom": 13,
              "layout": {},
              "paint": {
                "fill-color": '#9FD5B3',
                "fill-opacity": .5
              }
            },
            {
              "id": "districs-borders",
              "type": "line",
              "source": "districts",
              "minzoom": 13,
              "layout": {},
              "paint": {
                "line-color": "#004544",
                "line-width": 3
              }
            },
            {
              "id": "districs-hover",
              "type": "fill",
              "source": "districts",
              "minzoom": 13,
              "layout": {},
              "paint": {
                "fill-color": '#23A696',
                "fill-opacity": .5
              },
              "filter": ["==", "company_di", ""]
            }
          ]);
          controller.map.loadMap();
          Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/HydrantLabels/FeatureServer/0/query?where=fire_compa+%3D+%27' + company + '%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=q_I5u9NsU394TD1r8ivM2ABFGzDSpV4syF8RUojmiorqWmE1ILksZgi8homADnEBeGiCt0t5C1pzmyTbcj3_aNrpby5e_WK5zOz3lLi6vbmYHy7K4bXrCfRY0iDdv8FgWtP--BSlb6BEurVx3jaYtfl1BwsjCxMfaAgqhU9sm1RtQNyzj56zdjfXjQNb298d-1nBIaZDZ4JWYvzX1zwW_DiZ0paiP7zZElRxGsKrnWeu9oYjY-OtaAUYtPR9E-Zk', function(response){
            let responseObj = JSON.parse(response);
            console.log(responseObj);
            let sourcePromise = new Promise((resolve, reject) => {
              (this.loadSources()) ? resolve(this) : reject(this);
            });
            sourcePromise.then(function(val){
              val.loadLayers(val);
            }).catch(function(e){
              console.log("Error:" + e);
            });
            controller.map.updateSources([{
              id: "districts-labels",
              type: "geojson",
              data: responseObj
            }]);
            controller.map.updateLayers([
              {
                'id': 'districts-labels',
                'type': 'symbol',
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
            ]);
            controller.map.loadMap();
          });
          let tempTabBody = "";
          let totalSurveyed = 0;
          let totalNotSurved = 0;
          for (var i = 0; i < responseObj.features.length; i++) {
            let tempRowHtml = "<article id=\"row-"+ i +"\" class=\"tabular-row\">";
            let tempDistrict = {
              name: responseObj.features[i].properties.company_di,
              hydrants: responseObj.features[i].properties.total_hydr,
              surveyed: null,
              notSurveyed: null
            }
            console.log(Controller.getToken());
            let simplifiedPolygon = turf(responseObj.features[i], 0.003, false);
            console.log(simplifiedPolygon);
            let arcPolygon = arcGIS.convert(simplifiedPolygon.geometry);
            console.log(JSON.stringify(arcPolygon));
            let params = {
              token : Controller.getToken(),
              where: "INSPECTDT BETWEEN '"+ startDate +"' AND '"+ endDate +"'",
              geometry: JSON.stringify(arcPolygon),
              geometryType: 'esriGeometryPolygon',
              spatialRel: 'esriSpatialRelIntersects',
              outFields: '*',
              returnGeometry: true,
              returnTrueCurves: false,
              returnIdsOnly: false,
              returnCountOnly: false,
              orderByFields: 'INSPECTDT DESC',
              returnZ: false,
              returnM: false,
              returnDistinctValues: false,
              f: 'json'
            }
            Connector.postData("https://cors-anywhere.herokuapp.com/"+"https://gisweb.glwater.org/arcgis/rest/services/Hydrants/dwsd_HydrantInspection_v2/MapServer/0/query",params, function(response){
                console.log(JSON.parse(response));
                tempDistrict.surveyed = JSON.parse(response).features.length;
                tempDistrict.notSurveyed = tempDistrict.hydrants - JSON.parse(response).features.length;
                console.log(tempDistrict);
                tempRowHtml += "<div>"+ tempDistrict.name +"</div><div>"+ tempDistrict.surveyed +"</div><div>" + tempDistrict.notSurveyed + "</div></article>";
                tempTabBody += tempRowHtml;
                totalSurveyed += tempDistrict.surveyed;
                totalNotSurved += tempDistrict.notSurveyed;
                document.querySelector('.tabular-body').innerHTML = tempTabBody;
                document.getElementById('surveyed-num').innerHTML = totalSurveyed;
                document.getElementById('not-surveyed-num').innerHTML = totalNotSurved;
            });
          }
        });
    }
  }
  closeAlert(){
    document.getElementById('alert-overlay').className = '';
  }
  static setValidation(val){
    this.validation = val;
  }
  static setMap(map){
    this.map = map;
  }
  static getMap(){
    return this.map;
  }
  static getToken(){
    return this.token;
  }
  static setToken(token){
    this.token = token;
  }
}
