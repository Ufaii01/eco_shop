document.addEventListener('DOMContentLoaded', () => {
  // Configuration
  const SHIPPING_COST = 15000;
  const DISCOUNT_RATE = 0.10; // 10% discount

  // Initial Cart Data (matching the 4 items from the design)
  let cartItems = [
    { id: 1, name: 'PRODUCT NAME', desc: 'PREORDER DAYS', price: 45000, qty: 1, img: 'https://images.unsplash.com/photo-1607006411204-62986420d418?w=200&q=80' },
    { id: 2, name: 'PRODUCT NAME', desc: 'PREORDER DAYS', price: 45000, qty: 1, img: 'https://images.unsplash.com/photo-1607006411204-62986420d418?w=200&q=80' },
    { id: 3, name: 'PRODUCT NAME', desc: 'PREORDER DAYS', price: 45000, qty: 1, img: 'https://images.unsplash.com/photo-1607006411204-62986420d418?w=200&q=80' },
    { id: 4, name: 'PRODUCT NAME', desc: 'PREORDER DAYS', price: 45000, qty: 1, img: 'https://images.unsplash.com/photo-1607006411204-62986420d418?w=200&q=80' }
  ];

  const cartContainer = document.getElementById('cart-container');
  
  // Formatting utility
  const formatCurrency = (num) => {
    return 'RP. ' + num.toLocaleString('id-ID').replace(/,/g, '.');
  };

  // Render Cart
  const renderCart = () => {
    if (cartItems.length === 0) {
      cartContainer.innerHTML = '<div style="color: #FAF7F2; text-align: center; padding: 40px;">Your cart is empty.</div>';
      updateTotals();
      return;
    }

    cartContainer.innerHTML = cartItems.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item__image-wrap">
          <img src="${item.img}" alt="Product Image" class="cart-item__image">
        </div>
        <div class="cart-item__content">
          <div class="cart-item__details">
            <h3 class="cart-item__name title-font">${item.name}</h3>
            <p class="cart-item__meta">${item.desc}</p>
            <p class="cart-item__price title-font">${formatCurrency(item.price)}</p>
          </div>
          <div class="cart-item__actions">
            <div class="qty-selector">
              <button type="button" class="qty-selector__btn btn-dec" data-id="${item.id}">-</button>
              <span class="qty-selector__value">${item.qty}</span>
              <button type="button" class="qty-selector__btn btn-inc" data-id="${item.id}">+</button>
            </div>
            <button type="button" class="cart-item__delete btn-del" data-id="${item.id}">DELETE 🗑</button>
          </div>
        </div>
      </div>
    `).join('');

    attachCartListeners();
    updateTotals();
  };

  // Handle Events for Cart Items
  const attachCartListeners = () => {
    document.querySelectorAll('.btn-inc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = cartItems.find(i => i.id === id);
        if (item) item.qty++;
        renderCart();
      });
    });

    document.querySelectorAll('.btn-dec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = cartItems.find(i => i.id === id);
        if (item && item.qty > 1) item.qty--;
        renderCart();
      });
    });

    document.querySelectorAll('.btn-del').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        cartItems = cartItems.filter(i => i.id !== id);
        renderCart();
      });
    });
  };

  // Update Summary Totals
  const updateTotals = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const discount = cartItems.length > 0 ? Math.round(subtotal * DISCOUNT_RATE) : 0;
    const shipping = cartItems.length > 0 ? SHIPPING_COST : 0;
    const total = subtotal + shipping - discount;

    document.getElementById('summ-subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('summ-shipping').textContent = formatCurrency(shipping);
    document.getElementById('summ-discount').textContent = formatCurrency(discount);
    document.getElementById('summ-total').textContent = formatCurrency(total);
  };

  // Initialize Payment Tabs
  const paymentTabs = document.querySelectorAll('.payment-method');
  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paymentTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
    });
  });

  // Input Formatting
  const cardNumberInput = document.getElementById('card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      value = value.replace(/(.{4})/g, '$1 ').trim();
      e.target.value = value;
    });
  }

  const cardExpiryInput = document.getElementById('card-expiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 3) {
        value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }

  // Checkout Button
  const checkoutBtn = document.getElementById('btn-checkout');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if(cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
      }
      
      checkoutBtn.innerHTML = 'Processing...';
      checkoutBtn.disabled = true;
      
      setTimeout(() => {
        alert('Order Placed Successfully!');
        checkoutBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4l3 3"></path></svg> Check Out';
        checkoutBtn.disabled = false;
        cartItems = [];
        renderCart();
      }, 1500);
    });
  }

  // Initial Render
  renderCart();
});