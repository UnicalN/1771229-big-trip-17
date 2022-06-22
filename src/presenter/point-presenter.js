
import {render, replace} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

import OffersModel from '../model/offers-model.js';

export default class PointPresenter {
  #pointListComponent = null;
  #pointComponent = null;
  #editPointComponent = null;
  #point = null;

  #pointListContainer = null;
  #offersList = null;
  #offersModel = new OffersModel();

  constructor(pointListComponent){
    this.#pointListComponent = pointListComponent;
  }


  init = (point) => {
    this.#point = point;
    //
    this.#offersList = [...this.#offersModel.offers];

    this.#pointComponent = new PointView(point, this.#offersList);
    this.#editPointComponent = new EditPointView(point, this.#offersList);
    //
    this.#editPointComponent = new EditPointView(point, this.#offersList);


    this.#pointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClickStandard);
    this.#editPointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClickEdit);

    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setFormResetHandler(this.#handleFormReset);
    render(this.#pointComponent, this.#pointListComponent);
  };

  #replaceStandardWithEdit = () => {
    replace(this.#editPointComponent, this.#pointComponent);
    // eslint-disable-next-line no-use-before-define
    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  #replaceEditWithStandard = () => {
    replace(this.#pointComponent, this.#editPointComponent);
  };

  #onEscKeyDown =  (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditWithStandard();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #handleRollupButtonClickStandard = () => {
    this.#replaceStandardWithEdit();
  };

  #handleRollupButtonClickEdit = () => {
    this.#replaceEditWithStandard();
  };

  #handleFormSubmit = () => {
    this.#replaceEditWithStandard();
  };

  #handleFormReset = () => {
    this.#replaceEditWithStandard();
  };

  //  добавление listener'ов

  /*
  #pointComponent.setRollupButtonClickHandler(() => {
    replaceStandardWithEdit();
  });

  #editPointComponent.setRollupButtonClickHandler(() => {
    replaceEditWithStandard();
  });

  editPointComponent.setFormSubmitHandler(() => {
    replaceEditWithStandard();
  });

  editPointComponent.setFormResetHandler(() => {
    replaceEditWithStandard();
  });

*/

}
