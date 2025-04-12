// For reference

// <div class="row">
// <button class="clear" data-op="c">C</button>
// <button class="instant" data-op="mSubtract">M-</button>
// <button class="instant" data-op="mPlus">M+</button>
// <button class="instant" data-op="mRecall">MR</button>
// <button class="instant" data-op="mClear">MC</button>
// // i changed the memory operations to be their own class "memory"
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

let reset = false; // if true, clear on next press

let repeat = false; // Enables repeated calculations

let output = document.getElementById('out');

// Operations
let add = (a,b) => a+b;
let subtract = (a,b) => a-b;
let multiply = (a,b) => a*b;
let divide = (a,b) => {
    if (b==0) {
        // Punish them
        return 'This is what happens when you divide by 0.';
    }
    return a/b;
};


// Memory operations
let mAdd = (num) => {
    calculatorOperation.memory += num;
    reset = true;
};
let mSubtract = (num) => {
    calculatorOperation.memory -= num;
    reset = true;
}
let mRecall = (_) => {
    output.textContent = calculatorOperation.memory;
    reset = false;
    step = 0; // this will be num1
};
let mClear = (_) => {
    calculatorOperation.memory = 0;
};

// Instant operations
let switchSigns = (prevNum) => -prevNum;
let percent = (prevNum) => prevNum * 0.01;
let sqrt = (prevNum) => Math.sqrt(prevNum);


// "A calculator operation will consist of a number, an operator, and another number."
let calculatorOperation = {
    num1: 0,
    num2: 0,
    operation: '',
    memory: 0
}

let operations = {
    add,
    subtract,
    multiply,
    divide,
}

let memoryOperations = {
    mAdd,
    mSubtract,
    mRecall,
    mClear,
}

let instantOperations = {
    switchSigns,
    percent,
    sqrt,
}

// Runs an operation based on an operatior in operations
function operate(operator, a=0, b=0) {
    if (!operations.hasOwnProperty(operator)) {
        console.error(`${operator} does not exist.`);
        return;
    }

    return operations[operator](a,b);
}

function instantOperate(operator, num) {
    if (!instantOperations.hasOwnProperty(operator)) {
        console.error(`${operator} does not exist.`);
        return;
    }

    return instantOperations[operator](num);
}

function mOperate(operator, num) {
    if (!memoryOperations.hasOwnProperty(operator)) {
        console.error(`${operator} does not exist.`);
        return;
    }

    return memoryOperations[operator](num);
}

// Calculator functionality

// Number input
Array.from(document.getElementsByClassName('number')).forEach(numberBtn => {
    numberBtn.addEventListener('click', () => {
        if (reset) {
            output.textContent = 0;
            reset = false;
        }

        // If in step 1, we're in step 2
        if (step == 1) {
            step = 2;
            output.textContent = 0; // Clear display
        }

        // Makes sure 0's wont dissapear from the screen
        if (output.textContent === '0' && numberBtn.getAttribute('data-op') === '0') {
            return;
        }
        output.textContent = (output.textContent + numberBtn.getAttribute('data-op'))
        // remove beginning zeroes in whole numbers
        if (output.textContent % 1 == 0) output.textContent = output.textContent.replace(/^0+/, '');
    });
});

// Decimal input
document.getElementById('decimal').addEventListener('click', () => {
    if (reset) {
        output.textContent = 0;
        reset = false;
    }

    // if in step 1, . means decimal in step 2
    if (step == 1) {
        step = 2;
        output.textContent = '0.';
        return;
    }

    // If there is already decimal, exit
    if (output.textContent.includes('.')) return;

    output.textContent += '.'
})

// Instant operation logic
Array.from(document.getElementsByClassName('instant')).forEach(instantBtn => {
    instantBtn.addEventListener('click', () => {
        repeat = false;

        let ans = instantOperate(instantBtn.getAttribute('data-op'), Number(output.textContent));

        // If in step 1, assign to num1 instead
        // Operations will take in the answer
        if (step == 1 || reset) {
            output.textContent = ans;
            calculatorOperation.num1 = ans;
            return;
        }

        output.textContent = ans;

        // Assign number to num1 or num2
        let numStep = 'num' + (step + 1); // Current number in step
        calculatorOperation[numStep] = ans;
    });
});

// Operation logic
Array.from(document.getElementsByClassName('operator')).forEach(operationBtn => {
    operationBtn.addEventListener('click', () => {
        repeat = false;

        // If in step 1, we only need to change the operation
        if (step == 1) {
            calculatorOperation.operation = operationBtn.getAttribute('data-op');
            return;
        }

        // If in step 2, we should calculate with the previous operation first and assign it to num1
        if (step == 2) {
            calculatorOperation.num2 = Number(output.textContent); // Set current number to num2

            let ans = operate(calculatorOperation.operation, calculatorOperation.num1, calculatorOperation.num2);
            calculatorOperation.num1 = ans;
            output.textContent = ans;
        }

        reset = false; // Operations will take in the answer

        step = 1; // We're now in step 1

        // Setup num1
        output.textContent = Number(output.textContent); // Update display to be a complete number (i.e. 2. becomes 2, 2.0100 becomes 2.01)
        calculatorOperation.num1 = Number(output.textContent);

        // Set operation
        calculatorOperation.operation = operationBtn.getAttribute('data-op');
        console.log(calculatorOperation.operation);
    });
});

// Equals logic
document.getElementById('equals').addEventListener('click', () => {
    if (repeat) {
        output.textContent = operate(calculatorOperation.operation, Number(output.textContent), calculatorOperation.num2); // Repeated calculations
        return;
    }
    if (step==2) calculatorOperation.num2 = Number(output.textContent); // Compile num2
    output.textContent = operate(calculatorOperation.operation, calculatorOperation.num1, calculatorOperation.num2);
    step = 0;
    reset = true;
    repeat = true;

    if (calculatorOperation.operation == 'divide' && calculatorOperation.num2 == 0) {
        // Punish them
        window.location.replace('https://youtu.be/noY-Sd0DZqM?si=q3h-WteTE8k676ux&t=2');
    }
});

// Clear logic
document.getElementById('clear').addEventListener('click', () => {
    // This resets everything except memory
    output.textContent = 0;
    reset = false;
    step = 0;
    operations.num1 = 0;
    operations.num2 = 0;
    operations.operation = '';
    repeat = false;
});

// CE logic
document.getElementById('backspace').addEventListener('click', () => {
    repeat = false

    if (output.textContent.length == 1) {
        if (output.textContent != 0) output.textContent = 0;
        return; // Do not delete the zero
    }

    // This just deletes the last character
    output.textContent = output.textContent.slice(0, -1);
});

// Memory logic
Array.from(document.getElementsByClassName('memory')).forEach(memoryBtn => {
    memoryBtn.addEventListener('click', () => {
        repeat = false;
        mOperate(memoryBtn.getAttribute('data-op'), Number(output.textContent));
    })
})