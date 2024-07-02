// Selectors
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filters = document.querySelectorAll('input[name="filter"]');
const clearCompletedBtn = document.getElementById('clear-completed');

// Event listeners
todoForm.addEventListener('submit', addTask);
todoList.addEventListener('click', handleTaskClick);
filters.forEach(filter => {
  filter.addEventListener('change', filterTasks);
});
clearCompletedBtn.addEventListener('click', clearCompletedTasks);
document.addEventListener('DOMContentLoaded', displayTasksFromLocalStorage);

// Functions
function addTask(event) {
  event.preventDefault();
  const taskContent = todoInput.value.trim();
  if (taskContent === '') return; // Prevent empty tasks
  
  const task = {
    id: new Date().getTime(),
    content: taskContent,
    completed: false
  };

  addToLocalStorage(task);
  displayTask(task);
  todoInput.value = '';
}

function displayTask(task) {
  const taskElement = document.createElement('li');
  taskElement.classList.add('todo-item');
  if (task.completed) {
    taskElement.classList.add('completed');
  }

  taskElement.dataset.taskId = task.id;
  taskElement.innerHTML = `
    <input type="checkbox" ${task.completed ? 'checked' : ''}>
    <span>${task.content}</span>
    <button class="delete-btn">Delete</button>
  `;

  todoList.appendChild(taskElement);
}

function handleTaskClick(event) {
  if (event.target.type === 'checkbox') {
    const taskId = event.target.parentElement.dataset.taskId;
    toggleTaskCompleted(taskId);
  }
  if (event.target.classList.contains('delete-btn')) {
    const taskId = event.target.parentElement.dataset.taskId;
    deleteTask(taskId);
  }
}

function toggleTaskCompleted(taskId) {
  const taskElement = document.querySelector('li[data-task-id = "${taskId}"]');
  const taskIndex = findTaskIndexById(taskId);
  tasks[taskIndex].completed = !tasks[taskIndex].completed;
  updateLocalStorage();
  taskElement.classList.toggle('completed');
}

function deleteTask(taskId) {
  const taskElement = document.querySelector('li[data-task-id="${taskId}"]');
  taskElement.remove();
  tasks = tasks.filter(task => task.id !== parseInt(taskId));
  updateLocalStorage();
}

function filterTasks(event) {
  const filterValue = event.target.value;
  const taskElements = document.querySelectorAll('.todo-item');
  taskElements.forEach(task => {
    switch (filterValue) {
      case 'all':
        task.style.display = 'flex';
        break;
      case 'active':
        task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
        break;
      case 'completed':
        task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
        break;
    }
  });
}

function clearCompletedTasks() {
  const completedTasks = document.querySelectorAll('.todo-item.completed');
  completedTasks.forEach(task => task.remove());
  tasks = tasks.filter(task => !task.completed);
  updateLocalStorage();
}

// Local Storage
let tasks = [];

function addToLocalStorage(task) {
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function displayTasksFromLocalStorage() {
  const storedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (storedTasks) {
    tasks = storedTasks;
    tasks.forEach(task => displayTask(task));
  }
}

function findTaskIndexById(taskId) {
  return tasks.findIndex(task => task.id === parseInt(taskId));
}