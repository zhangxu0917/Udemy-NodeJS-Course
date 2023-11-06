const person = {
  name: "Max",
  age: 29,
  greet() {
    console.log(`Hi, I am ${this.name}. `);
  },
};
const printName1 = (personData) => {
  console.log(personData.name);
};
const printName2 = ({ name, age }) => {
  console.log(`name: ${name}, age: ${age}`);
};
printName1(person);
printName2(person);

const { name, age } = person;
console.log(name, age);

const hobbies = ["Sports", "Cooking"];
const [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);
