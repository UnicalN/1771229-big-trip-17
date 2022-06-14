import {
  offers
} from '../mock/generate-offers.js';

export default class OffersModel {
  offers = this.offers;
  getOffers = () => offers;
}
