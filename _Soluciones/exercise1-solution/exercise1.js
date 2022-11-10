/**
 * Part 1
 * Create a function that receives 2 strings. The second string must contain only a letter
 * It should return the number of times that letter (second parameter) is included in the string (first parameter).
 * It should not differentiate between uppercase and lowercase letters
 * Check that both parameters are strings and the second string is only 1 character. If there's an error, print a message and return -1 
 * Example: timesChar("Characteristic", "c") -> 3
 */
console.log("EXERCISE 1 - PART 1");

function timesChar(str, char) {
    if (typeof str !== "string" || typeof char !== "string") {
        console.error("Both parameters must be string");
        return -1;
    } else if (char.length !== 1) {
        console.error("Second parameter should be a single character");
        return -1;
    } else {
        let times = 0;
        str = str.toLocaleLowerCase();
        char = char.toLocaleLowerCase();
        for (let i = 0; i < str.length; i++) {
            if(str[i] === char) times++;
        }
        return times;
        // return (str.match(new RegExp(char, "ig")) || []).length; // -> SAME result in one line
    }
}

console.log(`"a" is included ${timesChar("Abracadabra", "a")} times in "Abracadabra"`);
console.log(`"e" is included ${timesChar("Abracadabra", "e")} times in "Abracadabra"`);
console.log(timesChar("Hello", 2));
console.log(timesChar("Hello", "bye"));

/**
 * Part 2
 * Create an array of strings.
 * Filter the array to include only the strings which their length is at least 5 characters
 * Transform all the strings in the filtered array to UPPERCASE
 * Print the resulting array, using ";" as the separator
 * Don't use traditional loops! (while, for, ...) 
 */
console.log("EXERCISE 1 - PART 2");

let arr = ["apple", "car", "house", "telephone", "air", "horse", "leaf"];
console.log(arr.filter(s => s.length >= 5).map(s => s.toLocaleUpperCase()).join("; "));

/**
 * Part 3
 * Create a function that receives 3 parameters with default values (product -> "Generic product",
 * price -> 100, tax 21). Transform the product's name to string and the other 2 parameters to number.
 * If price or tax cannot be converted to number (NaN), show an error.
 * Finally, print the received product and the final price (including taxes) 
 * Call this function several times, omitting parameters or sending not numeric values.
 */
console.log("EXERCISE 1 - PART 3");

function showProd(product = "Generic product", price = 100, tax = 21) {
    product = "" + product;
    price = +price;
    tax = +tax;
    if (isNaN(price) || isNaN(tax))
        console.error("Price and tax must be numeric!");
    else
        console.log(`Product: ${product}. Final price: ${(price * (1 + tax / 100)).toFixed(2)}€`);
}

showProd();
showProd("Bike");
showProd("Table", 70, 10);
showProd("Spoon", "a", "b");

/**
 * Part 4
 * Create an array with 4 values and do the following (use the correct array methods).
 * Add 2 elements at the beginning
 * Add 2 more at the end.
 * Delete positions 3,4 and 5
 * Insert 2 elements before the last element.
 * On each change, show the resulting array with its elements separated by '=>' (don't use any loop).
 */
console.log("EXERCISE 1 - PART 4");

let nums = [10, 20, 30, 40];
console.log(nums.join(' => '));
nums.unshift(0, 5);
console.log(nums.join(' => '));
nums.push(50, 60);
console.log(nums.join(' => '));
nums.splice(3, 3);
console.log(nums.join(' => '));
nums.splice(-1, 0, 55, 56);
console.log(nums.join(' => '));

/**
 * Part 5
 * Create an array with several strings. Using the reduce method, return a string
 * that is a concatenation of the first letter of every string in the array.
 */

console.log("EXERCISE 1 - PART 5");

let names = ["Max", "Oliver", "Rachel", "Thomas", "Yennefer"];
console.log(names.reduce((final, name) => final + name[0], ""));

/**
 * Part 6
 * Create an array with several strings. Using the reduce method, return the total length of all the strings.
 */
console.log("EXERCISE 1 - PART 6");

let names2 = ["Max", "Oliver", "Rachel", "Thomas", "Yennefer"];
console.log(names2.reduce((final, name) => final + name.length, 0));

/**
 * Part 7
 * Create a function that receives an array and adds the first three numbers of the array.
 * Use array destructuring in the parameters to get those three numbers.
 * If any of those numbers is not present in the array, a default value of 0 will be assigned
 * Return the result of adding those three numbers
 */
console.log("EXERCISE 1 - PART 7");

function destructSum([a = 0, b = 0, c = 0]) {
    return a + b + c;
}

console.log(destructSum([4, 6, 2, 7, 8, 2]));
console.log(destructSum([]));
console.log(destructSum([5, , 6]));

/**
 * Part 8
 * Create a funcion that can receive as many numbers as you want by parameter. Use rest to group them in
 * an array and print the ones that are even and the ones that arre odd separately. 
 * DON'T use loops (for, while, etc.)
 * Call this function several times with different values.
 */
console.log("EXERCISE 1 - PART 8");

function showEvenOdd(...nums) {
    console.log(`Even: ${nums.filter(n => n % 2 === 0)}`);
    console.log(`Odd: ${nums.filter(n => n % 2 === 1)}`);
}

showEvenOdd(23, 43, 54, 26, 9, 91, 34, 8, 7, 11);
showEvenOdd(1, 2, 3, 4, 5, 6);
showEvenOdd(1, 3, 15, 75, 89, 43, 25);

/**
 * Part 9
 * Create a Map object. The key will be a student name, and the value an array with all his/her exam marks.
 * Iterate through the Map and show each student's name, the marks separated by '-' and the average mark (with 2 decimals).
 * Example: Peter (7.60 - 2.50 - 6.25 - 9.00). Average: 6.34
 */
console.log("EXERCISE 1 - PART 9");

let persons = new Map();
persons.set("Jerry", [5.5, 1.25, 6, 6.75]);
persons.set("Jessica", [6, 8.6, 9, 9.25, 7.8]);
persons.set("Tom", [6, 10, 9.6, 7, 8]);

persons.forEach((marks, person) => console.log(`${person} (${marks.join(' - ')}). Average: ${(marks.reduce((t, m) => t + m, 0) / marks.length).toFixed(2)}`));

/**
 * Part 10
 * Create a function that receives an array, deletes its duplicated values and prints them.
 * Create a Set object from the array to delete the duplicated values.
 */
console.log("EXERCISE 1 - PART 10");

function deleteDups(array = []) {
    const set = new Set(array);
    console.log(`Original array: ${array}`);
    console.log(`Duplicates deleted: ${Array.from(set)}`);
}

deleteDups([3, 4, 5, 3, 3, 4, 5]);
deleteDups(['a', 'c', 'm', 'r', 'a', 'm', 'a']);

