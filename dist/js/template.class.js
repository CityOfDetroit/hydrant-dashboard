"use strict";

var templateModule = function () {
  var template = {
    templates: {
      'boundary-result-view': ['<article class="title">', 1, '</article>', '<article class="survey-btn"><article class="form-btn" onclick="survey.startSurvey()">START SURVEY</article></article>', '<article id="geocoder" class="geocoder"></article>', '<article class="total-rentals"><h4>TOTAL PROPERTIES</h4><p>', 6, '</p></article>', '<article class="overall-number">', 9, '</article>', '<article class="parcel-info rental-info"></article>'],
      'parcel-result-view': ['<article class="title">', 1, '</article>', '<article class="survey-btn"><article class="form-btn" onclick="survey.startSurvey()">START SURVEY</article></article>', '<article id="geocoder" class="geocoder"></article>', '<article class="parcel-data btn-type owner"><div class="data-view-btn" data-view="owner" onclick="mapPanel.switchParcelDataViews(this)">OWNER INFORMATION <span>&#10095;</span></div></article>', '<article class="parcel-data btn-type building"><div class="data-view-btn" data-view="building" onclick="mapPanel.switchParcelDataViews(this)">PROPERTY INFORMATION <span>&#10095;</span></div></article>', '<article class="parcel-info display-section" data-display-type=""></article>', '<article id="parcel-image"></article>'],
      'data-select-view': ['<article class="layer-controllers"><h5>BOUNDARIES</h5><ul><li><input type="radio" id="b-district" name="boundaries" class="layer-controller-toggle"><label for="b-district">Council Districts</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="b-neighborhoods" name="boundaries" class="layer-controller-toggle"><label for="b-neighborhoods">Neighborhoods</label><div class="check"><div class="inside"></div></div></li></ul></article>', '<article class="layer-controllers"><h5>DATA SET</h5><ul><li><input type="radio" id="c-w-vernor" name="selector" checked="true" class="layer-controller-toggle"><label for="c-w-vernor">W Vernor</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-e-vernor" name="selector" class="layer-controller-toggle"><label for="c-e-vernor">E Vernor</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-michigan" name="selector" class="layer-controller-toggle"><label for="c-michigan">Michigan Ave.</label><div class="check"></div></li><li><input type="radio" id="c-woodward" name="selector" class="layer-controller-toggle"><label for="c-woodward">Woodward</label><div class="check"><div class="inside"></div></div></li> <li><input type="radio" id="c-livernois" name="selector" class="layer-controller-toggle"><label for="c-livernois">Livernois</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-grand-river" name="selector" class="layer-controller-toggle"><label for="c-grand-river">Grand River</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-seven-mile" name="selector" class="layer-controller-toggle"><label for="c-seven-mile">Seven Mile</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-mcnichols" name="selector" class="layer-controller-toggle"><label for="c-mcnichols">McNichols</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-gratiot" name="selector" class="layer-controller-toggle"><label for="c-gratiot">Gratiot</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-jefferson" name="selector" class="layer-controller-toggle"><label for="c-jefferson">Jefferson</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-warren" name="selector" class="layer-controller-toggle"><label for="c-warren">Warren</label><div class="check"><div class="inside"></div></div></li></ul></article>'],
      'information-view': ['<article><p>Hodor, hodor. Hodor. Hodor, hodor, hodor. Hodor HODOR hodor, hodor hodor... Hodor hodor hodor, hodor, hodor hodor. Hodor hodor hodor hodor, hodor. Hodor hodor - hodor? Hodor, hodor hodor HODOR hodor, hodor hodor, hodor. Hodor hodor. Hodor, hodor. Hodor. Hodor, hodor... Hodor hodor hodor... Hodor hodor hodor... Hodor hodor hodor? Hodor hodor - hodor; hodor hodor hodor, hodor, hodor hodor. Hodor, hodor, hodor. Hodor hodor, hodor, hodor hodor.</p><p>Hodor! Hodor hodor, hodor... Hodor hodor hodor; hodor hodor. Hodor hodor... Hodor hodor hodor. Hodor. Hodor. Hodor hodor - HODOR hodor, hodor hodor? Hodor hodor - hodor hodor hodor, hodor. Hodor hodor.</p></article>']
    },
    getTemplate: function getTemplate(templateType, templateVariable, dataSetType) {
      switch (templateType) {
        case 'data-results-view-btn':
          switch (dataSetType) {
            case 'parcel':
              var tempHTMLArr2 = this.templates['parcel-result-view'];
              tempHTMLArr2[1] = templateVariable.title;
              return tempHTMLArr2.join('');
            default:
              console.log(templateVariable);
              var tempHTMLArr1 = this.templates['boundary-result-view'];
              tempHTMLArr1[1] = templateVariable.title;
              tempHTMLArr1[6] = templateVariable.total;
              tempHTMLArr1[9] = templateVariable.overall;
              console.log(tempHTMLArr1.join(''));
              return tempHTMLArr1.join('');
          }
          break;
        case 'data-sets-view-btn':
          return this.templates['data-select-view'].join('');
        default:
          return this.templates['information-view'].join('');
      }
    }
  };
  return template;
}();