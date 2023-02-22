"use strict";

$(document).ready(function () {
    var timerId = null;
    var isTimerStarted = false;

    $(".text_box").on("input", validateTextBox);

    $(".add_contact_button").click(addContactToTable);

    function showDialog(event) {
        var tableRow = $(event.target).closest(".table_row");

        var lastName = tableRow.find(".last_name").text();
        var firstName = tableRow.find(".first_name").text();
        var phoneNumber = tableRow.find(".phone_number").text();

        $(".dialog .last_name").text(lastName);
        $(".dialog .first_name").text(firstName);
        $(".dialog .phone_number").text(phoneNumber);

        $(".dialog").dialog({
            resizable: false,
            height: "auto",
            width: 280,
            modal: true,
            show: {
                effect: "slide",
                duration: 500
            },
            hide: {
                effect: "slide",
                duration: 500
            },
            buttons: {
                "Delete": function () {
                    deleteContactInTable(event);
                    $(this).dialog("close");
                },
                Cancel: function () {
                    $(this).dialog("close");
                }
            }
        });
    }

    function deleteContactInTable(event) {
        $(event.target).off();

        var row = $(event.target).closest(".table_row");

        var rowToDeleteIndex = $(".table_row").index(row);

        row.remove();

        var tableRows = $(".table_row");

        if (tableRows.length === 0) {
            $(".heading_no_contacts").show();

            return;
        }

        for (var i = rowToDeleteIndex; i < tableRows.length; i++) {
            tableRows.eq(i).find("div:first").text(i + 1);
        }
    }

    function getNewContactRow(contact) {
        var contactsCount = $(".table_row").length + 1;

        var rowContainer = $("<div class='table_row'></div>");

        rowContainer
            .append($("<div></div>")
                .text(contactsCount));

        rowContainer
            .append($("<div class='last_name'></div>")
                .text(contact.lastName));

        rowContainer
            .append($("<div class='first_name'></div>")
                .text(contact.firstName));

        rowContainer
            .append($("<div class='phone_number'></div>")
                .text(contact.phoneNumber));

        var rowDeleteButton = $("<input class='delete_row' type='button' name='delete_contact' value='X' title='Delete this row' />")
            .click(showDialog);

        rowContainer
            .append($("<div></div>")
                .append(rowDeleteButton));

        return rowContainer;
    }

    function hideErrorMessage(wrapper) {
        wrapper.removeClass("invalid")
            .val("");

        wrapper.next()
            .hide()
            .text("");
    }

    function addContactToTable() {
        var firstName = $("#first_name");

        var newRow = getNewContactRow({
            lastName: $("#last_name").val(),
            firstName: firstName.val(),
            phoneNumber: $("#phone_number").val()
        });

        $(".add_contact_button").prop("disabled", true);

        hideErrorMessage($(".text_box"));

        if ($(".table_row").length === 0) {
            $(".heading_no_contacts").hide();
        }

        $(".table").append(newRow);

        firstName.focus();
    }

    function showMessage(wrapper, message, isValid) {
        var errorMessage = wrapper.next();

        errorMessage.addClass("successful_validation");
        wrapper.removeClass("invalid");

        if (!isValid) {
            errorMessage.removeClass("successful_validation");
            wrapper.addClass("invalid");
        }

        errorMessage
            .show()
            .html(message);
    }

    function containsPhone(phoneNumber) {
        var phoneNumbers = $(".table .phone_number");

        if (phoneNumbers.length === 0) {
            return false;
        }

        for (var i = 0; i < phoneNumbers.length; i++) {
            if (phoneNumbers.eq(i).text() === phoneNumber) {
                return true;
            }
        }

        return false;
    }

    function accessTelephoneBook(event, errorMessages) {
        var addContactButton = $(".add_contact_button");

        if (errorMessages !== "") {
            errorMessages = errorMessages.slice(0, errorMessages.lastIndexOf("<br/>"));

            showMessage($(event.target), errorMessages, false);

            addContactButton.prop("disabled", true);

            return;
        }

        showMessage($(event.target), "This field is correct!", true);

        var textBoxes = $(".text_box");

        for (var i = 0; i < textBoxes.length; i++) {
            if (textBoxes.eq(i).hasClass("invalid") || textBoxes.eq(i).val() === "") {
                return;
            }
        }

        addContactButton.prop("disabled", false);
    }

    function validateTextBox(event) {
        var text = $(event.target).val();

        var errorMessages = "";

        if (text.length === 0) {
            errorMessages = "Required field!<br/>";
        }

        if (text.length > 255) {
            errorMessages += "Text longer than 255 characters!<br/>";
        }

        if (text.length !== 0 && text[0] === " ") {
            errorMessages += "Space at the beginning of the line!<br/>";
        }

        if (text.length !== 0 && text.length !== 1 && text[text.length - 1] === " ") {
            errorMessages += "Space at the end of the line!<br/>";
        }

        if ($(event.target).prop("type") === "tel") {
            if (!/[0-9]+/.test(text)) {
                errorMessages += "The phone number must contain at least 1 digit!<br/>";
            }

            if (/[^0-9-+.() ]/.test(text)) {
                errorMessages += "A phone number can contain: (, ), +, -, numbers, dots and spaces!<br/>";
            }

            if (errorMessages.length === 0) {
                accessTelephoneBook(event, "Search for matches in the directory...");

                isTimerStarted = true;

                clearTimeout(timerId);

                timerId = setTimeout(function () {
                    if (text.trim() !== "") {
                        if (containsPhone(text)) {
                            errorMessages += "The phone number is already in the phone book!<br/>";
                        } else {
                            errorMessages += "";
                        }

                        accessTelephoneBook(event, errorMessages);

                        isTimerStarted = false;
                    }
                }, 300);
            }
        }

        if (!isTimerStarted) {
            accessTelephoneBook(event, errorMessages);
        }
    }
});