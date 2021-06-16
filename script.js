// Main-Operations
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => Number((a / b).toFixed(10));
const remainder = (a, b) => a % b;
const negate = (a) => -a;

// Sub-operations
const clear = (element) => (element.textContent = "");
const backspace = (element) =>
  (element.textContent = element.textContent.slice(0, -1));
const addDot = (element) => {
  element.textContent.charAt(element.textContent.length - 1) === "."
    ? ""
    : (element.textContent += ".");
};

// Util-Operations
const toExp = (value) => Number(value).toExponential();

// Operator Map
const operatorMap = {
  "+": add,
  "-": subtract,
  x: multiply,
  "/": divide,
  "%": remainder,
  "+/-": negate,
  AC: clear,
  back: backspace,
  ".": addDot,
};

// Elements Selection for Event Listeners
const numButtons = [...document.querySelectorAll(".btn--num")];
const operators = [...document.querySelectorAll(".btn--op, .btn--sp-op")];
const equalOperator = document.querySelector(".btn--equal");

// Event Listeners
numButtons.forEach((button) =>
  button.addEventListener("click", (e) => console.log(e.target.textContent))
);
operators.forEach((button) =>
  button.addEventListener("click", (e) =>
    validateOperators(e.target.textContent)
  )
);
equalOperator.addEventListener("click", (e) =>
  console.log(e.target.textContent.trim())
);

// Functions
function validateOperators(operator) {
  console.log(operatorMap[operator.trim()]);
}

// Variables
let operand1 = "";
let operand2 = "";
let operator = "";
