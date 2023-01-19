"use strict";

document.addEventListener("DOMContentLoaded", function () {
    function Person(name, age) {
        this.name = name;
        this.age = age;
    }

    var people = [
        new Person("Ivan", 21),
        new Person("Petr", 29),
        new Person("Evgeny", 9),
        new Person("Liza", 5),
        new Person("Marina", 30),
        new Person("Evgeny", 20),
        new Person("Rudolph", 25),
        new Person("Dmitry", 17),
        new Person("Evgeny", 94),
        new Person("Rudolph", 25),
        new Person("Alan", 9)
    ];

    function printToConsole(message, collection) {
        console.log("#".repeat(50));
        console.log(message);

        if (_.size(collection) === 0) {
            return;
        }

        if (_.isArray(collection)) {
            _.each(collection, function (person) {
                console.log("name: " + person.name + "; age: " + person.age);
            });
        } else {
            for (var property in collection) {
                if (collection.hasOwnProperty(property)) {
                    console.log(property + ": " + collection[property] + " people");
                }
            }
        }

        console.log("#".repeat(50));
    }

    var agesSum = _.reduce(people, function (memo, person) {
        return memo + person.age;
    }, 0);

    var peopleAverageAge = (agesSum / _.size(people)).toFixed(2);

    printToConsole("1. Calculate the average age of all people. Average age of all people = " + peopleAverageAge, []);

    var peopleInRange20To30Years = _.chain(people)
        .filter(function (person) {
            return person.age >= 20 && person.age <= 30;
        })
        .sortBy(function (person) {
            return person.age;
        }).value();

    printToConsole("2. Get a list of people aged 20 to 30 inclusive, sort them in ascending order age.", peopleInRange20To30Years);

    var peopleInRange20To30WithUniqueNames = _.chain(people)
        .filter(function (person) {
            return person.age >= 20 && person.age <= 30;
        })
        .sortBy(function (person) {
            return Math.min(person.age);
        })
        .reverse()
        .unique(true, function (person) {
            return person.name;
        })
        .value();

    printToConsole("3. Get a list of unique names of people with age from 20 to 30 inclusive, sort it by descending.", peopleInRange20To30WithUniqueNames);

    var peopleWithSameNameCount = _.chain(people)
        .countBy(function (person) {
            return person.name;
        })
        .value();

    printToConsole("4. Get an object in which the names will be the keys people, and the values are the number of people with this name.", peopleWithSameNameCount);
});