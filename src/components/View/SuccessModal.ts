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

  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);

    this._closeSuccessModal = ensureElement<HTMLElement>('.order-success__close', this.container);

    if (actions?.onClick) {
      this._closeSuccessModal.addEventListener('click', actions.onClick);
    }
  }
}