const products = [
  {
    id: "lt-05",
    name: "Tea Pink Gold Veil",
    category: "Bridal Luxe",
    description: "Soft tea pink press-ons with white tips and a trace of gold foil.",
    price: 10,
    image: "img/5.jpg",
    rating: 5,
    badge: "Best Seller"
  },
  {
    id: "lt-06",
    name: "Blush Marble Shine",
    category: "Signature Set",
    description: "A polished marble finish made for elegant day-to-night styling.",
    price: 10,
    image: "img/6.jpg",
    rating: 5,
    badge: "New"
  },
  {
    id: "lt-26",
    name: "Pearl Mist Tips",
    category: "Classic Edit",
    description: "Minimal pearl shimmer with a clean salon silhouette.",
    price: 10,
    image: "img/26.jpg",
    rating: 5,
    badge: "Popular"
  },
  {
    id: "lt-10",
    name: "Champagne Bloom",
    category: "Occasion Wear",
    description: "Glossy nude nails balanced with champagne accents.",
    price: 15,
    image: "img/10.jpg",
    rating: 5,
    badge: "Premium"
  },
  {
    id: "lt-23",
    name: "Rose Silk Set",
    category: "Everyday Luxe",
    description: "A smooth rosy finish designed for repeat wear.",
    price: 12,
    image: "img/23.jpg",
    rating: 5,
    badge: "Top Rated"
  },
  {
    id: "lt-12",
    name: "Crystal Cloud",
    category: "Soft Glam",
    description: "A white glazed finish with delicate shimmer placement.",
    price: 12,
    image: "img/12.jpg",
    rating: 5,
    badge: "New"
  },
  {
    id: "lt-27",
    name: "Moonlight French",
    category: "Classic Edit",
    description: "A refined french-inspired design with subtle sparkle.",
    price: 15,
    image: "img/27.jpg",
    rating: 5,
    badge: "Premium"
  },
  {
    id: "lt-15",
    name: "Vanilla Glaze",
    category: "Minimal Wear",
    description: "Clean creamy tones with a mirror gloss topcoat.",
    price: 10,
    image: "img/15.jpg",
    rating: 5,
    badge: "Everyday"
  },
  {
    id: "lt-28",
    name: "Pink Aurora",
    category: "New Arrival",
    description: "Reflective pink tones with a luminous top finish.",
    price: 10,
    image: "img/28.jpg",
    rating: 5,
    badge: "Trending"
  },
  {
    id: "lt-35",
    name: "Golden Petal",
    category: "New Arrival",
    description: "Floral detailing with gold notes for event looks.",
    price: 10,
    image: "img/35.jpg",
    rating: 5,
    badge: "Trending"
  },
  {
    id: "lt-31",
    name: "Cotton Candy Gloss",
    category: "New Arrival",
    description: "Pastel shine with soft contouring and extra gloss.",
    price: 10,
    image: "img/31.jpg",
    rating: 5,
    badge: "New"
  },
  {
    id: "lt-29",
    name: "Radiant Nude",
    category: "New Arrival",
    description: "Neutral glam set elevated with metallic details.",
    price: 15,
    image: "img/29.jpg",
    rating: 5,
    badge: "Premium"
  }
];

const cartKey = "luxetips-cart";
const orderRecipient = "amna.mirza782@gmail.com";
const orderApiEndpoint = `https://formsubmit.co/ajax/${orderRecipient}`;

function getCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(cartKey));
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(cartKey, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((element) => {
    element.textContent = count;
  });
}

function renderStars(count) {
  return Array.from({ length: count }, () => '<i class="fas fa-star"></i>').join("");
}

function productCard(product) {
  return `
    <article class="pro" data-product-id="${product.id}">
      <div class="pro-badge">${product.badge}</div>
      <img src="${product.image}" alt="${product.name}">
      <div class="des">
        <span>${product.category}</span>
        <h5>${product.name}</h5>
        <p>${product.description}</p>
        <div class="star">${renderStars(product.rating)}</div>
        <h4>$${product.price}</h4>
      </div>
      <button class="cart action-cart" type="button" data-add-to-cart="${product.id}" aria-label="Add ${product.name} to cart">
        <i class="fa-solid fa-cart-shopping"></i>
      </button>
    </article>
  `;
}

function renderProductGrid(selector, items) {
  const container = document.querySelector(selector);
  if (!container) {
    return;
  }
  container.innerHTML = items.map(productCard).join("");
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    return;
  }

  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  showToast(`${product.name} added to cart`);
}

function updateCartItem(productId, quantity) {
  const cart = getCart();
  const item = cart.find((entry) => entry.id === productId);
  if (!item) {
    return;
  }

  if (quantity <= 0) {
    removeCartItem(productId);
    return;
  }

  item.quantity = quantity;
  saveCart(cart);
  renderCartPage();
}

function removeCartItem(productId) {
  const product = products.find((item) => item.id === productId);
  const updatedCart = getCart().filter((item) => item.id !== productId);
  saveCart(updatedCart);
  renderCartPage();

  if (product) {
    showToast(`${product.name} removed from cart`);
  }
}

function clearCart() {
  saveCart([]);
  renderCartPage();
  showToast("Cart cleared");
}

function cartTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length ? 5 : 0;
  return {
    subtotal,
    shipping,
    total: subtotal + shipping
  };
}

function renderCartPage() {
  const cartContainer = document.querySelector("[data-cart-items]");
  const summaryContainer = document.querySelector("[data-cart-summary]");
  const checkoutSection = document.querySelector("[data-checkout-section]");
  if (!cartContainer || !summaryContainer) {
    return;
  }

  const cart = getCart();

  if (!cart.length) {
    if (checkoutSection) {
      checkoutSection.hidden = true;
    }
    cartContainer.innerHTML = `
      <div class="empty-state">
        <h3>Your cart is empty</h3>
        <p>Add a few press-on sets and they will appear here instantly.</p>
        <a href="product.html" class="normal-link">Shop products</a>
      </div>
    `;
    summaryContainer.innerHTML = `
      <div class="summary-card">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><strong>$0</strong></div>
        <div class="summary-row"><span>Shipping</span><strong>$0</strong></div>
        <div class="summary-row total"><span>Total</span><strong>$0</strong></div>
      </div>
    `;
    return;
  }

  cartContainer.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-copy">
        <h3>${item.name}</h3>
        <p>$${item.price} each</p>
      </div>
      <label class="qty-label">
        Qty
        <input type="number" min="1" value="${item.quantity}" data-qty-input="${item.id}">
      </label>
      <div class="cart-item-total">$${item.price * item.quantity}</div>
      <button type="button" class="remove-btn" data-remove-item="${item.id}">Remove</button>
    </article>
  `).join("");

  const totals = cartTotals(cart);
  summaryContainer.innerHTML = `
      <div class="summary-card">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><strong>$${totals.subtotal}</strong></div>
        <div class="summary-row"><span>Shipping</span><strong>$${totals.shipping}</strong></div>
        <div class="summary-row total"><span>Total</span><strong>$${totals.total}</strong></div>
      <button type="button" class="normal checkout-btn">Open Checkout Form</button>
      <button type="button" class="secondary-btn" data-clear-cart>Clear Cart</button>
    </div>
  `;

  syncCheckoutTotal(totals.total);
}

function syncCheckoutTotal(total) {
  const totalInput = document.querySelector("#checkout-total");
  if (totalInput) {
    totalInput.value = `$${total}`;
  }
}

function openCheckout() {
  const cart = getCart();
  if (!cart.length) {
    showToast("Add products before checkout");
    return;
  }

  const totals = cartTotals(cart);
  const checkoutSection = document.querySelector("[data-checkout-section]");
  if (!checkoutSection) {
    return;
  }

  clearCheckoutStatus();
  syncCheckoutTotal(totals.total);
  checkoutSection.hidden = false;
  checkoutSection.scrollIntoView({ behavior: "smooth", block: "start" });
  showToast("Complete the checkout form to place your order");
}

function showToast(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function setCheckoutStatus(message, type = "info") {
  const status = document.querySelector("[data-checkout-status]");
  if (!status) {
    return;
  }

  status.textContent = message;
  status.className = `checkout-status ${type}`;
  status.hidden = false;
}

function clearCheckoutStatus() {
  const status = document.querySelector("[data-checkout-status]");
  if (!status) {
    return;
  }

  status.hidden = true;
  status.textContent = "";
  status.className = "checkout-status";
}

function handleContactForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const subject = formData.get("subject");
  const message = formData.get("message");

  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:${orderRecipient}?subject=${encodeURIComponent(subject)}&body=${body}`;
  form.reset();
  showToast("Your email draft is ready to send");
}

function toggleCheckoutSubmit() {
  const form = document.querySelector("[data-checkout-form]");
  const submitWrap = document.querySelector("[data-checkout-submit-wrap]");
  if (!form || !submitWrap) {
    return;
  }

  submitWrap.hidden = !form.checkValidity();
}

async function handleCheckoutForm(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const cart = getCart();
  if (!cart.length) {
    showToast("Your cart is empty");
    return;
  }

  const formData = new FormData(form);
  const totals = cartTotals(cart);
  const lines = cart.map((item) => `- ${item.name} x${item.quantity} = $${item.price * item.quantity}`);
  const fullPhone = `${formData.get("countryCode")} ${formData.get("phone")}`;
  const payload = new FormData();

  payload.append("_subject", `New LuxeTips Order - ${formData.get("fullName")}`);
  payload.append("_captcha", "false");
  payload.append("_template", "table");
  payload.append("Full Name", formData.get("fullName"));
  payload.append("Phone Number", fullPhone);
  payload.append("Email Address", formData.get("email"));
  payload.append("City", formData.get("city"));
  payload.append("Country", formData.get("country"));
  payload.append("Postal Code", formData.get("postalCode"));
  payload.append("Permanent Address", formData.get("address"));
  payload.append("Order Items", lines.join("\n"));
  payload.append("Subtotal", `$${totals.subtotal}`);
  payload.append("Shipping", `$${totals.shipping}`);
  payload.append("Total Amount", `$${totals.total}`);

  clearCheckoutStatus();
  setCheckoutStatus("Submitting your order...", "info");

  try {
    const response = await fetch(orderApiEndpoint, {
      method: "POST",
      headers: {
        Accept: "application/json"
      },
      body: payload
    });

    if (!response.ok) {
      throw new Error("Order request failed");
    }
  } catch (error) {
    setCheckoutStatus("Order email could not be sent from this static site without a live email service connection.", "error");
    showToast("Order submission failed");
    return;
  }

  form.reset();
  saveCart([]);
  setCheckoutStatus(`Order placed successfully on LuxeTips. Total amount: $${totals.total}.`, "success");
  showToast("Order placed successfully");
  toggleCheckoutSubmit();
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      addToCart(addButton.getAttribute("data-add-to-cart"));
      return;
    }

    const removeButton = event.target.closest("[data-remove-item]");
    if (removeButton) {
      removeCartItem(removeButton.getAttribute("data-remove-item"));
      return;
    }

    if (event.target.closest("[data-clear-cart]")) {
      clearCart();
      return;
    }

    if (event.target.closest(".checkout-btn")) {
      openCheckout();
    }
  });

  document.addEventListener("change", (event) => {
    const qtyInput = event.target.closest("[data-qty-input]");
    if (qtyInput) {
      const quantity = Number(qtyInput.value);
      updateCartItem(qtyInput.getAttribute("data-qty-input"), quantity);
    }
  });

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm);
  }

  const checkoutForm = document.querySelector("[data-checkout-form]");
  if (checkoutForm) {
    checkoutForm.addEventListener("input", toggleCheckoutSubmit);
    checkoutForm.addEventListener("input", clearCheckoutStatus);
    checkoutForm.addEventListener("submit", handleCheckoutForm);
    toggleCheckoutSubmit();
  }
}

function setActiveNav() {
  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === page);
  });
}

function renderPageContent() {
  renderProductGrid("[data-featured-products]", products.slice(0, 8));
  renderProductGrid("[data-new-products]", products.slice(8));
  renderProductGrid("[data-all-products]", products);
  renderCartPage();
}

document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  bindEvents();
  renderPageContent();
  updateCartCount();
});
