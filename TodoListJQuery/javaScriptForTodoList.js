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

    function exitEditMode(containerTask, isTaskSaving) {
        var textBoxElement = containerTask.find(".text_field");

        var paragraph = containerTask.find(".task_description");

        if (isTaskSaving) {
            paragraph.text(textBoxElement.val());
        }

        hideTooltip(containerTask.find(".text_container"));

        textBoxElement.remove();

        paragraph.css("display", "block");

        var editButton = getElementWrapper("<input/>", {
            class: "button",
            type: "button",
            value: "edit"
        });

        var buttons = containerTask.find(".button");

        for (var i = 0; i < 2; i++) {
            buttons.eq(i).remove();
        }

        containerTask
            .find(".buttons_container")
            .prepend(editButton);

        editButton.on("click", editTask);
    }

    function saveTask(event) {
        var taskElement = $(event.target).parent().parent();

        var textBoxElement = taskElement.find(".text_field");

        if (!isValidText(textBoxElement.val(), textBoxElement)) {
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

        paragraph.css("display", "none");

        taskElement
            .find(".text_container")
            .prepend(elementEditTask);

        var buttonsContainer = taskElement.find(".buttons_container");

        buttonsContainer
            .find(".button:first")
            .remove();

        var cancelButton = getElementWrapper("<input/>", {
            class: "button",
            type: "button",
            value: "cancel"
        });

        var saveButton = getElementWrapper("<input/>", {
            class: "button",
            type: "button",
            value: "save"
        });

        buttonsContainer
            .prepend(cancelButton)
            .prepend(saveButton);

        var buttons = buttonsContainer.find(".button");

        buttons.eq(0).on("click", saveTask);
        buttons.eq(1).on("click", cancelTaskEditing);
    }

    function getNewTask(taskText) {
        var paragraph = getElementWrapper("<p></p>", { class: "task_description" });
        paragraph.text(taskText);

        var textContainer = getElementWrapper("<div></div>", { class: "text_container" });

        var editButton = getElementWrapper("<input/>", {
            class: "button",
            type: "button",
            value: "edit"
        });

        var deleteButton = getElementWrapper("<input/>", {
            class: "button",
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
            .css("display", "block");

        textContainer
            .find(".text_field")
            .css("borderColor", "#C00");

        textContainer
            .parent()
            .find(".buttons_container")
            .css("justifyContent", "flex-start");
    }

    function hideTooltip(textContainer) {
        textContainer
            .find(".tooltip")
            .css("display", "none");

        textContainer
            .find(".text_field")
            .css("borderColor", "#66A");

        textContainer
            .parent()
            .find(".buttons_container")
            .css("justify-content", "center");
    }

    function disableInputValidation(event) {
        if ($(event.target).val().trim().length !== 0) {
            hideTooltip($(event.target).parent());

            event.target.removeEventListener("input", disableInputValidation);
        }
    }

    function isValidText(taskText, textBoxElement) {
        if (taskText === "" || taskText.trim().length === 0) {
            showTooltip(textBoxElement.parent());

            textBoxElement[0].addEventListener("input", disableInputValidation);

            return false;
        }

        return true;
    }

    function addTask() {
        var textBoxElement = $(".text_field").focus();

        var taskText = textBoxElement.val();

        textBoxElement.val("");

        if (!isValidText(taskText, textBoxElement)) {
            return;
        }

        var task = getNewTask(taskText);
        $("body").append(task);

        var buttons = task.find(".button");

        buttons.eq(0).on("click", editTask);
        buttons.eq(1).on("click", function (event) {
            $(event.target)
                .parent()
                .parent()
                .remove();
        });
    }

    $(".button").on("click", addTask);
});