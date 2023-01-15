"use strict";

document.addEventListener("DOMContentLoaded", function () {
    function getElement(typeElement, attributesObject) {
        var element = document.createElement(typeElement);

        for (var name in attributesObject) {
            if (attributesObject.hasOwnProperty(name)) {
                element.setAttribute(name, attributesObject[name]);
            }
        }

        return element;
    }

    function exitEditMode(containerTask, isTaskSaving) {
        var textBoxElement = containerTask.querySelector(".text_field");

        var paragraph = containerTask.querySelector(".task_description");

        if (isTaskSaving) {
            paragraph.textContent = textBoxElement.value;
        }

        hideTooltip(containerTask.firstChild);

        textBoxElement.remove();

        paragraph.style.display = "block";

        var editButton = getElement("input", {
            class: "button",
            type: "button",
            value: "edit"
        });

        var buttons = containerTask.querySelectorAll(".button");

        for (var i = 0; i < 2; i++) {
            buttons[i].remove();
        }

        var buttonsContainer = containerTask.querySelector(".buttons_container");
        buttonsContainer.prepend(editButton);

        editButton.addEventListener("click", editTask);
    }

    function saveTask(event) {
        var taskElement = event.target.parentElement.parentElement;

        var textBoxElement = taskElement.querySelector(".text_field");

        if (!isValidText(textBoxElement.value, textBoxElement)) {
            textBoxElement.value = "";

            return;
        }

        exitEditMode(taskElement, true);
    }

    function cancelTaskEditing(event) {
        var taskElement = event.target.parentElement.parentElement;

        exitEditMode(taskElement, false);
    }

    function editTask(event) {
        var taskElement = event.target.parentElement.parentElement;

        var paragraph = taskElement.querySelector(".task_description");

        var elementEditTask = getElement("input", {
            class: "text_field",
            type: "text",
            value: paragraph.textContent
        });

        paragraph.style.display = "none";

        var textContainer = taskElement.querySelector(".text_container");
        textContainer.prepend(elementEditTask);

        var buttonsContainer = taskElement.querySelector(".buttons_container");

        var editButton = buttonsContainer.querySelector(".button");
        editButton.remove();

        var cancelButton = getElement("input", {
            class: "button",
            type: "button",
            value: "cancel"
        });

        var saveButton = getElement("input", {
            class: "button",
            type: "button",
            value: "save"
        });

        buttonsContainer.prepend(cancelButton);
        buttonsContainer.prepend(saveButton);

        var buttons = buttonsContainer.querySelectorAll(".button");

        buttons[0].addEventListener("click", saveTask);
        buttons[1].addEventListener("click", cancelTaskEditing);
    }

    function deleteTask(event) {
        var taskElement = event.target.parentElement.parentElement;

        taskElement.remove();
    }

    function getNewTask(taskText) {
        var paragraph = getElement("p", { class: "task_description" });
        paragraph.textContent = taskText;

        var textContainer = getElement("div", { class: "text_container" });
        textContainer.append(paragraph);

        var tooltip = document.querySelector(".tooltip").cloneNode(true);
        textContainer.append(tooltip);

        var editButton = getElement("input", {
            class: "button",
            type: "button",
            value: "edit"
        });

        var buttonsContainer = getElement("div", { class: "buttons_container" });
        buttonsContainer.append(editButton);

        var deleteButton = getElement("input", {
            class: "button",
            type: "button",
            value: "delete"
        });

        buttonsContainer.append(deleteButton);

        var container = getElement("div", { class: "container" });
        container.append(textContainer);
        container.append(buttonsContainer);

        return container;
    }

    function showTooltip(textContainer) {
        var tooltip = textContainer.querySelector(".tooltip");
        tooltip.style.display = "block";

        var textField = textContainer.querySelector(".text_field");
        textField.style.border = "1px dashed #C00";

        var buttonsContainer = textContainer.parentElement.querySelector(".buttons_container");
        buttonsContainer.style.justifyContent = "flex-start";
    }

    function hideTooltip(textContainer) {
        var tooltip = textContainer.querySelector(".tooltip");
        tooltip.style.display = "none";

        var textField = textContainer.querySelector(".text_field");
        textField.style.border = "1px dashed #66A";

        var buttonsContainer = textContainer.parentElement.querySelector(".buttons_container");
        buttonsContainer.style.justifyContent = "center";
    }

    function disableInputValidation(event) {
        if (event.target.value.trim().length !== 0) {
            hideTooltip(event.target.parentElement);

            event.target.removeEventListener("input", disableInputValidation);
        }
    }

    function isValidText(taskText, textBoxElement) {
        if (taskText === "" || taskText.trim().length === 0) {
            showTooltip(textBoxElement.parentElement);

            textBoxElement.addEventListener("input", disableInputValidation);

            return false;
        }

        return true;
    }

    function addTask() {
        var textBoxElement = document.querySelector(".text_field");

        var taskText = textBoxElement.value;

        textBoxElement.value = "";

        textBoxElement.focus();

        if (!isValidText(taskText, textBoxElement)) {
            return;
        }

        var task = getNewTask(taskText);
        document.body.appendChild(task);

        var buttons = task.querySelectorAll(".button");

        buttons[0].addEventListener("click", editTask);
        buttons[1].addEventListener("click", deleteTask);
    }

    var addButton = document.querySelector(".button");
    addButton.addEventListener("click", addTask);
});