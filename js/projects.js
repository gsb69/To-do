const auth = firebase.auth();
const db = firebase.firestore();

const projectList = document.querySelector("#project-list");
const addProjectBtn = document.querySelector("#add-project-btn");
const logoutBtn = document.querySelector("#logout-btn");

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  await loadProjects(user);
});

async function loadProjects(user) {
  const userRef = db.collection("users").doc(user.email);
  let doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({ username: "Unknown", projects: { "Default": [] } });
    doc = await userRef.get();
  }

  const data = doc.data();
  const projects = Object.keys(data.projects);
  projectList.innerHTML = "";

  projects.forEach(project => {
    const li = document.createElement("li");
    li.classList.add("project-item");

    const nameSpan = document.createElement("span");
    nameSpan.textContent = project;
    nameSpan.classList.add("project-name");
    nameSpan.onclick = () => {
      localStorage.setItem("currentProject", project);
      window.location.href = "tasks.html";
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑";
    delBtn.classList.add("delete-project-btn");
    delBtn.onclick = async (e) => {
      e.stopPropagation();
      if (project === "Default") return alert("Default project cannot be deleted!");
      await deleteProject(user, project);
    };

    li.appendChild(nameSpan);
    li.appendChild(delBtn);
    projectList.appendChild(li);
  });
}

addProjectBtn.onclick = async () => {
  const user = auth.currentUser;
  const name = prompt("Enter project name:");
  if (!name) return;

  const userRef = db.collection("users").doc(user.email);
  const doc = await userRef.get();
  const data = doc.data();

  if (data.projects[name]) {
    alert("Project already exists!");
    return;
  }

  data.projects[name] = [];
  await userRef.set(data);
  loadProjects(user);
};

async function deleteProject(user, projectName) {
  const userRef = db.collection("users").doc(user.email);
  const doc = await userRef.get();
  const data = doc.data();
  delete data.projects[projectName];
  await userRef.set(data);
  loadProjects(user);
}

logoutBtn.onclick = async () => {
  await auth.signOut();
  window.location.href = "login.html";
};
