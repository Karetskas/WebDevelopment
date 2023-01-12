"use strict";

$(document).ready(function () {
    function deleteContactInTable(event) {
        $(event.target).off();

        var rowContainer = $(event.target).closest(".table_row");

        var rowNumber = rowContainer.find("span:first").text() - 1;

        rowContainer.remove();

        var rowsTable = $(".table_row");

        if (rowsTable.length === 0) {
            $(".heading_no_contacts").css("display", "block");

            return;
        }

        for (var i = rowNumber; i < rowsTable.length; i++) {
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

        var rowDeleteButton = $("<input class=\"delete_row\" type=\"button\" name=\"delete_contact\" value=\"X\" />");

        rowContainer
            .append($("<div></div>")
                .append(rowDeleteButton));

        return rowContainer;
    }

    function hideTooltip(wrapper) {
        wrapper.removeClass("invalid_input_in_text_box");
        wrapper.next()
            .css("display", "none")
            .css("color", "#E00")
            .text("");
    }

    function clearFormToAddContact() {
        var textBoxes = $(".text_box");

        $(".add_contact").prop("disabled", true);

        textBoxes.each(function () {
            $(this).val("");
            hideTooltip($(this));
        });
    }

    function addContactInTable() {
        var textBoxes = $(".text_box");

        var newRow = getNewContactRow({
            lastName: textBoxes.eq(1).val(),
            firstName: textBoxes.eq(0).val(),
            phoneNumber: textBoxes.eq(2).val()
        });

        clearFormToAddContact();

        if ($(".table_row").length === 0) {
            $(".heading_no_contacts").css("display", "none");
        }

        $(".table").append(newRow);

        var lastDeleteButtonRow = $(".delete_row:last");

        lastDeleteButtonRow.on("mousedown",
            function (event) {
                $(event.target).addClass("delete_row_button_down");
            });

        lastDeleteButtonRow.on("mouseup",
            function (event) {
                $(event.target).removeClass("delete_row_button_down");

                deleteContactInTable(event);
            });

        textBoxes.eq(0).focus();
    }

    var addContactButton = $(".add_contact");

    addContactButton.on("mousedown", function (event) {
        $(event.target).addClass("add_contact_button_down");
    });

    addContactButton.on("mouseup", function (event) {
        $(event.target).removeClass("add_contact_button_down");

        addContactInTable(event);
    });

    function showTooltip(wrapper, message, isValid) {
        var colorMessage = "#0A0";
        wrapper.removeClass("invalid_input_in_text_box");

        if (!isValid) {
            colorMessage = "#E00";
            wrapper.addClass("invalid_input_in_text_box");
        }

        wrapper.next()
            .css("display", "block")
            .css("color", colorMessage)
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

        if ($(event.target).prop("type") === "tel" && !/^\d+$/.test(text)) {
            tooltips += "The phone number must be digits!<br/>";
        }

        if (tooltips !== "") {
            tooltips = tooltips.slice(0, tooltips.lastIndexOf("<br/>"));

            showTooltip($(event.target), tooltips, false);

            $(".add_contact").prop("disabled", true);

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

        $(".add_contact").prop("disabled", false);
    }

    $(".text_box").each(function () {
        this.addEventListener("input", validateTextBox);
    });
});