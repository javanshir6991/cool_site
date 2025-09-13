// Firebase import
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpnYOnnGPP0cHjJfYiVkn2uQeStwWZ6pw",
    authDomain: "apple-website-50ec0.firebaseapp.com",
    projectId: "apple-website-50ec0",
    storageBucket: "apple-website-50ec0.firebasestorage.app",
    messagingSenderId: "995172838783",
    appId: "1:995172838783:web:7cbd15ba4061e99624be4a",
    measurementId: "G-CVYX9CLGBM"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ------------------ LOGIN FUNKSİYASI ------------------
async function login(email, password) {
    const errorEl = document.getElementById("error");
    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const user = userCred.user;

        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "index.html"; // uğurlu login → yönləndir
    } catch (err) {
        errorEl.textContent = err.message;
    }
}

// ------------------ LOGOUT FUNKSİYASI ------------------
function logout() {
    signOut(auth).then(() => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    });
}

// ------------------ NAVBAR RENDER ------------------
function renderNavbar() {
    const navbar = document.getElementById("navbar-auth");
    if (!navbar) return;
    const user = localStorage.getItem("user");

    if (user) {
        navbar.innerHTML = `<button id="logoutBtn" class="text-red-300 hover:text-red-600 duration-400 cursor-pointer">Log out</button>`;
        document.getElementById("logoutBtn").addEventListener("click", logout);
    } else {
        navbar.innerHTML = "";
    }
}

// ------------------ AUTO INIT ------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        login(email, password);
    });

    if (localStorage.getItem("user")) {
        window.location.href = "index.html";
    }
}

renderNavbar();
