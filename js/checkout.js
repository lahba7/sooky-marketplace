// ============================================
// SOOKY - SYSTÈME DE CHECKOUT COMPLET
// ============================================

// État du checkout
let checkoutData = {
  subtotal: 0,
  shipping: 30,
  discount: 0,
  total: 0,
  promoCode: null
};

// Codes promo disponibles
const promoCodes = {
  'BIENVENUE10': { type: 'percentage', value: 10, description: '10% de réduction' },
  'LIVRAISON': { type: 'shipping', value: 0, description: 'Livraison gratuite' },
  'SOOKY20': { type: 'percentage', value: 20, description: '20% de réduction' },
  'NOUVEAU15': { type: 'percentage', value: 15, description: '15% de réduction nouveaux clients' },
  'FIDELE25': { type: 'fixed', value: 25, description: '25 DH de réduction' }
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  initializeCheckout();
});

function initializeCheckout() {
  // Vérifier si le panier est vide
  const cart = JSON.parse(localStorage.getItem('sooky_cart') || '[]');
  if (cart.length === 0) {
    redirectToCart();
    return;
  }

  // Charger les données du panier
  loadOrderSummary();
  
  // Initialiser les événements
  initializePaymentMethods();
  initializeForm();
  
  // Pré-remplir les données utilisateur si connecté
  prefillUserData();
}

function redirectToCart() {
  alert('Votre panier est vide. Vous allez être redirigé vers la page d\'accueil.');
  window.location.href = '../index.html';
}

function loadOrderSummary() {
  const cart = JSON.parse(localStorage.getItem('sooky_cart') || '[]');
  const orderItemsContainer = document.getElementById('order-items');
  
  if (!orderItemsContainer) return;
  
  // Afficher les articles
  let itemsHTML = '';
  cart.forEach(item => {
    itemsHTML += `
      <div class="order-item">
        <div class="item-image" style="background-image: url('${item.image || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=100&q=80'}')"></div>
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>${item.shop} • Qté: ${item.quantity}</p>
        </div>
        <div class="item-price">${item.price * item.quantity} DH</div>
      </div>
    `;
  });
  
  orderItemsContainer.innerHTML = itemsHTML;
  
  // Calculer les totaux
  calculateTotals();
}

function calculateTotals() {
  const cart = JSON.parse(localStorage.getItem('sooky_cart') || '[]');
  
  // Sous-total
  checkoutData.subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Frais de livraison (gratuit si > 200 DH ou code promo)
  checkoutData.shipping = (checkoutData.subtotal >= 200 || (checkoutData.promoCode && promoCodes[checkoutData.promoCode]?.type === 'shipping')) ? 0 : 30;
  
  // Appliquer la réduction
  applyDiscount();
  
  // Total final
  checkoutData.total = checkoutData.subtotal + checkoutData.shipping - checkoutData.discount;
  
  // Mettre à jour l'affichage
  updateSummaryDisplay();
}

function applyDiscount() {
  checkoutData.discount = 0;
  
  if (checkoutData.promoCode && promoCodes[checkoutData.promoCode]) {
    const promo = promoCodes[checkoutData.promoCode];
    
    switch (promo.type) {
      case 'percentage':
        checkoutData.discount = Math.round(checkoutData.subtotal * promo.value / 100);
        break;
      case 'fixed':
        checkoutData.discount = promo.value;
        break;
      case 'shipping':
        checkoutData.shipping = 0;
        break;
    }
  }
}

function updateSummaryDisplay() {
  // Mettre à jour les éléments d'affichage
  const subtotalEl = document.getElementById('subtotal');
  const shippingEl = document.getElementById('shipping');
  const discountEl = document.getElementById('discount');
  const discountLine = document.getElementById('discount-line');
  const totalEl = document.getElementById('total');
  
  if (subtotalEl) subtotalEl.textContent = `${checkoutData.subtotal} DH`;
  if (shippingEl) shippingEl.textContent = checkoutData.shipping === 0 ? 'Gratuite' : `${checkoutData.shipping} DH`;
  if (totalEl) totalEl.textContent = `${checkoutData.total} DH`;
  
  // Afficher/masquer la ligne de réduction
  if (checkoutData.discount > 0) {
    if (discountEl) discountEl.textContent = `-${checkoutData.discount} DH`;
    if (discountLine) discountLine.style.display = 'flex';
  } else {
    if (discountLine) discountLine.style.display = 'none';
  }
}

function initializePaymentMethods() {
  const paymentMethods = document.querySelectorAll('.payment-method');
  
  paymentMethods.forEach(method => {
    method.addEventListener('click', function() {
      // Retirer la sélection précédente
      paymentMethods.forEach(m => m.classList.remove('selected'));
      
      // Sélectionner la nouvelle méthode
      this.classList.add('selected');
      
      // Cocher le radio button
      const radio = this.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });
  
  // Sélectionner la première méthode par défaut
  if (paymentMethods.length > 0) {
    paymentMethods[0].classList.add('selected');
  }
}

function initializeForm() {
  const form = document.getElementById('checkout-form');
  
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
}

function prefillUserData() {
  // Si l'utilisateur est connecté, pré-remplir ses données
  const userData = JSON.parse(localStorage.getItem('sooky_user') || '{}');
  
  if (userData.email) {
    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.value = userData.email;
  }
  
  if (userData.full_name) {
    const names = userData.full_name.split(' ');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    
    if (firstNameInput && names[0]) firstNameInput.value = names[0];
    if (lastNameInput && names.length > 1) lastNameInput.value = names.slice(1).join(' ');
  }
}

function applyPromoCode() {
  const promoInput = document.getElementById('promoCode');
  const promoMessage = document.getElementById('promo-message');
  
  if (!promoInput || !promoMessage) return;
  
  const code = promoInput.value.trim().toUpperCase();
  
  if (!code) {
    showPromoMessage('Veuillez entrer un code promo', 'error');
    return;
  }
  
  if (promoCodes[code]) {
    checkoutData.promoCode = code;
    calculateTotals();
    showPromoMessage(`✅ Code appliqué: ${promoCodes[code].description}`, 'success');
    promoInput.disabled = true;
    
    // Changer le bouton en "Retirer"
    const promoBtn = document.querySelector('.promo-btn');
    if (promoBtn) {
      promoBtn.textContent = 'Retirer';
      promoBtn.onclick = removePromoCode;
    }
  } else {
    showPromoMessage('❌ Code promo invalide', 'error');
  }
}

function removePromoCode() {
  checkoutData.promoCode = null;
  calculateTotals();
  
  const promoInput = document.getElementById('promoCode');
  const promoBtn = document.querySelector('.promo-btn');
  
  if (promoInput) {
    promoInput.value = '';
    promoInput.disabled = false;
  }
  
  if (promoBtn) {
    promoBtn.textContent = 'Appliquer';
    promoBtn.onclick = applyPromoCode;
  }
  
  showPromoMessage('Code promo retiré', 'info');
}

function showPromoMessage(message, type) {
  const promoMessage = document.getElementById('promo-message');
  if (!promoMessage) return;
  
  promoMessage.textContent = message;
  promoMessage.style.display = 'block';
  
  // Couleurs selon le type
  switch (type) {
    case 'success':
      promoMessage.style.color = 'var(--success)';
      break;
    case 'error':
      promoMessage.style.color = 'var(--secondary)';
      break;
    case 'info':
      promoMessage.style.color = 'var(--primary)';
      break;
  }
  
  // Masquer après 5 secondes
  setTimeout(() => {
    promoMessage.style.display = 'none';
  }, 5000);
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  // Valider le formulaire
  if (!validateForm()) {
    return;
  }
  
  // Collecter les données
  const formData = collectFormData();
  
  // Créer la commande
  createOrder(formData);
}

function validateForm() {
  const requiredFields = [
    'firstName', 'lastName', 'email', 'phone', 'address', 'city'
  ];
  
  let isValid = true;
  
  requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field && !field.value.trim()) {
      field.style.borderColor = 'var(--secondary)';
      isValid = false;
      
      // Retirer la couleur d'erreur après 3 secondes
      setTimeout(() => {
        field.style.borderColor = 'var(--border)';
      }, 3000);
    }
  });
  
  if (!isValid) {
    alert('Veuillez remplir tous les champs obligatoires');
  }
  
  return isValid;
}

function collectFormData() {
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cash';
  
  return {
    // Informations client
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    
    // Adresse de livraison
    address: document.getElementById('address').value.trim(),
    city: document.getElementById('city').value,
    postalCode: document.getElementById('postalCode').value.trim(),
    notes: document.getElementById('notes').value.trim(),
    
    // Paiement
    paymentMethod: paymentMethod,
    
    // Commande
    items: JSON.parse(localStorage.getItem('sooky_cart') || '[]'),
    subtotal: checkoutData.subtotal,
    shipping: checkoutData.shipping,
    discount: checkoutData.discount,
    total: checkoutData.total,
    promoCode: checkoutData.promoCode,
    
    // Métadonnées
    orderDate: new Date().toISOString(),
    orderNumber: generateOrderNumber()
  };
}

function generateOrderNumber() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `SK${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
}

async function createOrder(orderData) {
  try {
    // Afficher un loader
    showOrderLoader();
    
    // Simuler l'envoi à l'API (remplacer par vraie API plus tard)
    await simulateOrderCreation(orderData);
    
    // Sauvegarder la commande localement
    saveOrderLocally(orderData);
    
    // Vider le panier
    localStorage.removeItem('sooky_cart');
    
    // Rediriger vers la confirmation
    window.location.href = `confirmation.html?order=${orderData.orderNumber}`;
    
  } catch (error) {
    console.error('Erreur création commande:', error);
    hideOrderLoader();
    alert('Erreur lors de la création de la commande. Veuillez réessayer.');
  }
}

function showOrderLoader() {
  const submitBtn = document.querySelector('.place-order-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
        <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        Traitement en cours...
      </div>
    `;
  }
  
  // Ajouter l'animation CSS
  if (!document.getElementById('loader-style')) {
    const style = document.createElement('style');
    style.id = 'loader-style';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
}

function hideOrderLoader() {
  const submitBtn = document.querySelector('.place-order-btn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Confirmer la commande';
  }
}

async function simulateOrderCreation(orderData) {
  // Simuler un délai d'API
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Ici on intégrerait avec Supabase ou une autre API
  console.log('Commande créée:', orderData);
  
  return { success: true, orderId: orderData.orderNumber };
}

function saveOrderLocally(orderData) {
  // Sauvegarder dans l'historique des commandes
  const orders = JSON.parse(localStorage.getItem('sooky_orders') || '[]');
  orders.unshift(orderData);
  
  // Garder seulement les 50 dernières commandes
  if (orders.length > 50) {
    orders.splice(50);
  }
  
  localStorage.setItem('sooky_orders', JSON.stringify(orders));
}

// Exposer les fonctions globalement
window.applyPromoCode = applyPromoCode;
window.removePromoCode = removePromoCode;

// Utilitaires pour les autres pages
window.CheckoutUtils = {
  promoCodes,
  generateOrderNumber,
  saveOrderLocally
};