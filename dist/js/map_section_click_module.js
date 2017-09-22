"use strict";

var mapSectionClickModule = function () {
  map.on('click', function (e) {
    console.log(e);
    var councilFeatures = null;
    var neighborhoodsFeatures = null;
    var parcelFeatures = null;
    var parcelSurvey = null;
    try {
      councilFeatures = map.queryRenderedFeatures(e.point, { layers: ['council-fill'] });
      neighborhoodsFeatures = map.queryRenderedFeatures(e.point, { layers: ['neighborhoods-fill'] });
      parcelFeatures = map.queryRenderedFeatures(e.point, { layers: ['parcel-fill'] });
      parcelSurvey = map.queryRenderedFeatures(e.point, { layers: ['need-survey'] });
    } catch (e) {
      //console.log("ERROR: " +e);
    } finally {
      console.log(councilFeatures);
      console.log(neighborhoodsFeatures);
      console.log(parcelFeatures);
      console.log(parcelSurvey);
    }
    switch (true) {
      case councilFeatures.length !== 0:
        if (getQueryVariable('survey')) {
          console.log('survey going no click enable');
        } else {
          mapPanel.featureData = councilFeatures[0];
          updateURLParams([13, e.lngLat.lng, e.lngLat.lat, '', councilFeatures[0].properties.name]);
          mapPanel.createPanel('district');
        }
        break;
      case neighborhoodsFeatures.length !== 0:
        if (getQueryVariable('survey')) {
          console.log('survey going no click enable');
        } else {
          mapPanel.featureData = neighborhoodsFeatures[0];
          updateURLParams([16, e.lngLat.lng, e.lngLat.lat, '', '', neighborhoodsFeatures[0].properties.name]);
          mapPanel.createPanel('neighborhood');
        }
        break;
      case parcelFeatures.length !== 0:
        if (getQueryVariable('survey')) {
          console.log('survey going no click enable');
        } else {
          mapPanel.featureData = parcelFeatures[0];
          updateURLParams([17, e.lngLat.lng, e.lngLat.lat, parcelFeatures[0].properties.parcelno, '', '']);
          mapPanel.createPanel('parcel');
        }
        break;
      default:

    }
  });
}(window);