"use strict";

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

        hideTooltip(taskContainer.find(".text_container"));

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

    function saveTask(event) {
        var taskElement = $(event.target).parent().parent();

        var textBoxElement = taskElement.find(".text_field");

        if (!validateText(textBoxElement.val(), textBoxElement)) {
            textBoxElement.val("");
            textBoxElement.focus();

            return;
        }

        exitEditMode(taskElement, true);
    }

    function cancelTaskEditing(event) {
        var taskElement = $(event.target)
            .parent()
            .parent();

        exitEditMode(taskElement, false);
    }

    function editTask(event) {
        var taskElement = $(event.target)
            .parent()
            .parent();

        var paragraph = taskElement
            .find(".task_description");

        var elementEditTask = getElementWrapper("<input/>", {
            class: "form-control align-self-center text-white border border-light bg-black text_field valid_text",
            type: "text",
            value: paragraph.text()
        });

        paragraph
            .removeClass("d-block")
            .addClass("d-none");

        taskElement
            .find(".text_container")
            .prepend(elementEditTask);

        taskElement
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

        buttonsContainer.find(".btn.save").click(saveTask);
        buttonsContainer.find(".btn.cancel").click(cancelTaskEditing);
    }

    function getNewTask(taskText) {
        var paragraph = getElementWrapper("<p></p>", {
            class: "d-block align-self-center w-100 my-1 px-2 py-1 rounded-3 bg-info bg-opacity-50 text-break text-white task_description"
        });
        paragraph.text(taskText);

        var textTooltip = getElementWrapper("<div></div>", {
            class: "d-none text-center invalid-tooltip"
        });
        textTooltip.text("The field must not be empty or contain only spaces!");

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
                    .append(textTooltip))
                .append(buttonsContainer
                    .append(editButton)
                    .append(deleteButton)));
    }

    function showTooltip(textContainer) {
        textContainer
            .find(".invalid-tooltip")
            .removeClass("d-none")
            .addClass("d-block");

        textContainer
            .find(".text_field")
            .removeClass("border border-light")
            .addClass("border border-danger")
            .removeClass("valid_text")
            .addClass("invalid_text");
    }

    function hideTooltip(textContainer) {
        textContainer
            .find(".invalid-tooltip")
            .removeClass("d-block")
            .addClass("d-none");

        textContainer
            .find(".text_field")
            .removeClass("border border-danger")
            .addClass("border border-light")
            .removeClass("invalid_text")
            .addClass("valid_text");
    }

    function disableInputValidation(event) {
        if ($(event.target).val().trim().length !== 0) {
            hideTooltip($(event.target).parent());

            event.target.removeEventListener("input", disableInputValidation);
        }
    }

    function validateText(taskText, textBoxElement) {
        if (taskText === "" || taskText.trim().length === 0) {
            showTooltip(textBoxElement.parent());

            textBoxElement[0].addEventListener("input", disableInputValidation);

            return false;
        }

        return true;
    }

    function addTask() {
        var textBoxElement = $(".text_field:first").focus();

        var taskText = textBoxElement.val().trim();

        textBoxElement.val("");

        if (!validateText(taskText, textBoxElement)) {
            return;
        }

        var task = getNewTask(taskText);
        $(".task_container").append(task);

        task.find(".btn.edit").click(editTask);
        task.find(".btn.delete").click(function (event) {
            $(event.target)
                .parent()
                .parent()
                .parent()
                .remove();
        });
    }

    $(".btn.add").click(addTask);
});