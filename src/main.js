import PointsModel from './model/points-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import PointListPresenter from './presenter/point-list-presenter.js';

import FilterModel from './model/filter-model.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const pointListContainer = document.querySelector('.trip-events');


const pointListPresenter = new PointListPresenter();
const filtersPresenter = new FiltersPresenter();

const filterModel = new FilterModel();

pointListPresenter.init(pointListContainer);
filtersPresenter.init(filtersContainer);
