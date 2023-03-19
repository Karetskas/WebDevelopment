import Vue from "vue";

import PhoneBook from "./phoneBookVueServer.vue";

new Vue({
    render: h => h(PhoneBook)
}).$mount("#app");