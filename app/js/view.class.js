'use strict';
import Map from './map.class.js';
export default class View {
  constructor(init) {
    this.map = new Map(init.map);
  }
}
