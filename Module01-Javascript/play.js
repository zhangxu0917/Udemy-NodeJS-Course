let name = "Max";
let age = 29;
let hasHobbies = true;

const summarizeUser = (userName, userAge, userHasHobby) => {
  return `Name is ${userName}, age is ${userAge} and the user has hobbies: ${userHasHobby}`;
};

let message = summarizeUser(name, age, hasHobbies);
console.log(message);

const add = (a, b) => a + b;
const addOne = (a) => a + 1;
const addRandom = () => 1 + 2;

console.log("add(1, 2)", add(1, 2));
console.log("addOne(3)", addOne(3));
console.log("addRandom()", addRandom());

const person = {
  name: "Max",
  age: 29,
  greet() {
    console.log(`Hi, I am ${this.name}. `);
  },
};

console.log(person);
console.log(person.greet());

const hobbies = ["sports", "Cooking"];
for (const hobby of hobbies) {
  console.log(hobby);
}

console.log("==========");
console.log(hobbies.map((hobby) => `Hobby: ${hobby}`));
console.log(hobbies);

hobbies.push("Programming");
console.log(hobbies);

const toArray = (...args) => {
  return args;
};
console.log(toArray(1, 2, 3));

