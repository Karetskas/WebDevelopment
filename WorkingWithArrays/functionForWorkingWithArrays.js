(function () {
    var array = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Array before sorted: [" + array.join(", ") + "].",
        "Array after sorted: [" + getDescendingSort(array).join(", ") + "].");

    var array1 = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Current array: [" + array1.join(", ") + "].",
        "First 5 array items: [" + getItemsFromBeginning(array1, 5).join(", ") + "].");

    var array2 = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Current array: [" + array2.join(", ") + "].",
        "Last 5 array items: [" + getItemsFromEnd(array2, 5).join(", ") + "].");

    var array3 = [12, 1, 11, 7, 3, 15, 2, 9, 3, 13, 10, 8, 4, 5, 2, 14, 6];
    printToConsole(
        "Current array: [" + array3.join(", ") + "].",
        "Sum of even items of array: " + getEvenItemsSum(array3));

    printToConsole("Array of numbers from 1 to 100 elements: [" + getOneHundredItemsArray().join(", ") + "].");

    printToConsole("List of squares of even numbers: [" + getEvenNumbersSquaresList(getOneHundredItemsArray()).join(", ") + "].");

    function printToConsole() {
        console.log(getStringSeparator());

        var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));

        args.forEach(function (item) {
            return console.log(item);
        });

        console.log(getStringSeparator());
    }

    function getStringSeparator() {
        return new Array(99).fill("#").reduce(function (total, item) {
            return total + item;
        }, "#");
    }

    function getDescendingSort(sortableArray) {
        if (sortableArray === null
            || sortableArray === undefined
            || Array.isArray(sortableArray) === false
            || sortableArray.some((item) => typeof (item) !== "number")) {
            return NaN;
        }

        return sortableArray.sort(function (element2, element1) {
            return element1 - element2;
        });
    }

    function getItemsFromBeginning(currentArray, elementsCount) {
        if (currentArray === null
            || currentArray === undefined
            || Array.isArray(currentArray) === false) {
            return NaN;
        }

        if (elementsCount === null
            || elementsCount === undefined
            || typeof (elementsCount) !== "number"
            || Math.floor(elementsCount) < 0
            || Math.floor(elementsCount) >= currentArray.length) {
            return NaN;
        }

        return currentArray.filter(function (item, index) {
            return index < elementsCount;
        });
    }

    function getItemsFromEnd(currentArray, elementsCount) {
        if (currentArray === null
            || currentArray === undefined
            || Array.isArray(currentArray) === false) {
            return NaN;
        }

        if (elementsCount === null
            || elementsCount === undefined
            || typeof (elementsCount) !== "number"
            || Math.floor(elementsCount) < 0
            || Math.floor(elementsCount) >= currentArray.length) {
            return NaN;
        }

        return currentArray.filter(function (item, index) {
            return index >= currentArray.length - elementsCount;
        });
    }

    function getEvenItemsSum(currentArray) {
        if (currentArray === null
            || currentArray === undefined
            || Array.isArray(currentArray) === false
            || currentArray.some((item) => typeof (item) !== "number")) {
            return NaN;
        }

        return currentArray.filter(function (item) {
            return item % 2 === 0;
        }).reduce(function (total, item) {
            return total + item;
        }, 0);
    }

    function getOneHundredItemsArray() {
        return new Array(100).fill(0).map(function (item, index) {
            return index + 1;
        });
    }

    function getEvenNumbersSquaresList(currentArray) {
        return currentArray.filter(function (item) {
            return item % 2 === 0;
        }).map(function (item) {
            return item * item;
        });
    }
})();