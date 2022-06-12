import PointsModel from '../model/points-model.js';
import {render} from '../render.js';
import EditPointView from '../view/edit-point-view.js';
import NewPointView from '../view/new-point-view.js';
import PointListView from '../view/point-list-view.js';
import PointView from '../view/point-view.js';
import SortView from '../view/sort-view.js';


export default class PointListPresenter {
  editPointComponent = new EditPointView();
  pointListComponent = new PointListView();
  pointsModel = new PointsModel();
  init = (pointListContainer) => {
    this.pointListContainer = pointListContainer;
    this.pointsList = [...this.pointsModel.getPoints()];

    render(new SortView(), this.pointListContainer);
    render(this.pointListComponent, this.pointListContainer); // this. вместо new тк объявлено ранее для повторяющихся элементов
    render(new EditPointView(), this.pointListComponent.getElement());
    render(new NewPointView(), this.pointListComponent.getElement());

    //render(, this.pointListComponent.getElement());

    //render;

    for (let i = 0; i < 3; i++) {
      render(new PointView(this.pointsList[i]), this.pointListComponent.getElement());
    }
  };
}
