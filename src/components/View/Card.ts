import { ICard } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class BaseCard extends Component<ICard> {
	protected _cardCategory?: HTMLElement;
	protected _cardTitle: HTMLElement;
	protected _cardImage?: HTMLImageElement;
	protected _cardPrice: HTMLElement;

	constructor(container: HTMLElement) {
		super(container);

		this._cardCategory = container.querySelector('.card__category');
		this._cardTitle = ensureElement('.card__title', this.container);
		this._cardImage = container.querySelector(
			'.card__image'
		) as HTMLImageElement;
		this._cardPrice = ensureElement('.card__price', this.container);
	}

	set category(value: string) {
		if (this._cardCategory) {
			this.setText(this._cardCategory, value);
		}
	}

	set categoryClass(value: string) {
		if (!this._cardCategory) return;
		this._cardCategory.className = 'card__category';
		if (value) {
			this._cardCategory.classList.add(value);
		}
	}

	get category() {
		return this._cardCategory?.textContent || '';
	}

	set title(value: string) {
		this.setText(this._cardTitle, value);
	}

	get title() {
		return this._cardTitle.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._cardImage, value, this.title);
	}

	set price(value: string) {
		if (value != null) {
			this.setText(this._cardPrice, `${value} синапсов`);
		} else {
			this.setText(this._cardPrice, 'Бесценно');
		}
	}

	get price() {
		return this._cardPrice.textContent || '';
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}
}

export class Card extends BaseCard {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		if (actions?.onClick) {
			this.container.addEventListener('click', actions.onClick);
		}
	}
}

export class CardPreview extends BaseCard {
	protected _cardText: HTMLElement;
	protected _cardButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._cardText = ensureElement('.card__text', this.container);
		this._cardButton = ensureElement(
			'.card__button',
			this.container
		) as HTMLButtonElement;

		if (actions?.onClick && this._cardButton) {
			this._cardButton.addEventListener('click', (event) => {
				event.stopPropagation();
				actions.onClick(event);
			});
		}
	}

	set description(value: string) {
		this.setText(this._cardText, value);
	}

	get description() {
		return this._cardText.textContent || '';
	}

	setButtonState(disabled: boolean, text: string) {
		if (!this._cardButton) return;
		this._cardButton.disabled = disabled;
		this.setText(this._cardButton, text);
	}
}

export class CardBasket extends BaseCard {
	protected _cardIndex: HTMLElement;
	protected _cardDeleteButton: HTMLButtonElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._cardIndex = ensureElement('.basket__item-index', this.container);
		this._cardDeleteButton = ensureElement(
			'.basket__item-delete',
			this.container
		) as HTMLButtonElement;

		this.container.addEventListener('click', (event) => {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
		});

		if (actions?.onClick && this._cardDeleteButton) {
			this._cardDeleteButton.addEventListener('click', (event) => {
				event.preventDefault();
				event.stopPropagation();
				event.stopImmediatePropagation();
				actions.onClick(event);
			});
		}
	}

	set index(value: number) {
		this.setText(this._cardIndex, value);
	}
}