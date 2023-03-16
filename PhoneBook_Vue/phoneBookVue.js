new Vue({
    el: "#app",

    data: {
        firstName: "",
        lastName: "",
        phoneNumber: "",
        nextContactId: 1,
        contacts: [],

        contactsToDelete: [],

        modalDialog: null,

        filterText: ""
    },

    computed: {
        hasContacts: function () {
            return this.contacts.length !== 0;
        },

        canCheckFirstName: function () {
            return this.firstName.length > 0;
        },

        canCheckLastName: function () {
            return this.lastName.length > 0;
        },

        canCheckPhoneNumber: function () {
            return this.phoneNumber.length > 0;
        },

        messageInFirstName: function () {
            return this.validateText(this.firstName, false);
        },

        messageInLastName: function () {
            return this.validateText(this.lastName, false);
        },

        messageInPhoneNumber: function () {
            return this.validateText(this.phoneNumber, true);
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

        selectedContacts: function () {
            return this.filteredContacts.filter(function (contact) {
                return contact.isChecked;
            });
        },

        selectedRowsCount: function () {
            return this.selectedContacts.length;
        },

        disabledDeleteContactsButton: function () {
            return this.selectedRowsCount === 0;
        },

        isCheckedGeneralCheckBox: function () {
            return this.filteredContacts.length > 0 && this.selectedRowsCount === this.filteredContacts.length;
        },

        filteredContacts: function () {
            var filterText = this.filterText.trim().toLowerCase();

            if (filterText.length === 0) {
                return this.contacts;
            }

            return this.contacts.filter(function (contact) {
                return contact.firstName.toLowerCase().includes(filterText)
                    || contact.lastName.toLowerCase().includes(filterText)
                    || contact.phoneNumber.toLowerCase().includes(filterText);
            });
        },

        hasFilteredContacts: function () {
            return this.filteredContacts.length > 0;
        }
    },

    mounted: function () {
        this.setFocusToFirstName();

        this.modalDialog = new bootstrap.Modal(this.$refs.modalDialogForDeletingContact);
    },

    methods: {
        setFocusToFirstName: function () {
            this.$refs.firstName.focus();
        },

        validateText: function (text, isPhoneNumberField) {
            var errorMessages = "This field is correct!";

            if (text.length === 0) {
                errorMessages = "Required field!";
            } else if (text.length > 255) {
                errorMessages = "Text longer than 255 characters!";
            } else if (text.length !== 0 && text[0] === " ") {
                errorMessages = "Space at the beginning of the line!";
            } else if (text.length !== 0 && text.length !== 1 && text[text.length - 1] === " ") {
                errorMessages = "Space at the end of the line!";
            } else if (isPhoneNumberField) {
                if (!/[0-9]+/.test(text)) {
                    errorMessages = "The phone number must contain at least 1 digit!";
                } else if (/[^0-9-+.() ]/.test(text)) {
                    errorMessages = "A phone number can contain: (, ), +, -, numbers, dots and spaces!";
                } else {
                    var containPhoneNumber = this.contacts.some(function (contact) {
                        return contact.phoneNumber.includes(text);
                    });

                    if (containPhoneNumber) {
                        errorMessages = "The phone number is already in the phone book!";
                    }
                }
            }

            return errorMessages;
        },

        addContact: function () {
            this.contacts.push({
                id: this.nextContactId,
                firstName: this.firstName,
                lastName: this.lastName,
                phoneNumber: this.phoneNumber,
                isChecked: false
            });

            this.nextContactId++;

            this.firstName = "";
            this.lastName = "";
            this.phoneNumber = "";

            this.setFocusToFirstName();
        },

        showModalDialogForDeletingContacts: function (contacts) {
            this.contactsToDelete = contacts;

            this.modalDialog.show();
        },

        hideModalDialogForDeletingContacts: function () {
            this.modalDialog.hide();
        },

        deleteContacts: function () {
            this.hideModalDialogForDeletingContacts();

            var self = this;

            this.contacts = this.contacts.filter(function (contact) {
                var foundContactToDelete = self.contactsToDelete.find(function (contactToDelete) {
                    return contactToDelete.id === contact.id;
                });

                return typeof foundContactToDelete === "undefined";
            });

            this.contactsToDelete = [];
        },

        changeCheckBox: function (contact) {
            contact.isChecked = !contact.isChecked;
        },

        changeAllCheckBoxes: function () {
            var isCheckedGeneralCheckBox = this.isCheckedGeneralCheckBox;

            this.filteredContacts.forEach(function (contact) {
                contact.isChecked = !isCheckedGeneralCheckBox;
            });
        }
    }
});