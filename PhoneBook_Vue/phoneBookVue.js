new Vue({
    el: "#app",

    data: {
        firstNameText: "",
        lastNameText: "",
        phoneNumberText: "",
        nextContactId: 1,
        contacts: [],
        canCheckFields: false,

        contactsToDelete: [],

        modalDialog: null,

        textToFilter: ""
    },

    computed: {
        hasContacts: function () {
            return this.contacts.length !== 0;
        },

        messageInFirstName: function () {
            return this.validateText(this.firstNameText, false);
        },

        messageInLastName: function () {
            return this.validateText(this.lastNameText, false);
        },

        messageInPhoneNumber: function () {
            return this.validateText(this.phoneNumberText, true);
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

        selectedContacts: function () {
            return this.contactsFilter.filter(function (contact) {
                return contact.isChecked;
            });
        },

        selectedRowsCount: function () {
            return this.selectedContacts.length;
        },

        isDisabledGeneralCheckBox: function () {
            return !this.hasContacts;
        },

        isDisabledDeleteContactsButton: function () {
            return this.selectedRowsCount === 0;
        },

        isCheckedGeneralCheckBox: function () {
            return this.contactsFilter.length > 0 && this.selectedRowsCount === this.contactsFilter.length;
        },

        contactsFilter: function () {
            var textToFilter = this.textToFilter.trim().toLowerCase();

            if (textToFilter.length === 0) {
                return this.contacts;
            }

            return this.contacts.filter(function (contact) {
                return contact.firstName.toLowerCase().includes(textToFilter)
                    || contact.lastName.toLowerCase().includes(textToFilter)
                    || contact.phoneNumber.toLowerCase().includes(textToFilter);
            });
        },

        isContactsFilterEmpty: function () {
            return this.contactsFilter.length === 0 && this.contacts.length !== 0;
        }
    },

    watch: {
        hasContacts: function () {
            this.textToFilter = "";
        }
    },

    mounted: function () {
        this.setFocusToFirstName();
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
                firstName: this.firstNameText,
                lastName: this.lastNameText,
                phoneNumber: this.phoneNumberText,
                isChecked: false
            });

            this.nextContactId++;

            this.canCheckFields = false;

            this.firstNameText = "";
            this.lastNameText = "";
            this.phoneNumberText = "";

            this.setFocusToFirstName();
        },

        showModalDialogForDeletingContacts: function (contacts) {
            this.contactsToDelete = contacts;

            this.modalDialog = new bootstrap.Modal(this.$refs.modalDialogForDeletingContact);

            this.modalDialog.show();
        },

        hideModalDialogForDeletingContacts: function () {
            this.modalDialog.hide();
        },

        deleteContacts: function () {
            this.hideModalDialogForDeletingContacts();

            var self = this;

            this.contacts = this.contacts.filter(function (contact) {
                var canDeleted = false;

                self.contactsToDelete = self.contactsToDelete.filter(function (contactToDelete) {
                    if (contactToDelete.id === contact.id) {
                        canDeleted = true;

                        return false;
                    }

                    return true;
                });

                return !canDeleted;
            });
        },

        changeCheckBox: function (contact) {
            contact.isChecked = !contact.isChecked;
        },

        changeAllCheckBoxes: function () {
            var isCheckedGeneralCheckBox = this.isCheckedGeneralCheckBox;

            this.contactsFilter.forEach(function (contact) {
                contact.isChecked = !isCheckedGeneralCheckBox;
            });
        }
    }
});