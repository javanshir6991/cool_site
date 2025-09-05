const CART_KEY = "cart";

function renderCart() {
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    const overviewEl = document.getElementById("cart-overview"); // sağ tərəf overview

    container.innerHTML = "";
    overviewEl.innerHTML = "";

    if (cart.length === 0) {
        container.innerHTML = `<p class="text-xl text-gray-400">Cart is empty...</p>`;
        overviewEl.innerHTML = `<p class="text-gray-400">No products</p>`;
        totalEl.textContent = 0;
        return;
    }

    let total = 0;

    cart.forEach(item => {
        const div = document.createElement("div");
        div.className =
            "flex items-center justify-between bg-[#333] px-4 rounded-3xl";

        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        // --- Left Cart List ---
        div.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${item.image}" class="w-34 h-34 mb-3 object-cover rounded-2xl">
        <div class="flex flex-col ml-2">
          <h2 class="text-xl text-white">${item.title}</h2>
          <p class="text-white text-2xl mt-1 font-bold">${item.price} $</p>
        </div>
      </div>

      <div class="text-3xl font-semibold text-emerald-100">${itemTotal} $</div>

      <div class="flex items-center gap-2">
        <div class="flex items-center gap-4 bg-[#444] rounded-full">
          <button class="decrease text-white font-bold px-5 py-3 rounded-lg text-lg cursor-pointer">-</button>
          <span class="text-xl text-white font-bold">${item.quantity}</span>
          <button class="increase text-white font-bold px-5 py-3 rounded-lg text-lg cursor-pointer">+</button>
        </div>
        <button class="remove bg-[#444] px-4 py-3 rounded-full cursor-pointer">
          <i class="ri-delete-bin-7-line text-lg text-white"></i>
        </button>
      </div>
    `;

        // --- Overview List (sağ tərəf) ---
        const overviewItem = document.createElement("div");
        overviewItem.className =
            "flex justify-between font-bold text-white text-xl border-t border-gray-500 pt-2";
        overviewItem.innerHTML = `
      <span>${item.title} (${item.quantity}x)</span>
      <span>${itemTotal} $</span>
    `;
        overviewEl.appendChild(overviewItem);

        // minus
        div.querySelector(".decrease").addEventListener("click", () => {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(p => p.id !== item.id);
            }
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            renderCart();
        });

        // plus
        div.querySelector(".increase").addEventListener("click", () => {
            item.quantity += 1;
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            renderCart();
        });

        // remove
        div.querySelector(".remove").addEventListener("click", () => {
            cart = cart.filter(p => p.id !== item.id);
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
            renderCart();
        });

        container.appendChild(div);
    });

    totalEl.textContent = total;
}

// init
renderCart();
