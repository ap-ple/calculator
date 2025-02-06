// TODO: Round down results
// TODO: Chain operators

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

let primaryDisplay = document.getElementById("primary-display");
let secondaryDisplay = document.getElementById("secondary-display");

let buttons = Array.from(document.getElementsByTagName("button"));

buttons.forEach(button => {
   // if digit button, add to display
   if (button.innerText.match(/\d/)) {
      button.addEventListener("click", event => {
         if (primaryDisplay.innerText === "0") {
            // input is empty; set new input
            primaryDisplay.innerText = event.target.innerText;
         } else {
            primaryDisplay.innerText += event.target.innerText;
         }
      });
   }
   else if (button.innerText === "Clear") {
      button.addEventListener("click", event => {
         primaryDisplay.innerText = "0";
         secondaryDisplay.innerText = "";

         operator = null;
         leftOperand = null;
      });
   }
   else if (button.innerText === "←") {
      button.addEventListener("click", event => {
         // if not number, clear all
         if (!primaryDisplay.innerText.match(/\d+/)) {
            primaryDisplay.innerText = "0";
         }
         else if (primaryDisplay.innerText.length === 1) {
            if (primaryDisplay.innerText !== "0") {
               primaryDisplay.innerText = "0";
            }
         }
         else {
            primaryDisplay.innerText = primaryDisplay.innerText.slice(0, -1);
         }
      });
   }
   else if (button.innerText.match(/[\+\-×÷]/)) {
      button.addEventListener("click", event => {
         operator = event.target.innerText;

         if (leftOperand === null) {
            leftOperand = Number(primaryDisplay.innerText);
            primaryDisplay.innerText = "0";
         }

         secondaryDisplay.innerText = `${leftOperand} ${operator}`;
      });
   }
   else if (button.innerText === "=") {
      button.addEventListener("click", event => {
         if (leftOperand !== null) {
            let rightOperand = Number(primaryDisplay.innerText);

            primaryDisplay.innerText = operate(operator, leftOperand, rightOperand);
            secondaryDisplay.innerText = "";
            
            operator = null;
            leftOperand = null;
         }
      });
   }
});