"use strict";

$(document).ready(function () {
    function deleteContactInTable(event) {
        $(event.target).off();

        var rowContainer = $(event.target).closest(".table_row");

        rowContainer.remove();

        var rowsTable = $(".table_row");

        if (rowsTable.length === 0) {
            $(".heading_no_contacts").show();

            return;
        }

        var elementIndex = $(".table_row").index(rowContainer);

        for (var i = elementIndex; i < rowsTable.length; i++) {
            rowsTable.eq(i).find("span:first").text(i + 1);
        }
    }

    function getNewContactRow(contactObject) {
        var tableRows = $(".table_row");

        var contactsCount = tableRows.length + 1;

        var rowContainer = $("<div class=\"table_row\"></div>");

        rowContainer
            .append($("<div></div>")
                .append($("<span></span")
                    .text(contactsCount)));

        rowContainer
            .append($("<div></div>")
                .append($("<span></span>")
                    .text(contactObject.lastName)));

        rowContainer
            .append($("<div></div>")
                .append($("<span></span>")
                    .text(contactObject.firstName)));

        rowContainer
            .append($("<div></div>")
                .append($("<span></span>")
                    .text(contactObject.phoneNumber)));

        var rowDeleteButton = $("<input class=\"delete_row\" type=\"button\" name=\"delete_contact\" value=\"delete\" />")
            .on("click", deleteContactInTable);

        rowContainer
            .append($("<div></div>")
                .append(rowDeleteButton));

        return rowContainer;
    }

    function hideTooltip(wrapper) {
        wrapper.removeClass("invalid_input_in_text_box");

        wrapper.next()
            .hide()
            .text("");
    }

    function clearFormToAddContact() {
        var textBoxes = $(".text_box");

        var addContactButton = $(".adding_contact_form>.container_row:last>input");
        addContactButton.prop("disabled", true);
        addContactButton.removeClass("add_contact_button_enabled");
        addContactButton.addClass("add_contact_button_disabled");

        textBoxes.each(function () {
            $(this).val("");
            hideTooltip($(this));
        });
    }

    function addContactToTable() {
        var textBoxes = $(".text_box");

        var newRow = getNewContactRow({
            lastName: textBoxes.eq(1).val(),
            firstName: textBoxes.eq(0).val(),
            phoneNumber: textBoxes.eq(2).val()
        });

        clearFormToAddContact();

        if ($(".table_row").length === 0) {
            $(".heading_no_contacts").hide();
        }

        $(".table").append(newRow);

        textBoxes.eq(0).focus();
    }

    $(".adding_contact_form>.container_row:last>input").on("click", addContactToTable);

    function showTooltip(wrapper, message, isValid) {
        var tooltip = wrapper.next();

        tooltip.addClass("tooltip_successful_validation");
        wrapper.removeClass("invalid_input_in_text_box");

        if (!isValid) {
            tooltip.removeClass("tooltip_successful_validation");
            wrapper.addClass("invalid_input_in_text_box");
        }

        tooltip
            .show()
            .html(message);
    }

    function validateTextBox(event) {
        var text = $(event.target).val();

        var tooltips = "";

        if (text.length === 0) {
            tooltips = "Required field!<br/>";
        }

        if (text.length > 255) {
            tooltips += "Text longer than 255 characters!<br/>";
        }

        if (text.length !== 0 && text[0] === " ") {
            tooltips += "Space at the beginning of the line!<br/>";
        }

        if (text.length !== 0 && text.length !== 1 && text[text.length - 1] === " ") {
            tooltips += "Space at the end of the line!<br/>";
        }

        if ($(event.target).prop("type") === "tel") {
            if (!/[0-9]+/.test(text)) {
                tooltips += "The phone number must contain at least 1 digit!<br/>";
            }

            if (/[^0-9-+.() ]/.test(text)) {
                tooltips += "A phone number can contain: (, ), +, -, numbers, dots and spaces!<br/>";
            }
        }

        var addContactButton = $(".adding_contact_form>.container_row:last>input");

        if (tooltips !== "") {
            tooltips = tooltips.slice(0, tooltips.lastIndexOf("<br/>"));

            showTooltip($(event.target), tooltips, false);

            addContactButton.prop("disabled", true);
            addContactButton.removeClass("add_contact_button_enabled");
            addContactButton.addClass("add_contact_button_disabled");

            return;
        }

        tooltips = "This field is correct!";
        showTooltip($(event.target), tooltips, true);

        var textBoxes = $(".text_box");

        for (var i = 0; i < textBoxes.length; i++) {
            if (textBoxes.eq(i).hasClass("invalid_input_in_text_box") || textBoxes.eq(i).val() === "") {
                return;
            }
        }

        addContactButton.prop("disabled", false);
        addContactButton.removeClass("add_contact_button_disabled");
        addContactButton.addClass("add_contact_button_enabled");
    }

    $(".text_box").each(function () {
        $(this).on("input", validateTextBox);
    });
});