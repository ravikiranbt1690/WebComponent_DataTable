class AppComponent extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div class="app animate__animated animate__fadeIn">
				<header-component></header-component>
				<all-employees-component></all-employees-component>
			</div>
		`;
	}
}