export interface ICard {
  category: string;
  title: string;
  image: string;
  price: number | null;
  description?: string;
  id: number | string;
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
  getCard(cardId: number | string): ICard;
}

export interface ICartData {
  items: TCartModal[];
  total: number | null;
  count: number;
  addToCart(item: TCartModal): void;
  removeFromCart(cardId: number | string): void;
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

export type TMainPage = Pick<ICard, 'category' | 'title' | 'image' | 'price' | 'id'>;

export type TCardModal = Pick<ICard, 'category' | 'title' | 'image' | 'price' | 'description' | 'id'>;

export type TCartModal = Pick<ICard, 'title' | 'price' | 'id'> & Pick<IOrder, 'total' | 'items'>;

export type TPaymentModal = Pick<IOrder, 'payment' | 'address'>;

export type TContactModal = Pick<IOrder, 'email' | 'phone'>;

export type TOrderModal = Pick<ICard, 'id'> & Pick<IOrder, 'total'>;

export type TFormErrors = Record<keyof TPaymentModal | keyof TContactModal, string>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}