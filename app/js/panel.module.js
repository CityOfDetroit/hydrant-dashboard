"use strict";
var panelModule = (function(survey, template){
  var template = Object.create(templateModule);
  var panel = {
    'viewStates'    : {
      'dataSets' : null,
      'dataResults': null
    },
    'title'         : '',
    'featureData'   : null,
    'displayType'   : '',
    'parcelData'    : null,
    'parcelNumer'   : null,
    'tempHTML'      : [],
    'tempData'      : {'registrationNumbers':0,'totalNumbers':0},
    'imageList'     : null,
    changeViews: function(key){
      console.log(key.id);
      if(key.className !== 'active'){
        console.log('changing views');
        activeView = key.id;
        switch (key.id) {
          case 'data-sets-view-btn':
            console.log('loading data sets');
            document.querySelector('.top-nav-item > .active').className = '';
            document.querySelector('#'+key.id).className = 'active';
            document.querySelector('#panel-content').innerHTML = template.getTemplate(activeView, null, null);
            break;
          case 'data-results-view-btn':
            console.log('loading data results');
            document.querySelector('.top-nav-item > .active').className = '';
            document.querySelector('#'+key.id).className = 'active';
            document.querySelector('#panel-content').innerHTML = this.viewStates.dataSets;
            break;
          default:
            console.log('loading info');
            document.querySelector('.top-nav-item > .active').className = '';
            document.querySelector('#'+key.id).className = 'active';
            document.querySelector('#panel-content').innerHTML = template.getTemplate(activeView, null, null);
        }
      }else{
        console.log('view is already active');
      }
    },
    updateImageList : function updateImageList(arr){
      panel.imageList = arr;
      console.log(panel.imageList);
    },
    getSurveyImageIDs: function(){
      console.log( panel.getParcelNumber());
      console.log( this.getParcelNumber());
      console.log( this.parcelNumer);
      let tempParcel = panel.getParcelNumber();
      tempParcel = tempParcel.replace(/\./g,'_');
      console.log(tempParcel);
      $.getJSON("https://apis.detroitmi.gov/photo_survey/"+tempParcel+"/", function( data ) {
        console.log(data);
        if(data.images.length > 0){
          document.getElementById('parcel-image').innerHTML ='<h5 style="text-align:center">LOADING IMAGE<span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span></h5>';
          panel.updateImageList(data.images);
          panel.loadImage(data.images);
        }else{
          console.log('no images found');
        }
      });
    },
    loadImage: function(data){
      document.getElementById('parcel-image').innerHTML ='<img src="' + data[0] + '" alt="parcel image"></img>';
    },
    setParcelNumber : function(parcel) {
      console.log(parcel);
      panel.parcelNumer = parcel;
    },
    getParcelNumber : function(){
      return panel.parcelNumer;
    },
    createPanel     : function(type){
      this.setDisplayType(type);
      this.clearPanel();
      this.createPanelData();
    },
    setDisplayType  : function(type){
      this.displayType = type;
    },
    getDisplayType : function(){
      return this.displayType;
    },
    setTempData : function(obj){
      panel.tempData.registrationNumbers = obj.registrationNumbers;
      panel.tempData.totalNumbers = obj.totalNumbers;
    },
    getTempData : function(){
      return panel.tempData;
    },
    setTempHTML : function(obj){
      if(obj.constructor === Array){
        panel.tempHTML = obj;
      }else{
        panel.tempHTML.length = 0;
      }
    },
    getTempHTML : function(){
      return panel.tempHTML;
    },
    getTempFeatureData : function (){
      return panel.featureData;
    },
    setTempFeatureData : function (feature){
      panel.featureData = feature;
    },
    setPanelTitle : function (title){
      panel.title = title;
    },
    setParcelData : function (parcel){
      panel.parcelData = parcel;
    },
    getParcelData : function (){
      return panel.parcelData;
    },
    flyToPosition : function (params){
      console.log(params);
      map.flyTo({
          center: [params.lng, params.lat],
          zoom: params.zoom,
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
    },
    loadPanel : function(){
      console.log(this.getDisplayType());
      console.log(this.displayType);
      switch (true) {
        case this.displayType === 'parcel':
          console.log('loading parcel data');
          var localParcelData = this.getParcelData();
          console.log(localParcelData);
          console.log(typeof(localParcelData));
          console.log(this.getTempHTML());
          let templateParcel = {
            'title' : null
          };
          (localParcelData.propstreetcombined !== 'null') ? templateParcel.title = localParcelData.propstreetcombined: templateParcel.title = 'Loading...';
          this.viewStates.dataSets = template.getTemplate(activeView, templateParcel, 'parcel');
          document.querySelector('#panel-content').innerHTML = this.viewStates.dataSets;
          map.setFilter("parcel-fill-hover", ["==", "parcelno", currentURLParams.parcel]);
          panel.getSurveyImageIDs();
          break;
        case this.displayType === 'neighborhood':
          let templateNeighborhood = {
            'title' : this.title,
            'total' : this.tempData.totalNumbers,
            'overall' : this.tempHTML
          };
          document.querySelector('#panel-content').innerHTML = template.getTemplate(activeView, templateNeighborhood, 'neighborhood');
          break;
        case this.displayType === 'district':
          let templateDistrict = {
            'title' : this.title,
            'total' : this.tempData.totalNumbers,
            'overall' : this.tempHTML
          };
          document.querySelector('#panel-content').innerHTML = template.getTemplate(activeView, templateDistrict, 'district');
          break;
        default:
          let templateCity = {
            'title' : this.title,
            'total' : this.tempData.totalNumbers,
            'overall' : this.tempHTML
          };
          document.querySelector('#panel-content').innerHTML = template.getTemplate(activeView, templateCity, 'city');
      }
      (document.querySelector('#info').className === 'active') ? 0 : document.querySelector('#info').className = 'active';
    },
    clearPanel      : function(){
      console.log('clearing panel');
      this.tempData.registrationNumbers = 0;
      this.tempData.totalNumbers = 0;
      this.setTempHTML('clear');
      console.log(this.tempHTML);
      document.querySelector('#panel-content').innerHTML = '';
    },
    switchParcelDataViews : function switchParcelDataViews(e){
      //cons.log(e.getAttribute('data-view'));
      switch (e.getAttribute('data-view')) {
        case 'owner':
          if(document.querySelector('.parcel-info.display-section').getAttribute('data-display-type') === 'owner'){
            document.querySelector('.parcel-info.display-section').innerHTML = '';
            document.querySelector('.parcel-info.display-section').setAttribute('data-display-type', '');
          }else{
            var tempOwnerData = '';
            tempOwnerData += '<article class="info-items"><span>OWNER CITY</span> ' + panel.parcelData.ownercity + '</article>';
            tempOwnerData += '<article class="info-items"><span>OWNER NAME</span> ' + panel.parcelData.ownername1 + '</article>';
            tempOwnerData += '<article class="info-items"><span>OWNER STATE</span> ' + panel.parcelData.ownerstate + '</article>';
            tempOwnerData += '<article class="info-items"><span>OWNER ADDRESS</span> ' + panel.parcelData.ownerstreetaddr + '</article>';
            tempOwnerData += '<article class="info-items"><span>OWNER ZIP</span> ' + panel.parcelData.ownerzip + '</article>';
            document.querySelector('.parcel-info.display-section').innerHTML = tempOwnerData;
            document.querySelector('.parcel-info.display-section').setAttribute('data-display-type', 'owner');
          }
          //cons.log(panel.parcelData);
          break;
        case 'building':
          if(document.querySelector('.parcel-info.display-section').getAttribute('data-display-type')){
            document.querySelector('.parcel-info.display-section').innerHTML = '';
            document.querySelector('.parcel-info.display-section').setAttribute('data-display-type', '');
          }else{
            var tempBuldingData = '';
            tempBuldingData += '<article class="info-items"><span>PARCEL NUMBER</span> ' + panel.parcelData.pnum + '</article>';
            tempBuldingData += '<article class="info-items"><span>BASEMENT AREA</span> ' + panel.parcelData.resb_basementarea + '</article>';
            tempBuldingData += '<article class="info-items"><span>BUILDING CLASS</span> ' + panel.parcelData.resb_bldgclass + '</article>';
            tempBuldingData += '<article class="info-items"><span>CALCULATED VALUE</span> $' + parseInt(panel.parcelData.resb_calcvalue).toLocaleString() + '</article>';
            tempBuldingData += '<article class="info-items"><span>EXTERIOR</span> ' + panel.parcelData.resb_exterior + '</article>';
            tempBuldingData += '<article class="info-items"><span>NUMBER OF FIREPLACES</span> ' + panel.parcelData.resb_fireplaces + '</article>';
            tempBuldingData += '<article class="info-items"><span>FLOOR AREA</span> ' + panel.parcelData.resb_floorarea.toLocaleString() + '</article>';
            tempBuldingData += '<article class="info-items"><span>GARAGE AREA</span> ' + panel.parcelData.resb_garagearea.toLocaleString() + '</article>';
            tempBuldingData += '<article class="info-items"><span>GARAGE TYPE</span> ' + panel.parcelData.resb_gartype + '</article>';
            tempBuldingData += '<article class="info-items"><span>GROUND AREA</span> ' + panel.parcelData.resb_groundarea.toLocaleString() + '</article>';
            tempBuldingData += '<article class="info-items"><span>HALF BATHS</span> ' + panel.parcelData.resb_halfbaths + '</article>';
            tempBuldingData += '<article class="info-items"><span>NUMBER OF BEDROOMS</span> ' + panel.parcelData.resb_nbed + '</article>';
            document.querySelector('.parcel-info.display-section').innerHTML = tempBuldingData;
            document.querySelector('.parcel-info.display-section').setAttribute('data-display-type', 'building');
          }
          //cons.log(panel.parcelData);
          break;
        default:

      }
    },
    createFeatureData: function(){
      switch (true) {
        case currentURLParams.district !== '':
          console.log(currentURLParams.district.split('%20')[1]);
          $.getJSON("https://gis.detroitmi.gov/arcgis/rest/services/NeighborhoodsApp/council_district/MapServer/1/query?where=&text=District+"+ currentURLParams.district.split('%20')[1] +"&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson", function( data ) {
            console.log(data);
            panel.setTempFeatureData(data.features[0]);
            console.log(panel.getTempFeatureData());
            panel.createPanel('district');
          });
          break;
        case currentURLParams.neighborhood !== '':
          console.log(decodeURI(currentURLParams.neighborhood));
          $.getJSON("https://gis.detroitmi.gov/arcgis/rest/services/NeighborhoodsApp/Neighborhoods/MapServer/1/query?where=&text="+ decodeURI(currentURLParams.neighborhood) +"&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=geojson", function( data ) {
            console.log(data);
            panel.setTempFeatureData(data.features[0]);
            console.log(panel.getTempFeatureData());
            panel.createPanel('neighborhood');
          });
          break;
        default:
          console.log(decodeURI(currentURLParams.parcel));
          panel.setParcelNumber(decodeURI(currentURLParams.parcel));
          panel.setTempFeatureData({'properties':{'parcelno':currentURLParams.parcel}});
          panel.createPanel('parcel');
      }
    },
    createPanelData : function(){
      console.log(this.displayType);
      console.log(this.getDisplayType());
      switch (true) {
        case this.displayType === 'parcel':
          panel.setParcelData(null);
          panel.setTempHTML('clear');
          var tempParcelDataHTML = new Array(5);
          console.log('loading parcel data');
          console.log(this.displayType);
          console.log(this.featureData.properties.parcelno);
          panel.setParcelNumber(this.featureData.properties.parcelno);
          $.getJSON("https://apis.detroitmi.gov/assessments/parcel/"+this.featureData.properties.parcelno.replace(/\./g,'_')+"/", function( parcel ) {
            panel.setDisplayType('parcel');
            console.log(parcel);
            console.log(panel.getDisplayType());
            panel.setTempHTML(tempParcelDataHTML);
            panel.setParcelData(parcel);
            panel.loadPanel();
          });
          this.flyToPosition(currentURLParams);
          break;
        case this.displayType === 'neighborhood':
          this.setTempHTML('clear');
          console.log('creating neighborhood panel');
          var simplifiedNeighborhood = turf.simplify(this.featureData, 0.003, false);
          console.log(simplifiedNeighborhood);
          this.setPanelTitle(simplifiedNeighborhood.properties.name);
          var arcNeighborhoodPolygon = Terraformer.ArcGIS.convert(simplifiedNeighborhood.geometry);
          // console.log(arcPolygon);
          $.getJSON("https://gis.detroitmi.gov/arcgis/rest/services/DoIT/Commercial/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry="+ encodeURI(JSON.stringify(arcNeighborhoodPolygon))+"&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson", function( data ) {
            panel.setDisplayType('neighborhood');
            console.log(data);
            console.log(panel.getTempData());
            var localNeighborhoodData = panel.getTempData();
            var localNeighborhoodHTML = panel.getTempHTML();
            console.log(localNeighborhoodHTML);
            console.log(localNeighborhoodData);
            localNeighborhoodData.totalNumbers += data.count;
            localNeighborhoodData.registrationNumbers += data.count;
            console.log(localNeighborhoodData);
            localNeighborhoodHTML += '<article class="renewal"><span>NEED SURVEY</span> ' + localNeighborhoodData.registrationNumbers + '</article>';
            console.log(localNeighborhoodHTML);
            panel.setTempHTML([localNeighborhoodHTML]);
            panel.setTempData(localNeighborhoodData);
            panel.loadPanel();
          });
          this.flyToPosition(currentURLParams);
          break;
        case this.displayType === 'district':
          this.setTempHTML('clear');
          console.log('creating district panel');
          var simplifiedDistrict = turf.simplify(this.featureData, 0.003, false);
          console.log(simplifiedDistrict);
          this.setPanelTitle(simplifiedDistrict.properties.name);
          var arcDistrictPolygon = Terraformer.ArcGIS.convert(simplifiedDistrict.geometry);
          // console.log(arcPolygon);
          $.getJSON("https://gis.detroitmi.gov/arcgis/rest/services/DoIT/Commercial/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry="+ encodeURI(JSON.stringify(arcDistrictPolygon))+"&geometryType=esriGeometryPolygon&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson", function( data ) {
            panel.setDisplayType('district');
            console.log(panel.getTempData());
            var localDistrictData = panel.getTempData();
            var localDistrictHTML = panel.getTempHTML();
            console.log(localDistrictHTML);
            console.log(localDistrictData);
            localDistrictData.totalNumbers += data.count;
            localDistrictData.registrationNumbers += data.count;
            console.log(localDistrictData);
            localDistrictHTML += '<article class="renewal"><span>NEED SURVEY</span> ' + localDistrictData.registrationNumbers + '</article>';
            console.log(localDistrictHTML);
            panel.setTempHTML([localDistrictHTML]);
            panel.setTempData(localDistrictData);
            panel.loadPanel();
          });
          this.flyToPosition(currentURLParams);
          break;
        default:
          this.setTempHTML('clear');
          this.setPanelTitle('CITY OF DETROIT');
          console.log(this.tempData);
          $.getJSON("https://gis.detroitmi.gov/arcgis/rest/services/DoIT/Commercial/MapServer/0/query?where=1%3D1&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&returnIdsOnly=false&returnCountOnly=true&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson", function( data ) {
            panel.setDisplayType('city');
            console.log(data);
            console.log(panel.getTempData());
            var localData = panel.getTempData();
            var localHTML = panel.getTempHTML();
            console.log(localHTML);
            console.log(localData);
            localData.totalNumbers += data.count;
            localData.registrationNumbers += data.count;
            console.log(localData);
            localHTML += '<article class="renewal"><span>NEED SURVEY</span> ' + localData.registrationNumbers + '</article>';
            console.log(localHTML);
            panel.setTempHTML([localHTML]);
            panel.setTempData(localData);
            panel.loadPanel();
          });
      }
    }
  };
  return panel;
})(window,surveyModule,templateModule);
