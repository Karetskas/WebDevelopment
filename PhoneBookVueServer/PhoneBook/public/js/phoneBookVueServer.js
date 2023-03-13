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

PhoneBookService.prototype.deleteContacts = function (id) {
    return post(this.baseUrl + "deleteContacts", { id: id });
}

var rootComponent = new Vue({
    el: "#app",

    data: {
        firstNameText: "",
        lastNameText: "",
        phoneNumberText: "",
        contacts: [],
        canCheckFields: false,

        messageInFirstName: "",
        messageInLastName: "",
        messageInPhoneNumber: "",

        service: new PhoneBookService(),

        selectedContacts: [],
        contactsIdToDelete: [],
        requestErrorMessage: "",

        modalDialog: null,

        textToFilter: "",

        delayTimerId: null
    },

    computed: {
        isValidMessageInFirstName: function () {
            return this.messageInFirstName === "This field is correct!";
        },

        isValidMessageInLastName: function () {
            return this.messageInLastName === "This field is correct!";
        },

        isValidMessageInPhoneNumber: function () {
            return this.messageInPhoneNumber === "This field is correct!";
        },

        isValidInputInFirstName: function () {
            return this.isValidMessageInFirstName && this.canCheckFields;
        },

        isInvalidInputInFirstName: function () {
            return !this.isValidMessageInFirstName && this.canCheckFields;
        },

        isValidInputInLastName: function () {
            return this.isValidMessageInLastName && this.canCheckFields;
        },

        isInvalidInputInLastName: function () {
            return !this.isValidMessageInLastName && this.canCheckFields;
        },

        isValidInputInPhoneNumber: function () {
            return this.isValidMessageInPhoneNumber && this.canCheckFields;
        },

        isInvalidInputInPhoneNumber: function () {
            return !this.isValidMessageInPhoneNumber && this.canCheckFields;
        },

        areValidContactFields: function () {
            return !this.isValidMessageInFirstName
                || !this.isValidMessageInLastName
                || !this.isValidMessageInPhoneNumber;
        },

        isDisabledGeneralCheckBox: function () {
            return this.contacts.length === 0;
        },

        selectedRowsCount: function () {
            return this.selectedContacts.length;
        },

        isDisabledDeleteContactsButton: function () {
            return this.selectedRowsCount === 0;
        },

        isCheckedGeneralCheckBox: function () {
            return this.contacts.length > 0 && this.selectedRowsCount === this.contacts.length;
        },

        isContactsFilterEmpty: function () {
            return this.contacts.length === 0 && this.textToFilter !== "";
        },

        isContactsEmpty: function () {
            return this.contacts.length === 0 && this.textToFilter === "";
        },

        contactsToDelete: function () {
            var contactsIdToDelete = this.contactsIdToDelete.slice(0);

            return this.contacts.filter(function (contact) {
                var index = contactsIdToDelete.indexOf(contact.id);

                if (index !== -1) {
                    contactsIdToDelete.splice(index, 1);

                    return true;
                }

                return false;
            });
        }
    },

    watch: {
        firstNameText: function () {
            this.validateText(this.firstNameText, "firstName");
        },

        lastNameText: function () {
            this.validateText(this.lastNameText, "lastName");
        },

        phoneNumberText: function () {
            this.validateText(this.phoneNumberText, "phoneNumber");
        },

        contacts: function () {
            var self = this;

            this.selectedContacts = this.selectedContacts.filter(function (contactId) {
                return self.contacts.some(function (contact) {
                    return contactId === contact.id;
                });
            });
        },

        textToFilter: function () {
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
    },

    methods: {
        setFocusToFirstName: function () {
            this.$refs.firstName.focus();
        },

        loadContacts: function () {
            var self = this;

            this.service.getContacts(this.textToFilter).done(function (contacts) {
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
                firstName: this.firstNameText,
                lastName: this.lastNameText,
                phoneNumber: this.phoneNumberText
            }

            this.service.addContact(contact).done(function (response) {
                if (!response.success) {
                    self.writeMessage(response.fieldType, response.message);

                    self.setFocusToFirstName();

                    return;
                }

                self.loadContacts();

                self.canCheckFields = false;

                self.firstNameText = "";
                self.lastNameText = "";
                self.phoneNumberText = "";

                self.setFocusToFirstName();
            }).fail(function () {
                this.showModalDialogForServerMessage("Failed to load contacts.");
            });
        },

        showModalDialogForDeletingContacts: function (contacts) {
            this.contactsIdToDelete = contacts;

            this.modalDialog = new bootstrap.Modal(this.$refs.modalDialogForDeletingContact);

            this.modalDialog.show();
        },

        showModalDialogForServerMessage: function (message) {
            this.requestErrorMessage = message;

            this.modalDialog = new bootstrap.Modal(this.$refs.modalDialogForServerMessage);

            this.modalDialog.show();
        },

        deleteContacts: function () {
            this.modalDialog.hide();

            var self = this;

            this.service.deleteContacts(this.contactsIdToDelete).done(function () {
                self.loadContacts();
            }).fail(function () {
                this.showModalDialogForServerMessage("Failed to delete contacts.");
            });
        },

        isCheckedContact: function (contactId) {
            return this.selectedContacts.includes(contactId);
        },

        changeSelectedContacts: function (contactId) {
            var index = this.selectedContacts.indexOf(contactId);

            if (index === -1) {
                this.selectedContacts.push(contactId);

                return;
            }

            this.selectedContacts.splice(index, 1);
        },

        changeAllCheckBoxes: function () {
            if (this.isCheckedGeneralCheckBox) {
                this.selectedContacts = [];

                return;
            }

            this.selectedContacts = this.contacts.map(function (contact) {
                return contact.id;
            });
        }
    }
});