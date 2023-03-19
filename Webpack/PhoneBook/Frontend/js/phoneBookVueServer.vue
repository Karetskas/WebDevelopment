using System.Runtime.Serialization;

<template>
    <div class="container v-cloak">
        <div class="h1 text-decoration-underline text-center">Phone book</div>

        <div class="container-md d-flex flex-column mb-3 align-items-center p-3 rounded-5 bg-secondary bg-opacity-25 border border-3 border-secondary">
            <div class="h2 col-12 col-sm-10 col-md-8">Add new contact:</div>

            <div class="col-12 col-sm-10 col-md-8">
                <label>First name:</label>
                <div class="mb-1 d-flex flex-column align-items-center">
                    <input type="text"
                           name="first_name"
                           placeholder="enter first name..."
                           tabindex="1"
                           required
                           ref="firstName"
                           v-model="firstName"
                           class="form-control ps-2 pe-4 rounded-3 w-100 border border-1 border-secondary"
                           :class="{'is-valid': isValidInputInFirstName, 'is-invalid': isInvalidInputInFirstName}" />
                    <div v-if="canCheckFirstName"
                         class="text-center fst-italic"
                         :class="{'valid-feedback': isValidMessageInFirstName, 'invalid-feedback': !isValidMessageInFirstName}"
                         v-text="messageInFirstName"></div>
                </div>

                <label>Last name:</label>
                <div class="mb-1 d-flex flex-column align-items-center">
                    <input type="text"
                           name="last_name"
                           placeholder="enter last name..."
                           tabindex="2"
                           required
                           v-model="lastName"
                           class="form-control ps-2 pe-4 rounded-3 w-100 border border-1 border-secondary"
                           :class="{'is-valid': isValidInputInLastName, 'is-invalid': isInvalidInputInLastName}" />
                    <div v-if="canCheckLastName"
                         class="text-center fst-italic"
                         :class="{'valid-feedback': isValidMessageInLastName, 'invalid-feedback': !isValidMessageInLastName}"
                         v-text="messageInLastName"></div>
                </div>

                <label>Phone number:</label>
                <div class="mb-3 d-flex flex-column align-items-center">
                    <input type="text"
                           name="phone_number"
                           placeholder="enter phone number..."
                           tabindex="3"
                           required
                           v-model="phoneNumber"
                           class="form-control ps-2 pe-4 rounded-3 w-100 border border-1 border-secondary"
                           :class="{'is-valid': isValidInputInPhoneNumber, 'is-invalid': isInvalidInputInPhoneNumber}" />
                    <div v-if="canCheckPhoneNumber"
                         class="text-center fst-italic"
                         :class="{'valid-feedback': isValidMessageInPhoneNumber, 'invalid-feedback': !isValidMessageInPhoneNumber}"
                         v-text="messageInPhoneNumber"></div>
                </div>

                <div class="d-flex justify-content-center">
                    <button class="px-3 py-2 btn btn-success rounded-3"
                            type="button"
                            name="add_new_contact"
                            tabindex="4"
                            :disabled="areInvalidContactFields"
                            @click="addContact">
                        Add contact
                    </button>
                </div>
            </div>
        </div>

        <div class="d-flex px-0 mb-2">
            <button type="button"
                    class="me-1 pb-2 btn btn-danger rounded-3 position-relative"
                    title="Delete selected rows with phone numbers"
                    :disabled="disableDeleteContactsButton"
                    @click="showModalDialogForDeletingContacts(selectedContacts)">
                <i class="bi bi-trash fs-4"></i>
                <span class="position-absolute py-0 top-0 start-50 translate-middle badge rounded-pill bg-dark"
                      v-text="selectedRowsCount">
                </span>
            </button>

            <div class="btn-group w-100" role="group">
                <input class="form-control border border-secondary rounded-0 rounded-start"
                       type="text"
                       name="filter"
                       placeholder="search filter..."
                       v-model="filterText" />

                <button type="button"
                        class="pb-2 px-2 btn btn-secondary rounded-0 rounded-end"
                        name="filter_reset"
                        title="Reset filter"
                        @click="filterText=''">
                    <i class="bi bi-x-square fs-4"></i>
                </button>
            </div>
        </div>

        <table class="table table-hover">
            <thead class="align-middle table-secondary">
                <tr>
                    <th class="p-1 text-center" scope="col">
                        <input class="form-check-input"
                               type="checkbox"
                               name="mark_subscriber"
                               title="Select or deselect all rows"
                               :disabled="!hasContacts"
                               :checked="isCheckedGeneralCheckBox"
                               @change="changeAllCheckBoxes" />
                    </th>
                    <th class="p-1" scope="col">#</th>
                    <th class="p-1" scope="col">Last name</th>
                    <th class="p-1" scope="col">First name</th>
                    <th class="p-1" scope="col">Phone number</th>
                    <th class="p-0 col-2" scope="col"></th>
                </tr>
            </thead>
            <tbody class="align-middle table-group-divider">
                <tr v-if="!hasContacts && filterText === ''">
                    <td colspan="6">
                        <div class="fs-4 text-danger text-center">
                            <i class="bi bi-exclamation-triangle"></i> Phone book is empty! <i class="bi bi-exclamation-triangle"></i>
                        </div>
                    </td>
                </tr>

                <tr v-if="!hasContacts && filterText !== ''">
                    <td colspan="6">
                        <div class="fs-4 text-danger text-center">
                            <i class="bi bi-emoji-frown"></i> Nothing found! <i class="bi bi-emoji-frown"></i>
                        </div>
                    </td>
                </tr>

                <tr v-for="(contact, index) in contacts"
                    :key="contact.id">
                    <td class="p-1 text-center">
                        <input class="form-check-input"
                               type="checkbox"
                               name="mark_subscriber"
                               title="Select or deselect this row"
                               :checked="isCheckedContact(contact.id)"
                               @change="changeSelectedContacts(contact.id)" />
                    </td>
                    <th class="p-1"
                        scope="row"
                        v-text="index + 1"></th>
                    <td class="p-1 text-break"
                        v-text="contact.lastName"></td>
                    <td class="p-1 text-break"
                        v-text="contact.firstName"></td>
                    <td class="p-1 text-break"
                        v-text="contact.phoneNumber"></td>
                    <td class="p-0 text-center position-relative">
                        <button type="button"
                                class="position-absolute top-0 bottom-0 start-0 end-0 w-100 px-1 pt-0 btn btn-danger rounded-0"
                                title="Delete this row"
                                @click="showModalDialogForDeletingContacts([contact.id])">
                            <i class="bi bi-trash fs-4"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="modal" ref="modalDialogForDeletingContact" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="h1 fs-4">Delete these contact(s) from the phone book?</div>
                    </div>
                    <div class="modal-body py-1">
                        <ul class="list-group"
                            v-for="(contact, index) in contactsToDelete"
                            :key="contact.id">
                            <li class="list-group-item text-break my-1">
                                <div>
                                    Last name: <span v-text="contact.lastName"></span>
                                </div>
                                <div>
                                    First name: <span v-text="contact.firstName"></span>
                                </div>
                                <div>
                                    Phone number: <span v-text="contact.phoneNumber"></span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <div class="btn-group w-100" role="group">
                            <button type="button"
                                    class="pb-2 px-2 btn btn-primary rounded-0 rounded-start"
                                    name="delete_rows"
                                    @click="deleteContacts">
                                delete
                            </button>

                            <button type="button"
                                    class="pb-2 px-2 btn btn-secondary rounded-0 rounded-end"
                                    name="cancel"
                                    @click="modalDialogForDeletingContacts.hide()">
                                cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal" ref="modalDialogForServerMessage" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <div class="h1 fs-4">Server message!</div>
                    </div>
                    <div class="modal-body">
                        <div v-text="requestErrorMessage">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="btn-group w-100" role="group">
                            <button type="button"
                                    class="pb-2 px-2 btn btn-primary rounded-0 rounded-start"
                                    name="delete_rows"
                                    @click="modalDialogForDisplayingServerMessage.hide()">
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import bootstrap from "bootstrap/dist/js/bootstrap.bundle";

    import PhoneBookService from "./phoneBookService";
    import "bootstrap-icons/font/bootstrap-icons.css";
    import "../css/phoneBookVueServer.scss";

    export default {
        data() {
            return {
                firstName: "",
                lastName: "",
                phoneNumber: "",
                contacts: [],

                messageInFirstName: "",
                messageInLastName: "",
                messageInPhoneNumber: "",

                service: new PhoneBookService(),

                selectedContacts: [],
                contactsIdToDelete: [],
                requestErrorMessage: "",

                modalDialogForDeletingContacts: null,
                modalDialogForDisplayingServerMessage: null,

                filterText: "",

                delayTimerId: null
            };
        },

        computed: {
            hasContacts() {
                return this.contacts.length !== 0;
            },

            isValidMessageInFirstName() {
                return this.messageInFirstName === "This field is correct!";
            },

            isValidMessageInLastName() {
                return this.messageInLastName === "This field is correct!";
            },

            isValidMessageInPhoneNumber() {
                return this.messageInPhoneNumber === "This field is correct!";
            },

            canCheckFirstName() {
                return this.firstName.length > 0;
            },

            canCheckLastName() {
                return this.lastName.length > 0;
            },

            canCheckPhoneNumber() {
                return this.phoneNumber.length > 0;
            },

            isValidInputInFirstName() {
                return this.canCheckFirstName && this.isValidMessageInFirstName;
            },

            isInvalidInputInFirstName() {
                return this.canCheckFirstName && !this.isValidMessageInFirstName;
            },

            isValidInputInLastName() {
                return this.canCheckLastName && this.isValidMessageInLastName;
            },

            isInvalidInputInLastName() {
                return this.canCheckLastName && !this.isValidMessageInLastName;
            },

            isValidInputInPhoneNumber() {
                return this.canCheckPhoneNumber && this.isValidMessageInPhoneNumber;
            },

            isInvalidInputInPhoneNumber() {
                return this.canCheckPhoneNumber && !this.isValidMessageInPhoneNumber;
            },

            areInvalidContactFields() {
                return !this.isValidMessageInFirstName
                    || !this.isValidMessageInLastName
                    || !this.isValidMessageInPhoneNumber;
            },

            selectedRowsCount() {
                return this.selectedContacts.length;
            },

            disableDeleteContactsButton() {
                return this.selectedRowsCount === 0;
            },

            isCheckedGeneralCheckBox() {
                return this.contacts.length > 0 && this.selectedRowsCount === this.contacts.length;
            },

            contactsToDelete() {
                return this.contacts.filter(contact => this.contactsIdToDelete.includes(contact.id));
            }
        },

        watch: {
            firstName() {
                this.validateText(this.firstName, "firstName");
            },

            lastName() {
                this.validateText(this.lastName, "lastName");
            },

            phoneNumber() {
                this.validateText(this.phoneNumber, "phoneNumber");
            },

            contacts() {
                this.selectedContacts = this.selectedContacts.filter(contactId =>
                    this.contacts.some(contact => contactId === contact.id));
            },

            filterText() {
                clearTimeout(this.delayTimerId);

                this.delayTimerId = setTimeout(() => this.loadContacts(), 300);
            }
        },

        created() {
            this.loadContacts();
        },

        mounted() {
            this.setFocusToFirstName();

            this.modalDialogForDeletingContacts = new bootstrap.Modal(this.$refs.modalDialogForDeletingContact);
            this.modalDialogForDisplayingServerMessage = new bootstrap.Modal(this.$refs.modalDialogForServerMessage);
        },

        methods: {
            setFocusToFirstName() {
                this.$refs.firstName.focus();
            },

            loadContacts() {
                this.service.getContacts(this.filterText)
                    .done(contacts => this.contacts = contacts)
                    .fail(() => this.contacts = []);
            },

            writeMessage(fieldType, errorMessage) {
                if (fieldType === "firstName") {
                    this.messageInFirstName = errorMessage;
                } else if (fieldType === "lastName") {
                    this.messageInLastName = errorMessage;
                } else {
                    this.messageInPhoneNumber = errorMessage;
                }
            },

            validateText(text, fieldType) {
                let errorMessage = "This field is correct!";

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

            addContact() {
                const contact = {
                    firstName: this.firstName,
                    lastName: this.lastName,
                    phoneNumber: this.phoneNumber
                }

                this.service.addContact(contact)
                    .done(response => {
                        if (!response.success) {
                            this.writeMessage(response.fieldType, response.message);

                            this.setFocusToFirstName();

                            return;
                        }

                        this.loadContacts();

                        this.firstName = "";
                        this.lastName = "";
                        this.phoneNumber = "";

                        this.setFocusToFirstName();
                    })
                    .fail(() => this.showModalDialogForServerMessage("Failed to load contacts."));
            },

            showModalDialogForDeletingContacts(contacts) {
                this.contactsIdToDelete = contacts;

                this.modalDialogForDeletingContacts.show();
            },

            showModalDialogForServerMessage(message) {
                this.requestErrorMessage = message;

                this.modalDialogForDisplayingServerMessage.show();
            },

            deleteContacts() {
                this.modalDialogForDeletingContacts.hide();

                this.service.deleteContacts(this.contactsIdToDelete)
                    .done(() => this.loadContacts())
                    .fail(() => this.showModalDialogForServerMessage("Failed to delete contacts."));
            },

            isCheckedContact(contactId) {
                return this.selectedContacts.includes(contactId);
            },

            changeSelectedContacts(contactId) {
                const index = this.selectedContacts.indexOf(contactId);

                if (index === -1) {
                    this.selectedContacts.push(contactId);

                    return;
                }

                this.selectedContacts.splice(index, 1);
            },

            changeAllCheckBoxes() {
                if (this.isCheckedGeneralCheckBox) {
                    this.selectedContacts = [];

                    return;
                }

                this.selectedContacts = this.contacts.map(contact => contact.id);
            }
        }
    };


</script>