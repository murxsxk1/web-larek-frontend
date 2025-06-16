import { ICard, ICardsData, TCartModal } from '../../types';
import { IEvents } from '../base/Events';

export class CardsData implements ICardsData {
	protected _cards: ICard[] = [];
	protected _preview: string | null;

	constructor(protected events: IEvents) {
		this.events = events;
	}

	getCard(cardId: number | string) {
		return this._cards.find((item) => item.id === cardId);
	}

	setCards(cards: ICard[]) {
		this._cards = cards;
		this.events.emit('card:changed');
	}

	get cards() {
		return this._cards;
	}

	setPreview(item: ICard) {
		this._preview = item.id;
		this.events.emit('preview:changed', item);
	}

	clearPreview() {
		this._preview = null;
	}

	get preview() {
		return this._preview;
	}

	getCategoryColor(category: string) {
		const categoryMap: Record<string, string> = {
			'софт-скил': 'card__category_soft',
			'хард-скил': 'card__category_hard',
			другое: 'card__category_other',
			дополнительное: 'card__category_additional',
			кнопка: 'card__category_button',
		};

		return categoryMap[category.toLowerCase()] || '';
	}

	isPriceless(card: ICard) {
		return card.price === null;
	}

	isAvailableForPurchase(card: ICard, cartItems: TCartModal[]) {
		const isInCart = cartItems.some((item) => item.id === card.id);
		const isPriceless = this.isPriceless(card);
		return !isInCart && !isPriceless;
	}

	getButtonText(card: ICard, cartItems: TCartModal[]) {
		if (this.isPriceless(card)) {
			return 'Бесценный товар купить нельзя';
		}

		const isInCart = cartItems.some((item) => item.id === card.id);
		return isInCart ? 'Товар уже в корзине' : 'Купить';
	}
}