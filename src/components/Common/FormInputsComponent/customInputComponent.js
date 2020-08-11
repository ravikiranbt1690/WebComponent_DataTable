/**
 * Normal Regex for Form Validation in Modal Popup 
*/

const regex = {
	name: /^[a-zA-Z]{3,20}$/,
	alphaNumeric: /^[a-zA-Z0-9 ]+$/,
	email: /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
	alphaSpace: /^[a-zA-Z ]+$/,
	phone: /^(\+\d{1,2}\s)?\(?\d{3}[\s.-]\d{7}$/
};

class CustomTextInputComponent extends HTMLElement {
	constructor() {
		super();
		this.rendered = false;
		this._hasError = false;
		this._touched = false;
	}

	/**
 	 * Render UI 
 	*/

	render() {
		this.innerHTML = 	`
		<div class="custom-input-container" >
			<label class="label" >${this.label}</label>
			<input class="input" type="${this.type}" value="${this.value}" placeholder="${this.placeholder}" />
			<label class="label error hidden" >Invalid Input</label>
		</div>`;

		this.validate(this.value);
		this.rendered = true;
	}

	displayError() {
		this.hasError = true;
		if (this._touched) {
			let err = this.querySelector('.error');
			err.classList.remove('hidden');
		}
	}

	removeError() {
		this.hasError = false;
		let err = this.querySelector('.error');
		if (!err.classList.contains('hidden')) {
			err.classList.add('hidden');
		}
	}

	/**
 	 * Validates the Inputs in Modal Popup Form 
 	*/

	validate(value) {
		if (regex.hasOwnProperty(this.regexType)) {
			const res = regex[this.regexType].test(value.trim());
			if (!res) {
				this.displayError();
			} else {
				this.removeError();
			}
		}
	}

	/**
 	 * Set up the Event Listeners for the Component 
 	*/

	setupEventListeners() {
		if (regex.hasOwnProperty(this.regexType)) {
			this.querySelector('input').addEventListener('input', throttle((e) => {
				this.value = e.target.value;
				this._touched = true;
				this.validate(e.target.value);
			}, 200));
		}
	}

	connectedCallback() {
		if (!this.rendered) {
			this.render();
			this.setupEventListeners();
		}
	}

	disconnectedCallback() {
		clearTimeout(this.timer);
	}

	/**
 	 * Setters and Getters 
 	*/

	get regexType() {
		return this.getAttribute('regexType');
	}

	set regexType(regexType) {
		this.setAttribute('regexType', regexType);
	}

	get label() {
		return this.getAttribute('label');
	}

	set label(label) {
		this.setAttribute('label', label);
	}

	get type() {
		return this.getAttribute('type');
	}

	set type(type) {
		this.setAttribute('type', type);
	}
	
	get value() {
		return this.getAttribute('value').trim();
	}
	
	set value(value) {
		this.setAttribute('value', value);
	}
	
	get placeholder() {
		return this.getAttribute('placeholder');
	}
	
	set placeholder(placeholder) {
		this.setAttribute('placeholder', placeholder);
	}
	
	get hasError() {
		return this._hasError;
	}
	
	set hasError(hasError) {
		this._hasError = hasError;
	}
	
	get touched() {
		return this._touched;
	}
	
	set touched(touched) {
		this._touched = touched;
		if (this.rendered) {
			this.validate(this.value);
		}
	}
}