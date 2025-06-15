import { TPaymentModal } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class PaymentForm extends Form<TPaymentModal> {
  protected _paymentButtons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentButtons = Array.from(this.container.querySelectorAll('.order__buttons .button')) as HTMLButtonElement[];
  
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const value = button.name === 'card' ? 'online' : 'receipt';
        this.onInputChange('payment' as keyof TPaymentModal, value);
      });
    });
  }

  set paymentButtonsState(activeMethod: string) {
    this._paymentButtons.forEach(button => {
      const isActive = (button.name === 'card' && activeMethod === 'online') || (button.name === 'cash' && activeMethod === 'receipt');
      button.classList.toggle('button_alt-active', isActive);
    });
  }

  set address(value: string) {
    (this.container.querySelector('input[name="address"]') as HTMLInputElement).value = value;
  }
  
  set payment(value: string) {
    this.paymentButtonsState = value;
  }
}