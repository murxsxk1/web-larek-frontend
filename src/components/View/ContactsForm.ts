import { TContactModal } from '../../types';
import { IEvents } from '../base/Events';
import { Form } from './Form';

export class ContactsForm extends Form<TContactModal> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	set email(value: string) {
		(
			this.container.querySelector('input[name="email"]') as HTMLInputElement
		).value = value;
	}

	set phone(value: string) {
		(
			this.container.querySelector('input[name="phone"]') as HTMLInputElement
		).value = value;
	}
}