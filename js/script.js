document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const addDoneTaskButton = document.getElementById('addDoneTask');
    const addNotDoneTaskButton = document.getElementById('addNotDoneTask');
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];

    function calculateColor(done, notDone) {
        const totalTasks = done + notDone;
        const notDonePercentage = (notDone / totalTasks) * 100;

        if (notDonePercentage <= 25) {
            return 'green'; 
        } else if (notDonePercentage <= 50) {
            return 'yellow'; 
        } else {
            return 'red'; 
        }
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskMap = tasks.reduce((acc, task) => {
            if (!acc[task.name]) {
                acc[task.name] = { name: task.name, color: task.color, done: 0, notDone: 0 };
            }
            if (task.status === 'done') {
                acc[task.name].done++;
            } else {
                acc[task.name].notDone++;
            }
            return acc;
        }, {});

        taskTable.innerHTML = '';
        Object.values(taskMap).forEach(task => {
            const color = calculateColor(task.done, task.notDone);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.name}</td>
                <td style="background-color: ${color}; width: 100px;"></td>
                <td>${task.done}</td>
                <td>${task.notDone}</td>
                ${document.querySelector('form') ? `
                <td>
                    <button class="edit-button" data-name="${task.name}">Edit</button>
                    <button class="delete-button" data-name="${task.name}">Delete</button>
                </td>
                ` : ''}
            `;
            taskTable.appendChild(row);
        });
    }

    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function isValidTask(name, color) {
        return name.trim() !== '' && color.trim() !== '';
    }

    if (taskForm) {
        addDoneTaskButton.addEventListener('click', function() {
            const name = document.getElementById('name').value;
            const color = document.getElementById('color').value;

            if (!isValidTask(name, color)) {
                alert('Malumotlarni toldiring');
                return;
            }

            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const existingTask = tasks.find(t => t.name === name);

            if (existingTask) {
                existingTask.status = 'done';
            } else {
                tasks.push({ name, color, status: 'done' });
            }

            saveTasks(tasks);
            loadTasks();
            taskForm.reset();
        });

        addNotDoneTaskButton.addEventListener('click', function() {
            const name = document.getElementById('name').value;
            const color = document.getElementById('color').value;

            if (!isValidTask(name, color)) {
                alert('Malumotarlar qatori bosh');
                return;
            }

            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const existingTask = tasks.find(t => t.name === name);

            if (existingTask) {
                existingTask.status = 'not done';
            } else {
                tasks.push({ name, color, status: 'not done' });
            }

            saveTasks(tasks);
            loadTasks();
            taskForm.reset();
        });
    }

    taskTable.addEventListener('click', function(e) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const name = e.target.dataset.name;

        if (e.target.classList.contains('edit-button')) {
            const task = tasks.find(t => t.name === name);
            document.getElementById('name').value = task.name;
            document.getElementById('color').value = task.color;
            taskTable.deleteRow(e.target.parentElement.parentElement.rowIndex - 1);
        } else if (e.target.classList.contains('delete-button')) {
            const updatedTasks = tasks.filter(t => t.name !== name);
            saveTasks(updatedTasks);
            loadTasks();
        }
    });

    loadTasks(); 
});
