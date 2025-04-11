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

// Reality check
console.log(operate('add', 4, 7));
console.log(operate('subtract', 4, 7));
console.log(operate('multiply', 4, 7));
console.log(operate('divide', 8, 4));