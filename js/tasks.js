const auth = firebase.auth();
const db = firebase.firestore();

const logoutBtn = document.querySelector("#logout-btn");
const projectNameEl = document.querySelector("#project-name");
const taskList = document.querySelector("#task-list");
const addTaskBtn = document.querySelector("#add-task-btn");
const taskInput = document.querySelector("#task-input");
const sidebarList = document.querySelector("#project-sidebar-list");

const currentProject = localStorage.getItem("currentProject");
if (!currentProject) window.location.href = "projects.html";
projectNameEl.textContent = currentProject;

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  await loadSidebarProjects(user);
  await loadTasks(user);
});

// Load sidebar projects
async function loadSidebarProjects(user) {
  const userRef = db.collection("users").doc(user.email);
  const doc = await userRef.get();
  if (!doc.exists) return;
  const data = doc.data();
  const projects = Object.keys(data.projects);
  sidebarList.innerHTML = "";

  projects.forEach(project => {
    const li = document.createElement("li");
    li.textContent = project;
    li.classList.add("sidebar-project");
    if (project === currentProject) li.classList.add("active-project");

    li.addEventListener("click", () => {
      localStorage.setItem("currentProject", project);
      window.location.reload();
    });

    sidebarList.appendChild(li);
  });
}

// Load tasks
async function loadTasks(user) {
  const userRef = db.collection("users").doc(user.email);
  const doc = await userRef.get();
  const data = doc.data();
  const tasks = data.projects[currentProject] || [];
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = !!task.completed;
    checkbox.addEventListener("click", async () => {
      tasks[index].completed = checkbox.checked;
      data.projects[currentProject] = tasks;
      await userRef.set(data);
      loadTasks(user);
    });

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;

    const delBtn = document.createElement("button");
    delBtn.className = "delete-btn";
    delBtn.textContent = "🗑";
    delBtn.addEventListener("click", async () => {
      tasks.splice(index, 1);
      data.projects[currentProject] = tasks;
      await userRef.set(data);
      loadTasks(user);
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

// Add task
addTaskBtn.addEventListener("click", async () => {
  const text = taskInput.value.trim();
  if (!text) return;

  const user = auth.currentUser;
  const userRef = db.collection("users").doc(user.email);
  const doc = await userRef.get();
  const data = doc.data();

  const tasks = data.projects[currentProject] || [];
  tasks.push({ text, completed: false });

  data.projects[currentProject] = tasks;
  await userRef.set(data);

  taskInput.value = "";
  loadTasks(user);
});

// Logout
logoutBtn.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "login.html";
});
