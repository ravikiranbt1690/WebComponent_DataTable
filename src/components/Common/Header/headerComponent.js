class HeaderComponent extends HTMLElement {
	connectedCallback() {
		this.innerHTML = `
			<div class="header" >
				<div class="left" >
					<label class="heading">Zeta App</label>
					<label class="sub-heading">CONTROL CENTER</label>
				</div>
			</div>
		`;
	}
}