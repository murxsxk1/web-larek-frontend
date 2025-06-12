import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/LarekAPI';
import { CardsData } from './components/Model/CardsData';
import { CartData } from './components/Model/CartData';
import { OrderData } from './components/Model/OrderData';
import { Page } from './components/View/Page';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';

const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const cardsData = new CardsData(events);
const cartData = new CartData(events);
const orderData = new OrderData(events);

const page = new Page(document.body, events);

events.on('card:changed', () => {
  const cardsHTMLArray = cardsData.getItems()
})