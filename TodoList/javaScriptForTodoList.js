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
            paragraph.textContent = textBoxElement.value.trim();
        }

        hideTooltip(containerTask.firstChild);

        textBoxElement.remove();

        paragraph.style.display = "block";

        var editButton = getElement("input", {
            class: "button edit",
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

        if (!validateText(textBoxElement.value, textBoxElement)) {
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

        var editButton = buttonsContainer.querySelector(".button.edit");
        editButton.remove();

        var cancelButton = getElement("input", {
            class: "button cancel",
            type: "button",
            value: "cancel"
        });

        var saveButton = getElement("input", {
            class: "button save",
            type: "button",
            value: "save"
        });

        buttonsContainer.prepend(cancelButton);
        buttonsContainer.prepend(saveButton);

        buttonsContainer.querySelector(".button.save").addEventListener("click", saveTask);
        buttonsContainer.querySelector(".button.cancel").addEventListener("click", cancelTaskEditing);
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
            class: "button edit",
            type: "button",
            value: "edit"
        });

        var buttonsContainer = getElement("div", { class: "buttons_container" });
        buttonsContainer.append(editButton);

        var deleteButton = getElement("input", {
            class: "button delete",
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
        textField.classList.add("invalid_input");

        var buttonsContainer = textContainer.parentElement.querySelector(".buttons_container");
        buttonsContainer.classList.add("align_buttons_to_top");
    }

    function hideTooltip(textContainer) {
        var tooltip = textContainer.querySelector(".tooltip");
        tooltip.style.display = "none";

        var textField = textContainer.querySelector(".text_field");
        textField.classList.remove("invalid_input");

        var buttonsContainer = textContainer.parentElement.querySelector(".buttons_container");
        buttonsContainer.classList.remove("align_buttons_to_top");
    }

    function disableInputValidation(event) {
        if (event.target.value.trim().length !== 0) {
            hideTooltip(event.target.parentElement);

            event.target.removeEventListener("input", disableInputValidation);
        }
    }

    function validateText(taskText, textBoxElement) {
        if (taskText === "" || taskText.trim().length === 0) {
            showTooltip(textBoxElement.parentElement);

            textBoxElement.addEventListener("input", disableInputValidation);

            return false;
        }

        return true;
    }

    function addTask() {
        var textBoxElement = document.querySelector(".text_field");

        var taskText = textBoxElement.value.trim();

        textBoxElement.value = "";

        textBoxElement.focus();

        if (!validateText(taskText, textBoxElement)) {
            return;
        }

        var task = getNewTask(taskText);
        document.body.appendChild(task);

        task.querySelector(".button.edit").addEventListener("click", editTask);
        task.querySelector(".button.delete").addEventListener("click", deleteTask);
    }

    var addButton = document.querySelector(".button.add");
    addButton.addEventListener("click", addTask);
});