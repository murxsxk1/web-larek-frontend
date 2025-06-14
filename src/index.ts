import { EventEmitter } from './components/base/Events';
import { LarekAPI } from './components/LarekAPI';
import { CardsData } from './components/Model/CardsData';
import { CartData } from './components/Model/CartData';
import { OrderData } from './components/Model/OrderData';
import { Card, CardBasket, CardPreview } from './components/View/Card';
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

// Отображение карточек в каталоге
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

// Определение нажатой карточки
events.on('card:selected', (item: ICard) => {
  cardsData.setPreview(item);
})

// Отображение превью карточки при нажатии
events.on('preview:changed', (item: TCartModal) => {
  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
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

// Блокировка скролла при открытии модельного окна
events.on('modal:open', () => {
  page.locked = true;
})

// Отмена блокировки скролла при закрытии модельного окна
events.on('modal:close', () => {
  page.locked = false;
})

// Открытие корзины
events.on('cart:open', () => {
  modal.render({
    content: cart.render()
  })
})

// Изменение содержимого корзины
events.on('cart:changed', () => {
  page.counter = cartData.items.length;
  cart.items = cartData.items.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardCartTemplate), {
      onClick: (event) => {
        event.stopPropagation();
        cartData.removeFromCart(item.id);
      }
    });
    return card.render({
      title: item.title,
      price: item.price,
      index: index + 1
    })
  })
  let total = 0;
  cart.total = total;
})

// Получение данных карточек
api.getCards()
  .then(cardsData.setCards.bind(cardsData))
  .catch(error => {
    console.error(error);
  })