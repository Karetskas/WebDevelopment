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

    function exitEditMode(taskContainer, isTaskSaving) {
        var textBoxElement = taskContainer.querySelector(".text_field");

        var paragraph = taskContainer.querySelector(".task_description");

        if (isTaskSaving) {
            paragraph.textContent = textBoxElement.value.trim();
        }

        hideErrorMessage(taskContainer.firstChild);

        textBoxElement.remove();

        paragraph.style.display = "block";

        var editButton = getElement("input", {
            class: "button edit",
            type: "button",
            value: "edit"
        });

        taskContainer.querySelector(".button.save").remove();
        taskContainer.querySelector(".button.cancel").remove();

        var buttonsContainer = taskContainer.querySelector(".buttons_container");
        buttonsContainer.prepend(editButton);

        editButton.addEventListener("click", editTask);
    }

    function editTask(event) {
        var taskElement = event.target.closest(".container");

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

        buttonsContainer.querySelector(".button.save").addEventListener("click", function (event) {
            var taskElement = event.target.closest(".container");

            var textBoxElement = taskElement.querySelector(".text_field");

            if (!validateText(textBoxElement.value, textBoxElement)) {
                textBoxElement.value = "";

                return;
            }

            exitEditMode(taskElement, true);
        });

        buttonsContainer.querySelector(".button.cancel").addEventListener("click", function (event) {
            var taskElement = event.target.closest(".container");

            exitEditMode(taskElement, false);
        });

        textContainer.querySelector(".text_field").addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                event.target.closest(".container")
                    .querySelector(".button.save")
                    .click();
            }
        });
    }

    function getNewTask(taskText) {
        var paragraph = getElement("p", { class: "task_description" });
        paragraph.textContent = taskText;

        var textContainer = getElement("div", { class: "text_container" });
        textContainer.append(paragraph);

        var errorMessage = document.querySelector(".error_message").cloneNode(true);
        textContainer.append(errorMessage);

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

    function showErrorMessage(textContainer) {
        var errorMessage = textContainer.querySelector(".error_message");
        errorMessage.style.display = "block";

        var textField = textContainer.querySelector(".text_field");
        textField.classList.add("invalid_input");

        var buttonsContainer = textContainer.parentElement.querySelector(".buttons_container");
        buttonsContainer.classList.add("align_buttons_to_top");
    }

    function hideErrorMessage(textContainer) {
        var errorMessage = textContainer.querySelector(".error_message");
        errorMessage.style.display = "none";

        var textField = textContainer.querySelector(".text_field");
        textField.classList.remove("invalid_input");

        var buttonsContainer = textContainer.parentElement.querySelector(".buttons_container");
        buttonsContainer.classList.remove("align_buttons_to_top");
    }

    function disableInputValidation(event) {
        if (event.target.value.trim().length !== 0) {
            hideErrorMessage(event.target.parentElement);

            event.target.removeEventListener("input", disableInputValidation);
        }
    }

    function validateText(taskText, textBoxElement) {
        if (taskText.trim().length === 0) {
            showErrorMessage(textBoxElement.parentElement);

            textBoxElement.addEventListener("input", disableInputValidation);

            return false;
        }

        return true;
    }

    document.querySelector(".button.add").addEventListener("click", function () {
        var textBoxElement = document.querySelector(".text_field");

        var taskText = textBoxElement.value.trim();

        textBoxElement.value = "";

        textBoxElement.focus();

        if (!validateText(taskText, textBoxElement)) {
            return;
        }

        var task = getNewTask(taskText);
        document.querySelector(".tasks_container").append(task);

        task.querySelector(".button.edit").addEventListener("click", editTask);

        task.querySelector(".button.delete").addEventListener("click", function (event) {
            var taskElement = event.target.closest(".container");

            taskElement.remove();
        });
    });

    document.querySelector(".text_field").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            event.target
                .closest(".container")
                .querySelector(".button.add")
                .click();
        }
    });
});