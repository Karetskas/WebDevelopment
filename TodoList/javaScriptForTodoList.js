"use strict";

(function () {
    function getElement(typeElement, attributesObject) {
        var element = document.createElement(typeElement);

        for (var name in attributesObject) {
            if (attributesObject.hasOwnProperty(name)) {
                element.setAttribute(name, attributesObject[name]);
            }
        }

        return element;
    }

    function changeColorMouseDown(event) {
        event.target.classList.remove("button");
        event.target.classList.add("button_down");
    }

    function changeColorMouseUp(event) {
        event.target.classList.remove("button_down");
        event.target.classList.add("button");
    }

    var buttonFunctions = new Map();

    function addEventsForButtons(buttons, buttonsCount) {
        for (var i = 0; i < buttonsCount; i++) {
            buttons[i].addEventListener("mousedown", changeColorMouseDown);
            buttons[i].addEventListener("mouseleave", changeColorMouseUp);
            buttons[i].addEventListener("click", changeColorMouseUp);
            buttons[i].addEventListener("click", buttonFunctions.get(buttons[i]));
        }
    }

    function deleteEventsForButtons(buttons, buttonsCount) {
        for (var i = 0; i < buttonsCount; i++) {
            buttons[i].removeEventListener("mousedown", changeColorMouseDown);
            buttons[i].removeEventListener("mouseleave", changeColorMouseUp);
            buttons[i].removeEventListener("click", changeColorMouseUp);
            buttons[i].removeEventListener("click", buttonFunctions.get(buttons[i]));

            buttonFunctions.delete(buttons[i]);
        }
    }

    var tasksTexts = new WeakMap();

    function exitEditMode(containerTask, isTaskSaving) {
        var entryField = containerTask.querySelector(".text_field");

        if (isTaskSaving) {
            tasksTexts.set(containerTask, entryField.value);
        }

        entryField.remove();

        var paragraph = getElement("p", {
            class: "task_description"
        });
        paragraph.textContent = tasksTexts.get(containerTask);

        var divTextContainer = containerTask.querySelector(".text_container");
        divTextContainer.append(paragraph);

        var editButton = getElement("input", {
            class: "button",
            type: "button",
            name: "edit_button",
            value: "edit"
        });

        var buttons = containerTask.querySelectorAll(".button");

        deleteEventsForButtons(buttons, buttons.length - 1);

        for (var i = 0; i < 2; i++) {
            buttons[i].remove();
        }

        var divButtonsContainer = containerTask.querySelector(".buttons_container");
        divButtonsContainer.prepend(editButton);

        buttonFunctions.set(editButton, editTask);
        addEventsForButtons([editButton], 1);
    }

    function saveTask(event) {
        var taskElement = event.target.parentElement.parentElement;

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
            name: "edit_text",
            value: paragraph.textContent
        });

        paragraph.remove();

        var divTextContainer = taskElement.querySelector(".text_container");
        divTextContainer.append(elementEditTask);

        var divButtonsContainer = taskElement.querySelector(".buttons_container");

        var editButton = divButtonsContainer.querySelector(".button");
        deleteEventsForButtons([editButton], 1);
        editButton.remove();

        var cancelButton = getElement("input", {
            class: "button",
            type: "button",
            name: "cancel_button",
            value: "cancel"
        });

        var saveButton = getElement("input", {
            class: "button",
            type: "button",
            name: "save_button",
            value: "save"
        });

        divButtonsContainer.prepend(cancelButton);
        divButtonsContainer.prepend(saveButton);

        var buttons = divButtonsContainer.querySelectorAll(".button");

        buttonFunctions.set(buttons[0], saveTask);
        buttonFunctions.set(buttons[1], cancelTaskEditing);
        addEventsForButtons(buttons, buttons.length - 1);
    }

    function deleteTask(event) {
        var taskElement = event.target.parentElement.parentElement;

        var buttons = taskElement.querySelectorAll(".button");
        deleteEventsForButtons(buttons, buttons.length);

        taskElement.remove();
    }

    function getNewTask(taskText) {
        var paragraph = getElement("p", { class: "task_description" });
        paragraph.textContent = taskText;

        var divTextContainer = getElement("div", { class: "text_container" });
        divTextContainer.append(paragraph);

        var editButton = getElement("input", {
            class: "button",
            type: "button",
            name: "edit_button",
            value: "edit"
        });

        var divButtonsContainer = getElement("div", { class: "buttons_container" });
        divButtonsContainer.append(editButton);

        var deleteButton = getElement("input", {
            class: "button",
            type: "button",
            name: "delete_button",
            value: "delete"
        });

        divButtonsContainer.append(deleteButton);

        var divContainer = getElement("div", { class: "container" });
        divContainer.append(divTextContainer);
        divContainer.append(divButtonsContainer);

        return divContainer;
    }

    function addTask() {
        var entryFieldElement = document.querySelector(".text_field");

        var taskText = entryFieldElement.value;

        if (taskText === "") {
            return;
        }

        var task = getNewTask(taskText);
        document.body.appendChild(task);

        var buttons = task.querySelectorAll(".button");

        buttonFunctions.set(buttons[0], editTask);
        buttonFunctions.set(buttons[1], deleteTask);

        addEventsForButtons(buttons, buttons.length);

        tasksTexts.set(task, taskText);
    }

    var buttons1 = document.querySelector(".button");
    buttonFunctions.set(buttons1, addTask);
    addEventsForButtons([buttons1], 1);
})();