import { createConfetti } from './confetti.js';

class TaskManager {
    constructor() {
        this.taskList = document.querySelector('.task-list');
        this.taskInput = document.querySelector('.task-input');
        this.addTaskBtn = document.querySelector('.add-task-btn');
        this.modal = document.getElementById('dateModal');
        this.dateInput = document.getElementById('taskDate');
        this.currentTaskItem = null;
        this.currentDateElement = null;

        this.setupEventListeners();
        this.loadTasks();
    }

    setupEventListeners() {
        // Add Task eventos
        this.addTaskBtn.addEventListener('click', () => this.addNewTask());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addNewTask();
            }
        });

        // Modal eventos
        const confirmBtn = this.modal.querySelector('.confirm-btn');
        const cancelBtn = this.modal.querySelector('.cancel-btn');

        confirmBtn.addEventListener('click', () => this.handleDateConfirm());
        cancelBtn.addEventListener('click', () => this.hideModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }

    addNewTask() {
        const taskText = this.taskInput.value.trim();
        if (taskText) {
            const taskElement = this.createTask(taskText);
            this.taskList.appendChild(taskElement);
            this.taskInput.value = '';
            this.saveTasks();
        }
    }

    createTask(taskText, taskId = Date.now().toString(), completed = false, dueDate = null) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.dataset.taskId = taskId;
        taskItem.dataset.dueDate = dueDate;

        // Checkbox container
        const checkboxContainer = this.createCheckboxContainer(taskId, completed);
        
        // Task content
        const taskContent = this.createTaskContent(taskText, dueDate);
        
        // Actions container
        const actionsContainer = this.createActionsContainer(taskItem);

        // Montar a task
        taskItem.appendChild(checkboxContainer);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(actionsContainer);

        return taskItem;
    }

    createCheckboxContainer(taskId, completed) {
        const container = document.createElement('div');
        container.className = 'checkbox-container';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `task-${taskId}`;
        checkbox.checked = completed;

        const label = document.createElement('label');
        label.className = 'checkbox-label';
        label.htmlFor = checkbox.id;

        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti';

        if (completed) {
            label.textContent = "✓";
            container.closest('.task-item')?.classList.add('task-completed');
        }

        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                label.textContent = "✓";
                createConfetti(confettiContainer);
                container.closest('.task-item')?.classList.add('task-completed');
            } else {
                label.textContent = "";
                container.closest('.task-item')?.classList.remove('task-completed');
            }
            this.saveTasks();
        });

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(confettiContainer);

        return container;
    }

    createTaskContent(taskText, dueDate) {
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';

        const taskTextElement = document.createElement('p');
        taskTextElement.className = 'task-text';
        taskTextElement.textContent = taskText;

        const dateElement = document.createElement('span');
        dateElement.className = 'task-date';
        
        if (dueDate) {
            const date = new Date(dueDate);
            const formattedDate = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            dateElement.textContent = formattedDate;
            dateElement.classList.add('date-added');
        }

        taskContent.appendChild(taskTextElement);
        taskContent.appendChild(dateElement);

        return taskContent;
    }

    createActionsContainer(taskItem) {
        const container = document.createElement('div');
        container.className = 'task-actions';

        // Date Button
        const dateBtn = document.createElement('button');
        dateBtn.className = 'date-btn';
        dateBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M19 4h-1V3c0-.55-.45-1-1-1s-1 .45-1 1v1H8V3c0-.55-.45-1-1-1s-1 .45-1 1v1H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" fill="currentColor"/>
            </svg>
        `;

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
            </svg>
        `;

        dateBtn.addEventListener('click', () => {
            this.showDateModal(taskItem, taskItem.querySelector('.task-date'));
        });

        deleteBtn.addEventListener('click', () => {
            taskItem.classList.add('fade-out');
            setTimeout(() => {
                taskItem.remove();
                this.saveTasks();
            }, 300);
        });

        container.appendChild(dateBtn);
        container.appendChild(deleteBtn);

        return container;
    }

    showDateModal(taskItem, dateElement) {
        this.currentTaskItem = taskItem;
        this.currentDateElement = dateElement;
        this.modal.classList.add('show');

        if (taskItem.dataset.dueDate) {
            const date = new Date(taskItem.dataset.dueDate);
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
            this.dateInput.value = date.toISOString().split('T')[0];
        } else {
            this.dateInput.value = '';
        }
    }

    hideModal() {
        this.modal.classList.remove('show');
    }

    handleDateConfirm() {
        if (this.currentTaskItem && this.currentDateElement) {
            const selectedDate = this.dateInput.value;
            if (selectedDate) {
                const date = new Date(selectedDate + 'T12:00:00');
                this.currentTaskItem.dataset.dueDate = date.toISOString();

                const formattedDate = date.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                this.currentDateElement.textContent = formattedDate;
                this.currentDateElement.classList.add('date-added');
            }
            this.hideModal();
            this.saveTasks();
        }
    }

    saveTasks() {
        const tasks = Array.from(this.taskList.children).map(taskElement => ({
            id: taskElement.dataset.taskId,
            text: taskElement.querySelector('.task-text').textContent,
            completed: taskElement.querySelector('input[type="checkbox"]').checked,
            dueDate: taskElement.dataset.dueDate
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.taskList.innerHTML = '';

        tasks.forEach(task => {
            const taskElement = this.createTask(
                task.text,
                task.id,
                task.completed,
                task.dueDate
            );
            this.taskList.appendChild(taskElement);
            taskElement.classList.add('slide-in');
        });
    }
}

export { TaskManager }; 