'use strict';
import Map from './map.class.js';
import Connector from './connector.class.js';
import mapboxgl from 'mapbox-gl';
const turf = require('@turf/simplify');
const arcGIS = require('terraformer-arcgis-parser');
const GeoJSON = require('geojson');
export default class Controller {
  constructor(init) {
    this.time = 30,
    this.map = new Map(init);
    this.state = {
      currentActiveView: 'city',
      selectedCompany: null,
      selectedDistrict: null,
      seelectedHydrant: null
    };
    this.validation = null;
    this.token = null;
    this.companyList = null;
    this.initialLoad();
  }
  initialLoad(){
    document.querySelector('.companies-snapshots.active').innerHTML = '<article class="loading-box">LOADING <span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span></article>';
    let tempParent = this;
    Connector.getData('../private/login.json', function(response){
      Connector.postData("https://cors-anywhere.herokuapp.com/"+"https://gisweb.glwater.org/arcgis/tokens/generateToken", JSON.parse(response), function(response){
        console.log(response);
        Controller.setToken(response);
        Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/HydrantCompanies/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=geojson&token=GbKniXYGtAdr5uBw7F88RSx9wbdYJSYGIUIiNpfbgOYS9XVLLAzfem8XwTbCRpSNLI6EG83nhPop7nZTCEV-SmmZdT7ap9p3hpgZ99wyLeUHsxVNrBGDLaz4Vpc6DDCy64v7zkxz0eIjW3kXU5SkHLtd-NkK-j8xXYUGUSR1lNSVAHmrH82zvGfMBcFq5dSAwUHYm4VQUMgJ_gsXX8F0QcK5hENA3gtMikMW7W8OByTOxR66iFTVXWTMOeWJTXMm', function(response){
          var tempHTML = "";
          JSON.parse(response).features.forEach(function(company){
            tempHTML += '<option value="' + company.properties.new_engine + '"></option>';
          });
          document.getElementById("company-list").innerHTML = tempHTML;
          tempParent.companyList = JSON.parse(response).features;
          let date = new Date();
          date.setDate(date.getDate() - tempParent.time);
          let past30 = date.toISOString().split('T')[0];
          let today = new Date();
          let dd = today.getDate();
          let mm = today.getMonth()+1; //January is 0!
          let yyyy = today.getFullYear();
          today = yyyy + '-' + mm + '-' + dd;
          let surveyed = 0;
          let total = 0;
          let tempSnaps = '';
          tempParent.companyList.forEach(function(company){
            let companySurveyed = 0;
            let companyTotals = 0;
            let simplifiedPolygon = turf(company, 0.003, false);
            let arcPolygon = arcGIS.convert(simplifiedPolygon.geometry);
            let params1 = {
              token : Controller.getToken(),
              where: "INSPECTDT BETWEEN '"+ past30 +"' AND '"+ today +"'",
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
            Connector.postData("https://cors-anywhere.herokuapp.com/"+"https://gisweb.glwater.org/arcgis/rest/services/Hydrants/dwsd_HydrantInspection_v2/MapServer/0/query",params1, function(response){
              companySurveyed = JSON.parse(response).features.length;
              surveyed +=  JSON.parse(response).features.length;
              let params2 = {
                token : Controller.getToken(),
                geometry: JSON.stringify(arcPolygon),
                geometryType: 'esriGeometryPolygon',
                spatialRel: 'esriSpatialRelIntersects',
                outFields: '*',
                returnGeometry: true,
                returnTrueCurves: false,
                returnIdsOnly: false,
                returnCountOnly: true,
                returnZ: false,
                returnM: false,
                returnDistinctValues: false,
                f: 'json'
              }
              Connector.postData("https://cors-anywhere.herokuapp.com/"+"https://gisweb.glwater.org/arcgis/rest/services/Hydrants/dwsd_HydrantInspection_v2/MapServer/0/query",params2, function(response){
                companyTotals = JSON.parse(response).count;
                total += JSON.parse(response).count;
                tempSnaps += '<article class="snap"><label for="'+ company.properties.new_engine +'" class="tooltip--triangle" data-tooltip="'+ companySurveyed +'/'+ companyTotals +'"><span>' + company.properties.new_engine + '</span><div id="'+ company.properties.new_engine +'" ';
                switch (true) {
                  case (companySurveyed/companyTotals) < .25:
                    tempSnaps += 'class="progress zero">';
                    break;
                  case ((companySurveyed/companyTotals) >= .25 && (companySurveyed/companyTotals) < .5):
                    tempSnaps += 'class="progress twenty-five">';
                    break;
                  case ((companySurveyed/companyTotals) >= .5 && (companySurveyed/companyTotals) < .75):
                    tempSnaps += 'class="progress fifty">';
                    break;
                  case ((companySurveyed/companyTotals) >= .75 && (companySurveyed/companyTotals) < 1):
                    tempSnaps += 'class="progress seventy-five">';
                    break;
                  default:
                    tempSnaps += 'class="progress hundred">';
                }
                tempSnaps += '<div class="progress-bar"><div class="percentage">' + Math.trunc((companySurveyed/companyTotals) * 100) + '</div></div></div></label></article>';
                document.querySelector('.companies-snapshots.active').innerHTML = tempSnaps;
                document.getElementById('surveyed-num').innerHTML = surveyed;
                document.getElementById('not-surveyed-num').innerHTML = total - surveyed;
              });
            });
          });
        });
      });
    });
  }
  filterByCompany(startDate, endDate, company, controller){
    document.querySelector('.companies-snapshots').className = "companies-snapshots";
    document.querySelector('.data-panel').className = "data-panel active";
    document.querySelector('.map-panel').className = "map-panel active";
    document.getElementById('surveyed-num').innerHTML = 0;
    document.getElementById('not-surveyed-num').innerHTML = 0;
    controller.state.currentActiveView = 'company';
    controller.state.selectedCompany = company;
    Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/CompanyLabels/FeatureServer/0/query?where=new_engine+%3D+%27'+ company +'%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=5So00jOfZyq3hcqvFzBlBd_84UfknMx26gj_s3tPSj0L1_yGnn6qcd_WvnNH6U-OiQzdYIqbk76nk76R_RJAkZSoYMDo2zPcXla9gGDcRha7mxvAt6ACpKgLMzgz7BLNWSrdgw9gIxTlKquL4OJMON6ukWwdIuKiztmQ5CTFLR0nVLdEpCkfzI912F5iLTFmHvrO7vDU6YklT1t4XBtfIQ2Y57xdJvcCNQE3qbqR2ESwldHo60rS5xEgVh-mg0np', function(response){
        let centerPoint = JSON.parse(response);
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
    document.querySelector('.cf').innerHTML = '<li><a href="#"><span>1</span><span>City</span></a></li><li><a href="#"><span>2</span><span>Company - '+company+'</span></a></li>';
    Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/2017FireHydrantDistricts/FeatureServer/0/query?where=fire_compa+%3D+%27' + company + '%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=', function(response){
      let responseObj = JSON.parse(response);
      document.querySelector('.tabular-titles').innerHTML = "<div>District</div><div>Inspected</div><div>Not Inspected</div>";
      document.querySelector('.tabular-body').innerHTML = '<article class="loading-box">LOADING <span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span></article>';
      controller.map.map.getSource('districts').setData(responseObj);
      Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/HydrantLabels/FeatureServer/0/query?where=fire_compa+%3D+%27' + company + '%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=q_I5u9NsU394TD1r8ivM2ABFGzDSpV4syF8RUojmiorqWmE1ILksZgi8homADnEBeGiCt0t5C1pzmyTbcj3_aNrpby5e_WK5zOz3lLi6vbmYHy7K4bXrCfRY0iDdv8FgWtP--BSlb6BEurVx3jaYtfl1BwsjCxMfaAgqhU9sm1RtQNyzj56zdjfXjQNb298d-1nBIaZDZ4JWYvzX1zwW_DiZ0paiP7zZElRxGsKrnWeu9oYjY-OtaAUYtPR9E-Zk', function(response){
        let responseObj = JSON.parse(response);
        if(controller.map.map.getSource('districts-labels')){
           controller.map.map.getSource('districts-labels').setData(responseObj);
        }else{
        }
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
        let simplifiedPolygon = turf(responseObj.features[i], 0.003, false);
        let arcPolygon = arcGIS.convert(simplifiedPolygon.geometry);
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
            tempDistrict.surveyed = JSON.parse(response).features.length;
            tempDistrict.notSurveyed = tempDistrict.hydrants - JSON.parse(response).features.length;
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
  filterByDistrict(startDate, endDate, district, controller){
    document.querySelector('.companies-snapshots').className = "companies-snapshots";
    document.querySelector('.data-panel').className = "data-panel active";
    document.querySelector('.map-panel').className = "map-panel active";
    document.getElementById('surveyed-num').innerHTML = 0;
    document.getElementById('not-surveyed-num').innerHTML = 0;
    controller.state.currentActiveView = 'district';
    controller.state.selectedDistrict = district;
    Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/HydrantLabels/FeatureServer/0/query?where=company_di%3D+%27' + district + '%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=q_I5u9NsU394TD1r8ivM2ABFGzDSpV4syF8RUojmiorqWmE1ILksZgi8homADnEBeGiCt0t5C1pzmyTbcj3_aNrpby5e_WK5zOz3lLi6vbmYHy7K4bXrCfRY0iDdv8FgWtP--BSlb6BEurVx3jaYtfl1BwsjCxMfaAgqhU9sm1RtQNyzj56zdjfXjQNb298d-1nBIaZDZ4JWYvzX1zwW_DiZ0paiP7zZElRxGsKrnWeu9oYjY-OtaAUYtPR9E-Zk', function(response){
        let centerPoint = JSON.parse(response);
        controller.map.map.flyTo({
            center: [centerPoint.features[0].geometry.x, centerPoint.features[0].geometry.y],
            zoom: 15.5,
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
    document.querySelector('.cf').innerHTML = '<li><a href="#"><span>1</span><span>City</span></a></li><li><a href="#"><span>2</span><span>Company - '+ controller.state.selectedCompany +'</span></a></li><li><a href="#"><span>3</span><span>District - '+ district +'</span></a></li>';
    
    let params = {
      token : Controller.getToken(),
      where: "FIREDISTID='" + district + "'", 
      geometryType: "esriGeometryEnvelope",
      spatialRel: "esriSpatialRelIntersects",
      outFields: '*',
      returnGeometry: true,
      returnTrueCurves: false,
      returnIdsOnly: false,
      returnCountOnly: false,
      outSR: 4326,
      returnZ: false,
      returnM: false,
      returnDistinctValues: false,
      f: 'json'
    }
    Connector.postData("https://cors-anywhere.herokuapp.com/"+"https://gisweb.glwater.org/arcgis/rest/services/Hydrants/dwsd_HydrantInspection_v2/MapServer/0/query",params, function(response){
      console.log(JSON.parse(response));
      let responseObj = JSON.parse(response);
      let hydrantList = {
        "type": "FeatureCollection",
        "features": []
      };
      responseObj.features.forEach(function(hydrant){
        hydrantList.features.push({
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              hydrant.geometry.x,
              hydrant.geometry.y
            ]
          },
          "properties": {
            ID: hydrant.attributes.HYDRANTID,
            condition: hydrant.attributes.CONDITION,
            inspectedOn: hydrant.attributes.INSPECTDT,
            address: hydrant.attributes.LOCDESC,
            notes: hydrant.attributes.NOTES
          }
        });
      });
      if(controller.map.map.getSource('hydrants')){
        console.log("Updating hydrants");
        controller.map.map.getSource('hydrants').setData(hydrantList);
      }else{
        console.log("adding hydrants");
        controller.map.map.addSource('hydrants', {
          type: 'geojson',
          data: hydrantList
        });
        controller.map.map.loadImage('img/fire-hydrant-blue.png', function(error, image) {
          if (error) throw error;
          controller.map.map.addImage('hydrant', image);
          controller.map.map.addLayer({
              "id": "hydrants",
              "type": "symbol",
              "source": 'hydrants',
              "layout": {
                  "icon-image": "hydrant",
                  "icon-size": 0.5
              }
          });
        });
      }
      // tempDistrict.surveyed = JSON.parse(response).features.length;
      // tempDistrict.notSurveyed = tempDistrict.hydrants - JSON.parse(response).features.length;
      // tempRowHtml += "<div>"+ tempDistrict.name +"</div><div>"+ tempDistrict.surveyed +"</div><div>" + tempDistrict.notSurveyed + "</div></article>";
      // tempTabBody += tempRowHtml;
      // totalSurveyed += tempDistrict.surveyed;
      // totalNotSurved += tempDistrict.notSurveyed;
      // document.querySelector('.tabular-body').innerHTML = tempTabBody;
      // document.getElementById('surveyed-num').innerHTML = totalSurveyed;
      // document.getElementById('not-surveyed-num').innerHTML = totalNotSurved;
    });
  }
  filterData(e, controller){
    let tempParent = this;
    let startDate = null;
    let endDate = null;
    let polygon = null;
    if(Array.isArray(e)){
      let date = new Date();
      date.setDate(date.getDate() - tempParent.time);
      let endDate = date.toISOString().split('T')[0];
      let startDate = new Date();
      let dd = startDate.getDate();
      let mm = startDate.getMonth()+1; //January is 0!
      let yyyy = startDate.getFullYear();
      startDate = yyyy + '-' + mm + '-' + dd;
      switch (e[0].layer.id) {
        case "companies-fill":
          polygon = e[0].properties.new_engine;
          controller.filterByCompany(startDate,endDate,polygon,controller);
          break;
        case "districts-fill":
          polygon = e[0].properties.company_di;
          controller.filterByDistrict(startDate,endDate,polygon,controller);
          break;
        default:
          
      }
    }else{
      startDate = document.getElementById('start-date').value;
      endDate = document.getElementById('end-date').value;
      polygon = document.getElementById('company').value;
      switch (true) {
        case startDate === '':
          document.querySelector('#alert-overlay div').innerHTML = "Need start date.";
          document.getElementById('alert-overlay').className = 'active';
          break;
        case endDate === '':
          document.querySelector('#alert-overlay div').innerHTML = "Need end date.";
          document.getElementById('alert-overlay').className = 'active';
          break;
        case polygon === '':
          document.querySelector('#alert-overlay div').innerHTML = "Need company.";
          document.getElementById('alert-overlay').className = 'active';
          break;
        default:
          let temp = startDate.split('/');
          startDate = temp[2] + '-' + temp[0] + '-' + temp[1];
          temp = endDate.split('/');
          endDate = temp[2] + '-' + temp[0] + '-' + temp[1];
          controller.filterByCompany(startDate,endDate,polygon, controller);
      }
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
