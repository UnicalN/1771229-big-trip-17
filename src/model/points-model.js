import {
  generatePoints
} from '../mock/generate-point.js';

export default class PointsModel {
  #points = generatePoints();

  get points() {return this.#points;
  }
}
