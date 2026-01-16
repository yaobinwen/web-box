#!/usr/bin/node

function func_with_return_value() {
    return 123
}

function func_without_return_value() {
    return
}

// Returns the value.
console.log("Function with return value: ", func_with_return_value())

// Returns `undefined`.
console.log("Function without return value: ", func_without_return_value())
