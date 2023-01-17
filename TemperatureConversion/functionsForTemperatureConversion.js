"use strict";

document.addEventListener("DOMContentLoaded", function () {
    function isCorrectTemperature(temperature, textFieldElement) {
        if (temperature !== "" && temperature.length <= 15 && !isNaN(temperature)) {
            return true;
        }

        textFieldElement.style.backgroundColor = "#E00";

        setTimeout(function () {
            textFieldElement.style.backgroundColor = "#0B0";
        }, 1000);

        return false;
    }

    function getElementsWithResult(temperatureInCelsius, calculationResult) {
        var divContainer = document.createElement("div");
        divContainer.classList.add("flex_container_for_result");

        var divTemperatureInCelsius = document.createElement("div");
        divTemperatureInCelsius.innerHTML = temperatureInCelsius;
        divTemperatureInCelsius.classList.add("temperature_in_celsius");

        var divWithResult = document.createElement("div");
        divWithResult.innerHTML = calculationResult;
        divWithResult.classList.add("result");

        divContainer.append(divTemperatureInCelsius);
        divContainer.append(divWithResult);

        return divContainer;
    }

    function getHexColor(color) {
        var colorsArray = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

        return (colorsArray && colorsArray.length === 4)
            ? "#" +
            ("0" + parseInt(colorsArray[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(colorsArray[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(colorsArray[3], 10).toString(16)).slice(-2)
            : NaN;
    }

    function setElementsColor(containersWithResults) {
        if (containersWithResults === null
            || containersWithResults === undefined
            || {}.toString.call(containersWithResults) !== "[object NodeList]"
            || containersWithResults.length === 0) {
            return;
        }

        var computedStyleForTypeResult = getComputedStyle(containersWithResults[0].querySelector(".temperature_in_celsius"));

        var elementBackgroundColor = computedStyleForTypeResult.backgroundColor;

        var color = parseInt(getHexColor(elementBackgroundColor).slice(1), 16);

        for (var i = 0; i < containersWithResults.length; i++) {
            var typeResultElement = containersWithResults[i].querySelector(".temperature_in_celsius");

            var hexadecimalNumberString = color.toString(16);

            typeResultElement.style.backgroundColor = "#00" + hexadecimalNumberString;

            var result = containersWithResults[i].querySelector(".result");

            result.style.backgroundColor = "#00" + hexadecimalNumberString;

            color -= 13000;
        }
    }

    function getTemperatureInFahrenheit(temperatureInCelsius) {
        var result = 1.8 * parseFloat(temperatureInCelsius) + 32;

        return Math.round(result * 100) / 100;
    }

    function getTemperatureInKelvin(temperatureInCelsius) {
        var result = parseFloat(temperatureInCelsius) + 273.15;

        return Math.round(result * 100) / 100;
    }

    var elementsWithResultCount = 0;

    function convertTemperature(event) {
        var temperatureInputField = document.querySelector(".text_box_control");
        var currentCorrectTemperature = temperatureInputField.value.trim();

        if (!isCorrectTemperature(currentCorrectTemperature, temperatureInputField)) {
            return;
        }

        var calculationResult;
        var elementWithResult;

        var temperatureCelsiusText = "Celsius<br />" + currentCorrectTemperature;

        if (event.currentTarget.name === "conversion_to_degrees_fahrenheit") {
            calculationResult = getTemperatureInFahrenheit(currentCorrectTemperature);

            elementWithResult = getElementsWithResult(temperatureCelsiusText, "Fahrenheit<br />" + calculationResult);
        } else {
            calculationResult = getTemperatureInKelvin(currentCorrectTemperature);

            elementWithResult = getElementsWithResult(temperatureCelsiusText, "Kelvin<br />" + calculationResult);
        }

        var resultHistory = document.querySelector(".result_history");
        resultHistory.textContent = "History of result:";
        resultHistory.after(elementWithResult);

        elementsWithResultCount++;

        var containersWithResultsCollection = document.querySelectorAll(".flex_container_for_result");

        setElementsColor(containersWithResultsCollection);

        var maxResultsCount = 5;

        if (elementsWithResultCount > maxResultsCount) {
            containersWithResultsCollection[containersWithResultsCollection.length - 1].remove();
        }
    }

    var buttons = document.querySelectorAll(".button");

    buttons.forEach(function (button) {
        button.addEventListener("click", convertTemperature);
    });
});