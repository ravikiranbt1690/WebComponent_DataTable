const App = (function() {
  function render() {
    let root = document.getElementById("root");
    root.innerHTML = '<app-component></app-component>';
  }

  /**
	 * Initialize All Components in Vanilla App and Trigger those Components
	*/

  function defineComponents() {
    customElements.define("app-component", AppComponent);
    customElements.define("all-employees-component", FetchEmployeesComponent);
    customElements.define("view-employee-component", ViewEmployeeComponent);
    customElements.define("create-employee-component", CreateEmployeeComponent)
    customElements.define("header-component", HeaderComponent);
    customElements.define("my-custom-input", CustomTextInputComponent);
    customElements.define('my-date-input', CustomDateInputComponent)
  }

  defineComponents();

  return {
    render: render
  }
})();


/**
 * Normal Validation Regex for Modal Popup Form Elements
*/
var emailRegex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
var phoneRegex = /^(\+\d{1,2}\s)?\(?\d{3}[\s.-]\d{7}$/;
var firstNameRegex = /^[a-zA-Z]{3,20}$/;

/**
 * Render the CRUD Master Datatable Vanilla JS App
*/

window.addEventListener('DOMContentLoaded', (event) => {
  App.render();
});