import { ICartData, TCartModal } from "../../types";
import { IEvents } from "../base/Events";

export class CartData implements ICartData {
    protected _items: TCartModal[] = [];
    protected _total: number | null;
    protected _count: number;
    protected events: IEvents;

    constructor(events: IEvents) {
      this.events = events;
    }

    addToCart(item: TCartModal) {
      this._items.push(item);
      this.events.emit('card:added');
    };

    removeFromCart(cardId: string) {
      this._items = this._items.filter((item) => item.id !== cardId);
      this.events.emit('card:removed');
    }

    countPrices() {
      this._total = this._items.reduce((sum, item) => sum + (item.price || 0), 0);
      this.events.emit('cart:changed');
    }

    countCardsAmount() {
      this._count = this._items.length;
    }

    get items() {
      return this._items;
    }

    get total() {
      return this._total;
    }

    get count() {
      return this._count;
    }
}