"use strict";

(function () {
    var countriesArray = [
        {
            name: "India",
            citiesArray: [
                {
                    name: "Mumbai",
                    population: 12422373
                }
            ]
        },
        {
            name: "Lesotho",
            citiesArray: [
                {
                    name: "Maseru",
                    population: 227880
                },
                {
                    name: "Hlotse",
                    population: 47894
                },
                {
                    name: "Mafeten",
                    population: 36000
                }
            ]
        },
        {
            name: "USA",
            citiesArray: []
        },
        {
            name: "Gabon",
            citiesArray: [
                {
                    name: "Libreville",
                    population: 703939
                },
                {
                    name: "Port-Gentil",
                    population: 136462
                },
                {
                    name: "Oyem",
                    population: 21143
                }
            ]
        },
        {
            name: "Togo",
            citiesArray: [
                {
                    name: "Lome",
                    population: 729258
                },
                {
                    name: "Sokode",
                    population: 117811
                }
            ]
        }
    ];

    var countriesWithMaxCitiesCount = getCountriesObjectsListWithMaxCitiesCount(countriesArray)
        .map(function (element) {
            return element.name;
        });


    console.log("List of countries with the maximum count of cities: [" + countriesWithMaxCitiesCount.join(", ") + "].");

    var lineSeparator = new Array(99).fill("#").reduce(function (row, symbol) {
        return row + symbol;
    }, "#");

    console.log(lineSeparator);

    console.log("List of population of countries: ");

    var countriesTotalPopulation = getObjectWithCountriesTotalPopulation(countriesArray);

    for (var country in countriesTotalPopulation) {
        if (Object.prototype.hasOwnProperty.call(countriesTotalPopulation, country)) {
            console.log("\"" + country + "\": " + countriesTotalPopulation[country] + " peoples");
        }
    }

    function getCountriesObjectsListWithMaxCitiesCount(array) {
        if (array === null
            || array === undefined
            || Array.isArray(array) === false) {
            return NaN;
        }

        var sortingCountriesByCitiesCount = array.sort(function (a, b) {
            return b.citiesArray.length - a.citiesArray.length;
        });

        var citiesMaxCount = sortingCountriesByCitiesCount[0].citiesArray.length;

        return sortingCountriesByCitiesCount.filter(function (element) {
            return element.citiesArray.length === citiesMaxCount;
        });
    }

    function getObjectWithCountriesTotalPopulation(array) { 
        if (array === null
            || array === undefined
            || Array.isArray(array) === false) {
            return NaN;
        }

        var objectWorld = {};

        array.forEach(function (element) {
            var totalPopulation = element.citiesArray.reduce(function (total, populationProperty) {
                return total + populationProperty.population;
            }, 0);

            objectWorld[element.name] = totalPopulation;
        });

        return objectWorld;
    }
})();