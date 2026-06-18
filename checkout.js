document.addEventListener('DOMContentLoaded', () => {

  const SHIPPING_COST = 15000;
  const DISCOUNT_RATE = 0.10; 

  let cartItems = [
    { id: 1, name: 'Eco Cutlery Set', desc: 'BIOLOGICAL PLASTIC - 4 PO DAYS', price: 45000, qty: 1, img: 'assets/AssetFolderHCI-Lec/Sustainable Catering_ How to Reduce Waste and…_imgupscaler.ai_Beta_2K.jpg' },
    { id: 2, name: 'Recycled Tote Bag', desc: 'RECYCLED COTTON - 2 PO DAYS', price: 85000, qty: 1, img: 'assets/AssetFolderHCI-Lec/NewCatalog2.jpg' },
    { id: 3, name: 'Stone Paper Notebook', desc: 'RECYCLED PAPER - 4 PO DAYS', price: 65000, qty: 1, img: 'assets/AssetFolderHCI-Lec/This Zero Waste Drawing Might Inspire You to Change Your Life.jpg' },
    { id: 4, name: 'Bamboo Organizer', desc: 'BAMBOO - 7 PO DAYS', price: 120000, qty: 1, img: 'assets/AssetFolderHCI-Lec/Catalog1.jpeg' }
  ];

  const cartContainer = document.getElementById('cart-container');
  
  const formatCurrency = (num) => {
    return 'RP. ' + num.toLocaleString('id-ID').replace(/,/g, '.');
  };

  const renderCart = () => {
    if (cartItems.length === 0) {
      cartContainer.innerHTML = '<div style="color: #FAF7F2; text-align: center; padding: 40px;">Your cart is empty.</div>';
      updateTotals();
      return;
    }

    cartContainer.innerHTML = cartItems.map((item) => `
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

  const attachCartListeners = () => {
    document.querySelectorAll('.btn-inc').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = cartItems.find(i => i.id === id);
        if (!item) return;  
        item.qty++;
        renderCart();
      });
    });

    document.querySelectorAll('.btn-dec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = cartItems.find(i => i.id === id);
        if (!item || item.qty <= 1) return; 
        item.qty--;
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

  const paymentTabs = document.querySelectorAll('.payment-method');
  const ccInputFields = document.getElementById('cc-input-fields');

  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      paymentTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      if (tab.dataset.method === 'digital') {
        ccInputFields.style.display = 'none'; 
      } else {
        ccInputFields.style.display = 'block'; 
      }
    });
  });

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
        checkoutBtn.innerHTML = 'Check Out ✔️'; 
        checkoutBtn.disabled = false;
        cartItems = [];
        renderCart();
      }, 1500);
    });
  }

  renderCart();
});