export interface ICard {
  category: string;
  title: string;
  image: string;
  price: number | null;
  description?: string;
  id: string;
  index?: number;
  selected?: boolean;
  categoryClass?: string;
}

export interface IOrder {
  total: number;
  items: string[];
  payment: string;
  address: string;
  email: string;
  phone: string;
  id: string;
}

export interface ICardsData {
  cards: ICard[];
  preview: string | null;
  addCard(card: ICard): void;
  getCard(cardId: string): ICard;
}

export interface ICartData {
  items: TCartModal[];
  total: number | null;
  addToCart(item: TCartModal): void;
  removeFromCart(cardId: string): void;
  countPrices(): void;
  countCardsAmount(): void;
}

export interface IOrderData {
  order: IOrder;
  formErrors: TFormErrors;
  setPayment(payment: string): void;
  setAddress(address: string): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  submitOrder(): void;
  validateOrderFields(): boolean;
}

// Для отображения карточек в каталоге
export type TMainPage = Pick<ICard, 'category' | 'title' | 'image' | 'price' | 'id'>;

// Для отображения карточки в модальном окне (превью)
export type TCardModal = Pick<ICard, 'category' | 'title' | 'image' | 'price' | 'description' | 'id'>;

// ИСПРАВЛЕНО: для элементов корзины - только данные о товаре, без total и items
export type TCartModal = Pick<ICard, 'title' | 'price' | 'id' | 'description' | 'image' | 'category'>;

// Для форм оплаты и адреса
export type TPaymentModal = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>;

// Для формы контактов
export type TContactModal = Pick<IOrder, 'email' | 'phone'>;

// Для отображения результата заказа
export type TOrderModal = Pick<ICard, 'id'> & Pick<IOrder, 'total'>;

// Для ошибок валидации форм
export type TFormErrors = Record<keyof TPaymentModal | keyof TContactModal, string>;