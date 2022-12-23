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

    function isNotNumericArray(currentArray) {
        return Array.isArray(currentArray) === false
            || currentArray.some(function (item) {
                return typeof (item) !== "number";
            });
    }

    function sortDescending(sortableArray) {
        if (isNotNumericArray(sortableArray)) {
            return null;
        }

        return sortableArray.sort(function (element1, element2) {
            return element2 - element1;
        });
    }

    var array = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Array before sorted: [" + array.join(", ") + "].",
        "Array after sorted: [" + sortDescending(array).join(", ") + "].");

    function isArrayWithRequestedElementsCount(currentArray, elementsCount) {
        return Array.isArray(currentArray) === true
            && elementsCount !== null
            && elementsCount !== undefined
            && typeof (elementsCount) === "number"
            && Math.floor(elementsCount) >= 0
            && Math.floor(elementsCount) < currentArray.length;
    }

    function getItemsFromBeginning(currentArray, elementsCount) {
        if (isArrayWithRequestedElementsCount(currentArray, elementsCount) === false) {
            return null;
        }

        return currentArray.slice(0, elementsCount);
    }

    var array1 = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Current array: [" + array1.join(", ") + "].",
        "First 5 array items: [" + getItemsFromBeginning(array1, 5).join(", ") + "].");

    function getItemsFromEnd(currentArray, elementsCount) {
        if (isArrayWithRequestedElementsCount(currentArray, elementsCount) === false) {
            return null;
        }

        return currentArray.slice(currentArray.length - elementsCount);
    }

    var array2 = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Current array: [" + array2.join(", ") + "].",
        "Last 5 array items: [" + getItemsFromEnd(array2, 5).join(", ") + "].");

    function getEvenNumbersSum(currentArray) {
        if (isNotNumericArray(currentArray)) {
            return null;
        }

        return currentArray.filter(function (item) {
            return item % 2 === 0;
        }).reduce(function (total, item) {
            return total + item;
        }, 0);
    }

    var array3 = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Current array: [" + array3.join(", ") + "].",
        "Sum of even items of array: " + getEvenNumbersSum(array3));

    function getOneHundredNumbersArray() {
        var numbersArray = [];

        for (var i = 0; i < 100; i++) {
            numbersArray.push(i + 1);
        }

        return numbersArray;
    }

    printToConsole("Array of numbers from 1 to 100 elements: [" + getOneHundredNumbersArray().join(", ") + "].");

    function getEvenNumbersSquaresArray(currentArray) {
        if (isNotNumericArray(currentArray)) {
            return null;
        }

        return currentArray.filter(function (item) {
            return item % 2 === 0;
        }).map(function (item) {
            return item * item;
        });
    }

    printToConsole("List of squares of even numbers: [" + getEvenNumbersSquaresArray(getOneHundredNumbersArray()).join(", ") + "].");
})();