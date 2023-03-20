function get(url, data) {
    return $.get(url, data);
}

function post(url, data) {
    return $.post({
        url: url,
        data: JSON.stringify(data),
        contentType: "application/json"
    });
}

function PhoneBookService() { }

PhoneBookService.prototype.baseUrl = "/api/";

PhoneBookService.prototype.getContacts = function (term) {
    return get(this.baseUrl + "getContacts", { term: term });
}

PhoneBookService.prototype.addContact = function (contact) {
    return post(this.baseUrl + "addContact", { contact: contact });
}

PhoneBookService.prototype.deleteContacts = function (ids) {
    return post(this.baseUrl + "deleteContacts", { ids: ids });
}

var rootComponent = new Vue({
    el: "#app",

    data: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        contacts: [],

        messageInFirstName: "",
        messageInLastName: "",
        messageInPhoneNumber: "",

        service: new PhoneBookService(),

        selectedContactsIds: [],
        contactsIdsToDelete: [],
        requestErrorMessage: "",

        modalDialogForDeletingContacts: null,
        modalDialogForDisplayingServerMessage: null,

        filterText: "",

        delayTimerId: null
    },

    computed: {
        hasContacts: function () {
            return this.contacts.length !== 0;
        },

        isValidMessageInFirstName: function () {
            return this.messageInFirstName === "This field is correct!";
        },

        isValidMessageInLastName: function () {
            return this.messageInLastName === "This field is correct!";
        },

        isValidMessageInPhoneNumber: function () {
            return this.messageInPhoneNumber === "This field is correct!";
        },

        canCheckFirstName: function () {
            return this.firstName.length > 0;
        },

        canCheckLastName: function () {
            return this.lastName.length > 0;
        },

        canCheckPhoneNumber: function () {
            return this.phoneNumber > 0;
        },

        isValidInputInFirstName: function () {
            return this.canCheckFirstName && this.isValidMessageInFirstName;
        },

        isInvalidInputInFirstName: function () {
            return this.canCheckFirstName && !this.isValidMessageInFirstName;
        },

        isValidInputInLastName: function () {
            return this.canCheckLastName && this.isValidMessageInLastName;
        },

        isInvalidInputInLastName: function () {
            return this.canCheckLastName && !this.isValidMessageInLastName;
        },

        isValidInputInPhoneNumber: function () {
            return this.canCheckPhoneNumber && this.isValidMessageInPhoneNumber;
        },

        isInvalidInputInPhoneNumber: function () {
            return this.canCheckPhoneNumber && !this.isValidMessageInPhoneNumber;
        },

        areInvalidContactFields: function () {
            return !this.isValidMessageInFirstName
                || !this.isValidMessageInLastName
                || !this.isValidMessageInPhoneNumber;
        },

        selectedRowsCount: function () {
            return this.selectedContactsIds.length;
        },

        disableDeleteContactsButton: function () {
            return this.selectedRowsCount === 0;
        },

        isCheckedGeneralCheckBox: function () {
            return this.contacts.length > 0 && this.selectedRowsCount === this.contacts.length;
        },

        contactsToDelete: function () {
            var self = this;

            return this.contacts.filter(function (contact) {
                return self.contactsIdsToDelete.includes(contact.id);
            });
        }
    },

    watch: {
        firstName: function () {
            this.validateText(this.firstName, "firstName");
        },

        lastName: function () {
            this.validateText(this.lastName, "lastName");
        },

        phoneNumber: function () {
            this.validateText(this.phoneNumber, "phoneNumber");
        },

        contacts: function () {
            var self = this;

            this.selectedContactsIds = this.selectedContactsIds.filter(function (contactId) {
                return self.contacts.some(function (contact) {
                    return contactId === contact.id;
                });
            });
        },

        filterText: function () {
            clearTimeout(this.delayTimerId);

            var self = this;

            this.delayTimerId = setTimeout(function () {
                self.loadContacts();
            }, 300);
        }
    },

    created: function () {
        this.loadContacts();
    },

    mounted: function () {
        this.setFocusToFirstName();

        this.modalDialogForDeletingContacts = new bootstrap.Modal(this.$refs.modalDialogForDeletingContact);
        this.modalDialogForDisplayingServerMessage = new bootstrap.Modal(this.$refs.modalDialogForServerMessage);
    },

    methods: {
        setFocusToFirstName: function () {
            this.$refs.firstName.focus();
        },

        loadContacts: function () {
            var self = this;

            this.service.getContacts(this.filterText).done(function (contacts) {
                self.contacts = contacts;


            }).fail(function () {
                self.contacts = [];
            });
        },

        writeMessage: function (fieldType, errorMessage) {
            if (fieldType === "firstName") {
                this.messageInFirstName = errorMessage;
            } else if (fieldType === "lastName") {
                this.messageInLastName = errorMessage;
            } else {
                this.messageInPhoneNumber = errorMessage;
            }
        },

        validateText: function (text, fieldType) {
            var errorMessage = "This field is correct!";

            if (text.length === 0) {
                errorMessage = "Required field!";
            } else if (text.length > 255) {
                errorMessage = "Text longer than 255 characters!";
            } else if (text.length !== 0 && text[0] === " ") {
                errorMessage = "Space at the beginning of the line!";
            } else if (text.length !== 0 && text.length !== 1 && text[text.length - 1] === " ") {
                errorMessage = "Space at the end of the line!";
            } else if (fieldType === "phoneNumber") {
                if (!/[0-9]+/.test(text)) {
                    errorMessage = "The phone number must contain at least 1 digit!";
                } else if (/[^0-9-+.() ]/.test(text)) {
                    errorMessage = "A phone number can contain: (, ), +, -, numbers, dots and spaces!";
                }
            }

            this.writeMessage(fieldType, errorMessage);
        },

        addContact: function () {
            var self = this;

            var contact = {
                firstName: this.firstName,
                lastName: this.lastName,
                phoneNumber: this.phoneNumber
            };

            this.service.addContact(contact).done(function (response) {
                if (!response.success) {
                    self.writeMessage(response.fieldType, response.message);

                    self.setFocusToFirstName();

                    return;
                }
                self.loadContacts();

                self.firstName = "";
                self.lastName = "";
                self.phoneNumber = "";

                self.setFocusToFirstName();
            }).fail(function () {
                self.showModalDialogForServerMessage("Failed to load contacts.");
            });
        },

        showModalDialogForDeletingContacts: function (contacts) {
            this.contactsIdsToDelete = contacts;

            this.modalDialogForDeletingContacts.show();
        },

        showModalDialogForServerMessage: function (message) {
            this.requestErrorMessage = message;

            this.modalDialogForDisplayingServerMessage.show();
        },

        deleteContacts: function () {
            this.modalDialogForDeletingContacts.hide();

            var self = this;

            this.service.deleteContacts(this.contactsIdsToDelete).done(function () {
                self.loadContacts();
            }).fail(function () {
                self.showModalDialogForServerMessage("Failed to delete contacts.");
            });
        },

        isCheckedContact: function (contactId) {
            return this.selectedContactsIds.includes(contactId);
        },

        changeSelectedContacts: function (contactId) {
            var index = this.selectedContactsIds.indexOf(contactId);

            if (index === -1) {
                this.selectedContactsIds.push(contactId);

                return;
            }

            this.selectedContactsIds.splice(index, 1);
        },

        changeAllCheckBoxes: function () {
            if (this.isCheckedGeneralCheckBox) {
                this.selectedContactsIds = [];

                return;
            }

            this.selectedContactsIds = this.contacts.map(function (contact) {
                return contact.id;
            });
        }
    }
});