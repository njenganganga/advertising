(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Lenis provides smooth, eased scrolling. Native scrolling remains available
  // when the library is blocked or reduced motion is enabled.
  function startSmoothScroll() {
    if (reducedMotion || !window.Lenis) return;
    const lenis = new window.Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.15,
      anchors: true,
    });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
  if (document.readyState === "complete") startSmoothScroll();
  else window.addEventListener("load", startSmoothScroll, { once: true });

  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".nav-links");
  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const expanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!expanded));
      menuButton.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
      menuButton.textContent = expanded ? "☰" : "×";
      menu.classList.toggle("open", !expanded);
    });
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      menu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.textContent = "☰";
    }));
  }

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    const track = carousel.querySelector("[data-track]");
    const progress = carousel.querySelector("[data-progress]");
    const previous = carousel.querySelector("[data-prev]");
    const next = carousel.querySelector("[data-next]");
    if (!track) return;
    const amount = () => Math.max(track.clientWidth * 0.78, 250);
    previous?.addEventListener("click", () => track.scrollBy({ left: -amount(), behavior: reducedMotion ? "instant" : "smooth" }));
    next?.addEventListener("click", () => track.scrollBy({ left: amount(), behavior: reducedMotion ? "instant" : "smooth" }));
    const update = () => {
      if (!progress) return;
      const maximum = track.scrollWidth - track.clientWidth;
      progress.style.width = maximum <= 0 ? "100%" : `${Math.max(25, 25 + (track.scrollLeft / maximum) * 75)}%`;
    };
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  // Browser-only demo cart. It persists between pages using localStorage.
  // Checkout records a local demo order only; it never handles real payments.
  const products = {
    "home hub.jpg": { id: "home-hub", name: "Home Hub", price: 8.49 },
    "lighting system.jpg": { id: "lighting", name: "Smart Lighting System", price: 15.49 },
    "security camera.jpg": { id: "security-camera", name: "Smart Security Camera", price: 8.99 },
    "doorbell.jpg": { id: "doorbell", name: "Smart Doorbell Camera", price: 12.79 },
    "smoke detector.jpg": { id: "smoke-detector", name: "Smart Smoke & CO Detector", price: 19.99 },
    "smart plug.jpg": { id: "smart-plug", name: "Smart Plug", price: 24.99 },
    "smart blinds.jpg": { id: "smart-blinds", name: "Smart Blinds", price: 6.49 },
    "smart lock.jpg": { id: "smart-lock", name: "Smart Lock", price: 8.49 },
    "smart speaker.jpg": { id: "smart-speaker", name: "Smart Speaker", price: 68.49 },
    "smart tv.jpg": { id: "smart-tv", name: "Smart TV", price: 118.49 },
    "irrigation.jpg": { id: "irrigation", name: "Irrigation System", price: 28.49 },
  };
  const money = (amount) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
  const loadCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("promovista-cart") || "[]");
      return Array.isArray(saved) ? saved.filter((item) => products[item.id] && Number.isInteger(item.quantity) && item.quantity > 0) : [];
    } catch {
      return [];
    }
  };
  let cart = loadCart();
  const saveCart = () => localStorage.setItem("promovista-cart", JSON.stringify(cart));
  const quantityInCart = () => cart.reduce((sum, item) => sum + item.quantity, 0);
  const productById = (id) => Object.values(products).find((product) => product.id === id);

  // Load cart-only styles without changing the existing page templates.
  if (!document.querySelector('link[data-cart-styles]')) {
    const styles = document.createElement("link");
    styles.rel = "stylesheet";
    styles.href = "cart.css";
    styles.dataset.cartStyles = "true";
    document.head.append(styles);
  }

  const cartNav = document.createElement("a");
  cartNav.className = "nav-cta cart-nav-link";
  cartNav.href = "#shopping-cart";
  cartNav.innerHTML = 'Cart <span class="cart-count" aria-live="polite">0</span> <b aria-hidden="true">↗</b>';
  const nav = document.querySelector(".nav-wrap");
  if (nav) nav.append(cartNav);

  const productCards = [...document.querySelectorAll(".shop-card, .catalog-card")];
  if (!productCards.length) {
    cartNav.href = "shop.html#shopping-cart";
    cartNav.classList.add("cart-nav-remote");
  }

  const cartSection = document.createElement("section");
  cartSection.className = "shopping-cart-section";
  cartSection.id = "shopping-cart";
  cartSection.setAttribute("aria-labelledby", "cart-title");
  cartSection.innerHTML = `
    <div class="cart-heading"><div><p class="cart-eyebrow">YOUR PROMOVISTA BAG</p><h2 id="cart-title">A little more <em>ease.</em></h2></div><p class="cart-note">Your cart is saved in this browser while you browse.</p></div>
    <div class="cart-layout"><div class="cart-items" aria-live="polite"></div><aside class="cart-summary"><p class="cart-eyebrow">ORDER SUMMARY</p><div class="cart-summary-line"><span>Subtotal</span><strong data-subtotal>$0.00</strong></div><div class="cart-summary-line"><span>Delivery</span><strong data-shipping>Calculated at checkout</strong></div><div class="cart-summary-line cart-total"><span>Total</span><strong data-total>$0.00</strong></div>
      <form class="checkout-form"><h3>Checkout details</h3><label>Full name<input name="customer-name" autocomplete="name" required maxlength="100" placeholder="Your name"></label><label>Email address<input name="customer-email" type="email" autocomplete="email" required maxlength="160" placeholder="you@example.com"></label><fieldset><legend>Choose a payment method</legend><label class="payment-option"><input type="radio" name="payment-method" value="card" required><span><b>Credit or debit card</b><small>Visa · Mastercard · Amex (demo)</small></span></label><label class="payment-option"><input type="radio" name="payment-method" value="paypal"><span><b>PayPal</b><small>Demo checkout only</small></span></label><label class="payment-option"><input type="radio" name="payment-method" value="mobile-money"><span><b>Mobile Money</b><small>M-Pesa / mobile wallet (demo)</small></span></label></fieldset><p class="demo-disclaimer">Demo checkout only. No payment details are requested, no money is charged, and no order is sent to a retailer.</p><button class="button button-ember checkout-button" type="submit">Place demo order <span>↗</span></button><p class="checkout-message" role="status" aria-live="polite"></p></form>
    </aside></div>`;
  const renderCart = () => {
    document.querySelectorAll(".cart-count").forEach((badge) => { badge.textContent = String(quantityInCart()); });
    const itemsBox = cartSection.querySelector(".cart-items");
    if (!itemsBox) return;
    itemsBox.replaceChildren();
    if (!cart.length) {
      const empty = document.createElement("div");
      empty.className = "cart-empty";
      empty.innerHTML = '<span aria-hidden="true">⌂</span><h3>Your bag is taking a breather.</h3><p>Add something from the collection and it will be waiting here.</p><a href="shop.html#shop-list">Browse the shop ↗</a>';
      itemsBox.append(empty);
    } else {
      cart.forEach((item) => {
        const product = productById(item.id);
        if (!product) return;
        const row = document.createElement("article");
        row.className = "cart-item";
        const name = document.createElement("div");
        name.className = "cart-item-details";
        name.innerHTML = `<span class="cart-item-mark">⌂</span><span><strong></strong><small>${money(product.price)} each</small></span>`;
        name.querySelector("strong").textContent = product.name;
        const qty = document.createElement("div");
        qty.className = "cart-quantity";
        qty.setAttribute("aria-label", `Quantity for ${product.name}`);
        qty.innerHTML = `<button type="button" data-action="decrease" aria-label="Decrease ${product.name} quantity">−</button><span>${item.quantity}</span><button type="button" data-action="increase" aria-label="Increase ${product.name} quantity">+</button>`;
        qty.addEventListener("click", (event) => {
          const action = event.target.closest("button")?.dataset.action;
          if (!action) return;
          item.quantity += action === "increase" ? 1 : -1;
          if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== item.id);
          saveCart(); renderCart();
        });
        const price = document.createElement("strong");
        price.className = "cart-item-total";
        price.textContent = money(product.price * item.quantity);
        const remove = document.createElement("button");
        remove.className = "cart-remove";
        remove.type = "button";
        remove.textContent = "Remove";
        remove.setAttribute("aria-label", `Remove ${product.name} from cart`);
        remove.addEventListener("click", () => { cart = cart.filter((entry) => entry.id !== item.id); saveCart(); renderCart(); });
        row.append(name, qty, price, remove);
        itemsBox.append(row);
      });
    }
    const subtotal = cart.reduce((sum, item) => sum + productById(item.id).price * item.quantity, 0);
    cartSection.querySelector("[data-subtotal]").textContent = money(subtotal);
    cartSection.querySelector("[data-total]").textContent = money(subtotal);
    cartSection.querySelector("[data-shipping]").textContent = cart.length ? "Shown by retailer" : "—";
    const checkout = cartSection.querySelector(".checkout-button");
    checkout.disabled = !cart.length;
  };

  if (productCards.length) {
    productCards.forEach((card) => {
      const image = card.querySelector(".shop-image img, .catalog-image img");
      if (!image) return;
      let filename = image.getAttribute("src") || "";
      try { filename = decodeURIComponent(filename.split("/").pop()).toLowerCase(); } catch { filename = filename.toLowerCase(); }
      const product = products[filename];
      if (!product) return;
      const controls = document.createElement("div");
      controls.className = "product-cart-controls";
      controls.innerHTML = '<label>Qty <input type="number" min="1" max="99" value="1" inputmode="numeric" aria-label="Quantity"></label><button type="button" class="add-to-cart">Add to cart <span aria-hidden="true">+</span></button>';
      const price = card.querySelector(".shop-buy strong");
      if (price) price.textContent = money(product.price);
      controls.querySelector("button").addEventListener("click", () => {
        const input = controls.querySelector("input");
        const quantity = Math.min(99, Math.max(1, Number.parseInt(input.value, 10) || 1));
        input.value = String(quantity);
        const existing = cart.find((item) => item.id === product.id);
        if (existing) existing.quantity = Math.min(99, existing.quantity + quantity);
        else cart.push({ id: product.id, quantity });
        saveCart(); renderCart();
        const button = controls.querySelector("button");
        button.innerHTML = 'Added <span aria-hidden="true">✓</span>';
        window.setTimeout(() => { button.innerHTML = 'Add to cart <span aria-hidden="true">+</span>'; }, 1200);
      });
      const target = card.querySelector(".shop-buy") || card.querySelector(".catalog-copy");
      if (target) target.append(controls);
    });

    const host = document.querySelector(".shop-section, .catalog-section");
    if (host) {
      const closing = host.nextElementSibling;
      if (closing?.classList.contains("shop-footer-cta") || closing?.classList.contains("closing-cta")) host.after(cartSection);
      else host.append(cartSection);
    }
    cartSection.querySelector(".checkout-form").addEventListener("submit", (event) => {
      event.preventDefault();
      if (!cart.length) return;
      const form = event.currentTarget;
      const customer = form.elements["customer-name"].value.trim();
      const method = form.elements["payment-method"].value;
      const orderTotal = cart.reduce((sum, item) => sum + productById(item.id).price * item.quantity, 0);
      const orderId = `PV-${Date.now().toString().slice(-8)}`;
      const message = cartSection.querySelector(".checkout-message");
      message.textContent = `Demo order ${orderId} for ${customer} is ready (${money(orderTotal)} via ${method === "mobile-money" ? "Mobile Money" : method === "paypal" ? "PayPal" : "card"}). No payment was taken.`;
      cart = [];
      saveCart();
      form.reset();
      renderCart();
      cartSection.querySelector(".checkout-message").textContent = `Demo order ${orderId} for ${customer} is ready (${money(orderTotal)}). No payment was taken.`;
    });
  }
  renderCart();
})();
