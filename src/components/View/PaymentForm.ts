import { TPaymentModal } from "../../types";
import { IEvents } from "../base/Events";
import { Form } from "./Form";

export class PaymentForm extends Form<TPaymentModal> {
  protected _paymentTypeButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
  }
  
  set address(value: string) {
    (this.container.querySelector('input[name="address"]') as HTMLInputElement).value = value;
  }
  
  set payment(value: string) {
    this.toggleClass(this._paymentTypeButton, 'button_alt');
  }
}