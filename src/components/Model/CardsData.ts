import { ICard, ICardsData } from "../../types";
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

  get preview () {
    return this._preview;
  }
}