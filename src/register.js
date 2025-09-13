import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBpnYOnnGPP0cHjJfYiVkn2uQeStwWZ6pw",
    authDomain: "apple-website-50ec0.firebaseapp.com",
    projectId: "apple-website-50ec0",
    storageBucket: "apple-website-50ec0.firebasestorage.app",
    messagingSenderId: "995172838783",
    appId: "1:995172838783:web:7cbd15ba4061e99624be4a",
    measurementId: "G-CVYX9CLGBM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const registerForm = document.getElementById("registerForm");
const errorEl = document.getElementById("error");

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify(user));
        alert("Registration successful!");
        window.location.href = "index.html";
    } catch (err) {
        errorEl.textContent = err.message;
    }
});
