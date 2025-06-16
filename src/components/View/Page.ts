import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _cartCounter: HTMLElement;
	protected _cardCatalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _cart: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._cartCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this._cardCatalog = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._cart = ensureElement<HTMLElement>('.header__basket');

		this._cart.addEventListener('click', () => {
			this.events.emit('cart:open');
		});
	}

	set counter(value: number) {
		this.setText(this._cartCounter, String(value));
	}

	set catalog(items: HTMLElement[]) {
		this._cardCatalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}