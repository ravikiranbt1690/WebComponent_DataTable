const DataTable = (function() {

	/**
	 ** Pagination Component
	*/
	class PaginationComponent extends HTMLElement {
		constructor() {
			super();
			this.rendered = false;
		}

		getPageNumbers() {
			let pageNumber = this.pageNumber;
			let totalEntries = this.totalEntries;
			let entriesPerPage = this.entriesPerPage;
			let startPageNumber = (totalEntries > entriesPerPage * pageNumber ? pageNumber + 1 : 0);
			let endPageNumber = Math.min(startPageNumber + 5, startPageNumber + Math.floor((totalEntries - entriesPerPage * pageNumber - 1) / entriesPerPage));
			return {
				startPageNumber: startPageNumber,
				endPageNumber: endPageNumber
			}
		}

		getPage(pageNumber) {
			return `<div class="page${(this.pageNumber + 1 == pageNumber ? ' active' : '')}" data-key="${pageNumber - 1}" >
						${pageNumber}
					</div>`;
		}

		getPages() {
			let {startPageNumber, endPageNumber} = this.getPageNumbers();
			if (startPageNumber <= 0) return ``;
			let results = [];
			for (var i = startPageNumber ; i <= endPageNumber ; i++) {
				results.push(this.getPage(i));
			}
			return results.join('');
		}

		getPreviousButton() {
			let {startPageNumber} = this.getPageNumbers();
			if (startPageNumber >= 2) return `<div class="btn prev-btn" data-key="previous" >Previous</div>`;
			return `<div class="btn prev-btn" disabled data-key="previous" >Previous</div>`;
		}

		getNextButton() {
			let {startPageNumber, endPageNumber} = this.getPageNumbers();
			if (startPageNumber >= 1 && startPageNumber < endPageNumber) return `<div class="btn next-btn" data-key="next" >Next</div>`;
			return `<div class="btn next-btn" disabled data-key="next" >Next</div>`;
		}

		render() {
			this.innerHTML = 	`<div class="pagination" >
									<div class="prev-btn-container" >${this.getPreviousButton()}</div>
									<div class="pages" >
										${this.getPages()}
									</div>
									<div class="next-btn-container" >${this.getNextButton()}</div>
								</div>`;
			this.rendered = true;
		}

		setupEventListeners() {
			this.querySelector('.pages').addEventListener('click', (e) => {
				if (!e.target.dataset.hasOwnProperty('key')) {
					return;
				}
				let pageNumber = +e.target.dataset.key;
				if (typeof(pageNumber) == 'number' && this.pageNumber != +pageNumber) {
					this.pageNumber = pageNumber;
					this.dispatchEvent(new CustomEvent('change', {
						detail: {
							pageNumber: this.pageNumber
						}
					}));
				}
			});
			this.querySelector('.next-btn-container').addEventListener('click', (e) => {
				if (!e.target.hasAttribute("disabled")) {
					this.pageNumber = this.pageNumber + 1;
					this.dispatchEvent(new CustomEvent('change', {
						detail: {
							pageNumber: this.pageNumber
						}
					}));
				}
			});
			this.querySelector('.prev-btn-container').addEventListener('click', (e) => {
				if (!e.target.hasAttribute("disabled")) {
					this.pageNumber = this.pageNumber - 1;
					this.dispatchEvent(new CustomEvent('change', {
						detail: {
							pageNumber: this.pageNumber
						}
					}));
				}
			});
		}

		connectedCallback() {
			if (!this.rendered) {
				this.render();
				this.setupEventListeners();
			}
		}


		update() {
			this.querySelector('.pages').innerHTML = this.getPages();
			this.querySelector('.next-btn-container').innerHTML = this.getNextButton();
			this.querySelector('.prev-btn-container').innerHTML = this.getPreviousButton();
		}

		get pageNumber() {
			return +this.getAttribute('pageNumber');
		}

		set pageNumber(pageNumber) {
			this.setAttribute('pageNumber', pageNumber.toString());
			if (this.rendered) {
				this.update();
			}
		}

		get entriesPerPage() {
			return +this.getAttribute('entriesPerPage');
		}

		set entriesPerPage(entriesPerPage) {
			this.setAttribute('entriesPerPage', entriesPerPage.toString());
			if (this.rendered) {
				this.update();
			}

		}
		get totalEntries() {
			return +this.getAttribute('totalEntries');
		}

		set totalEntries(totalEntries) {
			this.setAttribute('totalEntries', totalEntries.toString());
			if (this.rendered) {
				this.update();
			}
		}

	}

	/**
	 ** DropdownSearchComponent
	*/
	class SearchDropdownComponent extends HTMLElement {
		constructor() {
			super();
			this._items = [];
			this._selectedItem = null;
			this.rendered = false;
		}

		getItems() {
			let items = this._items.map((item) => {
				return `<div class="item${item.selected ? ' selected' : ''}" data-key="${item.key}" data-label="${item.label}" >
							<label>${item.label}</label>
						</div>`;
			});
			return items.join('');
		}

		render() {
			this.innerHTML = 	`<div class="dropdown-container" style="width:${this.getAttribute('width')};" >
									<label>${this._selectedItem ? this._selectedItem.label : (this.getAttribute('placeholder') ? this.getAttribute('placeholder') : "Select" )}</label>
									<div class="dropdown-list-container" >
										${this.getItems()}
									</div>
									<span class="Dropdown-arrow" ></span>
								</div>`;
			this.rendered = true;
		}

		selectItem(key) {
			let items = this._items.filter((item) => {
					return (item.selected);
			});
			if (items.length) items[0].selected = false;
			const prevKey = this._selectedItem.key;
			this._selectedItem = this._items.filter((item) => {
				return (item.key === key);
			})[0];
			if (prevKey === this._selectedItem.key) return;
			this._selectedItem.selected = true;
			this.querySelector('.dropdown-list-container').innerHTML = this.getItems();
			this.querySelector('.dropdown-container > label').textContent = this._selectedItem.label;
			this.dispatchEvent(new CustomEvent('select', {
				detail: {
					key: this._selectedItem.key,
					label: this._selectedItem.label
				}
			}));
		}

		setupEventListeners() {
			this.querySelector('.dropdown-list-container').addEventListener('click', (e) => {
				this.selectItem(e.target.closest('.item').dataset.key);
			});
			document.addEventListener('click', () => {
				this.querySelector('.dropdown-container').classList.remove("open");
			});
			this.querySelector('.dropdown-container').addEventListener('click', (e) => {
				this.querySelector('.dropdown-container').classList.toggle("open");
				e.stopPropagation();
			});
		}

		validateItems(items) {
			if (!Array.isArray(items) || items.length <= 0) return false;
			items.forEach((item) => {
				if (typeof(item) != 'object' || !item.hasOwnProperty('key') || !item.hasOwnProperty('label')) return false;
			});
			return true;
		}

		set items(items) {
			if (!this.validateItems(items)) throw new Error("Invalid items");
			this._items = items;
			if (this.rendered) {
				this.selectItem(items[0].key);
			} else {
				this._selectedItem = items[0];
				this._selectedItem.selected = true;
			}
		}

		get items() {
			return this._items;
		}
		get selectedItem() {
			return this._selectedItem;
		}
		connectedCallback() {
			if (!this.rendered) {
				this.render();
				this.setupEventListeners();
			}
		}

		set width(width) {
			this.setAttribute("width", width);
			if (this.rendered) {
				this.querySelector('.dropdown-container').style.width = width;
			}
		}

		get width() {
			return this.getAttribute("width");
		}
		
	}

	/**
	 ** Search Component
	*/
	class SearchComponent extends HTMLElement {
		constructor() {
			super();
			this._headers = [];
			this.rendered = false;
		}
		set headers(headers) {
			this._headers = headers;
			if (this.rendered) {
				this.render();
			}
		}

		get headers() {
			return this._headers;
		}

		render() {
			let drp = document.createElement('data-table-dropdown');
			drp.width = "17rem";
			drp.items = this.headers.filter((header) => {
				return header.searchable;
			});
			this.innerHTML = 	`<div class="search-container">
									<input id="searchText" class="input" type="text" placeholder="Search" >

								</div>`;
			this.querySelector('.search-container').prepend(drp);
			this.rendered = true;
		}

		setupEventListeners() {
			this.querySelector('data-table-dropdown').addEventListener('select', (e) => {
				this.dispatchEvent(new CustomEvent('change', {
					detail: {
						query: this.querySelector('#searchText').value,
						selectedHeader: e.detail
					}
				}));
			});
			this.querySelector('#searchText').addEventListener('input', (e) => {
				this.dispatchEvent(new CustomEvent('change', {
					detail: {
						query: e.target.value,
						selectedHeader: this.querySelector('data-table-dropdown').selectedItem
					}
				}));
			});
		}

		connectedCallback() {
			if (!this.rendered) {
				this.render();
				this.setupEventListeners();
			}
		}

		get query() {
			return this.querySelector('#searchText').value;
		}
		get selectedHeader() {
			return this.querySelector('data-table-dropdown').selectedItem;
		}
	}

	/**
	 ** Action Widgets to be used in the Datatable. Actions like Edit, View & Delete
	*/

	class ActionsComponent extends HTMLElement {
		constructor() {
			super();
			this.rendered = false;
		}

		render() {
			let innerHTML = this.innerHTML;

			this.innerHTML = 	`
			<div class="actions-container" >
				<span class="actions-icon" >
					<span></span>
					<span></span>
					<span></span>
				</span>
				<div class="actions" >
					${innerHTML}
				</div>
			</div>`;
			this.rendered = true;
		}

		setupEventListeners() {
			this.querySelector('.actions-icon').addEventListener('click', (e) => {
				this.querySelector('.actions-container').classList.toggle("open");
				e.stopPropagation();
			});
			this.querySelector('.actions').addEventListener('click', (e) => {
				let action = e.target.closest('.actions > *');
				if (action != null) {
					this.dispatchEvent(new CustomEvent('action', {
						bubbles: true,
						detail: {
							key: action.dataset.key,
							itemId: this.itemId
						}
					}));
				
				}
				this.querySelector('.actions-container').classList.remove("open");
				e.stopPropagation();
				
			});
			document.addEventListener('click', () => {
				this.querySelector('.actions-container').classList.remove("open");
			});
		}

		connectedCallback() {
			if (!this.rendered) {
				this.render();
				this.setupEventListeners();
			}
		}

		set itemId(itemId) {
			this.setAttribute("itemId", itemId);
		}

		get itemId() {
			return this.getAttribute("itemId");
		}

	}

	/**
	 ** Main DataTable Component
	*/
	class DataTableComponent extends HTMLElement {
		constructor() {
			super();
			this._items = [];
			this._headers = [];
			this._totalItems = 0;
			this._actions = [];
			this._error = null;
			this.sort = {
				key: "",
				order: ""
			}
			this.rendered = false;
		}

		getArrows(header) {
			if (!header.sortable) return ``;
			return `<span class="arrow-container" >
						<span class="arrow up-arrow${this.sort.key == header.key && this.sort.order == 'inc' ? ' active' : ''}" ></span>
						<span class="arrow down-arrow${this.sort.key == header.key && this.sort.order == 'dec' ? ' active' : ''}" ></span>
					</span>`;
		}

		getHeaders() {
			let headers = this._headers.map((header) => {
				return `<div class="table-header" data-key="${header.key}" style="flex-basis: ${header.flexBasis}%;" >
							<label>${header.label}</label>
							${this.getArrows(header)}
							
						</div>`;
			});
			return headers.join('');
		}
		
		getActions(item) {
			let actions = this._actions.map((action) => {
				return `<div class="action" data-key="${action.key}" >
							${action.label}
						</div>`;
			});
			return actions.join('');
		}
		
		getItem(item) {
			let itemHTML = this._headers.map((header) => {
				return `<div class="table-cell" style="flex-basis: ${header.flexBasis}%;" >
							${item[header.key]}
						</div>`;
			});
			itemHTML.push(`<div class="table-cell actions-cell" >
								<data-table-actions itemId="${item[this.idKey]}" >
									${this.getActions()}
								</data-table-actions>
							</div>`);
			return itemHTML.join('');
		}

		getItems() {
			let items = this._items.map((item, idx) => {
				return `<div class="table-row" data-id="${item[this.idKey]}" style="z-index: ${100 - idx};" >
							${this.getItem(item)}
						</div>`;
			});
			return items.join('');
		}

		render() {
			let srch = document.createElement('data-table-search');
			srch.headers = this.headers;
			let drp = document.createElement('data-table-dropdown');
			drp.width = "6rem";
			drp.items = [
				{
					key: "10",
					label: "10"
				},
				{
					key: "20",
					label: "20"
				},
				{
					key: "30",
					label: "30"
				},
				{
					key: "40",
					label: "40"
				},
				{
					key: "50",
					label: "50"
				}
			];
			this.shadowRoot.innerHTML = `
			<div class="data-table-container" >
				<link rel="stylesheet" type="text/css" href="./src/components/DataTable/dataTable.css" />
				<div class="filter-container" >
					<div class="entries-container" >
						<label>Entries Per Page</label>
					</div>
				</div>
				<div class="table-container" >
					<div class="table-header-container" >
						${this.getHeaders()}
					</div>
					<div class="table-body-container" >
						${this.getItems()}
					</div>
				</div>
				<data-table-pagination pageNumber="0" entriesPerPage="0" totalEntries="0" ></data-table-pagination>
			</div>`;
			this.shadowRoot.querySelector('.filter-container').prepend(srch);
			this.shadowRoot.querySelector('.entries-container').append(drp);
			this.shadowRoot.querySelector('data-table-pagination').entriesPerPage = +drp.selectedItem.key;
			this.rendered = true;
		}

		attributeChangedCallback(name, oldValue, newValue) {

		}

		setupEventListeners() {
			this.shadowRoot.querySelector('data-table-search').addEventListener('change', (e) => {
				if (e.detail) {
					this.shadowRoot.querySelector('data-table-pagination').pageNumber = 0;
					this.dispatchEvent(new CustomEvent('change', {
						detail: this.filters
					}));
				}
			});
			
			this.shadowRoot.querySelector('.entries-container data-table-dropdown').addEventListener('select', (e) => {
				if (e.detail) {
					this.shadowRoot.querySelector('data-table-pagination').pageNumber = 0;
					this.shadowRoot.querySelector('data-table-pagination').entriesPerPage = e.detail.key;
					
					this.dispatchEvent(new CustomEvent('change', {
						detail: this.filters
					}));
				}
			});
			
			this.shadowRoot.querySelector('data-table-pagination').addEventListener('change', (e) => {
				if (e.detail) {
					this.dispatchEvent(new CustomEvent('change', {
						detail: this.filters
					}));
				}
			});

			this.shadowRoot.querySelector('.table-header-container').addEventListener('click', (e) => {
				if (!e.target.classList.contains("arrow")) return;
				if (e.target.classList.contains("active")) return;
				let prevActiveElem = this.shadowRoot.querySelector('.arrow.active');
				if (prevActiveElem) prevActiveElem.classList.remove('active');

				this.shadowRoot.querySelector('data-table-pagination').pageNumber = 0;
				this.sort.key = e.target.closest('.table-header').dataset.key;
				this.sort.order = (e.target.classList.contains('up-arrow') ? "inc" : "dec");
				e.target.classList.add('active');
				this.dispatchEvent(new CustomEvent('change', {
					detail: this.filters
				}));
			});

			document.addEventListener('action', (e) => {
				this.dispatchEvent(new CustomEvent('action', {
					detail: e.detail
				}));
			});
		}

		connectedCallback() {
			if (!this.rendered) {
				const shadow = this.attachShadow({mode: 'open'});
				this.render();
				this.setupEventListeners();
			}
		}

		disconnectedCallback() {

		}

		static get observedAttributes() {
			return [];
		}

		get filters() {
			return {
				search: {
					query: this.shadowRoot.querySelector('data-table-search').query,
					key: this.shadowRoot.querySelector('data-table-search').selectedHeader.key
				},
				sort: {
					key: this.sort.key,
					order: this.sort.order
				},
				pagination: {
					pageNumber: this.shadowRoot.querySelector('data-table-pagination').pageNumber,
					entriesPerPage: +this.shadowRoot.querySelector('.entries-container data-table-dropdown').selectedItem.key
				}
			}
		}

		get items() {
			return this._items;
		}

		set items(items) {
			this._items = items;
			if (this.rendered) {
				this.shadowRoot.querySelector('.table-body-container').innerHTML = this.getItems();
			}
		}

		get headers() {
			return this._headers;
		}

		set headers(headers) {
			this._headers = headers;
		}

		get headers() {
			return this._headers;
		}

		set actions(actions) {
			this._actions = actions;
		}

		get actions() {
			return this.actions;
		}

		get totalItems() {
			return this._totalItems;
		}

		set totalItems(totalItems) {
			this._totalItems = totalItems;
			if (this.rendered) {
				this.shadowRoot.querySelector('data-table-pagination').totalEntries = totalItems;
			}
		}

		get error() {
			return this._error;
		}

		set error(error) {
			this._error = error;
		}

		get idKey() {
			return this.getAttribute('idKey');
		}

		set idKey(idKey) {
			this.setAttribute('idKey', idKey);
		}
	}

	/**
	 ** To Create Custom DataTable in UI from Component
	*/
	class DataTable {
		constructor(headers, fetchItems, idKey, elem, actions, onAction) {
			this.dataTable = document.createElement('data-table');
			this.dataTable.headers = JSON.parse(JSON.stringify(headers));
			this.dataTable.actions = actions;
			this.dataTable.idKey = idKey;
			elem.append(this.dataTable);

			this.fetchItems = fetchItems;
			this.onAction = onAction;

			this.start();
		}

		setupEventListeners() {
			this.dataTable.addEventListener('change', (e) => {
				if (!e.detail) return;
				this.fetch();
			});
			this.dataTable.shadowRoot.addEventListener('action', (e) => {
				this.onAction({
					key: e.detail.key,
					itemId: e.detail.itemId
				});
			});
		}

		fetch() {
			this.fetchItems(this.dataTable.filters).then((response) => {
				this.handleResponse(response);
			}).catch((err) => {
				this.handleError(err);
			});
		}

		start() {
			this.fetch();
			this.setupEventListeners();
		}

		handleResponse(response) {
			this.dataTable.totalItems = response.totalItems;
			this.dataTable.items = response.items;
		}

		handleError(err) {
			this.error = err.error;
		}


		rerender() {
			this.fetch();
		}

		get items() {
			return JSON.parse(JSON.stringify(this.dataTable.items));
		}

		get headers() {
			return JSON.parse(JSON.stringify(this.dataTable.headers));
		}
		set error(error) {
			this.dataTable.error = error;
		}

		get error() {
			return this.dataTable.error;
		}
	}

	/**
	 * Custom Web Components created and Integrated in UI and then triggered
	*/

	function defineWebComponents() {
		customElements.define("data-table", DataTableComponent);
		customElements.define("data-table-search", SearchComponent);
		customElements.define("data-table-dropdown", SearchDropdownComponent);
		customElements.define('data-table-pagination', PaginationComponent);
		customElements.define('data-table-actions', ActionsComponent);
	}

	defineWebComponents();
	
	return {
		DataTable: DataTable
	}
})();