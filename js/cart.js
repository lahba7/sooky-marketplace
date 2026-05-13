// ============================================
// SOOKY - SYSTÈME DE PANIER FONCTIONNEL
// ============================================

// État du panier (stocké dans localStorage)
let cart = [];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  loadCart();
  updateCartUI();
  initializeCartButtons();
});

// Charger le panier depuis localStorage
function loadCart() {
  const savedCart = localStorage.getItem('sooky_cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Sauvegarder le panier dans localStorage
function saveCart() {
  localStorage.setItem('sooky_cart', JSON.stringify(cart));
  updateCartUI();
}

// Ajouter un produit au panier
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += product.quantity || 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      shop: product.shop,
      quantity: product.quantity || 1
    });
  }
  
  saveCart();
  showCartNotification('Produit ajouté au panier !');
}

// Retirer un produit du panier
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  showCartNotification('Produit retiré du panier');
}

// Mettre à jour la quantité
function updateQuantity(productId, newQuantity) {
  const item = cart.find(item => item.id === productId);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      item.quantity = newQuantity;
      saveCart();
    }
  }
}

// Vider le panier
function clearCart() {
  if (confirm('Êtes-vous sûr de vouloir vider votre panier ?')) {
    cart = [];
    saveCart();
    showCartNotification('Panier vidé');
  }
}

// Calculer le total
function getCartTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Calculer le nombre d'articles
function getCartCount() {
  return cart.reduce((count, item) => count + item.quantity, 0);
}

// Mettre à jour l'UI du panier (badge dans la navigation)
function updateCartUI() {
  const cartCount = getCartCount();
  const cartLinks = document.querySelectorAll('a[href*="panier.html"]');
  
  cartLinks.forEach(link => {
    // Retirer l'ancien badge s'il existe
    const oldBadge = link.querySelector('.cart-badge');
    if (oldBadge) {
      oldBadge.remove();
    }
    
    // Ajouter le nouveau badge si le panier n'est pas vide
    if (cartCount > 0) {
      const badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.textContent = cartCount;
      badge.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: linear-gradient(135deg, #EC4899 0%, #F43F5E 100%);
        color: white;
        font-size: 11px;
        font-weight: 700;
        padding: 3px 7px;
        border-radius: 100px;
        box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
        min-width: 20px;
        text-align: center;
      `;
      link.style.position = 'relative';
      link.appendChild(badge);
    }
  });
  
  // Si on est sur la page panier, mettre à jour le contenu
  if (window.location.pathname.includes('panier.html')) {
    renderCartPage();
  }
}

// Afficher une notification
function showCartNotification(message) {
  // Retirer l'ancienne notification si elle existe
  const oldNotif = document.querySelector('.cart-notification');
  if (oldNotif) {
    oldNotif.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 32px;
    right: 32px;
    background: linear-gradient(135deg, #10B981 0%, #059669 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 16px;
    box-shadow: 0 16px 48px rgba(16, 185, 129, 0.3);
    font-weight: 600;
    font-size: 15px;
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialiser les boutons "Ajouter au panier"
function initializeCartButtons() {
  // Boutons sur les pages produits
  const addToCartButtons = document.querySelectorAll('.btn-add-to-cart, .btn-primary:not([href])');
  
  addToCartButtons.forEach(button => {
    if (button.textContent.includes('Ajouter au panier')) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Récupérer les infos du produit depuis la page
        const productData = getProductDataFromPage();
        if (productData) {
          addToCart(productData);
        }
      });
    }
  });
}

// Extraire les données du produit depuis la page
function getProductDataFromPage() {
  // Sur la page produit
  const productName = document.querySelector('.product-details h1, .product-name');
  const productPrice = document.querySelector('.price, .product-price');
  const productImage = document.querySelector('.main-image, .product-image');
  const productShop = document.querySelector('.shop-link, .product-shop');
  const quantityInput = document.querySelector('#quantity, .quantity-value');
  
  if (productName && productPrice) {
    return {
      id: new Date().getTime(), // ID temporaire (sera remplacé par l'ID de la DB)
      name: productName.textContent.trim(),
      price: parseInt(productPrice.textContent.replace(/[^\d]/g, '')),
      image: productImage ? (productImage.style.backgroundImage.match(/url\(['"]?([^'"]+)['"]?\)/)?.[1] || '') : '',
      shop: productShop ? productShop.textContent.trim() : 'Boutique',
      quantity: quantityInput ? parseInt(quantityInput.textContent) : 1
    };
  }
  
  return null;
}

// Rendre la page panier
function renderCartPage() {
  const cartContainer = document.querySelector('.cart-items-container');
  const cartSummary = document.querySelector('.cart-summary');
  
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div style="text-align: center; padding: 80px 20px;">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" stroke-width="1.5" style="margin: 0 auto 24px;">
          <circle cx="9" cy="21" r="1"/>
          <circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <h2 style="font-family: 'Fraunces', serif; font-size: 32px; font-weight: 700; margin-bottom: 12px; color: #0F172A;">Votre panier est vide</h2>
        <p style="color: #64748B; font-size: 16px; margin-bottom: 32px;">Découvrez nos produits uniques et commencez vos achats !</p>
        <a href="../index.html" class="btn btn-primary" style="display: inline-flex; padding: 16px 32px; font-size: 16px;">Découvrir les produits</a>
      </div>
    `;
    
    if (cartSummary) {
      cartSummary.style.display = 'none';
    }
    return;
  }
  
  // Afficher les articles
  let cartHTML = '';
  cart.forEach(item => {
    cartHTML += `
      <div class="cart-item" data-id="${item.id}" style="display: grid; grid-template-columns: 100px 1fr auto; gap: 24px; align-items: center; padding: 24px; background: white; border-radius: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border: 1px solid #E2E8F0;">
        <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; border-radius: 16px; object-fit: cover;">
        <div>
          <h3 style="font-weight: 700; font-size: 18px; margin-bottom: 6px; color: #0F172A;">${item.name}</h3>
          <p style="color: #64748B; font-size: 14px; margin-bottom: 12px;">${item.shop}</p>
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 12px; background: #F1F5F9; padding: 8px 12px; border-radius: 12px;">
              <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" style="width: 32px; height: 32px; border: none; background: white; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 16px; color: #64748B; transition: all 0.2s;">−</button>
              <span style="font-weight: 700; min-width: 30px; text-align: center;">${item.quantity}</span>
              <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" style="width: 32px; height: 32px; border: none; background: white; border-radius: 8px; cursor: pointer; font-weight: 700; font-size: 16px; color: #64748B; transition: all 0.2s;">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" style="color: #EC4899; font-weight: 600; font-size: 14px; background: none; border: none; cursor: pointer; transition: all 0.2s;">Retirer</button>
          </div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">${item.price * item.quantity} DH</div>
          <div style="font-size: 13px; color: #94A3B8; margin-top: 4px;">${item.price} DH × ${item.quantity}</div>
        </div>
      </div>
    `;
  });
  
  cartContainer.innerHTML = cartHTML;
  
  // Mettre à jour le résumé
  if (cartSummary) {
    const subtotal = getCartTotal();
    const shipping = subtotal >= 200 ? 0 : 30;
    const total = subtotal + shipping;
    
    cartSummary.innerHTML = `
      <h3 style="font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; margin-bottom: 24px;">Résumé</h3>
      <div style="margin-bottom: 16px; display: flex; justify-content: space-between; font-size: 15px;">
        <span style="color: #64748B;">Sous-total</span>
        <span style="font-weight: 600;">${subtotal} DH</span>
      </div>
      <div style="margin-bottom: 16px; display: flex; justify-content: space-between; font-size: 15px;">
        <span style="color: #64748B;">Livraison</span>
        <span style="font-weight: 600; color: ${shipping === 0 ? '#10B981' : '#0F172A'};">${shipping === 0 ? 'Gratuite' : shipping + ' DH'}</span>
      </div>
      ${subtotal < 200 ? `<div style="margin-bottom: 20px; padding: 12px; background: rgba(59, 130, 246, 0.1); border-radius: 12px; font-size: 13px; color: #3B82F6; font-weight: 600;">Ajoutez ${200 - subtotal} DH pour la livraison gratuite</div>` : ''}
      <div style="padding-top: 20px; border-top: 2px solid #E2E8F0; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700; font-size: 18px;">Total</span>
        <span style="font-family: 'Fraunces', serif; font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;">${total} DH</span>
      </div>
      <button onclick="proceedToCheckout()" class="btn btn-primary" style="width: 100%; padding: 16px; font-size: 16px; margin-bottom: 12px;">Commander</button>
      <button onclick="clearCart()" class="btn btn-outline" style="width: 100%; padding: 16px; font-size: 16px;">Vider le panier</button>
    `;
  }
}

// Procéder au paiement
function proceedToCheckout() {
  if (cart.length === 0) {
    alert('Votre panier est vide');
    return;
  }
  
  // Pour l'instant, juste une alerte (sera remplacé par une vraie page de checkout)
  alert('Fonctionnalité de paiement en cours de développement.\n\nVotre commande:\n' + 
    cart.map(item => `- ${item.name} (×${item.quantity}): ${item.price * item.quantity} DH`).join('\n') +
    `\n\nTotal: ${getCartTotal()} DH`);
}

// Exposer les fonctions globalement
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.clearCart = clearCart;
window.proceedToCheckout = proceedToCheckout;
window.getCartTotal = getCartTotal;
window.getCartCount = getCartCount;

// Ajouter les animations CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
