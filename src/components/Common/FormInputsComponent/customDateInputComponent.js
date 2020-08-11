class CustomDateInputComponent extends HTMLElement {
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
				<input class="input" type="date" value="${this.value}" min="${this.minValue}" max="${this.maxValue}" />
				<label class="label error hidden" >Invalid Date</label>
			</div>
		`;
		let val = this.querySelector('input').valueAsNumber;
		this.validate(val);
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
	 * Validates the Inputs
	*/
	validate(value) {
		if (isNaN(value)) {
			this.displayError();
		} else {
			let latestDate = new Date(this.maxValue);
			let earliesttDate = new Date(this.minValue);
			if (value < earliesttDate || value > latestDate) {
				this.displayError();
			} else {
				this.removeError();
			}
		}
	}


	/**
	 * Setup Event Listeners
	*/
	setupEventListeners() {
		this.querySelector('input').addEventListener('input', throttle((e) => {
			this.value = e.target.value;
			this._touched = true;
			let a = e.target.valueAsNumber;
			this.validate(e.target.valueAsNumber);
		}, 200));
	}

	connectedCallback() {
		if (!this.rendered) {
			this.render();
			this.setupEventListeners();
		}
	}

	/**
	 * Getters and Setters
	*/

	get label() {
		return this.getAttribute('label');
	}

	set label(label) {
		this.setAttribute('label', label);
	}

	get value() {
		return this.getAttribute('value');
	}

	set value(value) {
		this.setAttribute('value', value);
	}

	get maxValue() {
		return this.getAttribute('maxValue');
	}

	set maxValue(maxValue) {
		this.setAttribute('maxValue', maxValue);
	}

	get minValue() {
		return this.getAttribute('minValue');
	}

	set minValue(minValue) {
		this.setAttribute('minValue', minValue);
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