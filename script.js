// TODO: Keyboard support

const PRECISION = 10;
const CHARACTER_LIMIT = 22;

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

const disableElementsAtCharacterLimit = (elements) => {
   if (primaryDisplay.innerText.match(/[^\-]+/).length >= CHARACTER_LIMIT) {
      elements.forEach(element => {
         element.toggleAttribute("disabled");
      });
   }
}

const enableElements = (elements) => {
   elements.forEach(element => {
      element.disabled = false;
   });
}

let operator = null;
let leftOperand = null;
let primaryDisplayIsUserInput = false;
let expressionInProgress = false;

let primaryDisplay = document.getElementById("primary-display");
let secondaryDisplay = document.getElementById("secondary-display");

let buttons = Array.from(document.getElementsByTagName("button"));
let inputs = [];

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
         expressionInProgress = false;

         disableElementsAtCharacterLimit(inputs);
      });
   }
   else if (button.innerText === "AC") {
      button.addEventListener("click", event => {
         primaryDisplay.innerText = "0";
         secondaryDisplay.innerText = "";

         operator = null;
         leftOperand = null;
         primaryDisplayIsUserInput = false;
         enableElements(inputs);
      });
   }
   else if (button.innerText === "CE") {
      button.addEventListener("click", event => {
         primaryDisplay.innerText = "0";

         primaryDisplayIsUserInput = false;
         enableElements(inputs);
      });
   }
   else if (button.innerText === "⌫") {
      button.addEventListener("click", event => {
         enableElements(inputs);

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

         disableElementsAtCharacterLimit(inputs);
      });
   }
   else if (button.innerText === "+/-") {
      button.addEventListener("click", event => {
         if (!expressionInProgress) {
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
         expressionInProgress = true;
         primaryDisplayIsUserInput = false;
         enableElements(inputs);
         
         if (leftOperand === null) {
            operator = event.target.innerText;
            leftOperand = Number(primaryDisplay.innerText);
            secondaryDisplay.innerText = `${leftOperand} ${operator}`;
         }
         else if (primaryDisplayIsUserInput) {
            let rightOperand = Number(primaryDisplay.innerText);
            
            // unary + removes trailing zeroes
            let result = + operate(operator, leftOperand, rightOperand).toFixed(PRECISION);

            primaryDisplay.innerText = result;
            
            operator = event.target.innerText;
            leftOperand = result;

            secondaryDisplay.innerText += ` ${rightOperand} ${operator}`;
         }
      });
   }
   else if (button.innerText === "=") {
      button.addEventListener("click", event => {
         if (primaryDisplayIsUserInput && leftOperand !== null) {
            primaryDisplayIsUserInput = false;
            enableElements(inputs);

            let rightOperand = Number(primaryDisplay.innerText);
            
            // unary + removes trailing zeroes
            let result = + operate(operator, leftOperand, rightOperand).toFixed(PRECISION);

            primaryDisplay.innerText = result;
            
            operator = null;
            leftOperand = null;
            expressionInProgress = false;

            secondaryDisplay.innerText = "";
         }
      });
   }
});