// Numeric Numbers
var myNumber = 42;
myNumber = myNumber + 10;
console.log(myNumber * 100);

var myString = "JavaScript is Cool";
console.log("D3 and " + myString);

var userName = "Dave";
console.log(userName);
// boolean
var isBigNumber = myNumber > 100;
console.log(isBigNumber);

//Array Variables
var users = ["Dave", 100, "Dan", "Mengyue"];
console.log(users[1]);

//Objects
var myObject = {
 name: "Dave",
 color: "red"
};
console.log(myObject.name);

var complexUser = {
 name: "Dave Landry",
 zip: "02339",
 color: "red",
 haveDog: true,
 greet: function(greeting){
     console.log(greeting + " Dave");
 }
};

console.log(complexUser.zip);
//Functions: when logic needs to be repeated multiple times, make a function
var sayHello = function() {
 console.log("Hello!");
}
sayHello();

var sayText = function(name){
 console.log("Hello " + name);
}
sayText(complexUser.name);
complexUser.greet("GoodBye");

 //Function Returns
 var plusTen = function(num){
     var x = num + 10 + myNumber;
     return x;
 }
 var newNum = plusTen(20);
 console.log(newNum);

//Conditional Statements
if (newNum > 100) {
 console.log("Wow! Big Number!");
} else if (newNum > 50){
 console.log("Ok...");
} else {
 console.log("Not so big...");
}

var greaterThanTen = function(num) {
 if(num > 10) {
     console.log("yes");
 } else {
     console.log("no");
 }
 return num > 10;
}

var checkNum = greaterThanTen(20);
console.log(checkNum);

//Interact with the Page
document.getElementById("title").innerHTML = "Hi there";
document.getElementById("title").style.color = "red";