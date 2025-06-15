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
import { ContactsForm } from './components/View/ContactsForm'; // Добавлен импорт
import { SuccessModal } from './components/View/SuccessModal';
import './scss/styles.scss';
import { ICard, TCartModal, TContactModal, TPaymentModal } from './types';
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
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events); // Создание экземпляра ContactsForm

// Отображение карточек в каталоге
events.on('card:changed', () => {
  page.catalog = cardsData.cards.map(item => {
    const card = new Card(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit('card:selected', item)
    });
    
    // Получаем CSS класс для категории из модели
    const categoryClass = cardsData.getCategoryColor(item.category);
    
    return card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      categoryClass: categoryClass,
      price: item.price,
      id: item.id
    });
  });
});

// Определение нажатой карточки
events.on('card:selected', (item: ICard) => {
  cardsData.setPreview(item);
});

// Отображение превью карточки при нажатии
events.on('preview:changed', (item: TCartModal) => {
  const isInCart = cartData.items.some(cartItem => cartItem.id === item.id);
  const isPriceless = item.price === null;

  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
   onClick: () => {
      if (!isInCart && !isPriceless) {
        cartData.addToCart(item);
        modal.close();
      }
   }
  });

  // Получаем CSS класс для категории из модели
  const categoryClass = cardsData.getCategoryColor(item.category);

  modal.render({
    content: card.render({
      title: item.title,
      image: item.image,
      category: item.category,
      categoryClass: categoryClass,
      price: item.price,
      id: item.id,
      description: item.description,
      selected: isInCart || isPriceless, // Кнопка неактивна если товар в корзине ИЛИ бесценный
    })
  });
});

// Обработка изменения метода оплаты из модели
events.on('payment:method-changed', (data: { method: string }) => {
  order.paymentButtonsState = data.method;
});

// Блокировка скролла при открытии модального окна
events.on('modal:open', () => {
  page.locked = true;
});

// Отмена блокировки скролла при закрытии модального окна
events.on('modal:close', () => {
  page.locked = false;
});

// Открытие корзины
events.on('cart:open', () => {
  modal.render({
    content: cart.render()
  });
});

// Изменение содержимого корзины (отображение карточки, указание индекса, подсчет общей суммы)
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
    });
  });
  cart.total = cartData.total;
});

// Открытие формы заказа (этап 1 - адрес и способ оплаты)
events.on('order:open', () => {
  // Устанавливаем данные корзины в заказ
  orderData.setOrderData(cartData.total, cartData.items.map(item => item.id));
  
  modal.render({
    content: order.render({
      address: orderData.order.address || '',
      payment: orderData.order.payment || '',
      valid: orderData.validatePaymentForm(),
      errors: [orderData.formErrors.address, orderData.formErrors.payment]
        .filter(error => error !== "")
    })
  });
});

// Открытие формы контактов (этап 2 - email и телефон)
events.on('contacts:open', () => {
  modal.render({
    content: contactsForm.render({
      email: orderData.order.email || '',
      phone: orderData.order.phone || '',
      valid: orderData.validateContactsForm(),
      errors: [orderData.formErrors.email, orderData.formErrors.phone]
        .filter(error => error !== "")
    })
  });
});

// Отправка формы оплаты (переход к контактам)
events.on('order:submit', () => {
  if (orderData.validatePaymentForm()) {
    events.emit('contacts:open');
  }
});

// Отправка формы заказа
events.on('contacts:submit', () => {
  if (orderData.validateContactsForm()) {
    
    orderData.setOrderData(cartData.total, cartData.items.map(item => item.id));
    
    api.addOrder(orderData.order)
      .then((result) => {
        const success = new SuccessModal(cloneTemplate(successModalTemplate), {
          onClick: () => {
            modal.close();
            cartData.clearCart();
            orderData.clearOrder();
          }
        });

        modal.render({
          content: success.render({
            total: result.total || cartData.total
          })
        });
      })
      .catch(error => {
        console.error('Ошибка при отправке заказа:', error);
      });
  }
});

// Изменение состояния валидации форм
events.on('formErrors:change', (errors: Partial<TPaymentModal>) => {
  const { email, phone, address, payment } = errors;
  
  // Обновляем состояние формы оплаты
  const paymentFormValid = !address && !payment;
  order.valid = paymentFormValid;
  order.errors = [address, payment].filter(i => !!i).join('; ');
  
  // Обновляем состояние формы контактов
  const contactsFormValid = !email && !phone;
  contactsForm.valid = contactsFormValid;
  contactsForm.errors = [email, phone].filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^(order|payment|contacts)\..*:change/, (data: { field: keyof TPaymentModal, value: string }) => {
  orderData.setOrderField(data.field, data.value);
});

// Получение данных карточек
api.getCards()
  .then(cardsData.setCards.bind(cardsData))
  .catch(error => {
    console.error(error);
  });