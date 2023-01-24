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
            class: "text_field",
            type: "text",
            value: paragraph.text()
        });

        paragraph.hide();

        taskElement
            .find(".text_container")
            .prepend(elementEditTask);

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

        buttonsContainer.find(".button.save").click(saveTask);
        buttonsContainer.find(".button.cancel").click(cancelTaskEditing);
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
                .append($(".tooltip:first").clone()))
            .append(buttonsContainer
                .append(editButton)
                .append(deleteButton));
    }

    function showTooltip(textContainer) {
        textContainer
            .find(".tooltip")
            .show();

        textContainer
            .find(".text_field")
            .addClass("invalid_input");

        textContainer
            .parent()
            .find(".buttons_container")
            .addClass("align_buttons_to_top");
    }

    function hideTooltip(textContainer) {
        textContainer
            .find(".tooltip")
            .hide();

        textContainer
            .find(".text_field")
            .removeClass("invalid_input");

        textContainer
            .parent()
            .find(".buttons_container")
            .removeClass("align_buttons_to_top");
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

        task.find(".button.edit").click(editTask);
        task.find(".button.delete").click(function (event) {
            $(event.target)
                .parent()
                .parent()
                .remove();
        });
    }

    $(".button.add").click(addTask);
});