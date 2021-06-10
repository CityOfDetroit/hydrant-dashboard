'use strict';
import Map from './map.class';
import Connector from './connector.class';

const iHydrantName = require('./img/fire-hydrant-inspected.png');
const nHydrantName = require('./img/fire-hydrant-not-inspected.png');
const bHydrantName = require('./img/fire-hydrant-broke.png');

const turf = require('@turf/simplify');
const arcGIS = require('terraformer-arcgis-parser');
const GeoJSON = require('geojson');

require('es6-promise').polyfill();
require('isomorphic-fetch');
export default class Controller {
  constructor(start, end, init) {
    this.surveyPeriod = {
      start: start,
      end: end
    }
    this.cityData = {
      companies: null,
      hydrants: null
    };
    this.time = 30,
    this.map = new Map(init);
    this.state = {
      currentActiveView: 'city',
      selectedCompany: {
        name: null,
        data: null,
        geometry: null
      },
      selectedDistrict: {
        name: null,
        geometry: null
      },
      selectedHydrant: null
    };
    this.validation = null;
    this.token = null;
    this.companyList = null;
    this.initialLoad();
  }
  initialLoad(){
    let tempDate = new Date(this.surveyPeriod.start);
    document.getElementById('start-date').value = (tempDate.getMonth()+1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear();
    tempDate = new Date(this.surveyPeriod.end);
    document.getElementById('end-date').value = (tempDate.getMonth()+1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear();
    let tempParent = this;
    let url = 'https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/2018_Hydrant_Survey_Companies/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&quantizationParameters=&sqlFormat=none&f=geojson';
    fetch(url)
    .then((resp) => resp.json()) // Transform the data into json
    .then(function(response) {
      let tempHTML = "";
      tempParent.cityData.companies = {};
      response.features.forEach(function(company){
        tempHTML += '<option value="' + company.properties.fire_compa + '"></option>';
        tempParent.cityData.companies[""+ company.properties.fire_compa] =  {inspected: 0, total: 0};
      });
      document.getElementById("company-list").innerHTML = tempHTML;
      Connector.getData('https://apis.detroitmi.gov/data_cache/hydrants/', function(response){
        // console.log(JSON.parse(response));
        tempParent.cityData.hydrants = JSON.parse(response);
        tempParent.loadCityData(tempParent);
      });
    });
  }
  loadCityData(controller){
    document.querySelector('.tabular-titles').innerHTML = "";
    document.querySelector('.tabular-body').innerHTML = '';
    document.querySelector('.blocks-body').innerHTML = "";
    document.querySelector('.cf').innerHTML = '<li><a href="#"><span>1</span><span class="breadcrumb-title">City</span></a></li>';
    // document.querySelector('.companies-snapshots.active').innerHTML = '<article class="loading-box">LOADING <span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span></article>';
    controller.map.map.flyTo({
        center: [-83.10, 42.36],
        zoom: 10.75,
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
    for(let tempComp in controller.cityData.companies){
      controller.cityData.companies[tempComp] = {inspected: 0, total: 0, broke: 0};
    }
    // console.log(controller.surveyPeriod);
    controller.cityData.hydrants.data.features.forEach(function(hydrant){
      if(hydrant.attributes.FIREDISTID != null){
        let tempCompanyName = hydrant.attributes.FIREDISTID.split('-')[0];
        if(controller.cityData.companies[tempCompanyName]){
          if(hydrant.attributes.INSPECTDT >= controller.surveyPeriod.start && hydrant.attributes.INSPECTDT <= controller.surveyPeriod.end){
            controller.cityData.companies[tempCompanyName].inspected++;
          }
          (hydrant.attributes.OPERABLE === 'No') ? controller.cityData.companies[tempCompanyName].broke++ : 0;
          controller.cityData.companies[tempCompanyName].total++;
        }
      }
    });
    let tempSnaps = "";
    let totalHydrants = 0;
    let totalInspected = 0;
    let totalBroke = 0;
    // console.log(controller.cityData.companies);
    for(let comp in controller.cityData.companies){
      totalHydrants += controller.cityData.companies[comp].total;
      totalInspected += controller.cityData.companies[comp].inspected;
      totalBroke += controller.cityData.companies[comp].broke;
      tempSnaps += '<article class="snap"><label for="'+ comp +'" class="tooltip--triangle" data-tooltip="'+ controller.cityData.companies[comp].inspected +'/'+ controller.cityData.companies[comp].total +'"><span>' + comp + '</span><div id="'+ comp +'" ';
      switch (true) {
        case (controller.cityData.companies[comp].inspected/controller.cityData.companies[comp].total) < .25:
          tempSnaps += 'class="progress zero">';
          break;
        case ((controller.cityData.companies[comp].inspected/controller.cityData.companies[comp].total) >= .25 && (controller.cityData.companies[comp].inspected/controller.cityData.companies[comp].total) < .5):
          tempSnaps += 'class="progress twenty-five">';
          break;
        case ((controller.cityData.companies[comp].inspected/controller.cityData.companies[comp].total) >= .5 && (controller.cityData.companies[comp].inspected/controller.cityData.companies[comp].total) < .75):
          tempSnaps += 'class="progress fifty">';
          break;
        case ((controller.cityData.companies[comp].inspected/controller.cityData.companies[comp].total) >= .75 && (controller.cityData.companies[comp].inspected/controller.cityData.companies[comp].total) < 1):
          tempSnaps += 'class="progress seventy-five">';
          break;
        default:
          tempSnaps += 'class="progress hundred">';
      }
      tempSnaps += '<div class="progress-bar"><div class="percentage">' + Math.trunc((controller.cityData.companies[comp].inspected/controller.cityData.companies[comp].total) * 100) + '%</div></div></div></label></article>';
    }
    document.querySelector('.companies-snapshots.active').innerHTML = tempSnaps;
    document.getElementById('surveyed-num').innerHTML = totalInspected.toLocaleString();
    document.getElementById('not-working-num').innerHTML = totalBroke.toLocaleString();
    document.getElementById('not-surveyed-num').innerHTML = (totalHydrants - totalInspected).toLocaleString();
    document.getElementById('initial-loader-overlay').className = '';
    let bars = document.querySelectorAll('.progress');
    bars.forEach(function(bar){
      bar.addEventListener('click', function(ev){
        // console.log(ev);
        let id = null;
        if(ev.target.id != ''){
          id = ev.target.id;
        }else{
          id = ev.target.parentNode.parentNode.id;
        }
        // console.log(id);
        controller.filterByCompany(id, controller);
      });
    });
  }
  closeAlert(ev){
    (ev.target.parentNode.parentNode.id === 'alert-overlay') ? document.getElementById('alert-overlay').className = '': document.getElementById('drill-down-overlay').className = '';
  }
  loadDrillDown(ev, controller){
    // console.log(ev);
    // console.log(ev.target.parentNode.id);
    // console.log(controller.state.selectedCompany.data[ev.target.parentNode.id]);
    let tempHTML = '<h1>District - ' + ev.target.parentNode.id + '</h1><article class="hydrant-title"><article>HYDRANT ID</article><article>ADDRESS</article><article>LAST INSPECTED</article></article>';
    if(ev.target.className === 'not-inspected broken-list'){
      controller.state.selectedCompany.data[ev.target.parentNode.id].brokenList.forEach(function(hydrant){
        let date = new Date(hydrant.attributes.INSPECTDT);
        tempHTML += '<article class="hydrant-row"><article>' + hydrant.attributes.HYDRANTID + '</article><article>' + hydrant.attributes.LOCDESC + '</article><article>' + date.toLocaleString("en-us", { month: "short" }) + ' ' + date.getDate() + ', ' + date.getFullYear() + '</article></article>';
      });
    }else{
      controller.state.selectedCompany.data[ev.target.parentNode.id].notInspected.forEach(function(hydrant){
        let date = new Date(hydrant.attributes.INSPECTDT);
        tempHTML += '<article class="hydrant-row"><article>' + hydrant.attributes.HYDRANTID + '</article><article>' + hydrant.attributes.LOCDESC + '</article><article>' + date.toLocaleString("en-us", { month: "short" }) + ' ' + date.getDate() + ', ' + date.getFullYear() + '</article></article>';
      });
    }
    document.querySelector('#drill-down-overlay div').innerHTML = tempHTML;
    document.getElementById('drill-down-overlay').className = 'active';
  }
  loadPrevious(prev, controller){
    let viewType = null;
    let item = null;
    if(prev.target.tagName === "A"){
      viewType = prev.target.children[1].innerText.split('-')[0].trim();
      if(viewType === "District"){
        (item = prev.target.children[1].innerText.split('-')[1] === undefined) ? 0 : item = prev.target.children[1].innerText.split('-')[1].trim() + "-" + prev.target.children[1].innerText.split('-')[2].trim();
      }else{
        (item = prev.target.children[1].innerText.split('-')[1] === undefined) ? 0 : item = prev.target.children[1].innerText.split('-')[1].trim();
      }
    }else{
      if(prev.target.className === ""){
        viewType = prev.target.nextSibling.innerText.split('-')[0].trim();
        if(viewType === "District"){
          (item = prev.target.nextSibling.innerText.split('-')[1] === undefined) ? 0 : item = prev.target.nextSibling.innerText.split('-')[1].trim() + "-" + prev.target.nextSibling.innerText.split('-')[2].trim();
        }else{
          (item = prev.target.nextSibling.innerText.split('-')[1] === undefined) ? 0 : item = prev.target.nextSibling.innerText.split('-')[1].trim();
        }
      }else{
        viewType = prev.target.innerText.split('-')[0].trim();
        if(viewType === "District"){
          (item = prev.target.innerText.split('-')[1] === undefined) ? 0 : item = prev.target.innerText.split('-')[1].trim() + "-" + prev.target.innerText.split('-')[2].trim();
        }else{
          (item = prev.target.innerText.split('-')[1] === undefined) ? 0 : item = prev.target.innerText.split('-')[1].trim();
        }
      }
    }
    // console.log(viewType);
    // console.log(item);
    let tmpObj = [{
      layer: {
        id: null
      },
      properties: {

      }
    }];
    switch (viewType) {
      case 'City':
        tmpObj[0].layer.id = "city";
        break;
      case 'Company':
        tmpObj[0].layer.id = "companies-fill";
        tmpObj[0].properties.fire_compa = item;
        break;
      case 'District':
        tmpObj[0].layer.id = "districts-fill";
        tmpObj[0].properties.company_di = item;
        break;
      default:
        // console.log("Hydrant view can't go back");
    }
    controller.filterData(tmpObj, controller);
  }
  filterData(e, controller){
    let tempParent = this;
    let startDate = null;
    let endDate = null;
    let polygon = null;
    if(Array.isArray(e)){
      // console.log(e[0].layer.id);
      switch (e[0].layer.id) {
        case 'city':
          controller.loadCityData(controller);
          break;
        case "companies-fill":
          polygon = e[0].properties.fire_compa;
          controller.filterByCompany(polygon,controller);
          break;
        case "districts-fill":
          polygon = e[0].properties.company_di;
          controller.filterByDistrict(polygon,controller);
          break;
        default:
          controller.filterByHydrant(e[0],controller);
      }
    }else{
      startDate = document.getElementById('start-date').value;
      endDate = document.getElementById('end-date').value;
      polygon = document.getElementById('company').value;
      let temp = null;
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
          temp = startDate.split('/');
          startDate = temp[2] + '-' + temp[0] + '-' + temp[1] + 'T00:00:00';
          let startUnix = (new Date(temp)).getTime();
          temp = endDate.split('/');
          endDate = temp[2] + '-' + temp[0] + '-' + temp[1] + 'T23:59:59';
          let endUnix = (new Date(temp)).getTime();
          // console.log(startUnix);
          // console.log(endUnix);
          controller.surveyPeriod = {
            start: startUnix,
            end: endUnix
          }
          controller.loadCityData(controller);
          // document.querySelector('#alert-overlay div').innerHTML = "Need company.";
          // document.getElementById('alert-overlay').className = 'active';
          break;
        default:
          temp = startDate.split('/');
          startDate = temp[2] + '-' + temp[0] + '-' + temp[1];
          temp = endDate.split('/');
          endDate = temp[2] + '-' + temp[0] + '-' + temp[1];
          controller.filterByCompany(polygon, controller);
      }
    }
  }
  filterByCompany(company, controller){
    document.getElementById('initial-loader-overlay').className = 'active';
    document.querySelector('.blocks-body').innerHTML = "";
    document.querySelector('.companies-snapshots.active').innerHTML = "";
    document.querySelector('.data-panel').className = "data-panel active";
    document.querySelector('.map-panel').className = "map-panel active";
    document.getElementById('surveyed-num').innerHTML = 0;
    document.getElementById('not-surveyed-num').innerHTML = 0;
    document.getElementById('not-working-num').innerHTML = 0;
    controller.state.currentActiveView = 'company';
    controller.state.selectedCompany.name = company;
    Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/Fire_Company_Labels_2018/FeatureServer/0/query?where=fire_compa+%3D+%27'+ company +'%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=json&token=', function(response){
        let centerPoint = JSON.parse(response);
        // console.log(centerPoint);
        controller.map.map.flyTo({
            center: [centerPoint.features[0].geometry.x, centerPoint.features[0].geometry.y],
            zoom: 13.5,
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
    document.querySelector('.cf').innerHTML = '<li><a href="#"><span>1</span><span class="breadcrumb-title">City</span></a></li><li><a href="#"><span>2</span><span class="breadcrumb-title">Company - '+company+'</span></a></li>';
    let breadcrumbs = document.querySelectorAll('.cf a');
    breadcrumbs.forEach(function(bread){
      bread.addEventListener('click', function(e){
        controller.loadPrevious(e, controller);
      });
    });
    Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/arcgis/rest/services/2018FireHydrantDistricts/FeatureServer/0/query?where=fire_compa+%3D+%27' + company + '%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&returnCentroid=false&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson&token=', function(response){
      let responseObj = JSON.parse(response);
      // console.log(responseObj);
      document.querySelector('.tabular-titles').innerHTML = "<div>District</div><div>Inspected</div><div>Not Inspected</div><div>Inoperable</div>";
      // document.querySelector('.tabular-body').innerHTML = '<article class="loading-box">LOADING <span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span></article>';
      controller.map.map.getSource('districts').setData(responseObj);
      Connector.getData('https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Fire_Company_District_Labels_2018/FeatureServer/0/query?where=fire_compa+%3D+%27' + company + '%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnHiddenFields=false&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&returnIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=geojson', function(response){
        let responseObj = JSON.parse(response);
        // console.log(responseObj);
        controller.map.map.getSource('districts-labels').setData(responseObj);
        let tempTabBody = "";
        let totalSurveyed = 0;
        let totalNotSurved = 0;
        let totalBroke = 0;
        let districtListing = {};
        JSON.parse(response).features.forEach(function(district){
          districtListing["" + district.properties.company_di] = {inspected: 0, total: 0, broke: 0, notInspected: [], brokenList: []};
        });
        controller.cityData.hydrants.data.features.forEach(function(hydrant){
          if(  districtListing[hydrant.attributes.FIREDISTID]){
            if(hydrant.attributes.INSPECTDT >= controller.surveyPeriod.start && hydrant.attributes.INSPECTDT <= controller.surveyPeriod.end){
              districtListing[hydrant.attributes.FIREDISTID].inspected++;
            }else{
              districtListing[hydrant.attributes.FIREDISTID].notInspected.push(hydrant);
            }
            if(hydrant.attributes.OPERABLE === 'No'){
              districtListing[hydrant.attributes.FIREDISTID].broke++;
              districtListing[hydrant.attributes.FIREDISTID].brokenList.push(hydrant);
            }
            districtListing[hydrant.attributes.FIREDISTID].total++;
          }
        });
        // console.log(districtListing);
        controller.state.selectedCompany.data = districtListing;
        // console.log(controller.state.selectedCompany.data);
        for(let dist in districtListing){
          let tempRowHtml = "<article id=\""+ dist +"\" class=\"tabular-row\"><div>"+ dist +"</div><div>"+ districtListing[dist].inspected +"</div><div class=\"not-inspected\">" + (districtListing[dist].total - districtListing[dist].inspected) + "</div><div class=\"not-inspected broken-list\">" + districtListing[dist].broke + "</div></article>";
          tempTabBody += tempRowHtml;
          totalBroke += districtListing[dist].broke;
          totalSurveyed += districtListing[dist].inspected;
          totalNotSurved += districtListing[dist].total - districtListing[dist].inspected;
        }
        document.querySelector('.tabular-body').innerHTML = tempTabBody;
        document.getElementById('surveyed-num').innerHTML = totalSurveyed.toLocaleString();
        document.getElementById('not-surveyed-num').innerHTML = totalNotSurved.toLocaleString();
        document.getElementById('not-working-num').innerHTML = totalBroke.toLocaleString();
        let drillDownBtns = document.querySelectorAll('.not-inspected');
        drillDownBtns.forEach(function(btn){
          btn.addEventListener('click',function(ev){
             controller.loadDrillDown(ev, controller);
          });
        });
        document.getElementById('initial-loader-overlay').className = '';
      });
    });
  }
  filterByDistrict(district, controller){
    // console.log(district);
    document.getElementById('initial-loader-overlay').className = 'active';
    document.querySelector('.blocks-body').innerHTML = "";
    document.querySelector('.companies-snapshots.active').innerHTML = "";
    document.querySelector('.data-panel').className = "data-panel active";
    document.querySelector('.map-panel').className = "map-panel active";
    document.getElementById('surveyed-num').innerHTML = 0;
    document.getElementById('not-surveyed-num').innerHTML = 0;
    document.getElementById('not-working-num').innerHTML = 0;
    controller.state.currentActiveView = 'district';
    controller.state.selectedDistrict.name = district;
    Connector.getData(`https://services2.arcgis.com/qvkbeam7Wirps6zC/ArcGIS/rest/services/Fire_Company_District_Labels_2018/FeatureServer/0/query?where=company_di%3D%27${district}%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=4326&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnDistinctValues=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=json&token=`, function(response){
        let centerPoint = JSON.parse(response);
        // console.log(centerPoint);
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
    document.querySelector('.tabular-titles').innerHTML = "<div>HYDRANT ID</div><div>Address</div><div>Condition</div><div>Inspected</div><div>Notes</div>";
    document.querySelector('.tabular-body').innerHTML = '<article class="loading-box">LOADING <span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span></article>';
    document.querySelector('.cf').innerHTML = '<li><a href="#"><span>1</span><span class="breadcrumb-title">City</span></a></li><li><a href="#"><span>2</span><span class="breadcrumb-title">Company - '+ controller.state.selectedCompany.name +'</span></a></li><li><a href="#"><span>3</span><span class="breadcrumb-title">District - '+ district +'</span></a></li>';
    let breadcrumbs = document.querySelectorAll('.cf a');
    breadcrumbs.forEach(function(bread){
      bread.addEventListener('click', function(e){
        controller.loadPrevious(e, controller);
      });
    });
    // ===================== loading small data sample =========================
    let hydrantList = {
      "type": "FeatureCollection",
      "features": []
    };
    let tempBody = '';
    let inspectedNum = 0;
    let notInspectedNum = 0;
    let brokeNum = 0;
    controller.cityData.hydrants.data.features.forEach(function(hydrant, index){
      if(hydrant.attributes.FIREDISTID === district){
        let temHydrantObj = {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              hydrant.geometry.x,
              hydrant.geometry.y
            ]
          },
          "properties": {
            ID: hydrant.attributes.OBJECTID,
            hydrantID: hydrant.attributes.HYDRANTID,
            inspectedOn: hydrant.attributes.INSPECTDT,
            address: hydrant.attributes.LOCDESC,
            notes: hydrant.attributes.NOTES,
            operable: hydrant.attributes.OPERABLE,
            inspectionStatus: null
          }
        };
        let hydrantStatus = null;
        if(hydrant.attributes.INSPECTDT >= controller.surveyPeriod.start && hydrant.attributes.INSPECTDT <= controller.surveyPeriod.end){
          inspectedNum++;
          hydrantStatus = true;
        }else{
          notInspectedNum++;
          hydrantStatus = false;
        }
        (hydrant.attributes.OPERABLE === 'No') ? brokeNum++ : 0;
        let tempCondition = null;
        let tempNotes = null;
        (hydrant.attributes.CONDITION === undefined) ? tempCondition = '' : tempCondition = hydrant.attributes.CONDITION;
        (hydrant.attributes.NOTES === undefined) ? tempNotes = '' : tempNotes = hydrant.attributes.NOTES;
        tempBody += `
        <article id=\"row-${index}\" class=\"tabular-row inspected-${hydrantStatus}\">
        <div>${hydrant.attributes.HYDRANTID}</div>
        <div>${hydrant.attributes.LOCDESC}</div>
        <div>${tempCondition}</div>
        <div>${hydrantStatus}</div>
        <div>${tempNotes}</div>
        </article>`;
        temHydrantObj.properties.inspectionStatus = hydrantStatus;
        hydrantList.features.push(temHydrantObj);
      }
    });
    document.querySelector('.tabular-body').innerHTML = tempBody;
    document.querySelector('#surveyed-num').innerHTML = inspectedNum;
    document.querySelector('#not-surveyed-num').innerHTML = notInspectedNum;
    document.querySelector('#not-working-num').innerHTML = brokeNum;
    if(controller.map.map.getSource('hydrants')){
      // console.log("Updating hydrants");
      // console.log(hydrantList);
      controller.map.map.getSource('hydrants').setData(hydrantList);
    }else{
      // console.log("adding hydrants");
      controller.map.map.addSource('hydrants', {
        type: 'geojson',
        data: hydrantList
      });
      controller.map.map.loadImage(iHydrantName, function(error, image) {
        if (error) throw error;
        controller.map.map.addImage('inspected-hydrant', image);
        controller.map.map.addLayer({
            "id": "inspected-hydrants",
            "type": "symbol",
            "source": 'hydrants',
            "minzoom": 15,
            "layout": {
                "icon-image": "inspected-hydrant",
                "icon-size": 0.75
            },
            'filter': ['==', 'inspectionStatus', true]
        });
      });
      controller.map.map.loadImage(nHydrantName, function(error, image) {
        if (error) throw error;
        controller.map.map.addImage('not-inspected-hydrant', image);
        controller.map.map.addLayer({
            "id": "not-inspected-hydrants",
            "type": "symbol",
            "source": 'hydrants',
            "minzoom": 15,
            "layout": {
                "icon-image": "not-inspected-hydrant",
                "icon-size": 0.75
            },
            'filter': ['all',['==', 'inspectionStatus', false],['==', 'operable', 'Yes']]
        });
      });
      controller.map.map.loadImage(bHydrantName, function(error, image) {
        if (error) throw error;
        controller.map.map.addImage('not-working-hydrant', image);
        controller.map.map.addLayer({
            "id": "not-workin-hydrants",
            "type": "symbol",
            "source": 'hydrants',
            "minzoom": 15,
            "layout": {
                "icon-image": "not-working-hydrant",
                "icon-size": 0.75
            },
            'filter': ['==', 'operable', 'No']
        });
      });
    }
    document.getElementById('initial-loader-overlay').className = '';
  }
  filterByHydrant(hydrant, controller){
    document.getElementById('initial-loader-overlay').className = 'active';
    window.setTimeout(function(){
      document.querySelector('.cf').innerHTML = '<li><a href="#"><span>1</span><span class="breadcrumb-title">City</span></a></li><li><a href="#"><span>2</span><span class="breadcrumb-title">Company - '+ controller.state.selectedCompany.name +'</span></a></li><li><a href="#"><span>3</span><span class="breadcrumb-title">District - '+ controller.state.selectedDistrict.name +'</span></a></li><li><a href="#"><span>4</span><span class="breadcrumb-title">Hydrant - '+ hydrant.properties.hydrantID +'</span></a></li>';
      let breadcrumbs = document.querySelectorAll('.cf a');
      breadcrumbs.forEach(function(bread){
        bread.addEventListener('click', function(e){
          controller.loadPrevious(e, controller);
        });
      });
      let tempNotes = null;
      (hydrant.properties.notes === undefined) ? tempNotes = 'No notes available.' : tempNotes = hydrant.properties.notes;
      let convertedDate = new Date(hydrant.properties.inspectedOn);
      controller.state.selectedHydrant = hydrant.properties.hydrantID;
      document.querySelector('.tabular-titles').innerHTML = '';
      document.querySelector('.tabular-body').innerHTML = '';
      document.querySelector('.blocks-body').innerHTML = '<article class="block"><article><h4>HYDRANT ID</h4><p>' + hydrant.properties.hydrantID + '</p></article></article><article class="block"><article><h4>ADDRESS</h4><p>' + hydrant.properties.address + '</p></article></article><article class="block"><article><h4>INSPECTED ON</h4><p>' + (convertedDate.getMonth()+1) + '/' + convertedDate.getDate() + '/' + convertedDate.getFullYear() + '</p></article></article></article><article class="block"><article><h4>NOTES</h4><p>' + tempNotes + '</p></article></article></article><article class="block"><article><h4>INSPECTED</h4><p>' + hydrant.properties.inspectionStatus + '</p></article></article></article><article class="block"><article><h4>OPERABLE</h4><p>' + hydrant.properties.operable + '</p></article></article></article>';
      document.getElementById('initial-loader-overlay').className = '';
    }, 1000);
  }
}
