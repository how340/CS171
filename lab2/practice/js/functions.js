

// could also be created as dictionaries. where ride name is the key while the rest ar values. 
let amusementRides = [
    //opendays is encoded from Monday to Sunday, where 1 represents open and 0 represents closed.
    {'id':1, 'name': 'rollerCoaster', 'price':10, 'openDays':[1,1,1,1,1,1,1], 'childrenAllowed':false},
    {'id':2, 'name': 'teacup', 'price':15, 'openDays':[1,1,0,1,1,1,0], 'childrenAllowed':true},
    {'id':3, 'name': 'bumpCar', 'price':20, 'openDays':[0,0,1,1,1,1,1], 'childrenAllowed':true}
];


function doublePrices(amusementRides) {
    for (let ride in amusementRides) {
        if (ride != 1){
            amusementRides[ride].price = amusementRides[ride].price *2
        }
    }
    return amusementRides
}

let amusementRidesDouble = doublePrices(amusementRides)

console.log(amusementRidesDouble)


function debugAmusementRides(amusementRides){
    const divElement = document.getElementById("content-1")

    amusementRides.forEach(element => {
        console.log(element.name + ' has price of: ' + element.price)

        //append new information to the DOM
        const paragraphElement = document.createElement('p')

        paragraphElement.innerHTML = element.name + ' has price of: ' + element.price

        divElement.append(paragraphElement)
    });
}

debugAmusementRides(amusementRidesDouble)


let person = { firstName: "Sarah", age: 24, profession: "Student" };

// Add a new variable to the class 'person' called 'message'. Store a function in 'message'.
person.message = function() {
	return "Hello, I'm " + this.firstName + "!";
}
console.log(person); // Returns your new person object

console.log(person.message()); // Returns: Hello, I'm Sarah.