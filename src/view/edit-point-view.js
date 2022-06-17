import {createElement} from '../render.js';
import {typesMap} from '../mock/types-map.js';
import { getTimeFromIso, getEditableDateFromIso } from '../dayjs-custom.js';
// add type in call
const createOfferListItem = (offer, type, isChecked) => {
  const {title, price} = offer;
  return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" ${isChecked ? 'checked' : ''}>
          <label class="event__offer-label" for="event-offer-${type}-1">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>
     `;
};


const createTypeOptionsList =(typesArray) => {
  let optionsList = '';
  for (const type of typesArray){
    optionsList = `${optionsList}
          <div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" >
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase()}${type.slice(1)}</label>
          </div>`;
  }
  return optionsList;
};

const createOffersOfPointList = (offersOfType, offersOfPoint, type) => {

  let offersOfPointList ='';
  for (const offerOfType of offersOfType) {
    let isChecked = false;
    for (const offerOfPoint of offersOfPoint) {
      if (offerOfType.id === offerOfPoint) {
        isChecked = true;
      }

    }
    offersOfPointList = `${offersOfPointList}${createOfferListItem(offerOfType, type, isChecked)}`;
  }
  return offersOfPointList;
};

const getOffersOfType = (offersByType, pointType) => {
  for (const offersOfType of offersByType){
    if (offersOfType.type === pointType){
      return offersOfType.offers;
    }
  }
};
//-----------------------------------------------------------------------Main function--------------------------------------------------------------------------------
const createEditPointTemplate = (point, offersByType) => {

  // eslint-disable-next-line no-unused-vars
  //console.log('entry createEditPointTemplate', point, offersByType);
  const {base_price: basePrice, date_from: dateFrom, date_to: dateTo, destination, offers, type} = point;
  const offersOfType = getOffersOfType(offersByType, type);

  //console.log(destination);
  return (`<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${createTypeOptionsList(typesMap)}


        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        <option value="Amsterdam"></option>
        <option value="Geneva"></option>
        <option value="Chamonix"></option>
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${getEditableDateFromIso(dateFrom)} ${getTimeFromIso(dateFrom)}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${getEditableDateFromIso(dateTo)} ${getTimeFromIso(dateTo)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">



        ${createOffersOfPointList(offersOfType, offers, type)}



    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
    </section>
  </section>
</form>
</li>
`);
};

export default class EditPointView {
  constructor(point, offers){
    this.point = point;
    this.offers = offers;
  }

  getTemplate(){
    //console.log(this.point.destination);
    return createEditPointTemplate(this.point, this.offers);
  }

  getElement() {
    if (!this.element) {
      //console.log('point view class', this.point, this.offers);
      this.element = createElement(this.getTemplate(this.point, this.offers));
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}

