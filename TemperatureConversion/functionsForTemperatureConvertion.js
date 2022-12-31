"use strict";

(function () {
    var temperatureInputField = document.querySelector(".text_box_control");

    var currentCorrectTemperature = temperatureInputField.value;
    var isGreen = true;

    function checkTemperatureKeyboardInput() {
        if (/^-?(0|[0-9]{1,16})+\.?([0-9]{1,2})?$/.test(temperatureInputField.value) === false
            || temperatureInputField.value.length > 15) {

            if (isGreen) {
                var timerId = setTimeout(function changeBackground() {

                    if (isGreen) {
                        temperatureInputField.style.backgroundColor = "#E00";

                        isGreen = false;
                    } else {
                        temperatureInputField.style.backgroundColor = "#0B0";

                        isGreen = true;
                    }

                    timerId = setTimeout(changeBackground, 1000);
                }, 0);

                setTimeout(function () {
                    clearInterval(timerId);
                }, 1010);
            }

            temperatureInputField.value = currentCorrectTemperature;

            return;
        }

        currentCorrectTemperature = temperatureInputField.value;
    }

    temperatureInputField.addEventListener("input", checkTemperatureKeyboardInput);

    function getElementsWithResult(name, calculationResult) {
        var divContainer = document.createElement("div");
        divContainer.classList.add("flex_container_for_result");

        var divTypeResult = document.createElement("div");
        divTypeResult.textContent = name;
        divTypeResult.classList.add("typeResult");

        var divWithResult = document.createElement("div");
        divWithResult.textContent = calculationResult;
        divWithResult.classList.add("result");

        divContainer.prepend(divTypeResult);
        divContainer.append(divWithResult);

        return divContainer;
    }

    function getColorToHex(color) {
        var colorsArray = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

        return (colorsArray && colorsArray.length === 4) ? "#" +
            ("0" + parseInt(colorsArray[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(colorsArray[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(colorsArray[3], 10).toString(16)).slice(-2) : NaN;
    };

    function setColorForElements(containersWithResults) {
        if (containersWithResults === null
            || containersWithResults === undefined
            || {}.toString.call(containersWithResults) !== "[object NodeList]"
            || containersWithResults.length === 0) {
            return;
        }

        var computedStyleForTypeResult = getComputedStyle(containersWithResults[0].querySelector(".typeResult"));

        var elementBackgroundColor = computedStyleForTypeResult.backgroundColor;

        var color = parseInt(getColorToHex(elementBackgroundColor).slice(1), 16);

        for (var i = 0; i < containersWithResults.length; i++) {
            var typeResultElement = containersWithResults[i].querySelector(".typeResult");

            var hexadecimalNumberString = color.toString(16);

            typeResultElement.style.backgroundColor = "#00" + hexadecimalNumberString;

            var result = containersWithResults[i].querySelector(".result");

            result.style.backgroundColor = "#00" + hexadecimalNumberString;

            color -= 13000;
        }
    }

    function getTemperatureInFahrenheit() {
        var result = 1.8 * parseFloat(currentCorrectTemperature) + 32;

        return Math.round(result * 100) / 100;
    }

    function getTemperatureInKelvin() {
        var result = parseFloat(currentCorrectTemperature) + 273.15;

        return Math.round(result * 100) / 100;
    }

    var elementsWithResultCount = 0;

    function outputToScreen(event) {
        var calculationResult;
        var elementWithResult;

        if (event.currentTarget.name === "conversion_to_degrees_fahrenheit") {
            calculationResult = getTemperatureInFahrenheit();

            elementWithResult = getElementsWithResult("Fahrenheit:", calculationResult);
        } else {
            calculationResult = getTemperatureInKelvin();

            elementWithResult = getElementsWithResult("Kelvin:", calculationResult);
        }

        var dividingLinesCollection = document.querySelectorAll(".dividing_line");
        dividingLinesCollection[dividingLinesCollection.length - 1].after(elementWithResult);

        elementsWithResultCount++;

        var containersWithResultsCollection = document.querySelectorAll(".flex_container_for_result");

        setColorForElements(containersWithResultsCollection);

        if (elementsWithResultCount > 5) {
            containersWithResultsCollection[containersWithResultsCollection.length - 1].remove();
        }
    }

    var fahrenheitConversionButton = document.querySelector(".fahrenheit_conversion_button");
    fahrenheitConversionButton.addEventListener("click", outputToScreen);

    var kelvinConversionButton = document.querySelector(".kelvin_conversion_button");
    kelvinConversionButton.addEventListener("click", outputToScreen);
})();