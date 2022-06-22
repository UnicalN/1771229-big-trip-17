import PointsModel from '../model/points-model.js';
import {render, replace, RenderPosition} from '../framework/render.js';
import NewPointView from '../view/new-point-view.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-points-view.js';

//import OffersModel from '../model/offers-model.js';
//import DestinationsModel from '../model/destinations-model.js';
import PointPresenter from './point-presenter.js';

export default class PointListPresenter {

  #pointListComponent = new PointListView();
  #pointListContainer = null;
  #pointsList= null;
  //#offersList= null;
  //#destinations = null;

  #pointsModel = new PointsModel();
  //#offersModel = new OffersModel();
  //#destinationsModel = new DestinationsModel();

  #renderPoint = (point) => {

    const pointPresenter = new PointPresenter(this.#pointListComponent.element);
    pointPresenter.init(point);
  };

  #renderSort = () => {
    render(new SortView(), this.#pointListContainer, RenderPosition.AFTERBEGIN);
  };

  #renderPointList = () => {
    render(this.#pointListComponent, this.#pointListContainer);
  };

  #renderNewPoint = () => {
    render(new NewPointView(), this.#pointListComponent.element);
  };

  #renderNoPoints = () => {
    render(new NoPointsView(), this.#pointListComponent.element);
  };

  #renderAllPoints = () => {
    this.#pointsList.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  init = (pointListContainer) => {
    this.#pointListContainer = pointListContainer;
    this.#pointsList = [...this.#pointsModel.points];

    //this.#offersList = [...this.#offersModel.offers];
    //this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderSort();
    this.#renderPointList();


    if (this.#pointsList.length === 0) {
      this.#renderNoPoints();
    }

    this.#renderNewPoint();
    this.#renderAllPoints();

  };
}

