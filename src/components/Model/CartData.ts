import { ICartData, IOrder, TCartModal } from "../../types";
import { IEvents } from "../base/Events";

export class CartData implements ICartData {
    protected _items: TCartModal[] = [];
    protected _total: number = 0; // Инициализируем 0 вместо null
    protected _count: number = 0;

    constructor(protected events: IEvents) {
        this.events = events;
    }

    addToCart(item: TCartModal) {
        // Проверяем, нет ли уже такого товара в корзине
        const existingItem = this._items.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            return; // Не добавляем дубликаты
        }
        
        this._items.push(item);
        this.countPrices();
        this.countCardsAmount();
        this.events.emit('cart:changed');
    }

    removeFromCart(cardId: string) {
        this._items = this._items.filter((item) => item.id !== cardId);
        this.countPrices();
        this.countCardsAmount();
        this.events.emit('cart:changed');
    }

    countPrices() {
        this._total = this._items.reduce((sum, item) => sum + (item.price || 0), 0);
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
        return this._count; // Возвращаем _count вместо пересчета
    }

    clearCart() {
        this._items = [];
        this._total = 0;
        this._count = 0;
        this.events.emit('cart:changed');
    }
}