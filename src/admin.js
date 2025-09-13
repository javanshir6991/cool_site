const API_URL = "http://localhost:3000/products";

// ---------------- Add / Update Product ----------------
document.getElementById("product-form").addEventListener("submit", async e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const imageInput = document.getElementById("image");
    const hiddenId = document.getElementById("product-id").value;

    const file = imageInput.files[0];

    let imageData = "";
    if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
            imageData = reader.result;
            await saveProduct({ id: hiddenId, title, price, image: imageData });
            e.target.reset();
            document.getElementById("product-id").value = ""; // reset id
            loadProducts();
        };
        reader.readAsDataURL(file);
    } else {
        const existing = hiddenId ? await fetch(`${API_URL}/${hiddenId}`).then(res => res.json()) : null;
        imageData = existing ? existing.image : "";
        await saveProduct({ id: hiddenId, title, price, image: imageData });
        e.target.reset();
        document.getElementById("product-id").value = "";
        loadProducts();
    }
});

// ---------------- Save Product (Add or Edit) ----------------
async function saveProduct(product) {
    if (product.id) {
        // UPDATE
        await fetch(`${API_URL}/${product.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });
    } else {
        const { id, ...productWithoutId } = product;
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productWithoutId)
        });
    }
}

// ---------------- Load Products ----------------
async function loadProducts() {
    const res = await fetch(API_URL);
    const products = await res.json();
    const container = document.getElementById("admin-products");
    container.innerHTML = "";

    products.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("flex", "items-center", "justify-between", "mx-120", "border-b", "border-gray-700");
        div.innerHTML = `
          <img class="object-cover rounded-lg" src="${p.image}" width="100">
          <b class="text-xl text-white">${p.title}</b>  
          <span class="text-xl font-bold text-white">${p.price}</span>
          <div class="flex gap-4">
            <button class="edit bg-blue-600 cursor-pointer text-xl font-semibold hover:bg-blue-800 duration-400 text-white p-2 px-6 rounded-full"
                    data-id="${p.id}">Edit</button>
            <button class="delete bg-red-600 cursor-pointer text-xl font-semibold hover:bg-red-800 duration-400 text-white p-2 px-6 rounded-full"
                    data-id="${p.id}">Delete</button>
          </div>
        `;
        container.appendChild(div);

        // Delete event
        div.querySelector(".delete").addEventListener("click", async () => {
            await fetch(`${API_URL}/${p.id}`, { method: "DELETE" });
            loadProducts();
        });

        // Edit event
        div.querySelector(".edit").addEventListener("click", () => {
            document.getElementById("title").value = p.title;
            document.getElementById("price").value = p.price;
            document.getElementById("product-id").value = p.id; // gizli id
        });
    });
}

// ---------------- Init ----------------
loadProducts();


const ordersContainer = document.getElementById("orders-list");


async function renderOrders() {
    ordersContainer.innerHTML = "";
    try {
        const res = await fetch("http://localhost:3000/orders");
        const orders = await res.json();

        if (!orders.length) {
            ordersContainer.innerHTML = "<p class='text-white'>No orders yet</p>";
            return;
        }

        orders.forEach(order => {
            const div = document.createElement("div");
            div.className = "bg-gray-800 p-4 rounded-xl text-white";
            div.innerHTML = `
              <h3 class="font-bold mb-2">Order #${order.id}</h3>
              ${order.items.map(i => `<p>${i.title} (${i.quantity}x) - ${i.price}$</p>`).join("")}
              <p class="mt-2 font-bold">Total: ${order.total}$</p>
              <p>Status: ${order.status}</p>
              <p class="mt-2 font-bold">Payment Info:</p>
              <p>Name: ${order.payment.name}</p>
              <p>Number: ${order.payment.number}</p>
              <p>Exp: ${order.payment.exp}</p>
              <p>CVV: ${order.payment.cvv}</p>
            `;
            ordersContainer.appendChild(div);
        });
    } catch (err) {
        ordersContainer.innerHTML = `<p class='text-red-500'>Failed to load orders</p>`;
    }
}

renderOrders();