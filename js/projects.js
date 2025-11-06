const projectList = document.querySelector("#project-list");
const addProjectBtn = document.querySelector("#add-project-btn");
const logoutBtn = document.querySelector("#logout-btn");

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) window.location.href = "login.html";

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUserData() {
    return getUsers().find(u => u.username === currentUser);
}


function loadProjects() {
    const user = getCurrentUserData();
    const projects = Object.keys(user.projects);
    
    projectList.innerHTML = "";

    projects.forEach(project => {
        const li = document.createElement("li");
        li.textContent = project;
        li.onclick = () => {
            localStorage.setItem("currentProject", project);
            window.location.href = "tasks.html";
        };
        projectList.appendChild(li);
    });
}


addProjectBtn.onclick = () => {
    const name = prompt("Project name:");
    if (!name) return;

    const users = getUsers();
    const user = users.find(u => u.username === currentUser);

    if (user.projects[name]) {
        alert("Project already exists!");
        return;
    }

    user.projects[name] = [];
    saveUsers(users);
    loadProjects();
};


logoutBtn.onclick = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
};


loadProjects();
