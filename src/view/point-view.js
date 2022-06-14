
import {createElement} from '../render.js';


const getOffersOfType = (offersByType, pointType) => {
  for (const offersOfType in offersByType){
    if (offersOfType.type === pointType)
    {return offersOfType.offers;}
  }
};

const createOfferListItem = (offer) => {
  // eslint-disable-next-line no-unused-vars
  const {id ,title, price} = offer;
  return `
     <li class="event__offer">
     <span class="event__offer-title">${title}</span>
     &plus;&euro;&nbsp;
     <span class="event__offer-price">${price}</span>
   </li>
     `;
};

const createOffersOfPointList = (offersOfType, offersOfPoint) => {
  let offersOfPointList ='';
  for (const offerOfType in offersOfType) {
    for (const offerOfPoint of offersOfPoint) {
      if (offerOfType.id === offerOfPoint) {
        offersOfPointList = `${offersOfPointList}${createOfferListItem(offerOfType)}`;
      }
    }
  }
};


const createPointTemplate = (point, offersByType) => {
  //const point = {basePrice: 100, dateFrom: '2019-03-18T10:30', dateTo: '2019-03-18T11:00', destination: 'Paris', id: 1, isFavorite: true, offers: [], type: 'taxi'};
  // eslint-disable-next-line no-unused-vars
  const {base_price: basePrice, date_from: dateFrom, date_to: dateTo, destination, id, is_favorite:isFavorite, offers, type} = point;
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  console.log(point, offersByType);
  createOffersOfPointList(getOffersOfType(offersByType, type), offers);

  return(`
<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime=datetime="${'date'}date">${'humanizedDate'}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type} icon">
  </div>
  <h3 class="event__title">${type} ${destination}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${dateFrom}">${'HumanizedDateFrom'}</time>
      &mdash;
      <time class="event__end-time" datetime="${dateTo}">${'humanizedDateTo'}</time>
    </p>
    <p class="event__duration">${'duration'}M</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">


  ${'offersList'}
    <li class="event__offer">
      <span class="event__offer-title">${'offerTitle'}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">20</span>
    </li>



  </ul>
  <button class="event__favorite-btn ${favoriteClass}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>
`);};

export default class PointView {
  constructor(point, offers){
    this.point = point;
    this.offers = offers;
  }

  getTemplate(){
    return createPointTemplate(this.point, this.offers);
  }

  getElement() {
    if (!this.element) {
      //console.log('жмых');
      //console.log(this.point);
      this.element = createElement(this.getTemplate(this.point, this.offers));


    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
