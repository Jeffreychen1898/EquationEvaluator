const operationPriority = new Map();

function Initialize() {
	operationPriority.set("+", 3);
	operationPriority.set("-", 3);
	operationPriority.set("*", 2);
	operationPriority.set("/", 2);
}

function Evaluate(_equation) {
	const equation = new Equation(_equation);
	let ans = equation.Compile();

	const output_text = document.getElementById("output");
	//output_text.innerText = "Output: " + equation.Calculate();
	output_text.innerText = "Output: " + ans;
}

window.addEventListener("load", () => {
	Initialize();

	const evaluator_input = document.getElementById("evaluator");
	evaluator_input.addEventListener("keyup", (e) => {
		if(e.keyCode == 13)
			Evaluate(evaluator_input.value);
	});
});
