import PointsModel from '../model/points-model.js';
import {render, replace} from '../framework/render.js';
import EditPointView from '../view/edit-point-view.js';
import NewPointView from '../view/new-point-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';
import NoPointsView from '../view/no-points-view.js';

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

  #renderPoint = (point) => {
    //render(new PointView(point, ), this.#pointListComponent.getElement()); //render(что, где)
    const pointComponent = new PointView(point, this.#offersList);
    const editPointComponent = new EditPointView(point, this.#offersList);

    const replaceStandardWithEdit = () => {
      replace(editPointComponent, pointComponent);
      // eslint-disable-next-line no-use-before-define
      document.addEventListener('keydown', onEscKeyDown);
    };
    const replaceEditWithStandard = () => {
      replace(pointComponent, editPointComponent);
    };
    const onEscKeyDown =  (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditWithStandard();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };
    //  добавление listener'ов
    pointComponent.setRollupButtonClickHandler(() => {
      replaceStandardWithEdit();
    });

    editPointComponent.setRollupButtonClickHandler(() => {
      replaceEditWithStandard();
    });

    editPointComponent.setFormSubmitHandler(() => {
      replaceEditWithStandard();
    });

    editPointComponent.setFormResetHandler(() => {
      replaceEditWithStandard();
    });


    render(pointComponent, this.#pointListComponent.element);
  };


  init = (pointListContainer) => {
    this.#pointListContainer = pointListContainer;
    this.#pointsList = [...this.#pointsModel.points];
    this.#offersList = [...this.#offersModel.offers];

    this.#destinations = [...this.#destinationsModel.destinations];


    render(new SortView(), this.#pointListContainer);
    render(this.#pointListComponent, this.#pointListContainer); // this. вместо new тк объявлено ранее для повторяющихся элементов
    //console.log('pre-render editPointView', this.pointsList, this.offersList);
    //render(new EditPointView(this.#pointsList[0], this.#offersList), this.#pointListComponent.element);
    render(new NewPointView(), this.#pointListComponent.element);

    if (this.#pointsList.length === 0) {
      render(new NoPointsView(), this.#pointListComponent.element);
    }


    this.#pointsList.forEach((point) => {
      this.#renderPoint(point);
    });

  };
}

