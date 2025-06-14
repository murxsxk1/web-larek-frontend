import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/LarekAPI';
import { CardsData } from './components/Model/CardsData';
import { CartData } from './components/Model/CartData';
import { OrderData } from './components/Model/OrderData';
import { Card, CardPreview } from './components/View/Card';
import { Cart } from './components/View/Cart';
import { Modal } from './components/View/Modal';
import { Page } from './components/View/Page';
import { PaymentForm } from './components/View/PaymentForm';
import './scss/styles.scss';
import { ICard, TCartModal } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Брокер событий
const events = new EventEmitter();

// Инициализация API
const api = new LarekAPI(CDN_URL, API_URL);

// Шаблоны
const successModalTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardCartTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const cartTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Модели данных
const cardsData = new CardsData(events);
const cartData = new CartData(events);
const orderData = new OrderData(events);

// Модели представления
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cart = new Cart(cloneTemplate(cartTemplate), events);
const order = new PaymentForm(cloneTemplate(orderTemplate), events);

// Изменение элементов каталога
events.on('card:changed', () => {
  page.catalog = cardsData.cards.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:selected', item)
    });
    return card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
      id: item.id
    });
  });

  page.counter = cartData.count;
})

events.on('card:selected', (item: ICard) => {
  cardsData.setPreview(item);
})

events.on('preview:changed', (item: TCartModal) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
      // Добавляем в корзину и закрываем модальное окно
      cartData.addToCart(item);
      modal.close();
    }
  });

  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      price: item.price,
      id: item.id,
      description: item.description,
    })
  });
});

api.getCards()
  .then(cardsData.setCards.bind(cardsData))
  .catch(error => {
    console.error(error);
  })