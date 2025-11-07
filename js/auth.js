const auth = firebase.auth();
const db = firebase.firestore();

const loginBox = document.querySelector("#login-box");
const signupBox = document.querySelector("#signup-box");
const loginUsername = document.querySelector("#login-username");
const loginPassword = document.querySelector("#login-password");
const loginBtn = document.querySelector("#login-btn");
const signupEmail = document.querySelector("#signup-email");
const signupPassword = document.querySelector("#signup-password");
const signupBtn = document.querySelector("#signup-btn");

// Switch forms
document.querySelector("#switch-to-signup").addEventListener("click", () => {
  loginBox.style.display = "none";
  signupBox.style.display = "block";
});
document.querySelector("#switch-to-login").addEventListener("click", () => {
  signupBox.style.display = "none";
  loginBox.style.display = "block";
});

// --- SIGN UP ---
signupBtn.addEventListener("click", async () => {
  const email = signupEmail.value.trim();
  const password = signupPassword.value.trim();

  if (!email || !password) return alert("Enter all fields!");

  try {
    await auth.createUserWithEmailAndPassword(email, password);
    await db.collection("users").doc(email).set({
      projects: { "Default": [] }
    });
    alert("Account created! Please login.");
    document.querySelector("#switch-to-login").click();
  } catch (err) {
    console.error(err);
    alert("Sign-up failed: " + err.message);
  }
});

// --- LOGIN ---
loginBtn.addEventListener("click", async () => {
  const email = loginUsername.value.trim();
  const password = loginPassword.value.trim();
  try {
    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "projects.html";
  } catch (err) {
    alert("Login failed: " + err.message);
  }
});
