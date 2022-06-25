import {typesMap} from '../mock/types-map.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getTimeFromIso, getEditableDateFromIso } from '../dayjs-custom.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
// add type in call
const createOfferListItem = (offer, type, isChecked) => {
  //console.log (offer);
  const {id, title, price} = offer;
  return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-${type}" ${isChecked ? 'checked' : ''}>
          <label class="event__offer-label" for="${id}">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>
     `;
};

const createTypeOptionsList =(typesArray, chosenType) => {
  let optionsList = '';
  for (const type of typesArray){
    optionsList = `${optionsList}
          <div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === chosenType ? 'checked' : ''} >
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type[0].toUpperCase()}${type.slice(1)}</label>
          </div>`;
  }
  return optionsList;
};

const createOffersOfPointList = (offersOfType, offersOfPoint, type) => {
  if (!offersOfType) {return '';}
  let offersOfPointList ='';
  //console.log(offersOfType);
  for (const offerOfType of offersOfType) {
    let isChecked = false;
    for (const offerOfPoint of offersOfPoint) {
      if (offerOfType.id === offerOfPoint) {
        isChecked = true;
      }

    }
    offersOfPointList = `${offersOfPointList}${createOfferListItem(offerOfType, type, isChecked)}`;
  }
  //console.log(offersOfPointList);
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
const createEditPointTemplate = (pointData, offersByType) => {

  // eslint-disable-next-line no-unused-vars
  //console.log('entry createEditPointTemplate', point, offersByType);
  const {base_price: basePrice, date_from: dateFrom, date_to: dateTo, destination, offers, type} = pointData;
  const offersOfType = getOffersOfType(offersByType, type);
  //console.log (offersOfType, offers, type);
  const offersOfPointList = createOffersOfPointList(offersOfType, offers, type);

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

          ${createTypeOptionsList(typesMap, type)}


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
      ${offersOfPointList ? '<h3 class="event__section-title  event__section-title--offers">Offers</h3>' : ''}

      <div class="event__available-offers">



        ${offersOfPointList}



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

const NEW_POINT = {};

export default class EditPointView extends AbstractStatefulView {

  #offers = null;
  constructor(point = NEW_POINT, offers){
    super();
    this._state = EditPointView.parse(point);
    this.#offers = offers;
    this.#setInnerHandlers();
  }

  get template() {
    //console.log('get template 153', this.#point, this.#offers);
    return createEditPointTemplate(this._state, this.#offers);
  }

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  };

  #setInnerHandlers =() => {
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#typeChangeHandler);

  };

  setRollupButtonClickHandler = (callback) =>{
    this._callback.click = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  setFormResetHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('reset', this.#formResetHandler);
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };


  #formResetHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit();
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      price: evt.target.value,
    });
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    console.log(evt.target.value);
    this.updateElement({
      type : evt.target.value
    });
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    //this._callback.formSubmit(this.#point);
    // ----------------------------------STATEFUL-------------------------------------
    this._callback.formSubmit(EditPointView.parse(this._state));
    this.element.querySelector('#event-price-1')
      .addEventListener('input', this.#priceInputHandler);
  };

  /*
  #dateFromInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      // eslint-disable-next-line camelcase
      date_From: evt.target.value,
    });
  };
*/
  static parse = (parced) => ({...parced});

}
//
