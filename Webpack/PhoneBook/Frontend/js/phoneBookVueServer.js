import Vue from "vue";

import PhoneBook from "./PhoneBookVueServer.vue";

new Vue({
    render: h => h(PhoneBook)
}).$mount("#app");