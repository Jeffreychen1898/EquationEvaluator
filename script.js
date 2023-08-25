const variable_names = [];
const variable_values = [];

function Initialize() {
}

function Evaluate(_equation) {
	try {
		const equation = new Equation(_equation);
		let ans = equation.Compile();

		const output_text = document.getElementById("output");
		//output_text.innerText = "Output: " + equation.Calculate();
		output_text.innerText = "Output: " + ans;
	} catch(e) {
		const output_text = document.getElementById("output");
		output_text.innerText = e;
	}
}

function VariableInputChange(_nameField, _valueField) {
	const parent_node = _nameField.parentNode;
	const variables_container = parent_node.parentNode;

	// find the index corresponding to the variable
	let index = -1;
	for(let i=1;i<variables_container.children.length;++i) {
		if(variables_container.children[i] == parent_node) {
			index = i - 1;
			break;
		}
	}

	// modify the variable name
	variable_names[index] = _nameField.value.length == 0 ? null : _nameField.value;

	// modify the variable values and the values of every subsequent variable
	for(let i=index;i<variables_container.children.length - 1;++i) {
		const variable_field_value = variables_container.children[i + 1].children[3].value;
		const variable_status_elem = variables_container.children[i + 1].children[0];

		variable_status_elem.classList.remove("variable-valid");
		variable_status_elem.classList.remove("variable-invalid");

		try {
			const equation = new Equation(variable_field_value);
			const result = equation.Compile();
			variable_values[i] = result;
			variable_status_elem.title = result;
			variable_status_elem.classList.add("variable-valid");
		} catch(e) {
			variable_values[i] = null;
			variable_status_elem.title = "null";
			variable_status_elem.classList.add("variable-invalid");
		}

	}
}

function GenNewVariable() {
	// Let ___ = ___ X
	
	// create the parent
	const container_elem = document.createElement("div");
	container_elem.classList.add("variable-container");
	
	// create the elements
	const element_tags = new Array("p", "input", "p", "input", "button");
	const element_classes = new Array("variable-status", "variable-name", "", "variable_value", "variable_remove");

	const elements = new Array(element_tags.length);

	for(let i=0;i<elements.length;++i) {
		const new_element = document.createElement(element_tags[i]);

		if(element_classes[i] != "")
			new_element.classList.add(element_classes[i]);
		if(element_tags[i] == "input")
			new_element.addEventListener("input", () => { VariableInputChange(elements[1], elements[3]) });

		if(i == 0) {
			new_element.classList.add("variable-invalid");
			new_element.title = "null";
		}

		elements[i] = new_element;
	}

	elements[0].innerText = "Let";
	elements[1].placeholder = "variable_name";
	elements[2].innerText = "=";
	elements[3].placeholder = "12.3 + 4.5";
	elements[4].innerText = "X";

	elements[4].addEventListener("click", RemoveVariableField);

	// append the elements
	for(let i=0;i<elements.length;++i)
		container_elem.appendChild(elements[i]);

	const parent_elem = document.getElementById("variable-container");
	if(parent_elem.children.length > 1)
		parent_elem.insertBefore(container_elem, parent_elem.children[1]);
	else
		parent_elem.appendChild(container_elem);

	variable_names.unshift(null);
	variable_values.unshift(null);
}

function RemoveVariableField(_closeButton) {
	const button_parent = this.parentNode;
	const inputs_container = button_parent.parentNode;

	// remove element from variable_names and variable_values
	for(let i=1;i<inputs_container.children.length;++i) {
		if(inputs_container.children[i] == button_parent) {
			variable_names.splice(i - 1, 1);
			variable_values.splice(i - 1, 1);
			break;
		}
	}

	// remove the element
	button_parent.remove();
}

window.addEventListener("load", () => {
	Initialize();

	const evaluator_input = document.getElementById("evaluator");
	evaluator_input.addEventListener("keyup", (e) => {
		if(e.keyCode == 13)
			Evaluate(evaluator_input.value);
	});

	const add_variable_element = document.getElementById("add-variable");
	add_variable_element.addEventListener("click", GenNewVariable);
	GenNewVariable();
});
