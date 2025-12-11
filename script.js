// =====================
// script.js for Raihan Harley Store
// =====================

// ---------- TRANSLATIONS ----------
const translations = {
  id: {
    home: "Beranda",
    collection: "Koleksi",
    cart: "Keranjang",
    viewDetails: "Lihat Detail",
    addToCart: "Tambah ke Keranjang",
    back: "← Kembali",
    searchPlaceholder: "Cari model Harley...",
    collectionTitle: "Koleksi Motor Harley Davidson",
    collectionDesc: "Pilih motor impian lo, rasakan kebebasan di jalanan!",
    cartTitle: "Keranjang Belanja",
    emptyCart: "Keranjang masih kosong.",
    clearCart: "Hapus Semua",
    checkout: "Checkout",
    total: "Total",
    delete: "Hapus",
    productNotFound: "Produk tidak ditemukan.",
    addedToCart: "berhasil ditambahkan ke keranjang.",
    confirmClear: "Yakin ingin menghapus semua item dari keranjang?",
    emptyCartAlert: "Keranjang kosong.",
    checkoutSim: "Simulasi checkout: fitur pembayaran belum diimplementasikan.\nTotal yang harus dibayar: ",
    loading: "Memuat...",
    motorNotFound: "Motor tidak ditemukan.",
    desc: "Motor ini menampilkan kombinasi desain, performa, dan karakter khas Harley Davidson.",
    specs: "Spesifikasi Teknis",
    heroTitle: "Raihan Harley Garage — Where Freedom Roars!",
    heroDesc: "Dari suara mesin yang menggema sampai desain yang menggoda — Temukan motor impianmu dan rasakan sensasi jalanan tanpa batas.",
    viewCollection: "Lihat Koleksi",
    exploreNow: "Explore Now",
    footer: "© 2025 Raihan Harley Garage | Ride With Pride",
    musicOn: "🔊",
    musicOff: "🔇",
    cartIcon: "🛒",
    servicesTitle: "Our Services",
    service1Title: "Penjualan Motor",
    service1Desc: "Temukan berbagai model Harley-Davidson asli dengan kualitas terbaik. Kami menyediakan motor baru dan bekas yang terawat dengan baik.",
    service2Title: "Servis & Perawatan",
    service2Desc: "Layanan servis berkala dan perbaikan untuk menjaga motor Anda tetap prima. Tim ahli kami siap membantu dengan suku cadang asli.",
    service3Title: "Custom & Modifikasi",
    service3Desc: "Ubah motor Anda menjadi unik dengan layanan custom dan modifikasi. Dari aksesoris hingga modifikasi mesin, kami wujudkan visi Anda.",
    learnMore: "Learn More"
  },
  en: {
    home: "Home",
    collection: "Collection",
    cart: "Cart",
    viewDetails: "View Details",
    addToCart: "Add to Cart",
    back: "← Back",
    searchPlaceholder: "Search Harley models...",
    collectionTitle: "Harley Davidson Motorcycle Collection",
    collectionDesc: "Choose your dream bike, feel the freedom on the road!",
    cartTitle: "Shopping Cart",
    emptyCart: "Your cart is empty.",
    clearCart: "Clear All",
    checkout: "Checkout",
    total: "Total",
    delete: "Delete",
    productNotFound: "Product not found.",
    addedToCart: "successfully added to cart.",
    confirmClear: "Are you sure you want to clear all items from the cart?",
    emptyCartAlert: "Cart is empty.",
    checkoutSim: "Checkout simulation: payment feature not yet implemented.\nTotal to pay: ",
    loading: "Loading...",
    motorNotFound: "Motorcycle not found.",
    desc: "This motorcycle showcases a combination of design, performance, and the distinctive character of Harley Davidson.",
    specs: "Technical Specifications",
    heroTitle: "Raihan Harley Garage — Where Freedom Roars!",
    heroDesc: "From the roaring engine sound to the alluring design — Find your dream motorcycle and experience the endless road sensation.",
    viewCollection: "View Collection",
    exploreNow: "Explore Now",
    footer: "© 2025 Raihan Harley Garage | Ride With Pride",
    musicOn: "🔊",
    musicOff: "🔇",
    cartIcon: "🛒",
    servicesTitle: "Our Services",
    service1Title: "Motor Sales",
    service1Desc: "Find various authentic Harley-Davidson models with the best quality. We provide new and used motorcycles that are well-maintained.",
    service2Title: "Service & Maintenance",
    service2Desc: "Regular service and repair services to keep your motorcycle in top condition. Our expert team is ready to help with genuine spare parts.",
    service3Title: "Custom & Modification",
    service3Desc: "Make your motorcycle unique with custom and modification services. From accessories to engine modifications, we realize your vision.",
    learnMore: "Learn More"
  }
};

// ---------- LANGUAGE MANAGEMENT ----------
let currentLang = localStorage.getItem("language") || "id";

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("language", lang);
  updateLanguage();
}

function t(key) {
  return translations[currentLang][key] || key;
}

function updateLanguage() {
  // Update navigation
  document.querySelectorAll('[data-translate]').forEach(el => {
    const key = el.getAttribute('data-translate');
    el.textContent = t(key);
  });

  // Update placeholders
  document.querySelectorAll('[data-placeholder]').forEach(el => {
    const key = el.getAttribute('data-placeholder');
    el.placeholder = t(key);
  });

  // Update title
  document.title = document.title.replace(/^(.*?) - /, t('collectionTitle') + ' - ');

  // Re-render dynamic content
  if (document.getElementById("productList")) renderProducts();
  if (document.getElementById("detail-container")) renderDetailIfNeeded();
  if (document.getElementById("cart-items")) renderCart();

  // Update music button
  const musicToggle = document.getElementById("music-toggle");
  if (musicToggle) {
    const musicState = localStorage.getItem("musicState") || "paused";
    musicToggle.innerHTML = musicState === "playing" ? t("musicOn") : t("musicOff");
  }

  // Update language switcher active state
  const langButtons = document.querySelectorAll('#language-switcher button');
  langButtons.forEach(btn => {
    btn.classList.toggle('active', btn.textContent.toLowerCase() === currentLang);
  });
}

// ---------- Helper: format harga ----------
function formatRupiah(n) {
  if (isNaN(n)) return n;
  return "Rp " + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ---------- LOADING SCREEN + SOUND + VIBRATE ----------
window.addEventListener("DOMContentLoaded", () => {
  const loading = document.getElementById("loading");
  if (loading) loading.innerHTML = `<div class="spinner"></div><p>${t("loading")}</p>`;

  // sedikit getar visual
  document.body.style.animation = "vibrate .25s ease-in-out 3";
  setTimeout(()=> document.body.style.animation = "none", 900);

  // Initialize language
  updateLanguage();

  // Hide loading screen after content loads
  setTimeout(() => {
    if (loading) loading.style.display = "none";
  }, 1500); // Adjust time as needed
});

// ---------- DATA PRODUK (19 motor) ----------
const motors = [
  {
    id: "sportster",
    nama: "Harley Davidson Sportster",
    priceNum: 650000000,
    harga: "Rp 650.000.000",
    gambar: "assets/Motor/Sportster.png"
  },
  {
    id: "fatbob",
    nama: "Harley Davidson Fat Bob",
    priceNum: 720000000,
    harga: "Rp 720.000.000",
    gambar: "assets/Motor/Fatbob.png"
  },
  {
    id: "streetglide",
    nama: "Harley Davidson Street Glide",
    priceNum: 950000000,
    harga: "Rp 950.000.000",
    gambar: "assets/Motor/Streetglide.png"
  },
  {
    id: "roadglide",
    nama: "Harley Davidson Road Glide",
    priceNum: 580000000,
    harga: "Rp 580.000.000",
    gambar: "assets/Motor/Roadglide.png"
  },
  {
    id: "lowride",
    nama: "Harley Davidson Low Rider",
    priceNum: 830000000,
    harga: "Rp 830.000.000",
    gambar: "assets/Motor/Lowride.png"
  },
  {
    id: "heritage",
    nama: "Harley Davidson Heritage Classic",
    priceNum: 970000000,
    harga: "Rp 970.000.000",
    gambar: "assets/Motor/Heritage.png"
  },
  {
    id: "roadking",
    nama: "Harley Davidson Road King",
    priceNum: 1050000000,
    harga: "Rp 1.050.000.000",
    gambar: "assets/Motor/Roadking.png"
  },
  {
    id: "panamerica",
    nama: "Harley Davidson Pan America",
    priceNum: 1200000000,
    harga: "Rp 1.200.000.000",
    gambar: "assets/Motor/panamerica.png"
  },
  {
    id: "breakout",
    nama: "Harley Davidson Breakout",
    priceNum: 1150000000,
    harga: "Rp 1.150.000.000",
    gambar: "assets/Motor/Breakout.png"
  },
  {
    id: "fatboy",
    nama: "Harley Davidson Fat Boy",
    priceNum: 750000000,
    harga: "Rp 750.000.000",
    gambar: "assets/Motor/FatBoy.png"
  },
  {
    id: "lowriderst",
    nama: "Harley Davidson Low Rider ST",
    priceNum: 880000000,
    harga: "Rp 880.000.000",
    gambar: "assets/Motor/LowRiderST.png"
  },
  {
    id: "nighster",
    nama: "Harley Davidson Nighster",
    priceNum: 600000000,
    harga: "Rp 600.000.000",
    gambar: "assets/Motor/Nighster.png"
  },
  {
    id: "nightsterspecial",
    nama: "Harley Davidson Nightster Special",
    priceNum: 650000000,
    harga: "Rp 650.000.000",
    gambar: "assets/Motor/NightsterSpecial.png"
  },
  {
    id: "panamericaspecial",
    nama: "Harley Davidson Pan America Special",
    priceNum: 1250000000,
    harga: "Rp 1.250.000.000",
    gambar: "assets/Motor/PanAmericaSpecial.png"
  },
  {
    id: "roadkingspecial",
    nama: "Harley Davidson Road King Special",
    priceNum: 1100000000,
    harga: "Rp 1.100.000.000",
    gambar: "assets/Motor/RoadKingSpesial.png"
  },
  {
    id: "streetbob",
    nama: "Harley Davidson Street Bob",
    priceNum: 700000000,
    harga: "Rp 700.000.000",
    gambar: "assets/Motor/StreetBob.png"
  },
  {
    id: "streetglideultra",
    nama: "Harley Davidson Street Glide Ultra",
    priceNum: 1000000000,
    harga: "Rp 1.000.000.000",
    gambar: "assets/Motor/StreetGlideUltra.png"
  },
  {
    id: "cvoroadglide",
    nama: "Harley Davidson CVO Road Glide",
    priceNum: 1500000000,
    harga: "Rp 1.500.000.000",
    gambar: "assets/Motor/CvoRoadGlide.png"
  },
  {
    id: "cvostreetglide",
    nama: "Harley Davidson CVO Street Glide",
    priceNum: 1450000000,
    harga: "Rp 1.450.000.000",
    gambar: "assets/Motor/CvoStreetGlide.png"
  }
];

// ---------- SPEC per model ----------
function getSpecList(id) {
  const specs = {
    sportster: [
      "Mesin: 1200cc Evolution V-Twin",
      "Transmisi: 5-percepatan manual",
      "Bobot: 252 kg",
      "Tangki Bensin: 7.9 liter",
      "Rangka: Steel tubular"
    ],
    fatbob: [
      "Mesin: Milwaukee-Eight 114",
      "Transmisi: 6-percepatan manual",
      "Bobot: 306 kg",
      "Tangki Bensin: 13.6 liter",
      "Rem: Double disc depan"
    ],
    streetglide: [
      "Mesin: Milwaukee-Eight 107",
      "Transmisi: 6-percepatan manual",
      "Bobot: 361 kg",
      "Tangki Bensin: 22.7 liter",
      "Sistem Audio: Boom! Box GTS"
    ],
    roadglide: [
      "Mesin: Milwaukee-Eight 107",
      "Transmisi: 6-percepatan manual",
      "Bobot: 361 kg",
      "Tangki Bensin: 22.7 liter",
      "Lampu: LED Daymaker"
    ],
    lowride: [
      "Mesin: Milwaukee-Eight 117",
      "Transmisi: 6-percepatan",
      "Bobot: 308 kg",
      "Tangki Bensin: 15.8 liter",
      "Suspensi: Inverted front fork"
    ],
    heritage: [
      "Mesin: Milwaukee-Eight 114",
      "Transmisi: 6-percepatan",
      "Bobot: 330 kg",
      "Tangki Bensin: 18.9 liter",
      "Gaya: Cruiser klasik"
    ],
    roadking: [
      "Mesin: Milwaukee-Eight 114",
      "Transmisi: 6-percepatan",
      "Bobot: 372 kg",
      "Tangki Bensin: 22.7 liter",
      "Lampu: LED Daymaker"
    ],
    panamerica: [
      "Mesin: Revolution Max 1250",
      "Transmisi: 6-percepatan",
      "Bobot: 258 kg",
      "Tangki Bensin: 21 liter",
      "Tipe: Adventure Touring"
    ],
    breakout: [
      "Mesin: Milwaukee-Eight 117",
      "Transmisi: 6-percepatan",
      "Bobot: 296 kg",
      "Tangki Bensin: 18.9 liter",
      "Velg: 26-spoke cast aluminum"
    ],
    fatboy: [
      "Mesin: Milwaukee-Eight 114",
      "Transmisi: 6-percepatan manual",
      "Bobot: 322 kg",
      "Tangki Bensin: 18.9 liter",
      "Gaya: Cruiser ikonik"
    ],
    lowriderst: [
      "Mesin: Milwaukee-Eight 117",
      "Transmisi: 6-percepatan",
      "Bobot: 308 kg",
      "Tangki Bensin: 15.8 liter",
      "Suspensi: Inverted front fork"
    ],
    nighster: [
      "Mesin: Revolution Max 975T",
      "Transmisi: 6-percepatan",
      "Bobot: 228 kg",
      "Tangki Bensin: 11.7 liter",
      "Tipe: Sport Cruiser"
    ],
    nightsterspecial: [
      "Mesin: Revolution Max 975T",
      "Transmisi: 6-percepatan",
      "Bobot: 228 kg",
      "Tangki Bensin: 11.7 liter",
      "Fitur: ABS dan traction control"
    ],
    panamericaspecial: [
      "Mesin: Revolution Max 1250",
      "Transmisi: 6-percepatan",
      "Bobot: 258 kg",
      "Tangki Bensin: 21 liter",
      "Tipe: Adventure Touring Premium"
    ],
    roadkingspecial: [
      "Mesin: Milwaukee-Eight 114",
      "Transmisi: 6-percepatan",
      "Bobot: 372 kg",
      "Tangki Bensin: 22.7 liter",
      "Lampu: LED Daymaker"
    ],
    streetbob: [
      "Mesin: Milwaukee-Eight 114",
      "Transmisi: 6-percepatan manual",
      "Bobot: 286 kg",
      "Tangki Bensin: 13.2 liter",
      "Gaya: Bobber klasik"
    ],
    streetglideultra: [
      "Mesin: Milwaukee-Eight 117",
      "Transmisi: 6-percepatan",
      "Bobot: 379 kg",
      "Tangki Bensin: 22.7 liter",
      "Sistem Audio: Boom! Box GTS"
    ],
    cvoroadglide: [
      "Mesin: Milwaukee-Eight 117",
      "Transmisi: 6-percepatan",
      "Bobot: 361 kg",
      "Tangki Bensin: 22.7 liter",
      "Fitur: Custom premium"
    ],
    cvostreetglide: [
      "Mesin: Milwaukee-Eight 117",
      "Transmisi: 6-percepatan",
      "Bobot: 379 kg",
      "Tangki Bensin: 22.7 liter",
      "Fitur: Custom premium"
    ]
  };
  return specs[id] || [];
}

// ---------- CART (localStorage utilities) ----------
function getCart() {
  // cart stored as array of {id, qty}
  return JSON.parse(localStorage.getItem("cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// update cart count display (all pages)
function updateCartCount() {
  const count = getCart().reduce((s, it) => s + (it.qty || 1), 0);
  document.querySelectorAll("#cart-count").forEach(el => el.innerText = count);
}
updateCartCount();

// add product to cart (increments qty if exists)
function addToCart(id) {
  const product = motors.find(m => m.id === id);
  if (!product) return alert(t("productNotFound"));

  const cart = getCart();
  const idx = cart.findIndex(it => it.id === id);
  if (idx >= 0) {
    cart[idx].qty = (cart[idx].qty || 1) + 1;
  } else {
    cart.push({ id: id, qty: 1 });
  }
  saveCart(cart);
  alert(`${product.nama} ${t("addedToCart")}`);
}

// remove item by index
function removeFromCart(index) {
  const cart = getCart();
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart(cart);
  // reload section if on cart page for immediate visual update
  if (document.getElementById("cart-items")) renderCart();
}

// clear cart
function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  if (document.getElementById("cart-items")) renderCart();
}

// change quantity
function changeQty(index, delta) {
  const cart = getCart();
  if (index < 0 || index >= cart.length) return;
  cart[index].qty = Math.max(1, (cart[index].qty || 1) + delta);
  saveCart(cart);
  renderCart();
}

// ---------- RENDER PRODUCTS (index.html) ----------
function renderProducts(list) {
  const productList = document.getElementById("productList");
  if (!productList) return;
  if (!list) list = motors;
  productList.innerHTML = list.map(m => `
    <div class="product">
      <img src="${m.gambar}" alt="${m.nama}">
      <h3>${m.nama}</h3>
      <p class="price">${formatRupiah(m.priceNum)}</p>
      <div class="actions">
        <a class="btn" href="detail.html?model=${m.id}" data-translate="viewDetails">${t("viewDetails")}</a>
        <button class="btn" onclick="addToCart('${m.id}')" data-translate="addToCart">${t("addToCart")}</button>
      </div>
    </div>
  `).join("");
}

// initial render (if on index page)
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(motors);

  // search handler (live)
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = motors.filter(m => m.nama.toLowerCase().includes(q));
      renderProducts(filtered);
    });
  }
});

// ---------- DETAIL PAGE render (detail.html) ----------
function renderDetailIfNeeded(){
  const detailContainer = document.getElementById("detail-container");
  if (!detailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const model = params.get("model");
  const motor = motors.find(m => m.id === model);
  if (!motor) {
    detailContainer.innerHTML = `<p>${t("motorNotFound")}</p>`;
    return;
  }

  const specs = getSpecList(motor.id);
  detailContainer.innerHTML = `
    <div class="detail-box">
      <img src="${motor.gambar}" alt="${motor.nama}">
      <div class="detail-info">
        <h2>${motor.nama}</h2>
        <p class="price">${formatRupiah(motor.priceNum)}</p>
        <p class="desc">${t("desc")}</p>
        <h3>${t("specs")}</h3>
        <ul>
          ${specs.map(s => `<li>${s}</li>`).join("")}
        </ul>
        <div style="margin-top:14px">
          <a class="btn" href="index.html" data-translate="back">${t("back")}</a>
          <button class="btn" onclick="addToCart('${motor.id}')" data-translate="addToCart">${t("addToCart")}</button>
        </div>
      </div>
    </div>
  `;
}

// Call renderDetailIfNeeded on detail page load
document.addEventListener("DOMContentLoaded", () => {
  renderDetailIfNeeded();
});

// ---------- CART PAGE render (cart.html) ----------
function renderCart() {
  const cartItemsEl = document.getElementById("cart-items");
  if (!cartItemsEl) return;

  const cart = getCart();
  if (!cart || cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Keranjang masih kosong.</p>";
    // hide actions if none
    const clearBtn = document.getElementById("clearCart");
    if (clearBtn) clearBtn.style.display = "none";
    const checkoutBtn = document.getElementById("checkout");
    if (checkoutBtn) checkoutBtn.style.display = "none";
    return;
  }

  // build html
  let total = 0;
  cartItemsEl.innerHTML = cart.map((it, idx) => {
    const product = motors.find(m => m.id === it.id) || {};
    const qty = it.qty || 1;
    const subtotal = (product.priceNum || 0) * qty;
    total += subtotal;
    return `
      <div class="cart-item">
        <div style="display:flex;gap:12px;align-items:center;flex:1">
          <img src="${product.gambar}" style="width:100px;height:60px;object-fit:cover;border-radius:6px" alt="${product.nama}">
          <div>
            <strong>${product.nama}</strong>
            <div style="color:#bbb">${formatRupiah(product.priceNum)}</div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn secondary" onclick="changeQty(${idx}, -1)">-</button>
          <div style="min-width:28px;text-align:center">${qty}</div>
          <button class="btn secondary" onclick="changeQty(${idx}, 1)">+</button>
          <div style="width:120px;text-align:right;margin-left:12px">${formatRupiah(subtotal)}</div>
          <button class="btn danger" onclick="removeFromCart(${idx})">Hapus</button>
        </div>
      </div>
    `;
  }).join("");

  cartItemsEl.innerHTML += `
    <div style="padding:12px 0;text-align:right;color:#fff;font-weight:800">
      Total: ${formatRupiah(total)}
    </div>
  `;

  // actions visible
  const clearBtn = document.getElementById("clearCart");
  if (clearBtn) clearBtn.style.display = "inline-block";
  const checkoutBtn = document.getElementById("checkout");
  if (checkoutBtn) checkoutBtn.style.display = "inline-block";

  // attach handlers (checkout already in script bottom)
}

// call renderCart on load if cart page
document.addEventListener("DOMContentLoaded", () => {
  renderCart();

  // attach clear & checkout listeners
  const clearBtn = document.getElementById("clearCart");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Yakin ingin menghapus semua item dari keranjang?")) {
        clearCart();
      }
    });
  }
  const checkoutBtn = document.getElementById("checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      const cart = getCart();
      if (!cart || cart.length === 0) return alert("Keranjang kosong.");
      window.location.href = "checkout.html";
    });
  }
});

// ---------- CHECKOUT PAGE render (checkout.html) ----------
function renderCheckout() {
  const orderSummaryEl = document.getElementById("order-summary");
  const orderTotalEl = document.getElementById("order-total");
  if (!orderSummaryEl || !orderTotalEl) return;

  const cart = getCart();
  if (!cart || cart.length === 0) {
    orderSummaryEl.innerHTML = "<p>Keranjang kosong.</p>";
    orderTotalEl.innerHTML = "";
    return;
  }

  let total = 0;
  orderSummaryEl.innerHTML = cart.map(it => {
    const product = motors.find(m => m.id === it.id) || {};
    const qty = it.qty || 1;
    const subtotal = (product.priceNum || 0) * qty;
    total += subtotal;
    return `
      <div class="checkout-item">
        <img src="${product.gambar}" style="width:80px;height:50px;object-fit:cover;border-radius:4px" alt="${product.nama}">
        <div>
          <strong>${product.nama}</strong>
          <div>Jumlah: ${qty} x ${formatRupiah(product.priceNum)}</div>
        </div>
        <div>${formatRupiah(subtotal)}</div>
      </div>
    `;
  }).join("");

  orderTotalEl.innerHTML = `<strong>Total: ${formatRupiah(total)}</strong>`;
}

// call renderCheckout on load if checkout page
document.addEventListener("DOMContentLoaded", () => {
  renderCheckout();

  // attach back to cart button
  const backBtn = document.getElementById("back-to-cart");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  }

  // toggle address field based on pickup option
  const pickupRadios = document.querySelectorAll('input[name="pickup-option"]');
  pickupRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const addressGroup = document.getElementById('address-group');
      if (radio.value === 'delivery') {
        addressGroup.style.display = 'block';
        document.getElementById('address').required = true;
      } else {
        addressGroup.style.display = 'none';
        document.getElementById('address').required = false;
      }
    });
  });

  // toggle payment fields based on method
  const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const creditCardFields = document.getElementById('credit-card-fields');
      const bankTransferInfo = document.getElementById('bank-transfer-info');
      if (radio.value === 'credit-card') {
        creditCardFields.style.display = 'block';
        bankTransferInfo.style.display = 'none';
        document.getElementById('card-number').required = true;
        document.getElementById('expiry').required = true;
        document.getElementById('cvv').required = true;
        document.getElementById('card-name').required = true;
      } else {
        creditCardFields.style.display = 'none';
        bankTransferInfo.style.display = 'block';
        document.getElementById('card-number').required = false;
        document.getElementById('expiry').required = false;
        document.getElementById('cvv').required = false;
        document.getElementById('card-name').required = false;
      }
    });
  });

  // attach form submit
  const form = document.getElementById("checkout-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // basic validation
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const pickupOption = document.querySelector('input[name="pickup-option"]:checked').value;
      const address = pickupOption === 'delivery' ? document.getElementById("address").value.trim() : '';
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
      let cardNumber = '', expiry = '', cvv = '', cardName = '';
      if (paymentMethod === 'credit-card') {
        cardNumber = document.getElementById("card-number").value.trim();
        expiry = document.getElementById("expiry").value.trim();
        cvv = document.getElementById("cvv").value.trim();
        cardName = document.getElementById("card-name").value.trim();
      }

      if (!name || !email || !phone) {
        alert("Harap isi semua field yang diperlukan.");
        return;
      }
      if (pickupOption === 'delivery' && !address) {
        alert("Harap isi alamat untuk delivery.");
        return;
      }
      if (paymentMethod === 'credit-card' && (!cardNumber || !expiry || !cvv || !cardName)) {
        alert("Harap isi semua detail kartu kredit.");
        return;
      }

      // generate order number
      const orderNumber = 'HD' + Date.now();

      // simulate processing
      alert(`Pembelian berhasil! Nomor pesanan: ${orderNumber}. Terima kasih telah berbelanja di Raihan Harley Garage. ${pickupOption === 'pickup' ? 'Silakan pickup di dealer.' : 'Motor Anda akan segera dikirim.'}`);
      clearCart();
      window.location.href = "index.html";
    });
  }
});

// make sure cart count is updated on page open
updateCartCount();

// expose some functions to global scope (so buttons inline can call them)
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
window.changeQty = changeQty;
window.renderCart = renderCart;
window.getSpecList = getSpecList;

// ---------- SLIDER LOGIC ----------
let currentSlide = 0;
const totalSlides = 6;

function showSlide(index) {
  const slides = document.querySelector('.slides');
  if (!slides) return;
  currentSlide = (index + totalSlides) % totalSlides;
  slides.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;

  // Update active dot
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
  });
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

// Auto slide every 5 seconds
setInterval(nextSlide, 5000);

// ---------- BACKGROUND MUSIC CONTROL ----------
document.addEventListener("DOMContentLoaded", () => {
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("music-toggle");
  if (!bgMusic || !musicToggle) return;

  // Ambil status dari localStorage
  let musicState = localStorage.getItem("musicState") || "paused"; // Default ke paused
  let currentTime = parseFloat(localStorage.getItem("musicTime") || "0");

  bgMusic.volume = 0.5;
  bgMusic.currentTime = currentTime;

  // Update tombol berdasarkan status
  function updateButton() {
    if (musicState === "playing") {
      musicToggle.innerHTML = "🔊";
    } else {
      musicToggle.innerHTML = "🔇";
    }
  }
  updateButton();

  // Toggle musik saat tombol diklik
  musicToggle.addEventListener("click", () => {
    if (musicState === "playing") {
      bgMusic.pause();
      musicState = "paused";
      localStorage.setItem("musicState", "paused");
    } else {
      bgMusic.play().then(() => {
        musicState = "playing";
        localStorage.setItem("musicState", "playing");
      }).catch(() => {
        console.warn("Audio play blocked");
      });
    }
    updateButton();
  });

  // Jika status adalah playing, mulai putar
  if (musicState === "playing") {
    bgMusic.play().catch(() => {
      console.warn("Audio autoplay blocked");
    });
  }

  // Simpan posisi lagu tiap detik
  setInterval(() => {
    if (!isNaN(bgMusic.currentTime)) {
      localStorage.setItem("musicTime", bgMusic.currentTime);
    }
  }, 1000);
});