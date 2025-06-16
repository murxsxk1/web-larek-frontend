import { IOrder, IOrderData, TFormErrors, TPaymentModal } from '../../types';
import { IEvents } from '../base/Events';

export class OrderData implements IOrderData {
	protected _order: IOrder;
	protected _formErrors: TFormErrors;

	constructor(protected events: IEvents) {
		this.events = events;
		this._order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: 0,
			id: '',
			items: [],
		};
		this._formErrors = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
	}

	setPayment(payment: 'online' | 'receipt') {
		this._order.payment = payment;
		this.validateOrderFields();
	}

	setAddress(address: string) {
		this._order.address = address;
		this.validateOrderFields();
	}

	setEmail(email: string) {
		this._order.email = email;
		this.validateOrderFields();
	}

	setPhone(phone: string) {
		this._order.phone = phone;
		this.validateOrderFields();
	}

	submitOrder() {
		this.events.emit('order:submit', this._order);
	}

	validateOrderFields() {
		const errors: typeof this._formErrors = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};

		if (!this._order.payment) {
			errors.payment = 'Необходимо выбрать способ оплаты';
		}

		if (!this._order.address) {
			errors.address = 'Необходимо указать адрес';
		}

		if (!this._order.email) {
			errors.email = 'Необходимо указать email';
		} else if (!this.isValidEmail(this._order.email)) {
			errors.email = 'Некорректный формат email';
		}

		if (!this._order.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!this.isValidPhone(this._order.phone)) {
			errors.phone = 'Некорректный формат телефона';
		}

		this._formErrors = errors;
		this.events.emit('formErrors:change', this._formErrors);

		return Object.values(errors).every((error) => error === '');
	}

	private isValidEmail(email: string) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	private isValidPhone(phone: string) {
		const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
		return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
	}

	get order() {
		return this._order;
	}

	get formErrors() {
		return this._formErrors;
	}

	validatePaymentForm() {
		this.validateOrderFields();
		return !this._formErrors.payment && !this._formErrors.address;
	}

	validateContactsForm() {
		this.validateOrderFields();
		return !this._formErrors.email && !this._formErrors.phone;
	}

	setOrderField(field: keyof TPaymentModal, value: string) {
		switch (field) {
			case 'payment':
				this.setPayment(value as 'online' | 'receipt');
				break;
			case 'address':
				this.setAddress(value);
				break;
			case 'email':
				this.setEmail(value);
				break;
			case 'phone':
				this.setPhone(value);
				break;
		}
	}

	clearOrder() {
		this._order = {
			payment: '',
			address: '',
			email: '',
			phone: '',
			total: 0,
			id: '',
			items: [],
		};
		this._formErrors = {
			payment: '',
			address: '',
			email: '',
			phone: '',
		};
		this.events.emit('formErrors:change', this._formErrors);
	}

	setOrderData(total: number, items: string[]) {
		this._order.total = total;
		this._order.items = items;
	}
}