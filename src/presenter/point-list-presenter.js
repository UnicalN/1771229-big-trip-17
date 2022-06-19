import PointsModel from '../model/points-model.js';
import {render} from '../render.js';
import EditPointView from '../view/edit-point-view.js';
import NewPointView from '../view/new-point-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';

import OffersModel from '../model/offers-model.js';
import DestinationsModel from '../model/destinations-model.js';

export default class PointListPresenter {
  #pointListComponent = new PointListView();

  #pointListContainer = null;
  #pointsList= null;
  #offersList= null;
  #destinations = null;

  #pointsModel = new PointsModel();
  #offersModel = new OffersModel();
  #destinationsModel = new DestinationsModel();

  #renderPoint = (point) => render(new PointView(point, this.#offersList), this.#pointListComponent.getElement()); //render(что, где)
  init = (pointListContainer) => {
    this.#pointListContainer = pointListContainer;
    this.#pointsList = [...this.#pointsModel.points];
    this.#offersList = [...this.#offersModel.offers];

    this.#destinations = [...this.#destinationsModel.destinations];


    render(new SortView(), this.#pointListContainer);
    render(this.#pointListComponent, this.#pointListContainer); // this. вместо new тк объявлено ранее для повторяющихся элементов
    //console.log('pre-render editPointView', this.pointsList, this.offersList);
    render(new EditPointView(this.#pointsList[0], this.#offersList), this.#pointListComponent.getElement());
    render(new NewPointView(), this.#pointListComponent.getElement());


    for (let i = 0; i < this.#pointsList.length; i++) {
      this.#renderPoint(this.#pointsList[i]);
    }
  };
}

