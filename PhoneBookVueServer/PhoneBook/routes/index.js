var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

var contacts = [];
var nextContactId = 1;

router.get("/api/getContacts", function (req, res) {
    var textToFilter = (req.query.term || "").trim().toLowerCase();

    console.log(textToFilter);

    var filteredContacts = textToFilter.length === 0
        ? contacts
        : contacts.filter(function (contact) {
            return contact.firstName.toLowerCase().includes(textToFilter)
                || contact.lastName.toLowerCase().includes(textToFilter)
                || contact.phoneNumber.toLowerCase().includes(textToFilter);
        });

    res.send(filteredContacts);
});

router.post("/api/addContact", function (req, res) {
    var contact = req.body.contact;

    for (var key in contact) {
        if (Object.prototype.hasOwnProperty.call(contact, key)) {
            if (contact[key].length === 0) {
                res.send({
                    success: false,
                    fieldType: key,
                    message: "Required field!"
                });

                return;
            }

            if (contact[key].length > 255) {
                res.send({
                    success: false,
                    fieldType: key,
                    message: "Text longer than 255 characters!"
                });

                return;
            }

            if (contact[key].length !== 0 && contact[key][0] === " ") {
                res.send({
                    success: false,
                    fieldType: key,
                    message: "Space at the beginning of the line!"
                });

                return;
            }

            if (contact[key].length !== 0 && contact[key].length !== 1 && contact[key][contact[key].length - 1] === " ") {
                res.send({
                    success: false,
                    fieldType: key,
                    message: "Space at the end of the line!"
                });

                return;
            }

            if (key === "phoneNumber") {
                if (!/[0-9]+/.test(contact[key])) {
                    res.send({
                        success: false,
                        fieldType: key,
                        message: "The phone number must contain at least 1 digit!"
                    });

                    return;
                }

                if (/[^0-9-+.() ]/.test(contact[key])) {
                    res.send({
                        success: false,
                        fieldType: key,
                        message: "A phone number can contain: (, ), +, -, numbers, dots and spaces!"
                    });

                    return;
                }

                if (contacts.some(function (currentContact) {
                    return currentContact.phoneNumber === contact["phoneNumber"];
                })) {
                    res.send({
                        success: false,
                        fieldType: key,
                        message: "The phone number is already in the phone book!"
                    });

                    return;
                }
            }
        }
    }

    contacts.push({
        id: nextContactId,
        firstName: contact.firstName,
        lastName: contact.lastName,
        phoneNumber: contact.phoneNumber
    });

    nextContactId++;

    res.send({
        success: true,
        message: null
    });
});

router.post("/api/deleteContacts", function (req, res) {
    var deleteContactsIds = req.body.ids;

    contacts = contacts.filter(function (contact) {
        return !deleteContactsIds.includes(contact.id);
    });

    res.send({
        success: true,
        message: null
    });
});

module.exports = router;
