// ------------------ LOGIN FUNKSİYASI ------------------
export async function login(username, password) {
    const errorEl = document.getElementById("error");
    try {
        const axios = (await import('axios')).default;
        const res = await axios.post("https://dummyjson.com/auth/login", {
            username: username.trim(),
            password: password.trim()
        }, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        const data = res.data;
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        window.location.href = "index.html";
    } catch (err) {
        if (errorEl) errorEl.textContent = err.response?.data?.message || err.message;
        else alert(err.response?.data?.message || err.message);
    }
}

// ------------------ LOGOUT FUNKSİYASI ------------------
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// ------------------ NAVBAR RENDER ------------------
export function renderNavbar() {
    const navbar = document.getElementById("navbar-auth");
    if (!navbar) return;

    const token = localStorage.getItem("token");

    if (token) {
        navbar.innerHTML = `<button id="logoutBtn" class="bg-red-600 text-white px-4 py-2 rounded">Logout</button>`;
        document.getElementById("logoutBtn").addEventListener("click", () => {
            logout();
        });
    }
}

// ------------------ PROTECT ROUTE ------------------
export function protectRoute() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
    }
}

// ------------------ AUTO INIT ------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", e => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        login(username, password);
    });
}

if (loginForm && localStorage.getItem("token")) {
    window.location.href = "index.html";
}

renderNavbar();
