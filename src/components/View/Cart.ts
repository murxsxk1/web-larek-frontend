import { ICartData } from "../../types";
import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/Events";

export class Cart extends Component<ICartData> {
  protected _cartList: HTMLElement;
  protected _cartTotal: HTMLElement;
  protected _cartButton: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._cartList = ensureElement('.basket__list', this.container);
    this._cartTotal = ensureElement('.basket__price', this.container);
    this._cartButton = ensureElement('.basket__button', this.container);
    
    if (this._cartButton) {
      this._cartButton.addEventListener('click', () => {
        events.emit('order:open');
      })
    }

    this.items = []
  }

  set items(items: HTMLElement[]) {
    if (items.length) {
      this._cartList.replaceChildren(...items);
    } else {
      this._cartList.replaceChildren(createElement<HTMLParagraphElement>('p', {
        textContent: 'Корзина пуста'
      }))
    }
  }

  set selected(items: string[]) {
    if (items.length) {
      this.setDisabled(this._cartButton, false);
    } else {
      this.setDisabled(this._cartButton, true);
    }
  }

  set total(value: number) {
    this.setText(this._cartTotal, `${value} синапсов`);
  }
}