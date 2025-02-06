// TODO: Chain operators
// TODO: Decimal point input
// TODO: Negative inputs
// TODO: Shrink display as number grows larger
// TODO: Format large outputs in scientific notation
// TODO: Keyboard support

const PRECISION = 12;

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

const operate = (operator, a, b) => {
   switch (operator) {
      case "+": return add(a, b);
      case "-": return subtract(a, b);
      case "×": return multiply(a, b);
      case "÷": return divide(a, b);
   }
}

let operator = null;
let leftOperand = null;
let primaryDisplayIsUserInput = false;

let primaryDisplay = document.getElementById("primary-display");
let secondaryDisplay = document.getElementById("secondary-display");

let buttons = Array.from(document.getElementsByTagName("button"));

buttons.forEach(button => {
   // digit buttons
   if (button.innerText.match(/^\d$/)) {
      button.addEventListener("click", event => {
         if (!primaryDisplayIsUserInput || primaryDisplay.innerText === "0") {
            // input is empty; set new input
            primaryDisplay.innerText = event.target.innerText;
         } else {
            primaryDisplay.innerText += event.target.innerText;
         }
         primaryDisplayIsUserInput = true;
      });
   }
   else if (button.innerText === "AC") {
      button.addEventListener("click", event => {
         primaryDisplay.innerText = "0";
         secondaryDisplay.innerText = "";

         operator = null;
         leftOperand = null;
         primaryDisplayIsUserInput = false;
      });
   }
   else if (button.innerText === "←") {
      button.addEventListener("click", event => {
         // if display is single digit or not user input, clear display
         if (primaryDisplay.innerText.match(/^\-?\d$/)
             || !primaryDisplayIsUserInput
            ) {
            primaryDisplay.innerText = "0";
            primaryDisplayIsUserInput = false;
         }
         else {
            primaryDisplay.innerText = primaryDisplay.innerText.slice(0, -1);
         }
      });
   }
   // operator buttons
   else if (button.innerText.match(/^[\+\-×÷]$/)) {
      button.addEventListener("click", event => {
         if (leftOperand === null) {
            operator = event.target.innerText;
            primaryDisplayIsUserInput = false;
            leftOperand = Number(primaryDisplay.innerText);
            secondaryDisplay.innerText = `${leftOperand} ${operator}`;
         }
      });
   }
   else if (button.innerText === "=") {
      button.addEventListener("click", event => {
         if (primaryDisplayIsUserInput && leftOperand !== null) {
            let rightOperand = Number(primaryDisplay.innerText);
            
            let result = operate(operator, leftOperand, rightOperand);

            // unary + removes trailing zeros
            primaryDisplay.innerText = + result.toPrecision(PRECISION);
            secondaryDisplay.innerText = "";
            
            operator = null;
            leftOperand = null;
            primaryDisplayIsUserInput = false;
         }
      });
   }
});