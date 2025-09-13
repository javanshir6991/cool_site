
const cart = JSON.parse(localStorage.getItem("checkoutCart")) || [];
const container = document.getElementById("checkout-items");
const totalEl = document.getElementById("checkout-total");

let total = 0;
cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center mb-3 bg-gray-800 rounded-xl px-4 py-2 shadow";
    div.innerHTML = `<span class='text-lg text-white'>${item.title} <span class='text-green-400 font-bold'>(${item.quantity}x)</span></span> <span class='text-xl text-green-300 font-bold'>${itemTotal} $</span>`;
    container.appendChild(div);
});
totalEl.textContent = total;

const cardNumberInput = document.getElementById("card-number");
const cardExpInput = document.getElementById("card-exp");

if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.substring(0, 16);
        let formatted = value.replace(/(.{4})/g, "$1 ").trim();
        e.target.value = formatted;
    });
}
if (cardExpInput) {
    cardExpInput.addEventListener("input", (e) => {
        let value = e.target.value.replace(/[^0-9]/g, "");
        if (value.length > 2) {
            value = value.substring(0, 2) + "/" + value.substring(2, 4);
        }
        e.target.value = value.substring(0, 5);
    });
}

const confirmBtn = document.getElementById("confirm-order-btn");
if (confirmBtn) {
    confirmBtn.addEventListener("click", () => {
        const cardName = document.getElementById("card-name").value;
        const cardNumber = document.getElementById("card-number").value.replace(/\s/g, "");
        const cardExp = document.getElementById("card-exp").value;
        const cardCVV = document.getElementById("card-cvv").value;

        if (!cardName || !cardNumber || !cardExp || !cardCVV) {
            alert("Please fill in all card details!");
            return;
        }
        // Realistic validation
        const cardNumberRegex = /^[0-9]{16}$/;
        const cardExpRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        const cardCVVRegex = /^[0-9]{3,4}$/;

        if (!cardName || !cardNumberRegex.test(cardNumber) || !cardExpRegex.test(cardExp) || !cardCVVRegex.test(cardCVV)) {
            alert("Please enter valid card details!\nCard Number: 16 digits\nExpiry: MM/YY\nCVV: 3 or 4 digits");
            return;
        }

        const orderObj = {
            id: Date.now(),
            items: cart,
            total: total,
            status: "pending",
            payment: {
                name: cardName,
                number: cardNumber,
                exp: cardExp,
                cvv: cardCVV
            }
        };
        fetch("http://localhost:3000/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderObj)
        }).then(() => {
            localStorage.removeItem("cart");
            localStorage.removeItem("checkoutCart");
            alert("Order confirmed successfully!");
            window.location.href = "index.html";
        });
    });
}
