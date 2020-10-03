// makePerson1 returns Object
function makePerson1(name, age) {
  return {
    name,
    age,
    nameInUpper() {
      return this.name.toUpperCase();
    }
  }
}

const p1 = makePerson1('a', 20);
const p2 = makePerson1('b', 25);

console.log(p1.nameInUpper(), p2.nameInUpper());
// Output: A B

// What is the problem in above code?

// Everytime we create an object by calling makePerson1() it actually copies the nameInUpper() function so that muliple objects have thier own copy of nameInUpper() which you can find by doing below code

console.log(p1.nameInUpper == p2.nameInUpper);
// Output: false

// Which means if you create millions of object then there will be millions of copies of nameInUpper() but different identities means they are occupying millions of allocation of memory

// NOTE: there is problem of memory utilzation 

// =======================================================================================

function nameInUpper() {
  return this.name.toUpperCase();
}

// makePerson2 returns Object
function makePerson2(name, age) {
  return {
    name,
    age
  }
}

const p3 = makePerson2('a', 20);
const p4 = makePerson2('b', 25);

console.log(nameInUpper.call(p3), nameInUpper.call(p4));
// Output: A B

// What is the problem in second implementation?

// So two problems imerged
// 1. the calling convention is not familiar
// 2. Global is polluted becuase the nameInUpper() function can not be used globally

// =======================================================================================

const PersonSharedMethod = {
  nameInUpper() {
    return this.name.toUpperCase();
  },
  ageInBinary() {
    return this.age.toString(2);
  }
};
// nameInUpper() is not in global now, First problem solved

function makePerson3(name, age) {
  return {
    name,
    age,
    nameInUpper: PersonSharedMethod.nameInUpper,
    ageInBinary: PersonSharedMethod.ageInBinary,
  };
}
// Now nameInUpper referrence to the PersonSharedMethod i.e an alias

const p5 = makePerson3('a', 20);
const p6 = makePerson3('b', 25);

console.log(p5.nameInUpper(), p6.nameInUpper());
// Output: A B
console.log(p5.ageInBinary(), p6.ageInBinary());
// Output:10100 11001

//  We improve the calling method also

// But problem with approach is that if you have a third function called xyz() then you have to modify the constructor again
// every time when PersonSharedMethod have a new function it will not add automatically to constructor function

// =======================================================================================

const PersonSharedMethods = {
  nameInUpper() {
    return this.name.toUpperCase();
  },
  ageInBinary() {
    return this.age.toString(2);
  }
};
// nameInUpper() is not in global now, First problem solved

function makePerson4(name, age) {
  const newPerson = Object.create(PersonSharedMethods);
  newPerson.name = name;
  newPerson.age = age;
  return newPerson;
}

const p7 = makePerson4('a', 20);
const p8 = makePerson4('b', 25);

console.log(p7.nameInUpper(), p8.nameInUpper());
// Output: A B
console.log(p7.ageInBinary(), p8.ageInBinary());
// Output:10100 11001

// In this case we have change the prototype method of objects p1 and p2 which is PersonSharedMethods which can access the methods of parent object. Therefore PersonSharedMethods is also called prototype.

// =======================================================================================

function makePerson5(name, age) {
  const newPerson = Object.create(PersonSharedMethods); // This will creare a new object of Person Shared Methods
  this.name = name;
  this.age = age;
  return newPerson; // Return the object requires comment
}

makePerson5.prototype = {
  nameInUpper() {
    return this.name.toUpperCase();
  },
  ageInBinary() {
    return this.age.toString(2);
  }
};

const p9 = new makePerson5('a', 20);
const p10 = new makePerson5('b', 25);

console.log(p7.nameInUpper(), p8.nameInUpper());
// Output: A B
console.log(p7.ageInBinary(), p8.ageInBinary());
// Output:10100 11001

// Because the new operator does this = Object.create(<fn>.prototype) it does it internally.


// IMPORTANT Thing to understand
// There are two prototype which is available in all traditional function like function with "function" keyword not arrow function. The *prototype* available in function is an object which keeps the sharedMethods which will be used by the objects created by that function. But every object has an internal prototype link which reffered to as [[prototype]] through which it keeps the link of it's parent.
