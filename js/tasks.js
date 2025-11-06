const logoutBtn = document.querySelector("#logout-btn");
const projectNameEl = document.querySelector("#project-name");
const taskList = document.querySelector("#task-list");
const addTaskBtn = document.querySelector("#add-task-btn");
const taskInput = document.querySelector("#task-input");

const currentUser = localStorage.getItem("currentUser");
const currentProject = localStorage.getItem("currentProject");

if (!currentUser) window.location.href = "login.html";
if (!currentProject) window.location.href = "projects.html";

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function getUserIndex(users) {
  return users.findIndex(u => u.username === currentUser);
}
function getTasksRef() {

  const users = getUsers();
  const ui = getUserIndex(users);
  if (ui === -1) {
   
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
  const user = users[ui];
  
  user.projects = user.projects || {};
  user.projects[currentProject] = user.projects[currentProject] || [];
  const tasks = user.projects[currentProject];
  return { users, ui, user, tasks };
}

projectNameEl.textContent = currentProject;


function loadTasks() {
  const { tasks } = getTasksRef();
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = !!task.completed;

    checkbox.addEventListener("click", (e) => {
      e.stopPropagation();
      const { users, tasks } = getTasksRef();
      tasks[index].completed = checkbox.checked;
      saveUsers(users);
      loadTasks();
    });

    // text
    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;

    // delete button
    const del = document.createElement("button");
    del.className = "delete-btn";
    del.textContent = "🗑";
    del.addEventListener("click", (e) => {
      e.stopPropagation();
      const { users, tasks } = getTasksRef();
      tasks.splice(index, 1);
      saveUsers(users);
      loadTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(del);
    taskList.appendChild(li);
  });
}


addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (!text) return;

  const { users, tasks } = getTasksRef();
  tasks.push({ text, completed: false });
  saveUsers(users);

  taskInput.value = "";
  loadTasks();
});


logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
});

loadTasks();
