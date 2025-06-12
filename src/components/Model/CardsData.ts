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

  set cards(cards: ICard[]) {
    this._cards = cards;
    this.events.emit('card:changed');
  }

  get cards () {
    return this._cards;
  }

  set preview(cardId: string | null) {
    if (!cardId) {
        this._preview = null;
        return;
    }
    const selectedCard = this.getCard(cardId);
    if (selectedCard) {
        this._preview = cardId;
        this.events.emit('card:selected')
    }
  }

  get preview () {
    return this._preview;
  }
}