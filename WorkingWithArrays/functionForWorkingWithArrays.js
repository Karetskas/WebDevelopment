"use strict";

(function () {
    function printToConsole() {
        console.log(getStringSeparator());

        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));

        args.forEach(function (item) {
            console.log(item);
        });

        console.log(getStringSeparator());
    }

    function getStringSeparator() {
        return "#".repeat(100);
    }

    function isNumericArray(array) {
        return Array.isArray(array)
            && array.every(function (item) {
                return typeof (item) === "number";
            });
    }

    function sortDescending(sortableArray) {
        if (!isNumericArray(sortableArray)) {
            return null;
        }

        return sortableArray.sort(function (element1, element2) {
            return element2 - element1;
        });
    }

    var array1 = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Array before sorted: [" + array1.join(", ") + "].",
        "Array after sorted: [" + sortDescending(array1).join(", ") + "].");

    function isArrayWithRequestedElementsCount(array, elementsCount) {
        return Array.isArray(array) === true
            && elementsCount !== null
            && elementsCount !== undefined
            && typeof (elementsCount) === "number"
            && Math.floor(elementsCount) >= 0
            && Math.floor(elementsCount) < array.length;
    }

    function getItemsFromBeginning(array, elementsCount) {
        if (!isArrayWithRequestedElementsCount(array, elementsCount)) {
            return null;
        }

        return array.slice(0, elementsCount);
    }

    var array2 = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Current array: [" + array2.join(", ") + "].",
        "First 5 array items: [" + getItemsFromBeginning(array2, 5).join(", ") + "].");

    function getItemsFromEnd(array, elementsCount) {
        if (!isArrayWithRequestedElementsCount(array, elementsCount)) {
            return null;
        }

        return array.slice(array.length - elementsCount);
    }

    var array3 = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Current array: [" + array3.join(", ") + "].",
        "Last 5 array items: [" + getItemsFromEnd(array3, 5).join(", ") + "].");

    function getEvenNumbersSum(array) {
        if (!isNumericArray(array)) {
            return null;
        }

        return array.filter(function (item) {
            return item % 2 === 0;
        }).reduce(function (evenNumbersSum, item) {
            return evenNumbersSum + item;
        }, 0);
    }

    var array4 = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Current array: [" + array4.join(", ") + "].",
        "Sum of even items of array: " + getEvenNumbersSum(array4));

    function getOneHundredNumbersArray() {
        var numbersArray = [];

        for (var i = 1; i <= 100; i++) {
            numbersArray.push(i);
        }

        return numbersArray;
    }

    printToConsole("Array of numbers from 1 to 100 elements: [" + getOneHundredNumbersArray().join(", ") + "].");

    function getEvenNumbersSquaresArray(array) {
        if (!isNumericArray(array)) {
            return null;
        }

        return array.filter(function (item) {
            return item % 2 === 0;
        }).map(function (item) {
            return item * item;
        });
    }

    printToConsole("List of squares of even numbers: [" + getEvenNumbersSquaresArray(getOneHundredNumbersArray()).join(", ") + "].");
})();