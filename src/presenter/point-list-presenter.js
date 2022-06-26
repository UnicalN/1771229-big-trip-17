import PointsModel from '../model/points-model.js';
import {render,  RenderPosition} from '../framework/render.js';
import NewPointView from '../view/new-point-view.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-points-view.js';

//import OffersModel from '../model/offers-model.js';
//import DestinationsModel from '../model/destinations-model.js';
import PointPresenter from './point-presenter.js';
//import { updateItem } from '../update-item.js';
import {SortType, UpdateType, UserAction} from '../const.js';
import { sortByDay, sortByPrice, sortByTime } from '../dayjs-custom.js';

export default class PointListPresenter {

  #pointListComponent = new PointListView();
  #pointListContainer = null;
  //#pointsList= null;
  //#offersList= null;
  //#destinations = null;

  #pointsModel = new PointsModel();
  //#offersModel = new OffersModel();
  //#destinationsModel = new DestinationsModel();
  #pointPresenter = new Map();
  #sortComponent = new SortView();
  constructor(){
    //!!
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.tasks].sort(sortByDay);
      case SortType.TIME:
        return [...this.#pointsModel.tasks].sort(sortByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.tasks].sort(sortByPrice);
    }
    return this.#pointsModel.points;
  }


  #handleModeChange = () => {
    //console.log('handleModeChange');
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point) => {

    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handleViewAction, this.#handleModeChange);
    //console.log ('point list presenter 30', point);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortChangeHandler(this.#handleSortChange);
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

  #renderAllPoints = (points) => {
    points.forEach((point) => {
      //console.log ('point list presenter 58',point);
      this.#renderPoint(point);
    });
  };

  #currentSortType = SortType.DEFAULT;
  //#sourcedPointsList = [];

  init = (pointListContainer) => {
    this.#pointListContainer = pointListContainer;
    //this.#pointsList = [...this.#pointsModel.points];

    //this.#offersList = [...this.#offersModel.offers];
    //this.#destinations = [...this.#destinationsModel.destinations];

    this.#renderSort();

    //this.#sourcedPointsList = [...this.#pointsModel.points];

    this.#renderPointList();


  };

  #renderList = () => {
    if ([...this.#pointsModel.tasks].length === 0) {
      this.#renderNoPoints();
    }
    //this.#renderNewPoint();
    this.#renderAllPoints();
  };

  #handlePointChange = (updatedPoint) => {
    //console.log('handlePoint begin', updatedPoint);
    //this.#pointsList = updateItem(this.#pointsList, updatedPoint);
    //this.sourcedPointsList = updateItem(this.#sourcedPointsList, updatedPoint);
    //this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
    //console.log('handlePoint end', updatedPoint);
  };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };

  /* #sortPoints = (sortType) => {
    switch (sortType) {
      case SortType.DAY:
        this.#pointsList.sort(sortByDay);
        break;
      case SortType.TIME:
        this.#pointsList.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#pointsList.sort(sortByPrice);
        break;
      default:
        this.#pointsList = [...this.#sourcedPointsList];
    }

    this.#currentSortType = sortType;

  }; */

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = (sortType);
    this.#clearPointsList();
    this.#renderAllPoints();
  };

}

