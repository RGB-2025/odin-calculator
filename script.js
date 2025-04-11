let add = (a,b) => a+b;
let subtract = (a,b) => a-b;
let multiply = (a,b) => a*b;
let divide = (a,b) => a/b;

// "A calculator operation will consist of a number, an operator, and another number."
let calculatorOperation = {
    num1: 0,
    num2: 0,
    operation: null
}

let operations = {
    add,
    subtract,
    multiply,
    divide
}

// Runs an operation based on an operatior in operations
function operate(operator, a=0, b=0) {
    if (!operations.hasOwnProperty(operator)) {
        console.error(`${operator} does not exist.`);
        return;
    }

    return operations[operator](a,b);
}

// For reference

// <div class="row">
// <button class="clear" data-op="c">C</button>
// <button class="instant" data-op="mSubtract">M-</button>
// <button class="instant" data-op="mPlus">M+</button>
// <button class="instant" data-op="mRecall">MR</button>
// <button class="instant" data-op="mClear">MC</button>
// </div>

// <div class="row">
// <button class="backspace" data-op="ce">CE</button>
// <button class="number" data-op="7">7</button>
// <button class="number" data-op="4">4</button>
// <button class="number" data-op="1">1</button>
// <button class="number" data-op="0">0</button>
// </div>

// <div class="row">
// <button class="instant" data-op="percent">%</button>
// <button class="number" data-op="8">8</button>
// <button class="number" data-op="5">5</button>
// <button class="number" data-op="2">2</button>
// <button class="decimal" data-op="dec">.</button>
// </div>

// <div class="row">
// <button class="instant" data-op="switchSigns">&plusmn;</button>
// <button class="number" data-op="3">3</button>
// <button class="number" data-op="6">6</button>
// <button class="number" data-op="9">9</button>
// <button class="equals" data-op="equals">=</button>
// </div>

// <div class="row">
// <button class="instant" data-op="sqrt">&radic;</button>
// <button class="operator" data-op="divide">&divide;</button>
// <button class="operator" data-op="multiply">&times;</button>
// <button class="operator" data-op="minus">-</button>
// <button class="operator" data-op="plus">+</button>
// </div>

/*
step 0: num1
step 1: operation (triggered when an operation is done)
step 2: num2

note:
- instant operations will not trigger step 1, rather will change num1 or num2 depending on the situation.
- if a calculator operation is done twice, the operation will be calculated.
(example: 5*3*4
- calculate 5*3 and put to num1, then do *3.
)
*/
let step = 0;

let output = document.getElementById('out');

// Number input
Array.from(document.getElementsByClassName('number')).forEach(numberBtn => {
    numberBtn.addEventListener('click', () => {
        // Makes sure 0's wont dissapear from the screen
        if (output.textContent === '0' && numberBtn.getAttribute('data-op') === '0') {
            return;
        }
        output.textContent = (output.textContent + numberBtn.getAttribute('data-op')).replace(/^0+/, '');
    });
});

// Decimal input
document.getElementById('decimal').addEventListener('click', () => {
    // If there is already decimal, exit
    if (output.textContent.includes('.')) return;

    output.textContent += '.'
})