// Main-Operations
const add = (a, b) => (parseFloat(a) + parseFloat(b)).toFixed(2);

const subtract = (a, b) => (a - b).toFixed(3);

const multiply = (a, b) => (a * b).toFixed(3);

const divide = (a, b) => (a / b).toFixed(3);

const remainder = (a, b) => a % b;

const negate = (element) => {
  let text = element.textContent;
  if (
    !text.match(opRegex) ||
    (text.match(opRegex).length === 1 && text[0].match(/\-/gi))
  ) {
    element.textContent = -element.textContent;
  } else if (text.match(opRegex).length >= 1) {
    element.textContent =
      text.slice(0, opIndex) + text[opIndex] + -1 * text.slice(opIndex + 1);
  }
};

const addDot = (element) => {
  let text = element.textContent;
  if (text.match(opRegex)) {
    textArray = text.split(`${text[opIndex]}`);
    textArray[1].includes(".") ? "" : (element.textContent += ".");
  } else {
    text.includes(".") ? "" : (element.textContent += ".");
  }
  scrollAdjust();
};

// Sub-operations
const clear = (element) => {
  element.innerHTML = "";
};

const backspace = (element) => {
  element.textContent = element.textContent.slice(0, -1);
};

const toExp = (value) => Number(value).toExponential(3);

// Operator Map
const operatorMap = {
  "+": add,
  "-": subtract,
  "*": multiply,
  "/": divide,
  "%": remainder,
  "~": negate,
  AC: clear,
  "<": backspace,
  ".": addDot,
};

// Elements Selection for Event Listeners & Variables
// Value Holders for display
let calculator = document.querySelector(".calculator");
let operation = document.querySelector(".display__operation p");
let current = document.querySelector(".display__input p");
let opIndex = ""; // Operator Index
let opRegex = /[+\-\*\/%]/gi; // Operator RegExp
const numButtons = [...document.querySelectorAll(".btn--num")];
const operators = [...document.querySelectorAll(".btn--op, .btn--sp-op")];

// Event Listeners
calculator.addEventListener("touchmove", (e) => {
  e.preventDefault();
});
numButtons.forEach((button) =>
  button.addEventListener("click", (e) => {
    validateKey(e.target.textContent);
  })
);
operators.forEach((button) =>
  button.addEventListener("click", (e) => {
    if (e.target.textContent.trim() === "+/-") {
      validateKey("~");
      return;
    }
    validateKey(e.target.textContent.trim());
  })
);
window.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() === "backspace") {
    validateKey("<");
    return;
  }
  if (e.key.toLowerCase() === "delete") {
    validateKey("AC");
    return;
  }
  validateKey(e.key);
});

// Functions
function updateOperand(value) {
  current.textContent += value;
  scrollAdjust();
}

function updateOperator(value, trim) {
  let text = current.textContent;
  if (text.length === 0) {
    if (value == "-") {
      current.textContent += value;
    } else {
      current.textContent += "";
    }
  } else if (text[text.length - 1].match(opRegex)) {
    if (
      value === "-" &&
      ![text[text.length - 1], text[text.length - 2]]
        .join("")
        .match(/[+\-\*\/%][+\-\*\/%]/gi) &&
      text.length >= 2
    ) {
      current.textContent += value;
      return;
    } else if (
      text.length > 2 &&
      text[text.length - 1].match(opRegex) &&
      !text[text.length - 2].match(opRegex)
    ) {
      current.textContent = text.slice(0, -1);
      current.textContent += value;
      opIndex = current.textContent.length - 1;
    }
  } else {
    if (!opIndex) {
      current.textContent += value;
      opIndex = current.textContent.length - 1;
    }
  }
  scrollAdjust();
}

function validateKey(value) {
  current.classList.remove("result");
  if (value.match(/^[0-9]$/gi)) {
    updateOperand(value);
  } else if (value.match(opRegex)) {
    let trim = false;
    if (
      current.textContent.length &&
      current.textContent[current.textContent.length - 1].match(opRegex)
    ) {
      trim = true;
    }
    updateOperator(value, trim);
  } else if (value.match(/(<)/gi)) {
    operatorMap[value](current);
  } else if (value.match(/(=)|(enter)/gi)) {
    evaluateExpression();
  } else if (value.match(/(\.)/gi)) {
    operatorMap[value](current);
  } else if (value.match(/(~)/gi)) {
    operatorMap[value](current);
  } else if (value.match(/(AC)/gi)) {
    operatorMap[value](current);
    operatorMap[value](operation);
  }
}

function evaluateExpression() {
  let text = current.textContent;
  if (!opIndex || !text[opIndex].match(opRegex)) {
    console.log("Nah!");
    opIndex = "";
    return;
  }
  if (
    text.length <= 1 ||
    opIndex === text.length - 1 ||
    [text[text.length - 1], text[text.length - 2]]
      .join("")
      .match(/[+\-\*\/%][+\-\*\/%]/gi)
  ) {
    console.log("Nah!!!");
    return;
  }
  let a = text.slice(0, opIndex);
  let operatorEval = text[opIndex];
  let b = text.slice(opIndex + 1);
  operation.textContent = current.textContent;
  current.textContent = operatorMap[operatorEval](a, b);
  current.classList.add("result");
  opIndex = "";
  scrollAdjust(true);
}

function scrollAdjust(afterResult = false) {
  let rect = current.getBoundingClientRect();
  let width = rect.width;
  let height = rect.height;
  let offsetTop = current.offsetTop;
  let offsetLeft = current.offsetLeft;
  let scroll = current.scrollWidth;
  current.scrollLeft = scroll - width;
}

// Keyboard Shortcuts:
console.log(`Keyboard Shortcuts:

numKey [0-9] - To Enter Number

Operators [+  -  *  /  %  ~(negate)  .(dot)] - To Enter Operators

[Delete(All Clear)  Backspace] - Additional Operations

[Enter] - Validates the Current Expression

`);
