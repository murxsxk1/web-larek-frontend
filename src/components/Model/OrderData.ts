import { IOrder, IOrderData, TFormErrors } from "../../types";
import { IEvents } from "../base/Events";

export class OrderData implements IOrderData {
    protected _order: IOrder;
    protected events: IEvents;
    formErrors: TFormErrors;

    constructor(events: IEvents) {
      this.events = events;
    }

    setPayment(payment: "online" | "receipt") {
      this._order.payment = payment;
    }

    setAddress(address: string) {
      this._order.address = address;
    }

    setEmail(email: string) {
      this._order.email = email;
    }

    setPhone(phone: string) {
      this._order.phone = phone;
    }

    submitOrder() {
      this.events.emit('order:submit', this._order);
    }
    
    validateOrderFields() {
      const errors: typeof this.formErrors = {
        payment: "",
        address: "",
        email: "",
        phone: ""
      };

      if (!this._order.address) {
        errors.address = 'Необходимо указать адрес';
      }

      if (!this._order.email) {
        errors.email = 'Необходимо указать email';
      }

      if (!this._order.phone) {
        errors.phone = 'Необходимо указать телефон';
      }

      this.formErrors = errors;
      this.events.emit('order:changed', this.formErrors);

      return Object.keys(errors).length === 0;
    }

    get order() {
      return this._order;
    }
}