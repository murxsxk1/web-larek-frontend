import { IOrder, IOrderData, TFormErrors, TPaymentModal } from "../../types";
import { IEvents } from "../base/Events";

export class OrderData implements IOrderData {
    protected _order: IOrder;
    formErrors: TFormErrors;

    constructor(protected events: IEvents) {
        this.events = events;
        this._order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            total: 0,
            id: '',
            items: []
        };
        this.formErrors = {
            payment: "",
            address: "",
            email: "",
            phone: ""
        };
    }

    setPayment(payment: "online" | "receipt") {
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
        const errors: typeof this.formErrors = {
            payment: "",
            address: "",
            email: "",
            phone: ""
        };

        // Валидация способа оплаты
        if (!this._order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }

        // Валидация адреса
        if (!this._order.address) {
            errors.address = 'Необходимо указать адрес';
        }

        // Валидация email
        if (!this._order.email) {
            errors.email = 'Необходимо указать email';
        } else if (!this.isValidEmail(this._order.email)) {
            errors.email = 'Некорректный формат email';
        }

        // Валидация телефона
        if (!this._order.phone) {
            errors.phone = 'Необходимо указать телефон';
        } else if (!this.isValidPhone(this._order.phone)) {
            errors.phone = 'Некорректный формат телефона';
        }

        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);

        return Object.values(errors).every(error => error === "");
    }

    // Вспомогательные методы для валидации
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    get order() {
        return this._order;
    }
    
    validatePaymentForm(): boolean {
        // Обновляем валидацию перед проверкой
        this.validateOrderFields();
        return !this.formErrors.payment && !this.formErrors.address;
    }

    validateContactsForm(): boolean {
        // Обновляем валидацию перед проверкой
        this.validateOrderFields();
        return !this.formErrors.email && !this.formErrors.phone;
    }

    setOrderField(field: keyof TPaymentModal, value: string) {
        // Используем соответствующий сеттер для каждого поля
        switch (field) {
            case 'payment':
                this.setPayment(value as "online" | "receipt");
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

    // Метод для очистки заказа
    clearOrder() {
        this._order = {
            payment: '',
            address: '',
            email: '',
            phone: '',
            total: 0,
            id: '',
            items: []
        };
        this.formErrors = {
            payment: "",
            address: "",
            email: "",
            phone: ""
        };
        this.events.emit('formErrors:change', this.formErrors);
    }

    // Метод для установки общей суммы и товаров из корзины
    setOrderData(total: number, items: string[]) {
        this._order.total = total;
        this._order.items = items;
    }
}