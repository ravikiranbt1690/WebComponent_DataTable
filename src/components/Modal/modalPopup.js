(function() {
	/**
	 * Custom Modal Component
	*/
	
	class ModalComponent extends HTMLElement {
		constructor() {
			super();
			this.rendered = false;
		}

		/**
		 * Custom Style for Modal Popup since we are creating Popup which we want to act like a Portal in 
		 * React. We use Shadow Root here 
		*/
		getStyles() {
			return `<style>
			.modal-dialog-container {
				position: fixed;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				background: white;
				z-index: 1001;
				min-width: 40rem;
				max-width: calc(100vw - 2rem);
				max-height: calc(100vh - 2rem);
			}

			.overlay {
				position: fixed;
				left: 0;
				top: 0;
				background: rgba(0, 0, 0, 0.6);
				z-index: 1000;
				width: 100vw;
				height: 100vh;
			}
		</style>`;
		}

		/**
	 		* Render the UI
	  */
		
		render() {
			this.shadowRoot.innerHTML = 
				`<div class="modal-popup modal" >
						${this.getStyles()}
						<div class="popup-container modal-dialog-container" >
							<slot></slot>
						</div>
						<div class="overlay"></div>
				  </div>
				`;
			this.rendered = true;
		}

		setupEventListeners() {
			this.shadowRoot.querySelector(".modal-popup").addEventListener('click', (e) => {
				let overlay = e.target.closest('.overlay');
				if (overlay != null) {
					this.closeModal();
				}
			});
		}

		closeModal() {
			this.remove();
		}

		connectedCallback() {
			if (!this.rendered) {
				const shadow = this.attachShadow({mode: 'open'});
				this.render();
				this.setupEventListeners();
			}
		}

		disconnectedCallback() {
			this.dispatchEvent(new CustomEvent('close', {
				bubbles: true,
				composed: true
			}));
		}
	}
	
	/**
	 * Custom Web Components created and Integrated in UI and then triggered
	*/
	function defineElements() {
		customElements.define("modal-dialog", ModalComponent);
	}

	defineElements();
})();