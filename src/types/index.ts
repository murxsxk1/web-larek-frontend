export interface ICard {
  category: string;
  title: string;
  image: string;
  price: number | null;
  description?: string;
  id: string;
}

export interface IOrder {
  total: number;
  items: string[];
  payment: string;
  address: string;
  email: string;
  phone: string;
}

export interface ICardsData {
  cards: ICard[];
  preview: string | null;
  addCard(card: ICard): void;
  getCard(cardId: string): ICard;
}

export interface ICartData {
  items: ICard[];
  total: number | null;
  count: number;
  addToCart(card: ICard): void;
  removeFromCart(cardId: string): void;
  countPrices(): void;
  countCardsAmount(): void;
}

export interface IOrderData {
  order: IOrder;
  formErrrors: TFormErrors;
  setPayment(payment: string): void;
  setAddress(address: string): void;
  setEmail(email: string): void;
  setPhone(phone: string): void;
  submitOrder(): void;
  validateOrderFields(): boolean;
}

export type TMainPage = Pick<ICard, 'category' | 'title' | 'image' | 'price' | 'id'>;

export type TCardModal = Pick<ICard, 'category' | 'title' | 'image' | 'price' | 'description' | 'id'>;

export type TCartModal = Pick<ICard, 'title' | 'price' | 'id'> & Pick<IOrder, 'total' | 'items'>;

export type TPaymentModal = Pick<IOrder, 'payment' | 'address'>;

export type TContactModal = Pick<IOrder, 'email' | 'phone'>;

export type TFormErrors = Record<keyof TPaymentModal | keyof TContactModal, string>;