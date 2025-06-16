import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected _modalCloseButton: HTMLButtonElement;
	protected _modalContent: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._modalCloseButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);
		this._modalContent = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);

		this._modalCloseButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._modalContent.addEventListener('click', (event) =>
			event.stopPropagation()
		);
	}

	set content(value: HTMLElement) {
		this._modalContent.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		this.events.emit('modal:close');
	}

	render(data: IModalData) {
		super.render(data);
		this.open();
		return this.container;
	}
}