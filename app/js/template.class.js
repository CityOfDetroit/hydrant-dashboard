"use strict";

export default class Template {
  constructor() {
    this.results = {
      main: (mainTitle, mainData) => {
        return `<article class="main-result"><h4>${ mainTitle }</h4><p>${ mainData }</p></article>`
      },
      sub: (subTitle, subData) => {
        return `<article class="main-result"><h4>${subTitle}</h4><p>${subData}</p></article>`
      }
    };
    this.elements = {
      title: '',
      results: {
        main: '',
        sub: ''
      },
      buttons: {
        'survey': '<article class="survey-btn"><article class="form-btn" onclick="survey.startSurvey()">START SURVEY</article></article>',

        'parcelOwner': '<article class="parcel-data btn-type owner"><div class="data-view-btn" data-view="owner" onclick="mapPanel.switchParcelDataViews(this)">OWNER INFORMATION <span>&#10095;</span></div></article>',

        'parcelInfo': '<article class="parcel-data btn-type building"><div class="data-view-btn" data-view="building" onclick="mapPanel.switchParcelDataViews(this)">PROPERTY INFORMATION <span>&#10095;</span></div></article>'
      },
      information: '<article><p>Hodor, hodor. Hodor. Hodor, hodor, hodor. Hodor HODOR hodor, hodor hodor... Hodor hodor hodor, hodor, hodor hodor. Hodor hodor hodor hodor, hodor. Hodor hodor - hodor? Hodor, hodor hodor HODOR hodor, hodor hodor, hodor. Hodor hodor. Hodor, hodor. Hodor. Hodor, hodor... Hodor hodor hodor... Hodor hodor hodor... Hodor hodor hodor? Hodor hodor - hodor; hodor hodor hodor, hodor, hodor hodor. Hodor, hodor, hodor. Hodor hodor, hodor, hodor hodor.</p><p>Hodor! Hodor hodor, hodor... Hodor hodor hodor; hodor hodor. Hodor hodor... Hodor hodor hodor. Hodor. Hodor. Hodor hodor - HODOR hodor, hodor hodor? Hodor hodor - hodor hodor hodor, hodor. Hodor hodor.</p></article>',
      controls: {
        'boundaries': '<article class="layer-controllers"><h5>BOUNDARIES</h5><ul><li><input type="radio" id="b-district" name="boundaries" class="layer-controller-toggle"><label for="b-district">Council Districts</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="b-neighborhoods" name="boundaries" class="layer-controller-toggle"><label for="b-neighborhoods">Neighborhoods</label><div class="check"><div class="inside"></div></div></li></ul></article><article class="layer-controllers"><h5>DATA SET</h5><ul><li><input type="radio" id="c-w-vernor" name="selector" class="layer-controller-toggle"><label for="c-w-vernor">W Vernor</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-e-vernor" name="selector" class="layer-controller-toggle"><label for="c-e-vernor">E Vernor</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-michigan" name="selector" class="layer-controller-toggle"><label for="c-michigan">Michigan Ave.</label><div class="check"></div></li><li><input type="radio" id="c-woodward" name="selector" class="layer-controller-toggle"><label for="c-woodward">Woodward</label><div class="check"><div class="inside"></div></div></li> <li><input type="radio" id="c-livernois" name="selector" class="layer-controller-toggle"><label for="c-livernois">Livernois</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-grand-river" name="selector" class="layer-controller-toggle"><label for="c-grand-river">Grand River</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-seven-mile" name="selector" class="layer-controller-toggle"><label for="c-seven-mile">Seven Mile</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-mcnichols" name="selector" class="layer-controller-toggle"><label for="c-mcnichols">McNichols</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-gratiot" name="selector" class="layer-controller-toggle"><label for="c-gratiot">Gratiot</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-jefferson" name="selector" class="layer-controller-toggle"><label for="c-jefferson">Jefferson</label><div class="check"><div class="inside"></div></div></li><li><input type="radio" id="c-warren" name="selector" class="layer-controller-toggle"><label for="c-warren">Warren</label><div class="check"><div class="inside"></div></div></li></ul></article>'
      }
    };
  }

  generateTemplate(templateSettings = null) {
    this.elements.title = templateSettings.title;
    this.elements.results.main = this.results.main(templateSettings.mainTitle, templateSettings.mainData);
    this.elements.results.sub = this.results.sub(templateSettings.subTitle, templateSettings.subData);
    return this.elements;
  }
}
