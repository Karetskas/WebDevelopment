﻿"use strict";

$(document).ready(function () {
    function getElementWrapper(typeElement, attributesObject) {
        var element = $(typeElement);

        for (var name in attributesObject) {
            if (attributesObject.hasOwnProperty(name)) {
                element.attr(name, attributesObject[name]);
            }
        }

        return element;
    }

    function exitEditMode(taskContainer, isTaskSaving) {
        var textBoxElement = taskContainer.find(".text_field");

        var paragraph = taskContainer.find(".task_description");

        if (isTaskSaving) {
            paragraph.text(textBoxElement.val().trim());
        }

        hideErrorTooltip(taskContainer.find(".text_container"));

        textBoxElement.remove();

        paragraph
            .removeClass("d-none")
            .addClass("d-block");

        var editButton = getElementWrapper("<input/>", {
            class: "d-block w-100 mb-1 btn btn-primary edit",
            type: "button",
            value: "edit"
        });

        taskContainer.find(".btn.save").remove();
        taskContainer.find(".btn.cancel").remove();

        taskContainer
            .find(".buttons_container")
            .prepend(editButton);

        editButton.click(editTask);
    }

    function editTask(event) {
        var taskElement = $(event.target).closest(".container");

        var paragraph = taskElement
            .find(".task_description");

        var elementEditTask = getElementWrapper("<input/>", {
            class: "form-control align-self-center text-white border border-light bg-black text_field",
            type: "text",
            value: paragraph.text()
        });

        paragraph
            .removeClass("d-block")
            .addClass("d-none");

        var textContainer = taskElement.find(".text_container");
        textContainer.prepend(elementEditTask)
            .find(".text_field")
            .focus();

        var buttonsContainer = taskElement.find(".buttons_container");

        buttonsContainer
            .find(".btn.edit")
            .remove();

        var cancelButton = getElementWrapper("<input/>", {
            class: "d-block w-100 mb-1 btn btn-primary cancel",
            type: "button",
            value: "cancel"
        });

        var saveButton = getElementWrapper("<input/>", {
            class: "d-block w-100 mb-1 btn btn-primary save",
            type: "button",
            value: "save"
        });

        buttonsContainer
            .prepend(cancelButton)
            .prepend(saveButton);

        buttonsContainer.find(".btn.save").click(function () {
            var textBoxElement = taskElement.find(".text_field");

            if (!validateText(textBoxElement.val(), textBoxElement)) {
                textBoxElement.val("");
                textBoxElement.focus();

                return;
            }

            exitEditMode(taskElement, true);
        });

        buttonsContainer.find(".btn.cancel").click(function () {
            exitEditMode(taskElement, false);
        });

        textContainer.find(".text_field").keyup(function () {
            if (event.key === "Enter") {
                taskElement.find(".btn.save")
                    .trigger("click");
            }
        });
    }

    function getNewTask(taskText) {
        var paragraph = getElementWrapper("<p></p>", {
            class: "d-block align-self-center w-100 my-1 px-2 py-1 rounded-3 bg-info bg-opacity-50 text-break text-white task_description"
        });
        paragraph.text(taskText);

        var textErrorTooltip = getElementWrapper("<div></div>", {
            class: "d-none text-center invalid-tooltip"
        });
        textErrorTooltip.text("The field must not be empty or contain only spaces!");

        var textContainer = getElementWrapper("<div></div>", {
            class: "d-flex align-self-center justify-content-center position-relative col-8 text_container"
        });

        var row = getElementWrapper("<div></div>", {
            class: "row row-cols-2 gx-2 p-1"
        });

        var editButton = getElementWrapper("<input/>", {
            class: "d-block w-100 mb-1 btn btn-primary edit",
            type: "button",
            value: "edit"
        });

        var deleteButton = getElementWrapper("<input/>", {
            class: "d-block w-100 btn btn-danger delete",
            type: "button",
            value: "delete"
        });

        var buttonsContainer = getElementWrapper("<div></div>", {
            class: "d-flex flex-column justify-content-center col-4 buttons_container"
        });

        return getElementWrapper("<div></div>", { class: "container mb-2 px-1 rounded-3 bg-info bg-opacity-25" })
            .append(row
                .append(textContainer
                    .append(paragraph)
                    .append(textErrorTooltip))
                .append(buttonsContainer
                    .append(editButton)
                    .append(deleteButton)));
    }

    function showErrorTooltip(textContainer) {
        textContainer
            .find(".invalid-tooltip")
            .removeClass("d-none")
            .addClass("d-block");

        textContainer
            .find(".text_field")
            .removeClass("border border-light")
            .addClass("border border-danger")
            .addClass("invalid_text");
    }

    function hideErrorTooltip(textContainer) {
        textContainer
            .find(".invalid-tooltip")
            .removeClass("d-block")
            .addClass("d-none");

        textContainer
            .find(".text_field")
            .removeClass("border border-danger")
            .addClass("border border-light")
            .removeClass("invalid_text");
    }

    function disableInputValidation(event) {
        var currentElement = $(event.target);

        if (currentElement.val().trim().length !== 0) {
            hideErrorTooltip(currentElement.closest(".text_container"));

            currentElement.off("input", disableInputValidation);
        }
    }

    function validateText(taskText, textBoxElement) {
        if (taskText.trim().length === 0) {
            showErrorTooltip(textBoxElement.closest(".text_container"));

            textBoxElement.on("input", disableInputValidation);

            return false;
        }

        return true;
    }

    $(".btn.add").click(function () {
        var textBoxElement = $(".text_field:first").focus();

        var taskText = textBoxElement.val().trim();

        textBoxElement.val("");

        if (!validateText(taskText, textBoxElement)) {
            return;
        }

        var task = getNewTask(taskText);
        $(".tasks_container").append(task);

        task.find(".btn.edit").click(editTask);
        task.find(".btn.delete").click(function (event) {
            $(event.target)
                .closest(".container")
                .remove();
        });
    });

    $(".text_field:first").keyup(function (event) {
        if (event.key === "Enter") {
            $(event.target)
                .closest(".container")
                .find(".btn.add")
                .trigger("click");
        }
    });
});