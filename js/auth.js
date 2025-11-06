const loginBox = document.querySelector("#login-box");
const signupBox = document.querySelector("#signup-box");

const loginUsername = document.querySelector("#login-username");
const loginPassword = document.querySelector("#login-password");
const loginBtn = document.querySelector("#login-btn");

const signupUsername = document.querySelector("#signup-username");
const signupPassword = document.querySelector("#signup-password");
const signupBtn = document.querySelector("#signup-btn");

document.querySelector("#switch-to-signup").addEventListener("click", () => {
    loginBox.style.display = "none";
    signupBox.style.display = "block";
});

document.querySelector("#switch-to-login").addEventListener("click", () => {
    signupBox.style.display = "none";
    loginBox.style.display = "block";
});

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

signupBtn.addEventListener("click", () => {
    const username = signupUsername.value.trim();
    const password = signupPassword.value.trim();

    if (!username || !password) {
        alert("Enter all fields!");
        return;
    }

    const users = getUsers();
    if (users.find(u => u.username === username)) {
        alert("Username already exists!");
        return;
    }

    users.push({
        username,
        password,
        projects: { "Default": [] }
    });

    saveUsers(users);
    alert("Signup successful! Please login.");
    document.querySelector("#switch-to-login").click();
});

loginBtn.addEventListener("click", () => {
    const username = loginUsername.value.trim();
    const password = loginPassword.value.trim();

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert("Invalid username or password!");
        return;
    }

    localStorage.setItem("currentUser", username);
    window.location.href = "projects.html";
});

if (localStorage.getItem("currentUser")) {
    window.location.href = "projects.html";
}
