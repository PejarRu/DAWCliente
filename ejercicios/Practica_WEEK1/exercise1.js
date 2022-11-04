/**
 * Part 1
 * Create a function that receives 2 strings. The second string must contain only a letter
 * It should return the number of times that letter (second parameter) is included in the string (first parameter).
 * It should not differentiate between uppercase and lowercase letters
 * Check that both parameters are strings and the second string is only 1 character. If there's an error, print a message and return -1 
 * Example: timesChar("Characteristic", "c") -> 3
 */
console.log("EXERCISE 1 - PART 1");

function timesChar(strMain, strChar) {
    if (strChar.length == 1 && strChar.match(/[a-zA-Z]/i)) {
        //Correct second param
        let a = 0;
        for (let i = 0; i < strMain.length; i++) {
            if (strMain.charAt(i).toLowerCase() === strChar.toLowerCase()){
                a++
            }
        }
        console.log(`There are ${a} appearence of "${strChar}" in "${strMain}"`)

    } else {
        //This parameter is no a single letter character
        console.log("Error, the second paraeter must be a single letter")
    }
}
timesChar("Characteristic", "c");
timesChar("Viva la vida", "v");
timesChar("Hello World", "o");
/**
 * Part 2
 * Create an array of strings.
 * Filter the array to include only the strings which their length is at least 5 characters
 * Transform all the strings in the filtered array to UPPERCASE
 * Print the resulting array, using ";" as the separator
 * Don't use traditional loops! (while, for, ...) 
 */
console.log("EXERCISE 1 - PART 2");
let arrayString = ["String number 1", "Lore", "Ipsum", "Final String"];
function filterByLenght(arrayString, minLenght) {
    let filteredArray = arrayString.filter((str) => str.length >= minLenght)
    console.log(filteredArray.join(";"));
}
filterByLenght(arrayString, 5);
/**
 * Part 3
 * Create a function that receives 3 parameters with default values (product -> "Generic product",
 * price -> 100, tax 21). Transform the product's name to string and the other 2 parameters to number.
 * If price or tax cannot be converted to number (NaN), show an error.
 * Finally, print the received product and the final price (including taxes) 
 * Call this function several times, omitting parameters or sending not numeric values.
 */

console.log("EXERCISE 1 - PART 3");
function convertToNum(notANumber){
    let number = Number(parseInt(notANumber))
    return number
}
function taxCalculator(product = "Generic product", price = 100, tax = 21){
    let prd = product.toString();
    let prc = convertToNum(price);
    let t = convertToNum(tax);
    if (!isNaN(t)) {
        console.log(`The price of ${prd} is ${prc+prc*t/100}$ where ${prc*t/100}$ is tax`)
    }else{
        console.log("Error. Couldn't convert tax to number")
    }
}
taxCalculator(); //Right
taxCalculator("MacBook");//Right
taxCalculator(33);//Right
taxCalculator("MacBook", 1000);//Right
taxCalculator("MacBook", "1000.99");//Right
taxCalculator("MacBook", 1000.99);//Right
taxCalculator("MacBook", 1000, 10);//Right
taxCalculator("MacBook", 1000, 10.8);//Right
taxCalculator("MacBook", 1000, "10.8");//Right
taxCalculator("Notebook","1000", "30");//Right
taxCalculator("Notebook","nan", "30");//Right
taxCalculator("Notebook","1000", "nan");//Error is thrown
taxCalculator("Notebook","nan","nan");//Error is thrown

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
let arrayEx4 = new Array(1,2,3,4);
console.log(JSON.stringify(arrayEx4));
console.log(arrayEx4.join("=>"));
arrayEx4.unshift("a");
arrayEx4.unshift("b");
console.log(arrayEx4.join("=>"));

arrayEx4.push("c");
arrayEx4.push("d");
console.log(arrayEx4.join("=>"));

arrayEx4.splice(2,3);
console.log(arrayEx4.join("=>"));
arrayEx4.splice(arrayEx4.length-1, 0, "E", "F");
console.log(arrayEx4.join("=>"));



/**,
 * Part 5
 * Create an array with several strings. Using the reduce method, return a string
 * that is a concatenation of the first letter of every string in the array.
 */

console.log("EXERCISE 1 - PART 5");
let arrayEx5  = new Array("Hilera","Endulzar","Lloros","Lapida","Oblicuos")
console.log(arrayEx5.reduce((word, letter) => word + letter.charAt(0), ''));

/**
 * Part 6
 * Create an array with several strings. Using the reduce method, return the total length of all the strings.
 */

console.log("EXERCISE 1 - PART 6");
let arrayEx6  = new Array("Hilera","Endulzar","Lloros","Lapida","Oblicuos")
console.log("Total lenght: "+arrayEx6.reduce((totalLenght, eachLegth) => totalLenght + eachLegth.length, 0));

/**
 * Part 7
 * Create a function that receives an array and adds the first three numbers of the array.
 * Use array destructuring in the parameters to get those three numbers.
 * If any of those numbers is not present in the array, a default value of 0 will be assigned
 * Return the result of adding those three numbers
 */
console.log("EXERCISE 1 - PART 7");
function addFirstThree(array, [first=0, second=0, third=0] = array){

    return first+second+third;
}
let arrayEx7_1 = new Array(49,43,71,19,18,37,46)
console.log("First array: "+arrayEx7_1.join(", "));

let arrayEx7_2 = new Array()
arrayEx7_2[0] = 49;
arrayEx7_2[2] = 71;
arrayEx7_2[3] = 19;
arrayEx7_2[4] = 18;
arrayEx7_2[5] = 37;
arrayEx7_2[6] = 46;
console.log("Array with no [2] value: "+arrayEx7_2.join(", "));

console.log(addFirstThree(arrayEx7_1))
console.log(addFirstThree(arrayEx7_2))

/**
 * Part 8
 * Create a funcion that can receive as many numbers as you want by parameter. Use rest to group them in
 * an array and print the ones that are even and the ones that arre odd separately. 
 * DON'T use loops (for, while, etc.)
 * Call this function several times with different values.
 */
console.log("EXERCISE 1 - PART 8");
function createArrayFrom(...number){
    console.log(`\n## N: ${number} ##`);
    console.log("Even numbers: " + number.filter(num => num%2 === 0)); 
    console.log("Odd numbers: " + number.filter(num => num%2 !== 0)); 
}
createArrayFrom(49,42,70,19)
createArrayFrom(71,15,49,46)
createArrayFrom(97,30,64,89)

/**
 * Part 9
 * Create a Map object. The key will be a student name, and the value an array with all his/her exam marks.
 * Iterate through the Map and show each student's name, the marks separated by '-' and the average mark (with 2 decimals).
 * Example: Peter (7.60 - 2.50 - 6.25 - 9.00). Average: 6.34
 */

console.log("EXERCISE 1 - PART 9");
let student = [["Pete", 7.8, 5, 7, 6.6],
["Jhon", 4, 7, 9.8, 3],
["Pablo", 1, 5, 8.9, 0],
["Stuart", 5, 9, 2, 6.7],
["Daniel", 2.9, 8.9, 5.9, 5.9],
["Alex", 4, 7.6, 8, 9]]

let studentMap = new Map(student)

console.log(studentMap)


studentMap.has()

/**
 * Part 10
 * Create a function that receives an array, deletes its duplicated values and prints them.
 * Create a Set object from the array to delete the duplicated values.
 */
console.log("EXERCISE 1 - PART 10");

function deleteDuplicates(array){
    let shuffledAray = array.sort((a, b) => 0.5 - Math.random())
    let setEx10  = new Set
    shuffledAray.forEach(element => {
        setEx10.add(element)
    });
    console.log(setEx10)
    console.log(setEx10.toString())
    
}

let arrayEx10  = new Array("Hilera",70,"Endulzar",49, "Lloros",56,"Oblicuos",70,"Endulzar",70,"Lloros",49,"Oblicuos",99);

deleteDuplicates(arrayEx10);