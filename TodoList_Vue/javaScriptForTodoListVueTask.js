new Vue({
    el: "#app",

    data: {
        nextTaskId: 1,
        tasks: [],
        taskText: "",
        isValidText: true
    },

    watch: {
        taskText: function (text) {
            if (text.length !== 0) {
                this.isValidText = true;
            }
        }
    },

    mounted: function () {
        this.setFocusForNewTask();
    },

    methods: {
        addTask: function () {
            this.setFocusForNewTask();

            if (this.taskText.length === 0) {
                this.isValidText = false;

                return;
            }

            this.tasks.push({
                id: this.nextTaskId,
                text: this.taskText,
                editTaskText: this.taskText,
                isEditMode: false,
                isValidText: true
            });

            this.taskText = "";
            this.nextTaskId++;
        },

        removeTask: function (taskIndex) {
            this.tasks.splice(taskIndex, 1);
        },

        startEditTask: function (task) {
            task.editTaskText = task.text;

            task.isEditMode = true;

            this.setFocusForEditTask(task);
        },

        cancelEditTask: function (task) {
            task.isEditMode = false;
        },

        saveTask: function (task) {
            if (task.editTaskText.length === 0) {
                task.isValidText = false;

                this.setFocusForEditTask(task);

                return;
            }

            task.text = task.editTaskText;
            task.isEditMode = false;
        },

        checkTextForValidity: function (task) {
            if (task.editTaskText.length !== 0) {
                task.isValidText = true;
            }
        },

        setFocusForNewTask: function () {
            this.$refs.enterTask.focus();
        },

        setFocusForEditTask: function (task) {
            this.$nextTick(function () {
                this.$refs[task.id][0].focus();
            });
        }
    }
});