import { ICard } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard>{
  protected _cardCategory?: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;
  
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._cardCategory = ensureElement('.card__category', this.container);
    this._cardTitle = ensureElement('.card__title', this.container);
    this._cardImage = ensureElement('.card__image', this.container) as HTMLImageElement;
    this._cardPrice = ensureElement('.card__price', this.container);
    
    if (actions?.onClick) {
      if (this.container) {
        this.container.addEventListener('click', actions.onClick);
      } 
    }
  }

  set category(value: string) {
    this.setText(this._cardCategory, value);
  }

  get category() {
    return this._cardCategory.textContent || '';
  }

  set title(value: string) {
    this.setText(this._cardTitle, value);
  }

  get title() {
    return this._cardTitle.textContent || '';
  }

  set image(value: string) {
    this.setImage(this._cardImage, value, this.title)
  }

  set price(value: string) {
    this.setText(this._cardPrice, value);
  }

  get price() {
    return this._cardPrice.textContent || '';
  }
}


export class CardPreview extends Card {
  protected _cardText: HTMLElement;
  protected _cardButton: HTMLButtonElement;

  constructor(container: HTMLElement,  actions?: ICardActions) {
    super(container);
    this._cardText = ensureElement('.card__text', this.container);
    this._cardButton = ensureElement('.card__button', this.container) as HTMLButtonElement;
    
    if (actions?.onClick) {
      if (this._cardButton) {
        this._cardButton.addEventListener('click', actions.onClick);
      } 
    }
  
  }

  set text(value: string) {
    this.setText(this._cardText, value);
  }

  get text() {
    return this._cardButton.textContent || '';
  }
}

export class CardBasket extends Card {
  protected _cardIndex: HTMLElement;
  protected _cardDeleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);
    this._cardIndex = ensureElement('.basket__item-index', this.container);
    this._cardDeleteButton = ensureElement('.basket__item-delete', this.container) as HTMLButtonElement;
  
    if (actions?.onClick) {
      if (this._cardDeleteButton) {
        this._cardDeleteButton.addEventListener('click', actions.onClick);
      } 
    }
  }
  set index(value: number) {
    this.setText(this._cardIndex, value);
  }
}