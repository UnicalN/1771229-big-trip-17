
import {render, replace, remove} from '../framework/render.js';
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
  #changeData = null;


  constructor(pointListComponent, changeData){
    this.#pointListComponent = pointListComponent;
    this.#changeData = changeData;
  }


  init = (point) => {
    this.#point = point;
    //
    this.#offersList = [...this.#offersModel.offers];

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView(point, this.#offersList);
    this.#editPointComponent = new EditPointView(point, this.#offersList);
    //


    this.#pointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClickStandard);
    this.#editPointComponent.setRollupButtonClickHandler(this.#handleRollupButtonClickEdit);

    this.#editPointComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#editPointComponent.setFormResetHandler(this.#handleFormReset);

    this.#pointComponent.setFavoriteClickHandler(this.#handleFavoriteClick);

    //переиспользование
    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#pointListComponent);
      return;
    }
    //console.log('point presenter 51', prevPointComponent.element)
    if (this.#pointListComponent.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#pointListComponent.contains(prevEditPointComponent.element)) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    remove(prevPointComponent);
    remove(prevEditPointComponent);

    render(this.#pointComponent, this.#pointListComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);

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

  #handleFavoriteClick = () => {
    this.#changeData({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleFormSubmit = (point) => {
    this.#changeData(point);
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
