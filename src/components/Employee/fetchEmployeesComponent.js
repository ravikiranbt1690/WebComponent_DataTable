
/**
 * DataTable Headers
*/

const headers = [
	{
		key: "id",
		label: "ID",
		flexBasis: 5,
		searchable: true,
		sortable: true
	},
	{
		key: "preferredFullName",
		label: "Full Name",
		flexBasis: 13,
		searchable: true,
		sortable: true
	},
	{
		key: "employeeCode",
		label: "Employee Code",
		flexBasis: 17,
		searchable: true,
		sortable: true
	},
	{
		key: "jobTitleName",
		label: "Job Title",
		flexBasis: 13,
		searchable: true,
		sortable: true
	},
	{
		key: "phoneNumber",
		label: "Phone Number",
		flexBasis: 15,
		searchable: true,
		sortable: false
	},
	{
		key: "emailAddress",
		label: "Email Id",
		flexBasis: 16,
		searchable: true,
		sortable: false
	},
	{
		key: "region",
		label: "Region",
		flexBasis: 9,
		searchable: true,
		sortable: true
	},
	{
		key: "dob",
		label: "DOB",
		flexBasis: 8,
		searchable: true,
		sortable: true
	}
];

/**
 * DataTable Widget Actions
*/

const actions = [
	{
		label: "view",
		key: "view"
	},
	{
		label: "edit",
		key: "edit"
	},
	{
		label: "delete",
		key: "delete"
	}
];

class FetchEmployeesComponent extends HTMLElement {
	constructor() {
		super();
		this.rendered = false;
	}

	/**
	 * Render UI
	*/
	render() {
		this.innerHTML = 
		`<div class="employees" >
				<div class="employees-header" >
					<label class="heading" >Employees</label>
					<div class="btn" id="createEmployee" >Create Employee</div>
				</div>

				<div class="employees-data" id="employeeData" ></div>
			</div>
		`;
		this.dt = new DataTable.DataTable(headers, this.fetchEmployees.bind(this), 'id', this.querySelector("#employeeData"),
			actions, (action) => {
			switch(action.key) {
				case 'view':
					this.querySelector('.employees')
							.insertAdjacentHTML('beforeend', 
							`<view-employee-component 
								employeeId="${action.itemId}" 
							>
							</view-employee-component>`);

					return;
				case 'delete':
					EmployeeService.deleteEmployee({
						id: action.itemId
					}).then(() => {
						this.dt.rerender();
					}).catch((err) => {
						this.dt.error = err.error;
					});
					return;
				case 'edit':
					this.querySelector('.employees').insertAdjacentHTML('beforeend', `<create-employee-component employeeId="${action.itemId}" ></create-employee-component>`);
					return;
			}
		});
		this.rendered = true;
	}

	/**
	 * Fetch Employees's Data from Employee Service
	*/

	fetchEmployees(tableData) {
		return new Promise(function(resolve, reject) {
			let {search, sort, pagination} = tableData;
			EmployeeService.fetchEmployees({
				filters: {
					search: search,
					sort: sort,
					pagination: pagination
				}
			}).then(function(response) {
				resolve({
					items: response.data.employees,
					totalItems: response.data.totalLength
				});
			}).catch(function(err) {
				console.error(err);
				reject({
					err: err
				});
			});
		});
	}

	/**
	 * Setup the Event Listeners
	*/
	setupEventListener() {
		this.querySelector('#createEmployee').addEventListener('click', (e) => {
			this.querySelector('.employees').insertAdjacentHTML('beforeend', `<create-employee-component ></create-employee-component>`);
		});

		this.addEventListener('success', (e) => {
			if (e.detail && e.detail.success) {
				this.dt.rerender();
			}
		});
	}
	
	connectedCallback() {
		if (!this.rendered) {
			this.render();
			this.setupEventListener();
		}
	}
}