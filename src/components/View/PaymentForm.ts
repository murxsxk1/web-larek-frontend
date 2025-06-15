import { TPaymentModal } from "../../types";
import { IEvents } from "../base/Events";
import { Form, IFormState } from "./Form";

export class PaymentForm extends Form<TPaymentModal> {
  protected _paymentButtons: HTMLButtonElement[];
  protected _selectedPayment: string = '';

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._paymentButtons = Array.from(this.container.querySelectorAll ('.order__buttons .button')) as HTMLButtonElement[];
  
    this._paymentButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const value = button.name === 'card' ? 'onliner' : 'receipt';
        this.setPaymentMethod(value);
        this.onInputChange('payment' as keyof TPaymentModal, value);
      });
    });
  }
  
  setPaymentMethod(method: string) {
    this._selectedPayment = method;
    this._paymentButtons.forEach(button => {
      const isActive = (button.name === 'card' && method === 'onliner') || (button.name === 'cash' && method === 'receipt');
      button.classList.toggle('button_alt-active', isActive);
    })
  }
  set address(value: string) {
    (this.container.querySelector('input[name="address"]') as HTMLInputElement).value = value;
  }
  
  set payment(value: string) {
    this.setPaymentMethod(value);
  }

  render(state: Partial<TPaymentModal> & IFormState) {
    const result = super.render(state);
    
    // Устанавливаем значения полей при рендере
    if (state.address !== undefined) {
      this.address = state.address;
    }
    if (state.payment !== undefined) {
      this.payment = state.payment;
    }
    
    return result;
  }
}