import { ICard, ICardsData, TCartModal } from "../../types";
import { IEvents } from "../base/Events";

export class CardsData implements ICardsData {
  protected _cards: ICard[] = [];
  protected _preview: string | null;

  constructor(protected events: IEvents) {
    this.events = events;
  }

  addCard(card: ICard) {
    this._cards = [card, ...this._cards];
    this.events.emit('card:changed');
  }

  getCard(cardId: number | string) {
    return this._cards.find(item => item.id === cardId);
  }

  setCards(cards: ICard[]) {
    this._cards = cards;
    this.events.emit('card:changed');
  }

  get cards () {
    return this._cards;
  }

  setPreview(item: ICard) {
    this._preview = item.id;
    this.events.emit('preview:changed', item);
  }

  clearPreview() {
    this._preview = null;
  }

  get preview () {
    return this._preview;
  }

  // Перенесенный метод из Card
  getCategoryColor(category: string): string {
    const categoryMap: Record<string, string> = {
      'софт-скил': 'card__category_soft',
      'хард-скил': 'card__category_hard',
      'другое': 'card__category_other',
      'дополнительное': 'card__category_additional',
      'кнопка': 'card__category_button'
    };

    return categoryMap[category.toLowerCase()] || '';
  }

  isPriceless(card: ICard): boolean {
    return card.price === null;
  }

  // Метод для проверки доступности товара для покупки
  isAvailableForPurchase(card: ICard, cartItems: TCartModal[]): boolean {
    const isInCart = cartItems.some(item => item.id === card.id);
    const isPriceless = this.isPriceless(card);
    return !isInCart && !isPriceless;
  }

  // Получить текст для кнопки товара
  getButtonText(card: ICard, cartItems: TCartModal[]): string {
    if (this.isPriceless(card)) {
      return 'Бесценный товар купить нельзя';
    }
    
    const isInCart = cartItems.some(item => item.id === card.id);
    return isInCart ? 'Товар уже в корзине' : 'В корзину';
  }
}