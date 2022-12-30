"use strict";

(function () {
    var countries = [
        {
            name: "India",
            cities: [
                {
                    name: "Mumbai",
                    population: 12422373
                }
            ]
        },
        {
            name: "Lesotho",
            cities: [
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
            cities: []
        },
        {
            name: "Gabon",
            cities: [
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
            cities: [
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

    var test = [
        {
            name: "Togo",
            cities: [
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

    var countriesWithMaxCitiesCount = getCountriesWithMaxCitiesCount(test)
        .map(function (country) {
            return country.name;
        });

    console.log("List of countries with the maximum count of cities: [" + countriesWithMaxCitiesCount.join(", ") + "].");

    console.log("#".repeat(100));

    console.log("List of population of countries: ");

    var countriesTotalPopulation = getObjectWithCountriesTotalPopulation(countries);

    for (var country in countriesTotalPopulation) {
        if (countriesTotalPopulation.hasOwnProperty(country)) {
            console.log("\"" + country + "\": " + countriesTotalPopulation[country] + " peoples");
        }
    }

    function getCountriesWithMaxCitiesCount(countryObjectsArray) {
        var maxCitiesCount = -Infinity;

        countryObjectsArray.forEach(function (country) {
            if (country.cities.length > maxCitiesCount) {
                maxCitiesCount = country.cities.length;
            }
        });

        return countryObjectsArray.filter(function (country) {
            return country.cities.length === maxCitiesCount;
        });
    }

    function getObjectWithCountriesTotalPopulation(countryObjectsArray) {
        var countriesPopulation = {};

        countryObjectsArray.forEach(function (country) {
            var countryPopulation = country.cities.reduce(function (totalPopulation, city) {
                return totalPopulation + city.population;
            }, 0);

            countriesPopulation[country.name] = countryPopulation;
        });

        return countriesPopulation;
    }
})();