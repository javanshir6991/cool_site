const API_URL = "http://localhost:3000/products";

// ---------------- Add Product ----------------
document.getElementById("product-form").addEventListener("submit", async e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const imageInput = document.getElementById("image"); // indi file input olacaq

    // FileReader ilə şəkil base64 çevrilir
    const file = imageInput.files[0];
    if (!file) {
        alert("Şəkil seçilməyib!");
        return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
        const product = {
            title,
            price,
            image: reader.result // base64 image
        };

        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });

        e.target.reset();
        loadProducts();
    };
    reader.readAsDataURL(file);
});

// ---------------- Load Products ----------------
async function loadProducts() {
    const res = await fetch(API_URL);
    const products = await res.json();
    const container = document.getElementById("admin-products");
    container.innerHTML = "";

    products.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("flex", "items-center", "justify-between", "mx-90", "border-b", "border-gray-700");
        div.innerHTML = `
          <img class="object-cover rounded-lg" src="${p.image}" width="100">
          <b class="text-xl text-white">${p.title}</b>  
          <span class="text-xl font-bold text-white">${p.price}</span>
          <button class="bg-red-600 cursor-pointer text-xl font-semibold hover:bg-red-800 duration-400 text-white p-2 px-6 rounded-full"
                    data-id="${p.id}">Sil</button>
        `;
        container.appendChild(div);

        div.querySelector("button").addEventListener("click", async () => {
            await fetch(`${API_URL}/${p.id}`, { method: "DELETE" });
            loadProducts();
        });
    });
}

// ---------------- Init ----------------
loadProducts();
