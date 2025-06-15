import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export interface ISuccess {
    total: number;
}

interface ISuccessActions {
  onClick: () => void;
}

export class SuccessModal extends Component<ISuccess> {
  protected _closeSuccessModal: HTMLElement;
  protected _totalElement: HTMLElement;

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._closeSuccessModal = ensureElement<HTMLElement>('.order-success__close', this.container);
    this._totalElement = ensureElement<HTMLElement>('.order-success__description', this.container);

    if (actions?.onClick) {
      this._closeSuccessModal.addEventListener('click', actions.onClick);
    }
  }

  set total(value: number) {
    this.setText(this._totalElement, `Списано ${value} синапсов`);
  }

  render(data: ISuccess): HTMLElement {
    this.total = data.total;
    return this.container;
  }
}