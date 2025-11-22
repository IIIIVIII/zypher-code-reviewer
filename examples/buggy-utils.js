// Example 5: Simple JavaScript with common bugs
// File: buggy-utils.js

// BUG 1: Function doesn't handle empty array
function calculateAverage(numbers) {
  let sum = 0;
  for (let i = 0; i <= numbers.length; i++) { // BUG 2: Off-by-one error
    sum += numbers[i];
  }
  return sum / numbers.length;
}

// BUG 3: Comparison issues
function findUser(users, id) {
  return users.find(user => user.id == id); // Should use ===
}

// BUG 4: Variable hoisting issue
function processData(data) {
  console.log(result); // BUG: Using before declaration
  for (var i = 0; i < data.length; i++) { // BUG 5: var instead of let
    var result = data[i] * 2;
  }
  return result;
}

// BUG 6: Async/await issues
function fetchData(url) {
  const response = fetch(url); // BUG: Missing await
  const data = response.json(); // BUG 7: Missing await
  return data;
}

// BUG 8: Reference vs value
function addToCart(cart, item) {
  cart.push(item); // Mutates original array
  return cart;
}

// BUG 9: Floating point precision
function calculatePrice(price, quantity) {
  return price * quantity; // Will have floating point issues
}

// BUG 10: No default parameter
function greet(name) {
  return `Hello, ${name.toUpperCase()}!`; // Crashes if name is undefined
}

module.exports = {
  calculateAverage,
  findUser,
  processData,
  fetchData,
  addToCart,
  calculatePrice,
  greet
};
