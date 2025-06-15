import { ICard } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card extends Component<ICard>{
  protected _cardCategory?: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage?: HTMLImageElement;
  protected _cardPrice: HTMLElement;
  
  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this._cardCategory = container.querySelector('.card__category');
    this._cardTitle = ensureElement('.card__title', this.container);
    this._cardImage = container.querySelector('.card__image') as HTMLImageElement;
    this._cardPrice = ensureElement('.card__price', this.container);
    
    if (actions?.onClick) {
      if (this.container) {
        this.container.addEventListener('click', actions.onClick);
      } 
    }
  }

  set category(value: string) {
    if(this._cardCategory){
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
    this.setImage(this._cardImage, value, this.title)
  }

  set price(value: string) {
    if (value!= null) {
      this.setText(this._cardPrice, `${value} синапсов`);
    } else {
      this.setText(this._cardPrice, `Бесценно`);
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
    return this._cardText.textContent || '';
  }

  set selected(value: boolean) {
    if(!this._cardButton) return;
    
    if (value) {
      // Товар уже в корзине или бесценный - кнопка неактивна
      this._cardButton.disabled = true;
      // Проверяем, является ли товар бесценным (цена null)
      const isPriceless = this.price.includes('Бесценно');
      this.setText(this._cardButton, isPriceless ? 'Бесценный товар купить нельзя' : 'Товар уже в корзине');
    } else {
      // Товар не в корзине и имеет цену - кнопка активна
      this._cardButton.disabled = false;
      this.setText(this._cardButton, 'В корзину');
    }
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