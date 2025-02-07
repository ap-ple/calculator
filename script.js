// TODO: Keyboard support
// TODO: Show full calculation in secondary display after enter is pressed
// TODO: Repeat last calculation if enter is pressed a second time

const PRECISION = 10;
const CHARACTER_LIMIT = 20;

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
let primaryDisplayIsRunningTotal = false;

let primaryDisplay = document.getElementById("primary-display");
let secondaryDisplay = document.getElementById("secondary-display");

let inputs = [];

const disableInputsIfCharacterLimitReached = () => {
   if (primaryDisplay.innerText.match(/[^\-]*/)[0].length >= CHARACTER_LIMIT) {
      inputs.forEach(input => {
         input.disabled = true;
      });
   }
}

const enableInputs = () => {
   inputs.forEach(input => {
      input.disabled = false;
   });
}

let buttons = Array.from(document.getElementsByTagName("button"));

buttons.forEach(button => {
   // digit buttons
   if (button.innerText.match(/^\d$/)) {
      inputs.push(button);

      button.addEventListener("click", event => {
         if (!primaryDisplayIsUserInput || primaryDisplay.innerText === "0") {
            // input is empty; set new input
            primaryDisplay.innerText = event.target.innerText;
         } else {
            primaryDisplay.innerText += event.target.innerText;
         }

         primaryDisplayIsUserInput = true;
         primaryDisplayIsRunningTotal = false;

         disableInputsIfCharacterLimitReached();
      });
   }
   else if (button.innerText === "AC") {
      button.addEventListener("click", event => {
         primaryDisplay.innerText = "0";
         secondaryDisplay.innerText = "";

         operator = null;
         leftOperand = null;
         primaryDisplayIsUserInput = false;
         enableInputs();
      });
   }
   else if (button.innerText === "CE") {
      button.addEventListener("click", event => {
         primaryDisplay.innerText = "0";

         primaryDisplayIsUserInput = false;
         enableInputs();
      });
   }
   else if (button.innerText === "⌫") {
      button.addEventListener("click", event => {
         enableInputs();

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
   else if (button.innerText === ".") {
      inputs.push(button);

      button.addEventListener("click", event => {
         if (primaryDisplayIsUserInput) {
            if (!primaryDisplay.innerText.match(/\./)) {
               primaryDisplay.innerText += ".";
            }
         }
         else {
            primaryDisplay.innerText = "0.";
            primaryDisplayIsUserInput = true;
         }

         disableInputsIfCharacterLimitReached();
      });
   }
   else if (button.innerText === "+/-") {
      button.addEventListener("click", event => {
         if (!primaryDisplayIsRunningTotal) {
            if (primaryDisplay.innerText.match(/^\-/)) {
               primaryDisplay.innerText = primaryDisplay.innerText.slice(1);
            }
            else {
               primaryDisplay.innerText = "-" + primaryDisplay.innerText;
            }
         }
      });
   }
   // operator buttons
   else if (button.innerText.match(/^[\+\-×÷]$/)) {
      button.addEventListener("click", event => {
         primaryDisplayIsRunningTotal = true;
         enableInputs(inputs);
         
         if (leftOperand === null) {
            primaryDisplayIsUserInput = false;

            operator = event.target.innerText;
            leftOperand = Number(primaryDisplay.innerText);

            secondaryDisplay.innerText = `${leftOperand} ${operator}`;
         }
         else if (primaryDisplayIsUserInput) {
            let rightOperand = Number(primaryDisplay.innerText);
            
            // Number function removes trailing zeroes
            let result = Number(operate(operator, leftOperand, rightOperand).toFixed(PRECISION));

            primaryDisplay.innerText = result;
            
            primaryDisplayIsUserInput = false;
            
            operator = event.target.innerText;
            leftOperand = result;
            
            secondaryDisplay.innerText += ` ${rightOperand} ${operator}`;
         }
         else {
            operator = event.target.innerText;

            secondaryDisplay.innerText = secondaryDisplay.innerText.slice(0, -1) + operator;
         }
      });
   }
   else if (button.innerText === "=") {
      button.addEventListener("click", event => {
         if (primaryDisplayIsUserInput && leftOperand !== null) {
            primaryDisplayIsUserInput = false;
            enableInputs();

            let rightOperand = Number(primaryDisplay.innerText);
            
            // Number function removes trailing zeroes
            let result = Number(operate(operator, leftOperand, rightOperand).toFixed(PRECISION));

            primaryDisplay.innerText = result;
            
            operator = null;
            leftOperand = null;
            primaryDisplayIsRunningTotal = false;

            secondaryDisplay.innerText = "";
         }
      });
   }
});