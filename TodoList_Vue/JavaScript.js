new Vue({
    el: "#app",

    data: {
        elementId: 1,
        tasks: [],
        taskText: "",
        isValidText: true
    },

    mounted: function () {
        this.setFocusForNewTask();
    },

    watch: {
        taskText: function (val) {
            if (val.length !== 0) {
                this.isValidText = true;
            }
        }
    },

    methods: {
        addTask: function () {
            this.setFocusForNewTask();

            if (this.taskText.length === 0) {
                this.isValidText = false;

                return;
            }

            this.tasks.push({
                id: this.elementId,
                text: this.taskText,
                editTaskText: this.taskText,
                isEditMode: false,
                isValidText: true
            });

            this.taskText = "";
            this.elementId++;
        },

        removeTask: function (elementIndex) {
            this.tasks.splice(elementIndex, 1);
        },

        enableEditMode: function (element) {
            element.editTaskText = element.text;

            element.isEditMode = true;

            this.setFocusForEditTask(element);
        },

        cancelEditTask: function (element) {
            element.isEditMode = false;
        },

        saveTask: function (element) {
            if (element.editTaskText.length === 0) {
                element.isValidText = false;

                this.setFocusForEditTask(element);

                return;
            }

            element.text = element.editTaskText;
            element.isEditMode = false;
        },

        checkValidation: function (element) {
            if (element.editTaskText.length !== 0) {
                element.isValidText = true;
            }
        },

        setFocusForNewTask: function () {
            this.$refs.enterTask.focus();
        },

        setFocusForEditTask: function (element) {
            this.$nextTick(function () {
                this.$refs[element.id][0].focus();
            });
        }
    }
});