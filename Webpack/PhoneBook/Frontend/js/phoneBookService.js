import $ from "jquery";

function get(url, data) {
    return $.get(url, data);
}

function post(url, data) {
    return $.post({
        url,
        data: JSON.stringify(data),
        contentType: "application/json"
    });
}

export default class PhoneBookService {
    constructor() {
        this.baseUrl = "/api/";
    }

    getContacts(term) {
        return get(`${this.baseUrl}getContacts`, { term });
    }

    addContact(contact) {
        return post(`${this.baseUrl}addContact`, { contact });
    }

    deleteContacts(ids) {
        return post(`${this.baseUrl}deleteContacts`, { ids });
    }
}