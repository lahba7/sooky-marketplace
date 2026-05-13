// ============================================
// SOOKY - INTÉGRATIONS PAIEMENT (CMI + PAYPAL)
// ============================================

// Configuration des passerelles de paiement
const paymentConfig = {
  cmi: {
    enabled: true,
    merchantId: 'SOOKY_MERCHANT', // À remplacer par le vrai ID
    apiUrl: 'https://payment.cmi.co.ma/fim/est3Dgate', // URL de test CMI
    currency: 'MAD',
    language: 'fr'
  },
  paypal: {
    enabled: true,
    clientId: 'YOUR_PAYPAL_CLIENT_ID', // À remplacer par le vrai client ID
    currency: 'USD',
    environment: 'sandbox' // 'sandbox' ou 'production'
  },
  cashOnDelivery: {
    enabled: true,
    fee: 0 // Frais supplémentaires pour paiement à la livraison
  }
};

// État du système de paiement
let paymentState = {
  currentMethod: null,
  orderData: null,
  isProcessing: false,
  paypalLoaded: false
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  initializePaymentSystem();
});

function initializePaymentSystem() {
  // Charger PayPal SDK si nécessaire
  if (paymentConfig.paypal.enabled) {
    loadPayPalSDK();
  }
  
  // Améliorer l'interface de paiement sur la page checkout
  if (window.location.pathname.includes('checkout.html')) {
    enhanceCheckoutPaymentMethods();
  }
  
  // Écouter les événements de paiement
  listenToPaymentEvents();
}

function enhanceCheckoutPaymentMethods() {
  // Attendre que le DOM soit prêt
  setTimeout(() => {
    const paymentMethods = document.querySelector('.payment-methods');
    if (!paymentMethods) return;
    
    // Remplacer les méthodes de paiement par des versions améliorées
    paymentMethods.innerHTML = `
      <!-- PAIEMENT À LA LIVRAISON -->
      <label class="payment-method selected" for="cash" data-method="cash">
        <input type="radio" id="cash" name="payment" value="cash" class="payment-radio" checked>
        <div class="payment-icon">💵</div>
        <div class="payment-info">
          <h4>Paiement à la livraison</h4>
          <p>Payez en espèces lors de la réception</p>
          <div style="font-size: 12px; color: var(--success); margin-top: 4px;">✅ Disponible partout au Maroc</div>
        </div>
      </label>

      <!-- CARTE BANCAIRE CMI -->
      <label class="payment-method" for="cmi" data-method="cmi">
        <input type="radio" id="cmi" name="payment" value="cmi" class="payment-radio">
        <div class="payment-icon" style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white;">💳</div>
        <div class="payment-info">
          <h4>Carte bancaire marocaine</h4>
          <p>Paiement sécurisé par CMI</p>
          <div style="display: flex; gap: 8px; margin-top: 8px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png" style="height: 20px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" style="height: 20px;">
            <span style="font-size: 12px; color: var(--primary); font-weight: 600;">CMI</span>
          </div>
        </div>
      </label>

      <!-- PAYPAL -->
      <label class="payment-method" for="paypal" data-method="paypal">
        <input type="radio" id="paypal" name="payment" value="paypal" class="payment-radio">
        <div class="payment-icon" style="background: #0070ba; color: white;">🌐</div>
        <div class="payment-info">
          <h4>PayPal</h4>
          <p>Paiement international sécurisé</p>
          <div style="margin-top: 8px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" style="height: 24px;">
          </div>
        </div>
      </label>

      <!-- VIREMENT BANCAIRE -->
      <label class="payment-method" for="transfer" data-method="transfer">
        <input type="radio" id="transfer" name="payment" value="transfer" class="payment-radio">
        <div class="payment-icon" style="background: #059669; color: white;">🏦</div>
        <div class="payment-info">
          <h4>Virement bancaire</h4>
          <p>Virement vers notre compte</p>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Délai de traitement: 1-2 jours</div>
        </div>
      </label>
    `;
    
    // Réinitialiser les événements
    initializePaymentMethodEvents();
    
    // Ajouter les conteneurs pour les formulaires de paiement
    addPaymentFormContainers();
    
  }, 1000);
}

function initializePaymentMethodEvents() {
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
      
      // Afficher le formulaire approprié
      const method = this.dataset.method;
      showPaymentForm(method);
    });
  });
}

function addPaymentFormContainers() {
  const checkoutSection = document.querySelector('.checkout-section:last-child');
  if (!checkoutSection) return;
  
  const paymentFormsHTML = `
    <!-- FORMULAIRES DE PAIEMENT -->
    <div id="payment-forms" style="margin-top: 24px;">
      
      <!-- FORMULAIRE CMI -->
      <div id="cmi-form" class="payment-form" style="display: none;">
        <div style="background: rgba(30, 64, 175, 0.05); border: 2px solid rgba(30, 64, 175, 0.2); border-radius: 16px; padding: 24px;">
          <h4 style="margin-bottom: 16px; color: var(--primary);">💳 Informations de carte</h4>
          
          <div class="form-row">
            <div class="form-group full-width">
              <label class="form-label">Numéro de carte *</label>
              <input type="text" id="card-number" class="form-input" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatCardNumber(this)">
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Date d'expiration *</label>
              <input type="text" id="card-expiry" class="form-input" placeholder="MM/AA" maxlength="5" oninput="formatCardExpiry(this)">
            </div>
            <div class="form-group">
              <label class="form-label">Code CVV *</label>
              <input type="text" id="card-cvv" class="form-input" placeholder="123" maxlength="4" oninput="formatCardCVV(this)">
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Nom sur la carte *</label>
            <input type="text" id="card-name" class="form-input" placeholder="AHMED BENNANI">
          </div>
          
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 16px; padding: 12px; background: rgba(16, 185, 129, 0.1); border-radius: 8px;">
            <span style="color: var(--success);">🔒</span>
            <span style="font-size: 13px; color: var(--success); font-weight: 600;">Paiement sécurisé par CMI</span>
          </div>
        </div>
      </div>
      
      <!-- FORMULAIRE PAYPAL -->
      <div id="paypal-form" class="payment-form" style="display: none;">
        <div style="background: rgba(0, 112, 186, 0.05); border: 2px solid rgba(0, 112, 186, 0.2); border-radius: 16px; padding: 24px;">
          <h4 style="margin-bottom: 16px; color: #0070ba;">🌐 Paiement PayPal</h4>
          
          <div id="paypal-button-container" style="margin: 16px 0;">
            <!-- Les boutons PayPal seront insérés ici -->
          </div>
          
          <div style="font-size: 13px; color: var(--text-muted); text-align: center;">
            Vous serez redirigé vers PayPal pour finaliser le paiement
          </div>
        </div>
      </div>
      
      <!-- FORMULAIRE VIREMENT -->
      <div id="transfer-form" class="payment-form" style="display: none;">
        <div style="background: rgba(5, 150, 105, 0.05); border: 2px solid rgba(5, 150, 105, 0.2); border-radius: 16px; padding: 24px;">
          <h4 style="margin-bottom: 16px; color: var(--success);">🏦 Informations de virement</h4>
          
          <div style="background: white; border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; justify-content: space-between;">
                <strong>Bénéficiaire:</strong>
                <span>SOOKY MARKETPLACE SARL</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <strong>Banque:</strong>
                <span>Attijariwafa Bank</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <strong>RIB:</strong>
                <span>007 780 0000123456789 12</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <strong>Référence:</strong>
                <span id="transfer-reference">SK-${Date.now().toString().slice(-8)}</span>
              </div>
            </div>
          </div>
          
          <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 8px; padding: 12px; font-size: 13px;">
            ⚠️ <strong>Important:</strong> Mentionnez la référence dans le motif du virement
          </div>
        </div>
      </div>
    </div>
  `;
  
  checkoutSection.insertAdjacentHTML('beforeend', paymentFormsHTML);
}

function showPaymentForm(method) {
  // Masquer tous les formulaires
  const forms = document.querySelectorAll('.payment-form');
  forms.forEach(form => form.style.display = 'none');
  
  // Afficher le formulaire approprié
  const targetForm = document.getElementById(`${method}-form`);
  if (targetForm) {
    targetForm.style.display = 'block';
    
    // Initialiser PayPal si nécessaire
    if (method === 'paypal' && paymentState.paypalLoaded) {
      initializePayPalButtons();
    }
  }
  
  paymentState.currentMethod = method;
}

// Fonctions de formatage des champs de carte
function formatCardNumber(input) {
  let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
  input.value = formattedValue;
}

function formatCardExpiry(input) {
  let value = input.value.replace(/\D/g, '');
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  input.value = value;
}

function formatCardCVV(input) {
  input.value = input.value.replace(/[^0-9]/g, '');
}

// Chargement du SDK PayPal
function loadPayPalSDK() {
  if (document.getElementById('paypal-sdk')) return;
  
  const script = document.createElement('script');
  script.id = 'paypal-sdk';
  script.src = `https://www.paypal.com/sdk/js?client-id=${paymentConfig.paypal.clientId}&currency=${paymentConfig.paypal.currency}`;
  script.onload = () => {
    paymentState.paypalLoaded = true;
    console.log('PayPal SDK chargé');
  };
  script.onerror = () => {
    console.error('Erreur chargement PayPal SDK');
  };
  
  document.head.appendChild(script);
}

function initializePayPalButtons() {
  const container = document.getElementById('paypal-button-container');
  if (!container || !window.paypal) return;
  
  // Vider le conteneur
  container.innerHTML = '';
  
  window.paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'blue',
      shape: 'rect',
      label: 'paypal'
    },
    
    createOrder: function(data, actions) {
      const orderData = getOrderDataForPayment();
      
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: convertMADtoUSD(orderData.total).toFixed(2)
          },
          description: `Commande Sooky #${orderData.orderNumber}`
        }]
      });
    },
    
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        handlePayPalSuccess(details);
      });
    },
    
    onError: function(err) {
      console.error('Erreur PayPal:', err);
      alert('Erreur lors du paiement PayPal. Veuillez réessayer.');
    }
  }).render('#paypal-button-container');
}

// Traitement des paiements
async function processPayment(orderData) {
  if (paymentState.isProcessing) return;
  
  paymentState.isProcessing = true;
  paymentState.orderData = orderData;
  
  try {
    let result;
    
    switch (paymentState.currentMethod) {
      case 'cash':
        result = await processCashOnDelivery(orderData);
        break;
      case 'cmi':
        result = await processCMIPayment(orderData);
        break;
      case 'paypal':
        // PayPal est géré par ses propres callbacks
        return;
      case 'transfer':
        result = await processBankTransfer(orderData);
        break;
      default:
        throw new Error('Méthode de paiement non supportée');
    }
    
    if (result.success) {
      handlePaymentSuccess(result);
    } else {
      handlePaymentError(result.error);
    }
    
  } catch (error) {
    handlePaymentError(error.message);
  } finally {
    paymentState.isProcessing = false;
  }
}

async function processCashOnDelivery(orderData) {
  // Paiement à la livraison - pas de traitement nécessaire
  return {
    success: true,
    paymentMethod: 'cash',
    transactionId: `CASH_${Date.now()}`,
    message: 'Commande confirmée - Paiement à la livraison'
  };
}

async function processCMIPayment(orderData) {
  // Valider les données de carte
  const cardData = validateCardData();
  if (!cardData.valid) {
    throw new Error(cardData.error);
  }
  
  // Préparer les données pour CMI
  const cmiData = {
    merchantId: paymentConfig.cmi.merchantId,
    amount: orderData.total,
    currency: paymentConfig.cmi.currency,
    orderNumber: orderData.orderNumber,
    cardNumber: cardData.number,
    cardExpiry: cardData.expiry,
    cardCVV: cardData.cvv,
    cardName: cardData.name,
    language: paymentConfig.cmi.language
  };
  
  // En production, envoyer à l'API CMI
  // Pour la démo, simuler le paiement
  return await simulateCMIPayment(cmiData);
}

async function processBankTransfer(orderData) {
  // Virement bancaire - générer les instructions
  const reference = document.getElementById('transfer-reference')?.textContent || `SK-${Date.now()}`;
  
  return {
    success: true,
    paymentMethod: 'transfer',
    transactionId: reference,
    message: 'Instructions de virement envoyées par email'
  };
}

function validateCardData() {
  const number = document.getElementById('card-number')?.value.replace(/\s/g, '') || '';
  const expiry = document.getElementById('card-expiry')?.value || '';
  const cvv = document.getElementById('card-cvv')?.value || '';
  const name = document.getElementById('card-name')?.value || '';
  
  // Validation basique
  if (number.length < 13 || number.length > 19) {
    return { valid: false, error: 'Numéro de carte invalide' };
  }
  
  if (!/^\d{2}\/\d{2}$/.test(expiry)) {
    return { valid: false, error: 'Date d\'expiration invalide (MM/AA)' };
  }
  
  if (cvv.length < 3 || cvv.length > 4) {
    return { valid: false, error: 'Code CVV invalide' };
  }
  
  if (name.length < 2) {
    return { valid: false, error: 'Nom sur la carte requis' };
  }
  
  // Vérifier la date d'expiration
  const [month, year] = expiry.split('/');
  const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
  if (expiryDate < new Date()) {
    return { valid: false, error: 'Carte expirée' };
  }
  
  return {
    valid: true,
    number,
    expiry,
    cvv,
    name
  };
}

async function simulateCMIPayment(cmiData) {
  // Simuler un délai de traitement
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simuler une réponse CMI (90% de succès)
  const success = Math.random() > 0.1;
  
  if (success) {
    return {
      success: true,
      paymentMethod: 'cmi',
      transactionId: `CMI_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: 'Paiement par carte réussi'
    };
  } else {
    throw new Error('Paiement refusé par la banque');
  }
}

function handlePayPalSuccess(details) {
  const result = {
    success: true,
    paymentMethod: 'paypal',
    transactionId: details.id,
    message: 'Paiement PayPal réussi'
  };
  
  handlePaymentSuccess(result);
}

function handlePaymentSuccess(result) {
  console.log('Paiement réussi:', result);
  
  // Sauvegarder les détails du paiement
  const orderData = paymentState.orderData;
  orderData.payment = result;
  
  // Déclencher l'événement de confirmation de commande
  const event = new CustomEvent('orderCreated', { detail: orderData });
  document.dispatchEvent(event);
  
  // Rediriger vers la confirmation
  window.location.href = `confirmation.html?order=${orderData.orderNumber}&payment=${result.transactionId}`;
}

function handlePaymentError(error) {
  console.error('Erreur paiement:', error);
  alert(`Erreur de paiement: ${error}`);
}

// Fonctions utilitaires
function getOrderDataForPayment() {
  // Récupérer les données de commande depuis le checkout
  const cart = JSON.parse(localStorage.getItem('sooky_cart') || '[]');
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return {
    orderNumber: `SK${Date.now().toString().slice(-8)}`,
    items: cart,
    subtotal: subtotal,
    shipping: subtotal >= 200 ? 0 : 30,
    total: subtotal + (subtotal >= 200 ? 0 : 30)
  };
}

function convertMADtoUSD(madAmount) {
  // Taux de change approximatif (à mettre à jour avec une API de taux de change)
  const exchangeRate = 0.10; // 1 MAD ≈ 0.10 USD
  return madAmount * exchangeRate;
}

// Écouter les événements de paiement
function listenToPaymentEvents() {
  // Intercepter la soumission du formulaire de checkout
  document.addEventListener('submit', function(event) {
    if (event.target.id === 'checkout-form') {
      event.preventDefault();
      
      // Récupérer les données de commande
      const orderData = collectOrderData();
      
      // Traiter le paiement
      processPayment(orderData);
    }
  });
}

function collectOrderData() {
  // Cette fonction devrait être synchronisée avec checkout.js
  if (window.CheckoutUtils && window.CheckoutUtils.collectFormData) {
    return window.CheckoutUtils.collectFormData();
  }
  
  // Fallback basique
  return getOrderDataForPayment();
}

// Exposer les fonctions globalement
window.formatCardNumber = formatCardNumber;
window.formatCardExpiry = formatCardExpiry;
window.formatCardCVV = formatCardCVV;

window.PaymentSystem = {
  processPayment,
  handlePaymentSuccess,
  handlePaymentError,
  convertMADtoUSD
};