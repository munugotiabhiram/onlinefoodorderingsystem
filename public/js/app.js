/**
 * Customer Dashboard Application Controller
 * Handles Categories, Menu Filters, Shopping Cart, Checkout,
 * Live 5-Stage Order Tracking, Profile, and Favorites
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Application State
  const state = {
    user: null,
    foods: [],
    categories: [],
    restaurants: [],
    coupons: [],
    selectedCategory: 'all',
    searchQuery: '',
    vegOnly: false,
    sortBy: 'popular',
    cart: [], // [{ id, name, price, quantity, image }]
    appliedCoupon: null,
    discountAmount: 0,
    selectedAddressId: null,
    selectedPaymentMethod: 'Demo Card Payment (Visa •••• 4242)',
    activeTrackOrder: null
  };

  // DOM Elements
  const navUserAvatar = document.getElementById('nav-user-avatar');
  const navUserName = document.getElementById('nav-user-name');
  const userProfileTrigger = document.getElementById('user-profile-trigger');
  const userDropdownMenu = document.getElementById('user-dropdown-menu');
  const menuUserName = document.getElementById('menu-user-name');
  const menuUserEmail = document.getElementById('menu-user-email');
  const menuUserBadge = document.getElementById('menu-user-badge');
  const adminSwitchContainer = document.getElementById('admin-switch-container');
  const heroWelcomeHeading = document.getElementById('hero-welcome-heading');
  const heroAccountBadge = document.getElementById('hero-account-badge');
  const btnLogout = document.getElementById('btn-logout');

  // Search & Filter DOM
  const foodSearchInput = document.getElementById('food-search-input');
  const categoriesContainer = document.getElementById('categories-container');
  const vegOnlyCheckbox = document.getElementById('veg-only-checkbox');
  const sortSelect = document.getElementById('sort-select');
  const foodResultsCount = document.getElementById('food-results-count');
  const foodsContainer = document.getElementById('foods-container');
  const restaurantsContainer = document.getElementById('restaurants-container');

  // Cart DOM
  const btnToggleCart = document.getElementById('btn-toggle-cart');
  const cartBadgeCount = document.getElementById('cart-badge-count');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const cartDrawer = document.getElementById('cart-drawer');
  const btnCloseCart = document.getElementById('btn-close-cart');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const couponInput = document.getElementById('coupon-input');
  const btnApplyCoupon = document.getElementById('btn-apply-coupon');
  const cartSubtotalVal = document.getElementById('cart-subtotal-val');
  const cartDiscountRow = document.getElementById('cart-discount-row');
  const cartDiscountVal = document.getElementById('cart-discount-val');
  const cartDeliveryVal = document.getElementById('cart-delivery-val');
  const cartTaxVal = document.getElementById('cart-tax-val');
  const cartTotalVal = document.getElementById('cart-total-val');
  const btnProceedCheckout = document.getElementById('btn-proceed-checkout');

  // Checkout Modal DOM
  const checkoutModal = document.getElementById('checkout-modal');
  const closeCheckoutModal = document.getElementById('close-checkout-modal');
  const btnCancelCheckout = document.getElementById('btn-cancel-checkout');
  const checkoutAddressesList = document.getElementById('checkout-addresses-list');
  const btnAddAddressQuick = document.getElementById('btn-add-address-quick');
  const newAddressFormWrap = document.getElementById('new-address-form-wrap');
  const btnSaveAddressAction = document.getElementById('btn-save-address-action');
  const checkoutTotalVal = document.getElementById('checkout-total-val');
  const btnConfirmOrder = document.getElementById('btn-confirm-order');

  // Tracking Modal DOM
  const trackingModal = document.getElementById('tracking-modal');
  const closeTrackingModal = document.getElementById('close-tracking-modal');
  const trackOrderIdTitle = document.getElementById('track-order-id-title');
  const trackOrderTimeSub = document.getElementById('track-order-time-sub');
  const trackingProgressBar = document.getElementById('tracking-progress-bar');
  const trackStatusLabel = document.getElementById('track-status-label');
  const trackDriverNote = document.getElementById('track-driver-note');
  const trackEtaVal = document.getElementById('track-eta-val');
  const trackReceiverName = document.getElementById('track-receiver-name');
  const trackDeliveryAddress = document.getElementById('track-delivery-address');
  const trackDriverName = document.getElementById('track-driver-name');
  const trackItemsList = document.getElementById('track-items-list');
  const btnAdvanceStageSimulate = document.getElementById('btn-advance-stage-simulate');

  // Profile Modal DOM
  const profileModal = document.getElementById('profile-modal');
  const closeProfileModal = document.getElementById('close-profile-modal');
  const btnOpenProfile = document.getElementById('btn-open-profile');
  const btnOpenOrders = document.getElementById('btn-open-orders');
  const btnOpenFavorites = document.getElementById('btn-open-favorites');
  const profileImgVal = document.getElementById('profile-img-val');
  const profileNameVal = document.getElementById('profile-name-val');
  const profileEmailVal = document.getElementById('profile-email-val');
  const profileRoleBadge = document.getElementById('profile-role-badge');
  const profileInputName = document.getElementById('profile-input-name');
  const profileInputPhone = document.getElementById('profile-input-phone');
  const btnSaveProfile = document.getElementById('btn-save-profile');
  const profileAddressesContainer = document.getElementById('profile-addresses-container');
  const profileOrdersContainer = document.getElementById('profile-orders-container');

  // 1. Initial Authentication & User Verification
  try {
    const res = await API.getCurrentUser();
    state.user = res.user;
    updateUserNavUI();
  } catch (err) {
    // If not authenticated, redirect to login
    window.location.href = '/index.html';
    return;
  }

  // Load saved cart from localStorage
  try {
    const savedCart = localStorage.getItem('ofos_cart');
    if (savedCart) state.cart = JSON.parse(savedCart);
  } catch (e) {
    state.cart = [];
  }

  function updateUserNavUI() {
    if (!state.user) return;
    const { name, email, avatar, role, isDemo } = state.user;
    
    navUserName.textContent = name;
    menuUserName.textContent = name;
    menuUserEmail.textContent = email;
    heroWelcomeHeading.textContent = `Welcome back, ${name.split(' ')[0]}! 👋`;
    
    if (avatar) {
      navUserAvatar.src = avatar;
      profileImgVal.src = avatar;
    }

    if (isDemo) {
      heroAccountBadge.textContent = role === 'admin' ? 'Store Administrator Demo' : 'Demo Customer Account';
      heroAccountBadge.className = role === 'admin' ? 'badge badge-warning' : 'badge badge-demo';
      menuUserBadge.innerHTML = `<span class="badge ${role === 'admin' ? 'badge-warning' : 'badge-demo'}">${role === 'admin' ? 'Admin Demo' : 'Demo Customer'}</span>`;
      profileRoleBadge.textContent = role === 'admin' ? 'Store Administrator Demo' : 'Demo Customer Account';
    } else {
      heroAccountBadge.textContent = 'Google Account Connected';
      heroAccountBadge.className = 'badge badge-success';
      menuUserBadge.innerHTML = `<span class="badge badge-success"><i class="fa-brands fa-google"></i> Google User</span>`;
      profileRoleBadge.textContent = 'Verified Google User';
    }

    if (role === 'admin') {
      adminSwitchContainer.style.display = 'block';
    }
  }

  // Dropdown toggle
  userProfileTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    userDropdownMenu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    userDropdownMenu.classList.remove('show');
  });

  btnLogout.addEventListener('click', () => API.logout());

  // 2. Fetch Initial Data (Categories, Foods, Restaurants, Coupons)
  async function loadData() {
    try {
      const [catsRes, restsRes, foodsRes, couponsRes] = await Promise.all([
        API.getCategories(),
        API.getRestaurants(),
        API.getFoods(),
        API.getCoupons()
      ]);

      state.categories = catsRes.data || [];
      state.restaurants = restsRes.data || [];
      state.foods = foodsRes.data || [];
      state.coupons = couponsRes.data || [];

      renderCategories();
      renderRestaurants();
      renderFoods();
      updateCartUI();
    } catch (err) {
      Toast.error('Failed to load menu data: ' + err.message);
    }
  }

  // 3. Render Categories Bar
  function renderCategories() {
    categoriesContainer.innerHTML = '';

    // "All Dishes" Pill
    const allPill = document.createElement('div');
    allPill.className = `category-pill ${state.selectedCategory === 'all' ? 'active' : ''}`;
    allPill.innerHTML = `<span>🍽️</span> <span>All Dishes</span>`;
    allPill.addEventListener('click', () => selectCategory('all'));
    categoriesContainer.appendChild(allPill);

    state.categories.forEach(cat => {
      const pill = document.createElement('div');
      pill.className = `category-pill ${state.selectedCategory === cat.slug ? 'active' : ''}`;
      pill.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span>`;
      pill.addEventListener('click', () => selectCategory(cat.slug));
      categoriesContainer.appendChild(pill);
    });
  }

  function selectCategory(slug) {
    state.selectedCategory = slug;
    renderCategories();
    renderFoods();
  }

  // 4. Render Foods Grid
  function renderFoods() {
    let filtered = [...state.foods];

    // Category filter
    if (state.selectedCategory !== 'all') {
      filtered = filtered.filter(f => f.category.toLowerCase() === state.selectedCategory.toLowerCase());
    }

    // Search query filter
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        (f.restaurantName && f.restaurantName.toLowerCase().includes(q))
      );
    }

    // Veg only filter
    if (state.vegOnly) {
      filtered = filtered.filter(f => f.isVeg);
    }

    // Sort
    if (state.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      // popular
      filtered.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    foodResultsCount.textContent = filtered.length;
    foodsContainer.innerHTML = '';

    if (filtered.length === 0) {
      foodsContainer.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 48px; background: rgba(255,255,255,0.02); border-radius: 20px; border: 1px dashed rgba(255,255,255,0.1);">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 18px; font-weight: 700; color: #FFF; margin-bottom: 6px;">No dishes found</h3>
          <p style="font-size: 14px; color: var(--text-secondary);">Try clearing your search or category filters to explore our full menu.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(food => {
      const isFav = state.user && state.user.favorites && state.user.favorites.includes(food.id);
      const cartItem = state.cart.find(c => c.id === food.id);
      const inCartQty = cartItem ? cartItem.quantity : 0;

      const card = document.createElement('div');
      card.className = 'food-card card-3d';
      card.innerHTML = `
        <div class="food-card-img-wrapper">
          <img src="${food.image}" alt="${food.name}" class="food-card-img" loading="lazy">
          <div class="food-card-overlay">
            <div class="diet-tag" title="${food.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}">
              <div class="diet-dot ${food.isVeg ? 'veg' : 'non-veg'}"></div>
            </div>
            <button class="fav-btn ${isFav ? 'active' : ''}" data-food-id="${food.id}" title="${isFav ? 'Remove Favorite' : 'Save to Favorites'}">
              <i class="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>

        <div class="food-card-body">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--primary); letter-spacing: 0.5px;">
              ${food.category}
            </span>
            <div class="food-rating">
              <i class="fa-solid fa-star"></i>
              <span>${food.rating}</span>
              <span style="font-size: 11px; color: var(--text-muted); font-weight: 400;">(${food.reviewsCount})</span>
            </div>
          </div>

          <h4 class="food-title">${food.name}</h4>
          <p class="food-desc">${food.description}</p>

          <div class="food-meta">
            <span><i class="fa-solid fa-clock"></i> ${food.prepTime}</span>
            <span><i class="fa-solid fa-store"></i> ${food.restaurantName || 'Gourmet Kitchen'}</span>
          </div>

          <div class="food-card-footer">
            <div class="food-price"><span>$</span>${food.price.toFixed(2)}</div>
            <div id="cart-btn-slot-${food.id}">
              ${inCartQty > 0 ? `
                <div class="cart-qty-stepper">
                  <button class="qty-btn" onclick="window.decrementCartItem('${food.id}')">&minus;</button>
                  <span class="qty-count">${inCartQty}</span>
                  <button class="qty-btn" onclick="window.incrementCartItem('${food.id}')">&plus;</button>
                </div>
              ` : `
                <button class="btn btn-primary btn-sm" onclick="window.addFoodToCart('${food.id}')">
                  <i class="fa-solid fa-plus"></i> Add
                </button>
              `}
            </div>
          </div>
        </div>
      `;

      // Favorite toggle event
      const favBtn = card.querySelector('.fav-btn');
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(food.id, favBtn);
      });

      foodsContainer.appendChild(card);
    });
  }

  // 5. Render Featured Restaurants
  function renderRestaurants() {
    restaurantsContainer.innerHTML = '';
    state.restaurants.forEach(rest => {
      const card = document.createElement('div');
      card.className = 'restaurant-card card-3d';
      card.innerHTML = `
        <div class="restaurant-img-wrap">
          <img src="${rest.image}" alt="${rest.name}" class="restaurant-img" loading="lazy">
        </div>
        <div class="restaurant-info">
          <h4 class="restaurant-name">${rest.name}</h4>
          <p class="restaurant-cuisine">${rest.cuisine}</p>
          <div class="restaurant-meta">
            <span style="color: #FBBF24;"><i class="fa-solid fa-star"></i> ${rest.rating}</span>
            <span style="color: var(--text-muted);"><i class="fa-solid fa-clock"></i> ${rest.deliveryTime}</span>
            <span class="badge badge-primary" style="font-size: 11px;">${rest.tag || 'Popular'}</span>
          </div>
        </div>
      `;
      card.addEventListener('click', () => {
        foodSearchInput.value = rest.name;
        state.searchQuery = rest.name;
        renderFoods();
      });
      restaurantsContainer.appendChild(card);
    });
  }

  // 6. Search, Veg Switch, and Sort Event Listeners
  let searchTimeout = null;
  foodSearchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = e.target.value.trim();
      renderFoods();
    }, 250);
  });

  vegOnlyCheckbox.addEventListener('change', (e) => {
    state.vegOnly = e.target.checked;
    renderFoods();
  });

  sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderFoods();
  });

  // 7. Cart Functionality
  window.addFoodToCart = function(foodId) {
    const food = state.foods.find(f => f.id === foodId);
    if (!food) return;

    const existing = state.cart.find(c => c.id === foodId);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.cart.push({
        id: food.id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity: 1
      });
    }

    saveCartState();
    updateCartUI();
    renderFoods();
    Toast.success(`Added ${food.name} to cart!`);
  };

  window.incrementCartItem = function(foodId) {
    const item = state.cart.find(c => c.id === foodId);
    if (item) {
      item.quantity += 1;
      saveCartState();
      updateCartUI();
      renderFoods();
    }
  };

  window.decrementCartItem = function(foodId) {
    const idx = state.cart.findIndex(c => c.id === foodId);
    if (idx !== -1) {
      state.cart[idx].quantity -= 1;
      if (state.cart[idx].quantity <= 0) {
        state.cart.splice(idx, 1);
      }
      saveCartState();
      updateCartUI();
      renderFoods();
    }
  };

  function saveCartState() {
    localStorage.setItem('ofos_cart', JSON.stringify(state.cart));
  }

  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadgeCount.textContent = totalItems;

    let subtotal = 0;
    cartItemsContainer.innerHTML = '';

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
          <i class="fa-solid fa-basket-shopping" style="font-size: 42px; margin-bottom: 12px; color: rgba(255,255,255,0.2);"></i>
          <p style="font-size: 15px; font-weight: 700; color: #FFF; margin-bottom: 4px;">Your cart is hungry!</p>
          <p style="font-size: 13px;">Add mouth-watering dishes from the menu to start ordering.</p>
        </div>
      `;
    } else {
      state.cart.forEach(item => {
        subtotal += item.price * item.quantity;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
          <div class="cart-qty-stepper">
            <button class="qty-btn" onclick="window.decrementCartItem('${item.id}')">&minus;</button>
            <span class="qty-count">${item.quantity}</span>
            <button class="qty-btn" onclick="window.incrementCartItem('${item.id}')">&plus;</button>
          </div>
        `;
        cartItemsContainer.appendChild(row);
      });
    }

    // Delivery calculation
    let deliveryFee = subtotal >= 40 || subtotal === 0 ? 0.00 : 2.99;
    if (state.appliedCoupon && state.appliedCoupon.freeDelivery) {
      deliveryFee = 0.00;
    }

    // Coupon discount calculation
    state.discountAmount = 0;
    if (state.appliedCoupon && subtotal > 0) {
      if (state.appliedCoupon.discountPercent) {
        let calc = (subtotal * state.appliedCoupon.discountPercent) / 100;
        if (state.appliedCoupon.maxDiscount && calc > state.appliedCoupon.maxDiscount) {
          calc = state.appliedCoupon.maxDiscount;
        }
        state.discountAmount = calc;
      }
    }

    if (state.discountAmount > 0) {
      cartDiscountRow.style.display = 'flex';
      cartDiscountVal.textContent = `-$${state.discountAmount.toFixed(2)}`;
    } else {
      cartDiscountRow.style.display = 'none';
    }

    const taxable = Math.max(0, subtotal - state.discountAmount);
    const taxes = taxable > 0 ? taxable * 0.05 : 0;
    const finalTotal = subtotal > 0 ? (taxable + deliveryFee + taxes) : 0;

    cartSubtotalVal.textContent = `$${subtotal.toFixed(2)}`;
    cartDeliveryVal.textContent = deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`;
    cartTaxVal.textContent = `$${taxes.toFixed(2)}`;
    cartTotalVal.textContent = `$${finalTotal.toFixed(2)}`;
    checkoutTotalVal.textContent = `$${finalTotal.toFixed(2)}`;
  }

  // Cart Drawer open/close
  btnToggleCart.addEventListener('click', () => {
    cartDrawerOverlay.classList.add('active');
    cartDrawer.classList.add('active');
  });

  function closeCartDrawer() {
    cartDrawerOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
  }

  btnCloseCart.addEventListener('click', closeCartDrawer);
  cartDrawerOverlay.addEventListener('click', closeCartDrawer);

  // Promo code pills click to apply
  document.querySelectorAll('.promo-code-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const code = pill.getAttribute('data-code');
      couponInput.value = code;
      applyCouponCode(code);
    });
  });

  btnApplyCoupon.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    if (!code) {
      Toast.error('Please enter a coupon code.');
      return;
    }
    applyCouponCode(code);
  });

  function applyCouponCode(code) {
    const coupon = state.coupons.find(c => c.code.toUpperCase() === code);
    if (!coupon) {
      Toast.error(`Invalid coupon code "${code}". Try WELCOME50 or FOODIE30.`);
      return;
    }

    let subtotal = state.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      Toast.error(`Coupon requires a minimum order of $${coupon.minOrder}. Current subtotal is $${subtotal.toFixed(2)}.`);
      return;
    }

    state.appliedCoupon = coupon;
    updateCartUI();
    Toast.success(`Coupon ${code} applied successfully! (${coupon.description})`);
  }

  // 8. Checkout Modal Flow
  btnProceedCheckout.addEventListener('click', () => {
    if (state.cart.length === 0) {
      Toast.error('Your cart is empty. Please add items before checkout.');
      return;
    }
    closeCartDrawer();
    renderCheckoutAddresses();
    checkoutModal.classList.add('active');
  });

  closeCheckoutModal.addEventListener('click', () => checkoutModal.classList.remove('active'));
  btnCancelCheckout.addEventListener('click', () => checkoutModal.classList.remove('active'));

  function renderCheckoutAddresses() {
    checkoutAddressesList.innerHTML = '';
    const addresses = (state.user && state.user.addresses) || [];

    if (addresses.length === 0) {
      checkoutAddressesList.innerHTML = `
        <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
          No saved addresses found. Please add a delivery address below.
        </div>
      `;
      newAddressFormWrap.style.display = 'block';
      return;
    }

    addresses.forEach((addr, idx) => {
      const card = document.createElement('div');
      const isSelected = (!state.selectedAddressId && addr.isDefault) || state.selectedAddressId === addr.id || (!state.selectedAddressId && idx === 0);
      if (isSelected) state.selectedAddressId = addr.id;

      card.className = `address-card-option ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <strong style="color: #FFF; font-size: 14px;">${addr.label} &bull; ${addr.receiverName}</strong>
          ${addr.isDefault ? '<span class="badge badge-primary" style="font-size: 10px;">Default</span>' : ''}
        </div>
        <div style="font-size: 13px; color: var(--text-secondary);">${addr.street}, ${addr.city} (${addr.phone})</div>
      `;

      card.addEventListener('click', () => {
        state.selectedAddressId = addr.id;
        renderCheckoutAddresses();
      });

      checkoutAddressesList.appendChild(card);
    });
  }

  btnAddAddressQuick.addEventListener('click', () => {
    newAddressFormWrap.style.display = newAddressFormWrap.style.display === 'none' ? 'block' : 'none';
  });

  btnSaveAddressAction.addEventListener('click', async () => {
    const street = document.getElementById('new-street-input').value.trim();
    const city = document.getElementById('new-city-input').value.trim();
    const phone = document.getElementById('new-phone-input').value.trim();

    if (!street || !city) {
      Toast.error('Please fill in street address and city.');
      return;
    }

    try {
      const res = await API.addAddress({
        label: 'Home',
        receiverName: state.user.name,
        phone: phone || state.user.phone || '+1 (555) 000-0000',
        street,
        city,
        isDefault: true
      });
      state.user.addresses = res.addresses;
      state.selectedAddressId = res.addresses[res.addresses.length - 1].id;
      newAddressFormWrap.style.display = 'none';
      renderCheckoutAddresses();
      Toast.success('Address saved successfully!');
    } catch (err) {
      Toast.error('Failed to save address: ' + err.message);
    }
  });

  // Payment method selection
  document.querySelectorAll('.payment-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.payment-pill').forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      state.selectedPaymentMethod = pill.getAttribute('data-method');
    });
  });

  // Confirm and Place Order
  btnConfirmOrder.addEventListener('click', async () => {
    const addresses = (state.user && state.user.addresses) || [];
    let address = addresses.find(a => a.id === state.selectedAddressId);

    if (!address && addresses.length > 0) {
      address = addresses[0];
    }

    if (!address) {
      Toast.error('Please provide a delivery address before placing order.');
      newAddressFormWrap.style.display = 'block';
      return;
    }

    btnConfirmOrder.disabled = true;
    btnConfirmOrder.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Order...';

    try {
      const payload = {
        items: state.cart,
        deliveryAddress: address,
        couponCode: state.appliedCoupon ? state.appliedCoupon.code : null,
        paymentMethod: state.selectedPaymentMethod
      };

      const res = await API.createOrder(payload);
      checkoutModal.classList.remove('active');
      
      // Clear Cart
      state.cart = [];
      saveCartState();
      updateCartUI();
      renderFoods();

      Toast.success(`Order #${res.order.id} placed successfully!`);
      btnConfirmOrder.disabled = false;
      btnConfirmOrder.innerHTML = '<i class="fa-solid fa-check"></i> Place Food Order';

      // Automatically launch Live Order Tracking Modal
      openOrderTrackingModal(res.order);

    } catch (err) {
      Toast.error(err.message || 'Failed to place order.');
      btnConfirmOrder.disabled = false;
      btnConfirmOrder.innerHTML = '<i class="fa-solid fa-check"></i> Place Food Order';
    }
  });

  // 9. Order Tracking System
  function openOrderTrackingModal(order) {
    state.activeTrackOrder = order;
    trackOrderIdTitle.textContent = `Tracking Order: ${order.id}`;
    trackOrderTimeSub.textContent = `Placed on ${new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    updateTrackingView(order);
    trackingModal.classList.add('active');
  }

  function updateTrackingView(order) {
    const stage = order.statusStage || 1;
    
    // Update Stepper Progress Bar
    const progressWidths = { 1: '20%', 2: '40%', 3: '60%', 4: '80%', 5: '100%' };
    trackingProgressBar.style.width = progressWidths[stage] || '20%';

    for (let i = 1; i <= 5; i++) {
      const stepEl = document.getElementById(`track-step-${i}`);
      stepEl.className = 'step-item';
      if (i < stage) {
        stepEl.classList.add('completed');
      } else if (i === stage) {
        stepEl.classList.add('current');
      }
    }

    trackStatusLabel.textContent = order.statusLabel || 'Order Placed';
    trackEtaVal.textContent = order.estimatedDeliveryTime || '25-30 mins';

    // Status notes
    const notes = {
      1: 'Your order was received and confirmed by the kitchen',
      2: 'Restaurant accepted your order and began prep work',
      3: 'Chef is preparing and packaging your hot gourmet dishes',
      4: `Driver ${order.driverName || 'Carlos'} is speeding towards your door`,
      5: 'Order successfully delivered. Enjoy your meal!'
    };
    trackDriverNote.textContent = notes[stage] || notes[1];

    trackReceiverName.textContent = order.deliveryAddress ? order.deliveryAddress.receiverName : state.user.name;
    trackDeliveryAddress.textContent = order.deliveryAddress ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}` : 'Metro City';
    trackDriverName.textContent = order.driverName || 'Carlos Mendez';

    // Items list
    trackItemsList.innerHTML = '';
    (order.items || []).forEach(item => {
      const itemRow = document.createElement('div');
      itemRow.style.cssText = 'display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); background: rgba(255,255,255,0.02); padding: 8px 12px; border-radius: 6px;';
      itemRow.innerHTML = `
        <span>${item.quantity}x ${item.name}</span>
        <span style="font-weight: 700; color: #FFF;">$${(item.price * item.quantity).toFixed(2)}</span>
      `;
      trackItemsList.appendChild(itemRow);
    });

    if (stage >= 5) {
      btnAdvanceStageSimulate.disabled = true;
      btnAdvanceStageSimulate.innerHTML = '<i class="fa-solid fa-check"></i> Delivered';
    } else {
      btnAdvanceStageSimulate.disabled = false;
      btnAdvanceStageSimulate.innerHTML = '<i class="fa-solid fa-forward-step"></i> Next Stage &rarr;';
    }
  }

  closeTrackingModal.addEventListener('click', () => trackingModal.classList.remove('active'));

  // Live Simulation Next Stage Click
  btnAdvanceStageSimulate.addEventListener('click', async () => {
    if (!state.activeTrackOrder) return;
    btnAdvanceStageSimulate.disabled = true;

    try {
      const res = await API.advanceOrderStage(state.activeTrackOrder.id);
      state.activeTrackOrder = res.order;
      updateTrackingView(res.order);
      Toast.success(`Live update: ${res.order.statusLabel}`);
    } catch (err) {
      Toast.error('Simulation error: ' + err.message);
      btnAdvanceStageSimulate.disabled = false;
    }
  });

  // 10. User Profile Modal Flow
  btnOpenProfile.addEventListener('click', () => {
    userDropdownMenu.classList.remove('show');
    loadProfileDetails();
    profileModal.classList.add('active');
  });

  btnOpenOrders.addEventListener('click', () => {
    userDropdownMenu.classList.remove('show');
    loadProfileDetails();
    profileModal.classList.add('active');
  });

  btnOpenFavorites.addEventListener('click', () => {
    userDropdownMenu.classList.remove('show');
    state.selectedCategory = 'all';
    // Filter to favorites only
    if (state.user && state.user.favorites && state.user.favorites.length > 0) {
      const favFoods = state.foods.filter(f => state.user.favorites.includes(f.id));
      foodResultsCount.textContent = favFoods.length;
      foodsContainer.innerHTML = '';
      favFoods.forEach(food => {
        // reuse render food
      });
      Toast.info(`Showing ${favFoods.length} saved favorite dishes.`);
    } else {
      Toast.info('You have not added any favorite foods yet. Click the heart icon on any dish!');
    }
  });

  closeProfileModal.addEventListener('click', () => profileModal.classList.remove('active'));

  async function loadProfileDetails() {
    profileNameVal.textContent = state.user.name;
    profileEmailVal.textContent = state.user.email;
    profileInputName.value = state.user.name;
    profileInputPhone.value = state.user.phone || '';

    // Render Saved Addresses
    renderProfileAddresses();

    // Render Order History
    try {
      const ordersRes = await API.getOrders();
      renderProfileOrders(ordersRes.data || []);
    } catch (e) {
      profileOrdersContainer.innerHTML = '<div style="color: var(--text-muted);">Could not fetch orders.</div>';
    }
  }

  function renderProfileAddresses() {
    profileAddressesContainer.innerHTML = '';
    const addresses = (state.user && state.user.addresses) || [];

    if (addresses.length === 0) {
      profileAddressesContainer.innerHTML = '<div style="font-size: 13px; color: var(--text-muted);">No addresses added yet.</div>';
      return;
    }

    addresses.forEach(addr => {
      const row = document.createElement('div');
      row.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); padding: 12px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);';
      row.innerHTML = `
        <div>
          <div style="font-size: 14px; font-weight: 700; color: #FFF;">${addr.label}: ${addr.street}, ${addr.city}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${addr.receiverName} &bull; ${addr.phone}</div>
        </div>
        <button class="btn btn-secondary btn-sm" style="color: #EF4444;" onclick="window.deleteProfileAddress('${addr.id}')">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      `;
      profileAddressesContainer.appendChild(row);
    });
  }

  window.deleteProfileAddress = async function(addressId) {
    try {
      const res = await API.deleteAddress(addressId);
      state.user.addresses = res.addresses;
      renderProfileAddresses();
      Toast.success('Address removed.');
    } catch (err) {
      Toast.error('Failed to remove address: ' + err.message);
    }
  };

  function renderProfileOrders(orders) {
    profileOrdersContainer.innerHTML = '';
    if (orders.length === 0) {
      profileOrdersContainer.innerHTML = '<div style="font-size: 13px; color: var(--text-muted);">No orders placed yet.</div>';
      return;
    }

    orders.forEach(order => {
      const card = document.createElement('div');
      card.style.cssText = 'background: rgba(255,255,255,0.03); padding: 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center;';
      card.innerHTML = `
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <strong style="color: #FFF; font-size: 14px;">Order #${order.id}</strong>
            <span class="badge ${order.statusStage === 5 ? 'badge-success' : 'badge-warning'}" style="font-size: 11px;">
              ${order.statusLabel}
            </span>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">
            ${new Date(order.createdAt).toLocaleDateString()} &bull; ${order.items ? order.items.length : 0} items &bull; Total: $${order.totalAmount.toFixed(2)}
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.trackExistingOrder('${order.id}')">
          <i class="fa-solid fa-location-crosshairs"></i> Track
        </button>
      `;
      profileOrdersContainer.appendChild(card);
    });
  }

  window.trackExistingOrder = async function(orderId) {
    try {
      profileModal.classList.remove('active');
      const res = await API.getOrder(orderId);
      openOrderTrackingModal(res.order);
    } catch (err) {
      Toast.error('Could not load order tracking: ' + err.message);
    }
  };

  // Save profile edits
  btnSaveProfile.addEventListener('click', async () => {
    const name = profileInputName.value.trim();
    const phone = profileInputPhone.value.trim();

    if (!name) {
      Toast.error('Customer name cannot be empty.');
      return;
    }

    try {
      const res = await API.updateProfile({ name, phone });
      state.user = res.user;
      updateUserNavUI();
      Toast.success('Profile updated successfully!');
    } catch (err) {
      Toast.error('Failed to update profile: ' + err.message);
    }
  });

  // 11. Toggle Favorite Food
  async function toggleFavorite(foodId, favBtn) {
    try {
      const res = await API.toggleFavorite(foodId);
      if (res.isFavorite) {
        favBtn.classList.add('active');
        if (!state.user.favorites) state.user.favorites = [];
        state.user.favorites.push(foodId);
        Toast.success(res.message);
      } else {
        favBtn.classList.remove('active');
        if (state.user.favorites) {
          state.user.favorites = state.user.favorites.filter(id => id !== foodId);
        }
        Toast.info(res.message);
      }
    } catch (err) {
      Toast.error('Failed to toggle favorite: ' + err.message);
    }
  }

  // Load initial data
  loadData();
});
