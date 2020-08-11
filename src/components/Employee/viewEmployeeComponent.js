class ViewEmployeeComponent extends HTMLElement {
	constructor() {
		super();
		this.rendered = false;
	}
	
	/** 
	 * Getters and Setters
	 * Get Employee gets employeeId
	 * @param {employeeId} Id The Employee Id we need to set
	 * Set Employee sets employeeId
	*/
	
	get employeeId() {
		return this.getAttribute("employeeId");
	}

	set employeeId(employeeId) {
		this.setAttribute("employeeId", employeeId);
	}

	/**
	 * Render UI
	*/
	render() {
		this.innerHTML = `<modal-dialog></modal-dialog>`;
		if (this.employeeId) {
			this.fetchEmployee();
		}
		this.rendered = true;
	}

	/**
	 * Display Employee Details in the Modal Popup
	 * @param {object} employeeDetails Individual Employee Object
	*/

	displayEmployee(employeeDetails) {
		this.querySelector('modal-dialog').innerHTML = 
		`<div class="popup-header" >
				<label class="sub-heading" >EM${this.employeeId}</label>
				<label class="heading" >${employeeDetails.preferredFullName}</label>
			</div>

			<div class="popup-content" >
				<div class="detail" >
					<label class="key" >Name</label>
					<label class="value" >${employeeDetails.preferredFullName}</label>
				</div>

				<div class="detail" >
					<label class="key" >Employee Code</label>
					<label class="value" >${employeeDetails.employeeCode}</label>
				</div>

				<div class="detail" >
					<label class="key" >Job Title</label>
					<label class="value" >${employeeDetails.jobTitleName}</label>
				</div>

				<div class="detail" >
					<label class="key" >Phone Number</label>
					<label class="value" >${employeeDetails.phoneNumber}</label>
				</div>

				<div class="detail" >
					<label class="key" >Email Id</label>
					<label class="value" >${employeeDetails.emailAddress}</label>
				</div>

				<div class="detail" >
					<label class="key" >Region</label>
					<label class="value" >${employeeDetails.region}</label>
				</div>
				
				<div class="detail" >
					<label class="key" >DOB</label>
					<label class="value" >${employeeDetails.dob}</label>
				</div>
			</div>`;
	}

	displayError(error) {
		this.querySelector('modal-dialog').innerHTML = `<div class="error" >Some error occured</div>`;
	}

	/**
	 * Custom API Request being triggered to Employee Service to request individual Employee Data
	*/
	fetchEmployee() {
		EmployeeService.fetchEmployee({
			id: this.employeeId
		}).then((response) => {
			this.displayEmployee(response.data);
		}).catch((err) => {
			this.displayError();
		});
	}
	
	setupEventListeners() {
		this.querySelector('modal-dialog').addEventListener('close', () => {
			console.log('closed');
			this.remove();
		});
	}
	
	connectedCallback() {
		if (!this.rendered) {
			this.render();
			this.setupEventListeners();
		}
	}
}