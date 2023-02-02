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

        hideErrorMessage(taskContainer.find(".text_container"));

        textBoxElement.remove();

        paragraph.show();

        var editButton = getElementWrapper("<input/>", {
            class: "button edit",
            type: "button",
            value: "edit"
        });

        taskContainer.find(".button.save").remove();
        taskContainer.find(".button.cancel").remove();

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
            class: "text_field",
            type: "text",
            value: paragraph.text()
        });

        paragraph.hide();

        var textContainer = taskElement.find(".text_container");
        textContainer.prepend(elementEditTask);

        var buttonsContainer = taskElement.find(".buttons_container");

        buttonsContainer
            .find(".button.edit")
            .remove();

        var cancelButton = getElementWrapper("<input/>", {
            class: "button cancel",
            type: "button",
            value: "cancel"
        });

        var saveButton = getElementWrapper("<input/>", {
            class: "button save",
            type: "button",
            value: "save"
        });

        buttonsContainer
            .prepend(cancelButton)
            .prepend(saveButton);

        buttonsContainer.find(".button.save").click(function (event) {
            var taskElement = $(event.target).closest(".container");

            var textBoxElement = taskElement.find(".text_field");

            if (!validateText(textBoxElement.val(), textBoxElement)) {
                textBoxElement.val("");
                textBoxElement.focus();

                return;
            }

            exitEditMode(taskElement, true);
        });

        buttonsContainer.find(".button.cancel").click(function (event) {
            var taskElement = $(event.target).closest(".container");

            exitEditMode(taskElement, false);
        });

        textContainer.find(".text_field").keyup(function (event) {
            if (event.key === "Enter") {
                $(event.target)
                    .closest(".container")
                    .find(".button.save")
                    .trigger("click");
            }
        });
    }

    function getNewTask(taskText) {
        var paragraph = getElementWrapper("<p></p>", { class: "task_description" });
        paragraph.text(taskText);

        var textContainer = getElementWrapper("<div></div>", { class: "text_container" });

        var editButton = getElementWrapper("<input/>", {
            class: "button edit",
            type: "button",
            value: "edit"
        });

        var deleteButton = getElementWrapper("<input/>", {
            class: "button delete",
            type: "button",
            value: "delete"
        });

        var buttonsContainer = getElementWrapper("<div></div>", { class: "buttons_container" });

        return getElementWrapper("<div></div>", { class: "container" })
            .append(textContainer
                .append(paragraph)
                .append($(".error_message:first").clone()))
            .append(buttonsContainer
                .append(editButton)
                .append(deleteButton));
    }

    function showErrorMessage(textContainer) {
        textContainer
            .find(".error_message")
            .show();

        textContainer
            .find(".text_field")
            .addClass("invalid_input");

        textContainer
            .closest(".container")
            .find(".buttons_container")
            .addClass("align_buttons_to_top");
    }

    function hideErrorMessage(textContainer) {
        textContainer
            .find(".error_message")
            .hide();

        textContainer
            .find(".text_field")
            .removeClass("invalid_input");

        textContainer
            .closest(".container")
            .find(".buttons_container")
            .removeClass("align_buttons_to_top");
    }

    function disableInputValidation(event) {
        if ($(event.target).val().trim().length !== 0) {
            hideErrorMessage($(event.target).closest(".text_container"));

            $(event.target).on("input", disableInputValidation);
        }
    }

    function validateText(taskText, textBoxElement) {
        if (taskText.trim().length === 0) {
            showErrorMessage(textBoxElement.closest(".text_container"));

            textBoxElement.on("input", disableInputValidation);

            return false;
        }

        return true;
    }

    $(".button.add").click(function () {
        var textBoxElement = $(".text_field:first").focus();

        var taskText = textBoxElement.val().trim();

        textBoxElement.val("");

        if (!validateText(taskText, textBoxElement)) {
            return;
        }

        var task = getNewTask(taskText);
        $(".tasks_container").append(task);

        task.find(".button.edit").click(editTask);
        task.find(".button.delete").click(function (event) {
            $(event.target)
                .closest(".container")
                .remove();
        });
    });

    $(".text_field:first").keyup(function (event) {
        if (event.key === "Enter") {
            $(event.target)
                .closest(".container")
                .find(".button.add")
                .trigger("click");
        }
    });
});