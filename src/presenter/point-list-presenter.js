/* eslint-disable no-console */
import PointsModel from '../model/points-model.js';
import {render,  RenderPosition, remove} from '../framework/render.js';
import NewPointView from '../view/new-point-view.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-points-view.js';

import PointPresenter from './point-presenter.js';

import {SortType, UpdateType, UserAction} from '../const.js';
import { sortByDay, sortByPrice, sortByTime } from '../dayjs-custom.js';

export default class PointListPresenter {
  #noPointsComponent = new NoPointsView();
  #pointListComponent = new PointListView();
  #pointListContainer = null;

  #pointsModel = new PointsModel();

  #pointPresenter = new Map();
  #sortComponent = null;
  constructor(){
    //!!
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortByDay);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortByTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }
    return this.#pointsModel.points;
  }


  #handleModeChange = () => {

    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point) => {

    const pointPresenter = new PointPresenter(this.#pointListComponent.element, this.#handleViewAction, this.#handleModeChange);

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #clearPointsList = (resetSortType = false) => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DEFAULT;
    }
    this.#renderSort();
  };
  //----------------------------------------------

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortChangeHandler(this.#handleSortChange);
  };
  /*
  #renderPointList = (points) => {
    render(this.#pointListComponent, this.#pointListContainer);

    if (!points) {
      this.#renderNoPoints();
      return;
    }

    this.#renderSort();
    render(this.#pointListComponent, this.#pointListContainer);

    this.#renderAllPoints();
  };
*/
  //----------------------------------------------------------------------

  #renderNewPoint = () => {
    render(new NewPointView(), this.#pointListComponent.element);
  };

  #renderNoPoints = () => {
    render(new NoPointsView(), this.#pointListComponent.element);
  };

  #renderAllPoints = (points) => {
    render(this.#pointListComponent, this.#pointListContainer);
    if (!points) {
      this.#renderNoPoints();
      return;
    }
    console.log('renderallpoints',points);
    points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #currentSortType = SortType.DEFAULT;

  init = (pointListContainer) => {
    this.#pointListContainer = pointListContainer;

    //this.#renderPointList();
    this.#renderAllPoints(this.points);
    this.#renderSort();

  };

  #handlePointChange = (updatedPoint) => {

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
        console.log('PATCH');
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        console.log('minor');
        // - обновить список (например, когда задача ушла в архив)
        this.#clearPointsList();
        this.#renderAllPoints(data); //points list?______
        break;
      case UpdateType.MAJOR:
        console.log('major');
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearPointsList({resetSortType: true});
        this.#renderAllPoints(data); //points list?_____
        break;
    }
  };

  #handleSortChange = (sortType) => {
    console.log(this.#currentSortType, sortType);
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = (sortType);
    this.#clearPointsList();
    this.#renderAllPoints(this.points);
  };

}

