"use strict";

$(document).ready(function () {
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

        row.remove();

        var tableRows = $(".table_row");

        if (tableRows.length === 0) {
            $(".heading_no_contacts").show();

            return;
        }

        var rowToDeleteIndex = tableRows.index(row);

        for (var i = rowToDeleteIndex; i < tableRows.length; i++) {
            tableRows.eq(i).find("div:first").text(i + 1);
        }
    }

    function getNewContactRow(contactObject) {
        var contactsCount = $(".table_row").length + 1;

        var rowContainer = $("<div class=\"table_row\"></div>");

        rowContainer
            .append($("<div></div>")
                .text(contactsCount));

        rowContainer
            .append($("<div class=\"last_name\"></div>")
                .text(contactObject.lastName));

        rowContainer
            .append($("<div class=\"first_name\"></div>")
                .text(contactObject.firstName));

        rowContainer
            .append($("<div class=\"phone_number\"></div>")
                .text(contactObject.phoneNumber));

        var rowDeleteButton = $("<input class=\"delete_row\" type=\"button\" name=\"delete_contact\" value=\"X\" title=\"Delete this row\" />")
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
        var textBoxes = $(".text_box");

        var newRow = getNewContactRow({
            lastName: textBoxes.eq(1).val(),
            firstName: textBoxes.eq(0).val(),
            phoneNumber: textBoxes.eq(2).val()
        });

        $(".adding_contact_form>.container_row:last>input").prop("disabled", true);

        hideErrorMessage($(".text_box"));

        if ($(".table_row").length === 0) {
            $(".heading_no_contacts").hide();
        }

        $(".table").append(newRow);

        textBoxes.eq(0).focus();
    }

    $(".adding_contact_form>.container_row:last>input").click(addContactToTable);

    function showErrorMessage(wrapper, message, isValid) {
        var errorMessage = wrapper.next();

        errorMessage.addClass("error_message_successful_validation");
        wrapper.removeClass("invalid");

        if (!isValid) {
            errorMessage.removeClass("error_message_successful_validation");
            wrapper.addClass("invalid");
        }

        errorMessage
            .show()
            .html(message);
    }

    function isPhoneBookNumber(phoneNumber) {
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
        var addContactButton = $(".adding_contact_form>.container_row:last>input");

        if (errorMessages !== "") {
            errorMessages = errorMessages.slice(0, errorMessages.lastIndexOf("<br/>"));

            showErrorMessage($(event.target), errorMessages, false);

            addContactButton.prop("disabled", true);

            return;
        }

        errorMessages = "This field is correct!";
        showErrorMessage($(event.target), errorMessages, true);

        var textBoxes = $(".text_box");

        for (var i = 0; i < textBoxes.length; i++) {
            if (textBoxes.eq(i).hasClass("invalid") || textBoxes.eq(i).val() === "") {
                return;
            }
        }

        addContactButton.prop("disabled", false);
    }

    var timerId = null;
    var isTimerStarted = false;

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
                        if (isPhoneBookNumber(text)) {
                            errorMessages += "The phone number is already in the phone book!<br/>";
                        } else {
                            errorMessages += "";
                        }

                        accessTelephoneBook(event, errorMessages);

                        isTimerStarted = false;

                        return;
                    }
                }, 1000);
            }
        }

        if (!isTimerStarted) {
            accessTelephoneBook(event, errorMessages);
        }
    }

    $(".text_box").on("input", validateTextBox);
});