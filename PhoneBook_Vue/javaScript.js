new Vue({
    el: "#app",

    data: {
        firstNameText: "",
        lastNameText: "",
        phoneNumberText: "",
        nextContactId: 1,
        contacts: [],
        isPhoneBookEmpty: true,
        isAddingContact: false,
        areAllRowsSelected: false,
        selectedRowsCount: 0,

        deleteSelectedRowsButton: {
            isDisabled: true
        },
        generalCheckBox: {
            isDisabled: true,
            isChecked: false
        },
        errorMessageFirstName: {
            isEnabled: false,
            isValid: false,
            messages: ""
        },
        errorMessageLastName: {
            isEnabled: false,
            isValid: false,
            messages: ""
        },
        errorMessagePhoneNumber: {
            isEnabled: false,
            isValid: false,
            messages: ""
        },

        timerId: null,
        isTimerStarted: false,

        isModalDialogVisible: false,
        contactsToDelete: [],
        singleContactIndex: -1,

        isFilterEnabled: false,
        foundContactsCount: 0,
        textToFilter: ""
    },

    computed: {
        areValidContactFields: function () {
            return !(this.errorMessageFirstName.isValid && this.errorMessageLastName.isValid && this.errorMessagePhoneNumber.isValid);
        },

        errorMessageClassesFirstName: function () {
            return this.getErrorMessageClasses(this.errorMessageFirstName);
        },

        errorMessageClassesLastName: function () {
            return this.getErrorMessageClasses(this.errorMessageLastName);
        },

        errorMessageClassesPhoneNumber: function () {
            return this.getErrorMessageClasses(this.errorMessagePhoneNumber);
        },

        textBoxClassesFirstName: function () {
            return this.getTextBoxClasses(this.errorMessageFirstName);
        },

        textBoxClassesLastName: function () {
            return this.getTextBoxClasses(this.errorMessageLastName);
        },

        textBoxClassesPhoneNumber: function () {
            return this.getTextBoxClasses(this.errorMessagePhoneNumber);
        },

        contactsNotFound: function () {
            return this.foundContactsCount === 0 && this.isFilterEnabled;
        },

        countingSelectedCheckBoxes: {
            get: function () {
                return this.selectedRowsCount;
            },

            set: function (isChecked) {
                if (isChecked) {
                    this.selectedRowsCount++;
                } else {
                    this.selectedRowsCount--;
                }
            }
        }
    },

    watch: {
        firstNameText: function (text) {
            if (this.isAddingContact) {
                return;
            }

            this.showErrorMessage(this.validateText(text, {}), this.errorMessageFirstName);
        },

        lastNameText: function (text) {
            if (this.isAddingContact) {
                return;
            }

            this.showErrorMessage(this.validateText(text, {}), this.errorMessageLastName);
        },

        phoneNumberText: function (text) {
            if (this.isAddingContact) {
                this.isAddingContact = false;

                return;
            }

            this.showErrorMessage(this.validateText(text, this.errorMessagePhoneNumber), this.errorMessagePhoneNumber);
        },

        selectedRowsCount: function (selectedRowsCount) {
            this.changeGeneralCheckBox(selectedRowsCount);

            this.deleteSelectedRowsButton.isDisabled = selectedRowsCount > 0
                ? false
                : true;
        },

        foundContactsCount: function () {
            this.changeGeneralCheckBox(this.selectedRowsCount);
        }
    },

    mounted: function () {
        this.setFocus();
    },

    methods: {
        setFocus: function () {
            this.$refs.firstName.focus();
        },

        addContact: function () {
            this.contacts.push({
                isChecked: false,
                isVisible: true,
                id: this.nextContactId,
                firstName: this.firstNameText,
                lastName: this.lastNameText,
                phoneNumber: this.phoneNumberText
            });

            this.nextContactId++;
            this.isPhoneBookEmpty = false;
            this.generalCheckBox.isDisabled = false;

            this.invertObjectBooleanProperties(this.errorMessageFirstName);
            this.invertObjectBooleanProperties(this.errorMessageLastName);
            this.invertObjectBooleanProperties(this.errorMessagePhoneNumber);

            this.isAddingContact = true;
            this.firstNameText = "";
            this.lastNameText = "";
            this.phoneNumberText = "";

            this.changeGeneralCheckBox(this.selectedRowsCount);

            if (this.isFilterEnabled) {
                this.filterContacts();
            }

            this.setFocus();
        },

        invertObjectBooleanProperties(object) {
            _.each(object, function (value, key) {
                if (_.isBoolean(value)) {
                    object[key] = !value;
                }
            });
        },

        validateText: function (text, errorMessageObject) {
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

            if (errorMessageObject === this.errorMessagePhoneNumber) {
                if (!/[0-9]+/.test(text)) {
                    errorMessages += "The phone number must contain at least 1 digit!<br/>";
                }

                if (/[^0-9-+.() ]/.test(text)) {
                    errorMessages += "A phone number can contain: (, ), +, -, numbers, dots and spaces!<br/>";
                }

                if (errorMessages.length === 0) {
                    this.isTimerStarted = true;

                    clearTimeout(this.timerId);

                    var rootComponent = this;
                    this.timerId = setTimeout(function () {
                        if (text !== "") {
                            var isPhoneNumberExists = _.chain(rootComponent.contacts)
                                .pluck("phoneNumber")
                                .contains(text)
                                .value();

                            if (isPhoneNumberExists) {
                                errorMessages += "The phone number is already in the phone book!<br/>";
                            } else {
                                errorMessages += "";
                            }

                            if (rootComponent.phoneNumberText !== "") {
                                rootComponent.showErrorMessage(errorMessages, rootComponent.errorMessagePhoneNumber);
                            } else {
                                errorMessages = "Required field!<br/>";
                                errorMessages += "The phone number must contain at least 1 digit!<br/>";

                                rootComponent.showErrorMessage(errorMessages, rootComponent.errorMessagePhoneNumber);
                            }

                            rootComponent.isTimerStarted = false;
                        }
                    }, 300);
                }
            }

            if (!this.isTimerStarted) {
                return errorMessages;
            }

            return "Search for matches in the directory...";
        },

        showErrorMessage: function (errorMessages, errorMessageObject) {
            errorMessageObject.isEnabled = true;

            if (errorMessages !== "") {
                errorMessageObject.messages = errorMessages.slice(0, errorMessages.lastIndexOf("<br/>"));

                errorMessageObject.isValid = false;

                return;
            }

            errorMessageObject.messages = "This field is correct!";

            errorMessageObject.isValid = true;
        },

        getErrorMessageClasses: function (errorMessage) {
            return {
                'd-none': !errorMessage.isEnabled,
                'd-block': errorMessage.isEnabled,
                'valid-feedback': errorMessage.isValid,
                'invalid-feedback': !errorMessage.isValid
            };
        },

        getTextBoxClasses: function (errorMessage) {
            var isValidAndVisibleField = errorMessage.isEnabled && errorMessage.isValid;
            var isInvalidAndInvisibleField = errorMessage.isEnabled && !errorMessage.isValid;

            return {
                valid_text: isValidAndVisibleField,
                invalid_text: isInvalidAndInvisibleField,
                'border-success': isValidAndVisibleField,
                'border-danger': isInvalidAndInvisibleField
            };
        },

        deleteContact(index) {
            this.isModalDialogVisible = false;

            var isChecked = this.contacts[index].isChecked;

            if (isChecked) {
                this.countingSelectedCheckBoxes = false;
            }

            this.contacts.splice(index, 1);

            if (this.isFilterEnabled) {
                this.foundContactsCount--;
            }

            if (!isChecked) {
                this.changeGeneralCheckBox(this.selectedRowsCount);
            }

            if (this.contacts.length === 0) {
                this.isPhoneBookEmpty = true;
                this.generalCheckBox.isDisabled = true;
            }
        },

        deleteContacts() {
            var rootComponent = this;

            _.each(this.getIndexesSelectedContacts(), function (index) {
                rootComponent.deleteContact(index);
            });
        },

        getIndexesSelectedContacts: function () {
            return _.chain(this.contacts)
                .map(function (contact, index) {
                    if (contact.isChecked === true) {
                        return index;
                    }

                    return -1;
                })
                .filter(function (contact) {
                    return contact >= 0;
                })
                .sortBy()
                .reverse()
                .value();
        },

        changeAllCheckBoxes: function () {
            var isCheckedGeneralCheckBox = !this.generalCheckBox.isChecked;

            var rootComponent = this;

            _.each(this.contacts, function (contact) {
                if (contact.isVisible && contact.isChecked !== isCheckedGeneralCheckBox) {
                    contact.isChecked = isCheckedGeneralCheckBox;
                    rootComponent.countingSelectedCheckBoxes = isCheckedGeneralCheckBox;
                }
            });
        },

        changeOneCheckBox: function (contact) {
            contact.isChecked = !contact.isChecked;

            this.countingSelectedCheckBoxes = contact.isChecked;
        },

        changeGeneralCheckBox: function (selectedRowsCount) {
            if ((!this.isFilterEnabled && selectedRowsCount === this.contacts.length && selectedRowsCount > 0)
                || (this.isFilterEnabled && selectedRowsCount === this.foundContactsCount && selectedRowsCount > 0)) {
                this.generalCheckBox.isChecked = true;
            } else if (selectedRowsCount === 0 || selectedRowsCount !== this.contacts.length || selectedRowsCount !== this.foundContactsCount) {
                this.generalCheckBox.isChecked = false;
            }
        },

        showModalDialog: function (index) {
            this.singleContactIndex = index;

            if (index !== undefined) {
                this.contactsToDelete = [this.contacts[index]];
            } else {
                this.contactsToDelete = _.filter(this.contacts, function (contact) {
                    return contact.isChecked === true;
                });
            }

            this.isModalDialogVisible = true;
        },

        filterContacts: function () {
            this.isFilterEnabled = true;

            this.foundContactsCount = 0;
            var foundContactsCount = 0;

            var text = this.textToFilter.toLowerCase();
            var rootComponent = this;

            _.each(this.contacts, function (contact) {
                if (!(contact.firstName.toLowerCase().includes(text)
                    || contact.lastName.toLowerCase().includes(text)
                    || contact.phoneNumber.toLowerCase().includes(text))) {
                    contact.isVisible = false;

                    if (contact.isChecked) {
                        contact.isChecked = false;

                        rootComponent.countingSelectedCheckBoxes = false;
                    }

                    return;
                }

                contact.isVisible = true;
                foundContactsCount++;
            });

            this.foundContactsCount = foundContactsCount;
        },

        resetFilter: function () {
            this.textToFilter = "";

            _.each(this.contacts, function (contact) {
                contact.isVisible = true;
            });

            this.isFilterEnabled = false;
            this.foundContactsCount = 0;
        }
    }
});