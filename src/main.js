const swiper = new Swiper('.swiper', {
    autoplay: {
        delay: 2000,
        disableOnInteraction: false,
    },
    loop: true,

    effect: 'coverflow', // <<< effekt əlavə olundu
    coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
    },

    speed: 800,

    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    scrollbar: {
        el: '.swiper-scrollbar',
    },
})
const scrollBtn = document.getElementById("scrollToTopBtn");
// scroll olduqda button göstər
window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
        scrollBtn.classList.remove("hidden");
    } else {
        scrollBtn.classList.add("hidden");
    }
});
// kliklə yuxarı at
scrollBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


const API_URL = "http://localhost:3000/products";
const CART_KEY = "cart";

async function loadProducts() {
    const res = await fetch(API_URL);
    const products = await res.json();
    const container = document.getElementById("products");
    container.innerHTML = "";

    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
        <div class="card flex flex-col gray rounded-4xl p-5">
                <div class="relative">
                    <img class="w-full h-70 object-cover rounded-4xl"
                        src="${p.image}" alt="">
                    <div class="absolute top-3 right-3 bg-red-700 text-white text-sm px-3 py-1 rounded-full">
                        5% OFF</div>
                </div>
                <h3 class="text-white font-semibold text-2xl mt-3 mb-5">${p.title}</h3>
                <div class="line-through font-color text-xl font-bold">789.99$</div>
                <div class="text-white font-bold text-3xl">${p.price} AZN</div>

                <div class="flex justify-between items-center mt-6">
                    <button data-id="${p.id}" class="add-to-cart bg-[#333] flex items-center rounded-full px-5 py-3 cursor-pointer hover:bg-green-700 duration-300">
                        <i class="ri-shopping-cart-2-line text-white text-2xl"></i> 
                        <span class="text-white font-semibold text-xl mx-3">Add to cart</span>
                    </button>
                    <button class="rounded-full text-3xl text-white bg-[#333] p-2 px-3 cursor-pointer hover:bg-red-700 duration-300">
                        <i class="ri-heart-2-line"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(div);

        // səbətə əlavə
        div.querySelector(".add-to-cart").addEventListener("click", () => addToCart(p));
    });
}

// ✅ səbət funksiyası
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    alert(`${product.title} səbətə əlavə olundu ✅`);
}

loadProducts();
