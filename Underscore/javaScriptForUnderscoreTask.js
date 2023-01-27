"use strict";

(function () {
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

    function printObjectsArrayToConsole(collection) {
        _.each(collection, function (person) {
            var text = "";

            for (var property in person) {
                if (person.hasOwnProperty(property)) {
                    text += property + ": " + person[property] + "; ";
                }
            }
                
            console.log(text.slice(0, text.length - 2));
        });
    }

    function printArrayToConsole(collection) {
        collection.forEach(function(item) {
            console.log(item);
        });
    }

    function printObjectToConsole(collection) {
        for (var property in collection) {
            if (collection.hasOwnProperty(property)) {
                console.log(property + ": " + collection[property] + " people");
            }
        }
    }

    function printToConsole(message, collection) {
        console.log("#".repeat(50));
        console.log(message);

        if (_.size(collection) === 0) {
            return;
        }

        if (_.isArray(collection)) {
            if (_.isObject(collection[0])) {
                printObjectsArrayToConsole(collection);
            } else {
                printArrayToConsole(collection);
            }
        } else {
            printObjectToConsole(collection);
        }

        console.log("#".repeat(50));
    }

    var agesSum = _.reduce(people, function (peopleAgesSum, person) {
        return peopleAgesSum + person.age;
    }, 0);

    var peopleAverageAge = (agesSum / _.size(people)).toFixed(2);

    printToConsole("1. Calculate the average age of all people. Average age of all people = " + peopleAverageAge, []);

    var peopleInRange20To30Years = _.chain(people)
        .filter(function (person) {
            return person.age >= 20 && person.age <= 30;
        })
        .sortBy("age")
        .value();

    printToConsole("2. Get a list of people aged 20 to 30 inclusive, sort them in ascending order age.", peopleInRange20To30Years);

    var peopleInRange20To30WithUniqueNames = _.chain(people)
        .filter(function (person) {
            return person.age >= 20 && person.age <= 30;
        })
        .pluck("name")
        .unique()
        .sortBy()
        .reverse()
        .value();

    printToConsole("3. Get a list of unique names of people with age from 20 to 30 inclusive, sort it by descending.", peopleInRange20To30WithUniqueNames);

    var peopleWithSameNameCount = _.countBy(people, "name");

    printToConsole("4. Get an object in which the names will be the keys people, and the values are the number of people with this name.", peopleWithSameNameCount);
})();