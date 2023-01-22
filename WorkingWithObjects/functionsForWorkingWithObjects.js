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

    var countriesWithMaxCitiesCount = getCountriesWithMaxCitiesCount(countries)
        .map(function (country) {
            return country.name;
        });

    console.log("List of countries with the maximum count of cities: [" + countriesWithMaxCitiesCount.join(", ") + "].");

    console.log("#".repeat(100));

    console.log("List of population of countries: ");

    var countriesPopulation = getObjectWithCountriesPopulation(countries);

    for (var countryName in countriesPopulation) {
        if (countriesPopulation.hasOwnProperty(countryName)) {
            console.log("\"" + countryName + "\": " + countriesPopulation[countryName] + " peoples");
        }
    }

    function getCountriesWithMaxCitiesCount(countriesArray) {
        var maxCitiesCount = countriesArray.reduce(function (citiesMaxCount, country) {
            return Math.max(country.cities.length, citiesMaxCount);
        }, 0);

        return countriesArray.filter(function (country) {
            return country.cities.length === maxCitiesCount;
        });
    }

    function getObjectWithCountriesPopulation(countriesArray) {
        var countriesPopulation = {};

        countriesArray.forEach(function (country) {
            var countryPopulation = country.cities.reduce(function (totalPopulation, city) {
                return totalPopulation + city.population;
            }, 0);

            countriesPopulation[country.name] = countryPopulation;
        });

        return countriesPopulation;
    }
})();