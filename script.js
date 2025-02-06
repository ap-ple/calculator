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

let operator;
let left;
let right;

let screen = document.getElementById("screen");

const setScreenText = (newText) => {
   screen.innerText = newText;
   left = newText;
} 

let buttons = Array.from(document.getElementsByTagName("button"));

buttons.forEach(button => {
   // if digit button, add to display
   if (button.innerText.match(/\d/)) {
      button.addEventListener("click", event => {
         if (screen.innerText === "0") {
            // input is empty; set new input
            setScreenText(event.target.innerText);
         } else {
            setScreenText(screen.innerText + event.target.innerText);
         }
      });
   }
   else if (button.innerText === "CE") {
      button.addEventListener("click", event => {
         setScreenText("0");
      });
   }
   else if (button.innerText === "←") {
      button.addEventListener("click", event => {
         if (screen.innerText.length === 1) {
            if (screen.innerText !== "0") {
               setScreenText("0");
            }
         }
         else {
            setScreenText(screen.innerText.slice(0, -1));
         }
      });
   }
});