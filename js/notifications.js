// ============================================
// SOOKY - SYSTÈME DE NOTIFICATIONS COMPLET
// ============================================

// Configuration des notifications
const notificationConfig = {
  email: {
    enabled: true,
    templates: {
      orderConfirmation: 'Confirmation de commande',
      orderShipped: 'Commande expédiée',
      orderDelivered: 'Commande livrée',
      newMessage: 'Nouveau message',
      reviewRequest: 'Demande d\'avis'
    }
  },
  sms: {
    enabled: true,
    templates: {
      orderConfirmation: 'Votre commande #{orderNumber} a été confirmée',
      orderShipped: 'Votre commande #{orderNumber} a été expédiée',
      orderDelivered: 'Votre commande #{orderNumber} a été livrée'
    }
  },
  push: {
    enabled: true,
    permission: null
  }
};

// État des notifications
let notificationState = {
  queue: [],
  isProcessing: false,
  userPreferences: null
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  initializeNotificationSystem();
});

function initializeNotificationSystem() {
  // Charger les préférences utilisateur
  loadUserPreferences();
  
  // Demander la permission pour les notifications push
  requestPushPermission();
  
  // Créer le centre de notifications
  createNotificationCenter();
  
  // Traiter la queue de notifications
  processNotificationQueue();
  
  // Écouter les événements de commande
  listenToOrderEvents();
}

function loadUserPreferences() {
  const saved = localStorage.getItem('sooky_notification_preferences');
  if (saved) {
    notificationState.userPreferences = JSON.parse(saved);
  } else {
    // Préférences par défaut
    notificationState.userPreferences = {
      email: {
        orderUpdates: true,
        messages: true,
        promotions: false,
        reviews: true
      },
      sms: {
        orderUpdates: true,
        messages: false,
        promotions: false
      },
      push: {
        orderUpdates: true,
        messages: true,
        promotions: false,
        reviews: true
      }
    };
    saveUserPreferences();
  }
}

function saveUserPreferences() {
  localStorage.setItem('sooky_notification_preferences', JSON.stringify(notificationState.userPreferences));
}

async function requestPushPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    notificationConfig.push.permission = permission;
    
    if (permission === 'granted') {
      console.log('Notifications push activées');
    } else {
      console.log('Notifications push refusées');
    }
  }
}

function createNotificationCenter() {
  // Créer l'icône de notifications dans la navigation
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  
  const notificationIcon = document.createElement('div');
  notificationIcon.innerHTML = `
    <button onclick="toggleNotificationCenter()" style="background: none; border: none; cursor: pointer; position: relative; padding: 8px;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
      <span id="notification-badge" style="position: absolute; top: 0; right: 0; background: var(--secondary); color: white; border-radius: 50%; width: 18px; height: 18px; font-size: 10px; font-weight: 700; display: none; align-items: center; justify-content: center;">
        0
      </span>
    </button>
  `;
  
  // Insérer avant le lien de connexion
  const connexionLink = navLinks.querySelector('a[href*="connexion"]');
  if (connexionLink) {
    navLinks.insertBefore(notificationIcon, connexionLink);
  }
}

function toggleNotificationCenter() {
  const existingPanel = document.getElementById('notification-panel');
  
  if (existingPanel) {
    existingPanel.remove();
  } else {
    createNotificationPanel();
  }
}

function createNotificationPanel() {
  const notifications = getRecentNotifications();
  
  const panel = document.createElement('div');
  panel.id = 'notification-panel';
  panel.innerHTML = `
    <div style="position: fixed; top: 80px; right: 24px; width: 380px; max-height: 500px; background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); z-index: 1000; border: 1px solid var(--border); overflow: hidden;">
      
      <!-- HEADER -->
      <div style="padding: 20px; border-bottom: 1px solid var(--border); background: var(--gradient-primary); color: white;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h3 style="font-size: 18px; font-weight: 700; margin: 0;">Notifications</h3>
          <button onclick="closeNotificationPanel()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer;">×</button>
        </div>
      </div>
      
      <!-- NOTIFICATIONS LIST -->
      <div style="max-height: 400px; overflow-y: auto;">
        ${notifications.length > 0 ? renderNotifications(notifications) : renderEmptyNotifications()}
      </div>
      
      <!-- FOOTER -->
      <div style="padding: 16px; border-top: 1px solid var(--border); background: var(--bg-secondary);">
        <button onclick="openNotificationSettings()" style="width: 100%; padding: 12px; background: var(--primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">
          Gérer les notifications
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Marquer les notifications comme lues
  markNotificationsAsRead();
}

function renderNotifications(notifications) {
  return notifications.map(notification => {
    const timeAgo = getTimeAgo(notification.createdAt);
    const icon = getNotificationIcon(notification.type);
    
    return `
      <div class="notification-item" style="padding: 16px; border-bottom: 1px solid var(--border); cursor: pointer; transition: background 0.2s;" 
           onclick="handleNotificationClick('${notification.id}')"
           onmouseover="this.style.background='var(--bg-secondary)'"
           onmouseout="this.style.background='white'">
        <div style="display: flex; align-items: start; gap: 12px;">
          <div style="font-size: 24px;">${icon}</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px; color: var(--text-primary);">
              ${notification.title}
            </div>
            <div style="font-size: 13px; color: var(--text-muted); line-height: 1.4; margin-bottom: 8px;">
              ${notification.message}
            </div>
            <div style="font-size: 11px; color: var(--text-muted);">
              ${timeAgo}
            </div>
          </div>
          ${!notification.isRead ? `
            <div style="width: 8px; height: 8px; background: var(--primary); border-radius: 50%;"></div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderEmptyNotifications() {
  return `
    <div style="padding: 40px; text-align: center; color: var(--text-muted);">
      <div style="font-size: 48px; margin-bottom: 16px;">🔔</div>
      <div style="font-weight: 600; margin-bottom: 8px;">Aucune notification</div>
      <div style="font-size: 14px;">Vos notifications apparaîtront ici</div>
    </div>
  `;
}

function getNotificationIcon(type) {
  const icons = {
    order: '📦',
    message: '💬',
    review: '⭐',
    promotion: '🎁',
    delivery: '🚚',
    payment: '💳'
  };
  return icons[type] || '🔔';
}

function getTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'À l\'instant';
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)} h`;
  if (diffInSeconds < 604800) return `Il y a ${Math.floor(diffInSeconds / 86400)} j`;
  
  return date.toLocaleDateString('fr-FR');
}

function closeNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  if (panel) panel.remove();
}

function openNotificationSettings() {
  closeNotificationPanel();
  createNotificationSettingsModal();
}

function createNotificationSettingsModal() {
  const modal = document.createElement('div');
  modal.id = 'notification-settings-modal';
  modal.innerHTML = `
    <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center;">
      <div style="background: white; border-radius: 20px; padding: 32px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto;">
        
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
          <h2 style="font-family: 'Fraunces', serif; font-size: 24px; margin: 0;">Préférences de notifications</h2>
          <button onclick="closeNotificationSettings()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
        </div>
        
        <!-- EMAIL -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; margin-bottom: 16px; color: var(--primary);">📧 Email</h3>
          ${renderNotificationToggle('email', 'orderUpdates', 'Mises à jour de commandes')}
          ${renderNotificationToggle('email', 'messages', 'Nouveaux messages')}
          ${renderNotificationToggle('email', 'reviews', 'Demandes d\'avis')}
          ${renderNotificationToggle('email', 'promotions', 'Promotions et offres')}
        </div>
        
        <!-- SMS -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; margin-bottom: 16px; color: var(--primary);">📱 SMS</h3>
          ${renderNotificationToggle('sms', 'orderUpdates', 'Mises à jour de commandes')}
          ${renderNotificationToggle('sms', 'messages', 'Nouveaux messages')}
          ${renderNotificationToggle('sms', 'promotions', 'Promotions et offres')}
        </div>
        
        <!-- PUSH -->
        <div style="margin-bottom: 32px;">
          <h3 style="font-size: 18px; margin-bottom: 16px; color: var(--primary);">🔔 Notifications push</h3>
          ${renderNotificationToggle('push', 'orderUpdates', 'Mises à jour de commandes')}
          ${renderNotificationToggle('push', 'messages', 'Nouveaux messages')}
          ${renderNotificationToggle('push', 'reviews', 'Demandes d\'avis')}
          ${renderNotificationToggle('push', 'promotions', 'Promotions et offres')}
        </div>
        
        <div style="display: flex; gap: 16px; justify-content: flex-end;">
          <button onclick="closeNotificationSettings()" style="padding: 12px 24px; border: 2px solid var(--border); background: white; color: var(--text-primary); border-radius: 12px; font-weight: 600; cursor: pointer;">
            Annuler
          </button>
          <button onclick="saveNotificationSettings()" style="padding: 12px 24px; background: var(--primary); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer;">
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

function renderNotificationToggle(channel, type, label) {
  const isChecked = notificationState.userPreferences[channel][type];
  const toggleId = `toggle-${channel}-${type}`;
  
  return `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border);">
      <label for="${toggleId}" style="font-weight: 500; cursor: pointer;">${label}</label>
      <label class="toggle-switch" style="position: relative; display: inline-block; width: 50px; height: 24px;">
        <input type="checkbox" id="${toggleId}" ${isChecked ? 'checked' : ''} 
               onchange="updatePreference('${channel}', '${type}', this.checked)"
               style="opacity: 0; width: 0; height: 0;">
        <span style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: ${isChecked ? 'var(--primary)' : '#ccc'}; transition: 0.3s; border-radius: 24px;">
          <span style="position: absolute; content: ''; height: 18px; width: 18px; left: ${isChecked ? '26px' : '3px'}; bottom: 3px; background: white; transition: 0.3s; border-radius: 50%;"></span>
        </span>
      </label>
    </div>
  `;
}

function updatePreference(channel, type, value) {
  notificationState.userPreferences[channel][type] = value;
  
  // Mettre à jour visuellement le toggle
  const toggle = document.getElementById(`toggle-${channel}-${type}`);
  if (toggle) {
    const slider = toggle.nextElementSibling;
    const knob = slider.querySelector('span');
    
    slider.style.background = value ? 'var(--primary)' : '#ccc';
    knob.style.left = value ? '26px' : '3px';
  }
}

function saveNotificationSettings() {
  saveUserPreferences();
  closeNotificationSettings();
  
  // Afficher une confirmation
  showNotification({
    type: 'success',
    title: 'Préférences sauvegardées',
    message: 'Vos préférences de notifications ont été mises à jour'
  });
}

function closeNotificationSettings() {
  const modal = document.getElementById('notification-settings-modal');
  if (modal) modal.remove();
}

// Fonctions principales de notification
function sendOrderConfirmation(orderData) {
  const notification = {
    type: 'order',
    title: 'Commande confirmée',
    message: `Votre commande #${orderData.orderNumber} a été confirmée`,
    data: orderData
  };
  
  // Email
  if (notificationState.userPreferences.email.orderUpdates) {
    sendEmail({
      to: orderData.email,
      subject: `Confirmation de commande #${orderData.orderNumber}`,
      template: 'orderConfirmation',
      data: orderData
    });
  }
  
  // SMS
  if (notificationState.userPreferences.sms.orderUpdates) {
    sendSMS({
      to: orderData.phone,
      message: `Votre commande #${orderData.orderNumber} a été confirmée. Total: ${orderData.total} DH. Merci !`
    });
  }
  
  // Push
  if (notificationState.userPreferences.push.orderUpdates) {
    showPushNotification(notification);
  }
  
  // Ajouter à l'historique
  addNotificationToHistory(notification);
}

function sendOrderShipped(orderNumber, trackingNumber) {
  const notification = {
    type: 'delivery',
    title: 'Commande expédiée',
    message: `Votre commande #${orderNumber} a été expédiée. Suivi: ${trackingNumber}`
  };
  
  // Email
  if (notificationState.userPreferences.email.orderUpdates) {
    sendEmail({
      subject: `Commande expédiée #${orderNumber}`,
      template: 'orderShipped',
      data: { orderNumber, trackingNumber }
    });
  }
  
  // SMS
  if (notificationState.userPreferences.sms.orderUpdates) {
    sendSMS({
      message: `Votre commande #${orderNumber} a été expédiée. Suivi: ${trackingNumber}`
    });
  }
  
  // Push
  if (notificationState.userPreferences.push.orderUpdates) {
    showPushNotification(notification);
  }
  
  addNotificationToHistory(notification);
}

function sendNewMessageNotification(messageData) {
  const notification = {
    type: 'message',
    title: 'Nouveau message',
    message: `${messageData.senderName}: ${messageData.content.substring(0, 50)}...`
  };
  
  // Email
  if (notificationState.userPreferences.email.messages) {
    sendEmail({
      subject: 'Nouveau message sur Sooky',
      template: 'newMessage',
      data: messageData
    });
  }
  
  // Push
  if (notificationState.userPreferences.push.messages) {
    showPushNotification(notification);
  }
  
  addNotificationToHistory(notification);
}

// Implémentations des canaux de notification
async function sendEmail(emailData) {
  try {
    // En production, intégrer avec SendGrid, Mailgun, ou service email
    console.log('📧 Email envoyé:', emailData);
    
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true, messageId: Date.now() };
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return { success: false, error };
  }
}

async function sendSMS(smsData) {
  try {
    // En production, intégrer avec Twilio, Nexmo, ou service SMS marocain
    console.log('📱 SMS envoyé:', smsData);
    
    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return { success: true, messageId: Date.now() };
  } catch (error) {
    console.error('Erreur envoi SMS:', error);
    return { success: false, error };
  }
}

function showPushNotification(notification) {
  if (notificationConfig.push.permission !== 'granted') return;
  
  try {
    const pushNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/images/logo-192.png', // Logo de l'app
      badge: '/images/badge-72.png',
      tag: notification.type,
      requireInteraction: false,
      silent: false
    });
    
    pushNotification.onclick = function() {
      window.focus();
      this.close();
      
      // Rediriger vers la page appropriée
      if (notification.type === 'order') {
        window.location.href = '/pages/suivi.html';
      } else if (notification.type === 'message') {
        // Ouvrir le chat
        if (window.toggleChatPanel) {
          window.toggleChatPanel();
        }
      }
    };
    
    // Fermer automatiquement après 5 secondes
    setTimeout(() => {
      pushNotification.close();
    }, 5000);
    
  } catch (error) {
    console.error('Erreur notification push:', error);
  }
}

// Gestion de l'historique des notifications
function addNotificationToHistory(notification) {
  const notifications = getStoredNotifications();
  
  const newNotification = {
    id: Date.now(),
    ...notification,
    isRead: false,
    createdAt: new Date().toISOString()
  };
  
  notifications.unshift(newNotification);
  
  // Garder seulement les 100 dernières notifications
  if (notifications.length > 100) {
    notifications.splice(100);
  }
  
  localStorage.setItem('sooky_notifications', JSON.stringify(notifications));
  
  // Mettre à jour le badge
  updateNotificationBadge();
}

function getStoredNotifications() {
  const saved = localStorage.getItem('sooky_notifications');
  return saved ? JSON.parse(saved) : [];
}

function getRecentNotifications() {
  return getStoredNotifications().slice(0, 20); // 20 plus récentes
}

function markNotificationsAsRead() {
  const notifications = getStoredNotifications();
  notifications.forEach(notification => {
    notification.isRead = true;
  });
  
  localStorage.setItem('sooky_notifications', JSON.stringify(notifications));
  updateNotificationBadge();
}

function updateNotificationBadge() {
  const notifications = getStoredNotifications();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const badge = document.getElementById('notification-badge');
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

// Écouter les événements de commande
function listenToOrderEvents() {
  // Écouter les événements personnalisés
  document.addEventListener('orderCreated', function(event) {
    sendOrderConfirmation(event.detail);
  });
  
  document.addEventListener('orderShipped', function(event) {
    sendOrderShipped(event.detail.orderNumber, event.detail.trackingNumber);
  });
  
  document.addEventListener('newMessage', function(event) {
    sendNewMessageNotification(event.detail);
  });
}

// Traiter la queue de notifications
function processNotificationQueue() {
  if (notificationState.isProcessing || notificationState.queue.length === 0) return;
  
  notificationState.isProcessing = true;
  
  const notification = notificationState.queue.shift();
  
  // Traiter la notification selon son type
  switch (notification.type) {
    case 'orderConfirmation':
      sendOrderConfirmation(notification.data);
      break;
    case 'orderShipped':
      sendOrderShipped(notification.data.orderNumber, notification.data.trackingNumber);
      break;
    case 'newMessage':
      sendNewMessageNotification(notification.data);
      break;
  }
  
  notificationState.isProcessing = false;
  
  // Traiter le prochain élément de la queue
  setTimeout(processNotificationQueue, 100);
}

// Fonction utilitaire pour afficher des notifications dans l'app
function showNotification({ type, title, message, duration = 5000 }) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 24px;
    right: 24px;
    background: white;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    z-index: 3000;
    max-width: 400px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  const colors = {
    success: 'var(--success)',
    error: 'var(--secondary)',
    info: 'var(--primary)',
    warning: '#f59e0b'
  };
  
  notification.innerHTML = `
    <div style="display: flex; align-items: start; gap: 12px;">
      <div style="color: ${colors[type] || colors.info}; font-size: 20px;">
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
      </div>
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
        <div style="font-size: 14px; color: var(--text-muted);">${message}</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-muted);">×</button>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Suppression automatique
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, duration);
}

// Initialiser le badge au chargement
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(updateNotificationBadge, 1000);
});

// Exposer les fonctions globalement
window.toggleNotificationCenter = toggleNotificationCenter;
window.closeNotificationPanel = closeNotificationPanel;
window.openNotificationSettings = openNotificationSettings;
window.closeNotificationSettings = closeNotificationSettings;
window.updatePreference = updatePreference;
window.saveNotificationSettings = saveNotificationSettings;
window.handleNotificationClick = function(notificationId) {
  console.log('Notification cliquée:', notificationId);
  closeNotificationPanel();
};

// Exposer les fonctions utilitaires
window.NotificationSystem = {
  sendOrderConfirmation,
  sendOrderShipped,
  sendNewMessageNotification,
  showNotification
};