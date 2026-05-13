// ============================================
// SOOKY - SYSTÈME DE CHAT VENDEUR-ACHETEUR
// ============================================

// État du chat
let chatState = {
  currentConversationId: null,
  currentShopId: null,
  currentUserId: null,
  messages: [],
  isConnected: false,
  unreadCount: 0,
  conversations: []
};

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  initializeChatSystem();
});

function initializeChatSystem() {
  chatState.currentUserId = getCurrentUserId();
  
  if (!chatState.currentUserId) {
    console.log('Utilisateur non connecté - Chat désactivé');
    return;
  }
  
  // Charger les conversations existantes
  loadConversations();
  
  // Créer le bouton de chat flottant
  createFloatingChatButton();
  
  // Initialiser les boutons de contact sur les pages produit/boutique
  initializeContactButtons();
  
  // Simuler la connexion temps réel (en production: WebSocket/Supabase Realtime)
  simulateRealTimeConnection();
}

function createFloatingChatButton() {
  // Vérifier s'il y a des conversations
  if (chatState.conversations.length === 0) return;
  
  const floatingButton = document.createElement('div');
  floatingButton.id = 'floating-chat-btn';
  floatingButton.innerHTML = `
    <div style="position: fixed; bottom: 24px; right: 24px; z-index: 1000;">
      <button onclick="toggleChatPanel()" 
              style="width: 64px; height: 64px; background: var(--gradient-primary); border: none; border-radius: 50%; color: white; font-size: 24px; cursor: pointer; box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4); transition: all 0.3s ease; position: relative;">
        💬
        ${chatState.unreadCount > 0 ? `
          <span style="position: absolute; top: -4px; right: -4px; background: var(--secondary); color: white; border-radius: 50%; width: 24px; height: 24px; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center;">
            ${chatState.unreadCount > 9 ? '9+' : chatState.unreadCount}
          </span>
        ` : ''}
      </button>
    </div>
  `;
  
  document.body.appendChild(floatingButton);
}

function initializeContactButtons() {
  // Ajouter des boutons "Contacter le vendeur" sur les pages produit
  if (window.location.pathname.includes('produit.html')) {
    addContactSellerButton();
  }
  
  // Ajouter des boutons "Contacter" sur les pages boutique
  if (window.location.pathname.includes('boutique.html')) {
    addContactShopButton();
  }
}

function addContactSellerButton() {
  const productDetails = document.querySelector('.product-details');
  if (!productDetails) return;
  
  // Récupérer l'ID de la boutique (simulé)
  const shopId = getShopIdFromPage();
  
  const contactButton = document.createElement('button');
  contactButton.className = 'btn btn-outline btn-large';
  contactButton.style.marginTop = '12px';
  contactButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    Contacter le vendeur
  `;
  contactButton.onclick = () => startConversation(shopId);
  
  // Insérer après le bouton "Acheter maintenant"
  const buyButton = productDetails.querySelector('.btn-primary');
  if (buyButton && buyButton.parentNode) {
    buyButton.parentNode.insertBefore(contactButton, buyButton.nextSibling);
  }
}

function addContactShopButton() {
  const shopHeader = document.querySelector('.shop-header');
  if (!shopHeader) return;
  
  const shopId = getShopIdFromPage();
  
  const contactButton = document.createElement('button');
  contactButton.className = 'btn btn-outline';
  contactButton.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
    Contacter
  `;
  contactButton.onclick = () => startConversation(shopId);
  
  shopHeader.appendChild(contactButton);
}

function getShopIdFromPage() {
  // Récupérer l'ID de la boutique depuis l'URL ou les données de la page
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id') || '1'; // ID par défaut pour la démo
}

function startConversation(shopId) {
  if (!chatState.currentUserId) {
    alert('Veuillez vous connecter pour contacter le vendeur');
    window.location.href = 'connexion.html';
    return;
  }
  
  // Vérifier si une conversation existe déjà
  const existingConversation = chatState.conversations.find(conv => conv.shopId === shopId);
  
  if (existingConversation) {
    openConversation(existingConversation.id);
  } else {
    createNewConversation(shopId);
  }
}

function createNewConversation(shopId) {
  const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const newConversation = {
    id: conversationId,
    shopId: shopId,
    shopName: getShopName(shopId),
    shopAvatar: getShopAvatar(shopId),
    userId: chatState.currentUserId,
    userName: getCurrentUserName(),
    userAvatar: getCurrentUserAvatar(),
    lastMessage: null,
    lastMessageTime: new Date().toISOString(),
    unreadCount: 0,
    isActive: true,
    createdAt: new Date().toISOString()
  };
  
  chatState.conversations.unshift(newConversation);
  saveConversationsLocally();
  
  // Ouvrir la conversation
  openConversation(conversationId);
}

function openConversation(conversationId) {
  chatState.currentConversationId = conversationId;
  
  // Charger les messages de cette conversation
  loadMessages(conversationId);
  
  // Ouvrir le panneau de chat
  createChatPanel();
}

function createChatPanel() {
  // Supprimer le panneau existant s'il y en a un
  const existingPanel = document.getElementById('chat-panel');
  if (existingPanel) {
    existingPanel.remove();
  }
  
  const conversation = chatState.conversations.find(conv => conv.id === chatState.currentConversationId);
  if (!conversation) return;
  
  const chatPanel = document.createElement('div');
  chatPanel.id = 'chat-panel';
  chatPanel.innerHTML = `
    <div style="position: fixed; bottom: 100px; right: 24px; width: 380px; height: 500px; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); z-index: 1001; display: flex; flex-direction: column; border: 1px solid var(--border);">
      
      <!-- HEADER -->
      <div style="padding: 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--gradient-primary); color: white; border-radius: 20px 20px 0 0;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${conversation.shopAvatar}" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3);">
          <div>
            <div style="font-weight: 700; font-size: 16px;">${conversation.shopName}</div>
            <div style="font-size: 12px; opacity: 0.8;">En ligne</div>
          </div>
        </div>
        <button onclick="closeChatPanel()" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='none'">
          ×
        </button>
      </div>
      
      <!-- MESSAGES -->
      <div id="chat-messages" style="flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background: #f8fafc;">
        ${renderMessages()}
      </div>
      
      <!-- INPUT -->
      <div style="padding: 16px; border-top: 1px solid var(--border); background: white; border-radius: 0 0 20px 20px;">
        <div style="display: flex; gap: 12px; align-items: flex-end;">
          <input type="text" id="chat-input" placeholder="Tapez votre message..." 
                 style="flex: 1; padding: 12px 16px; border: 2px solid var(--border); border-radius: 20px; font-size: 14px; resize: none; max-height: 80px;"
                 onkeypress="handleChatKeyPress(event)">
          <button onclick="sendMessage()" id="send-btn"
                  style="width: 44px; height: 44px; background: var(--primary); border: none; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(chatPanel);
  
  // Focus sur l'input
  setTimeout(() => {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) chatInput.focus();
  }, 100);
  
  // Scroll vers le bas
  scrollToBottom();
}

function renderMessages() {
  if (chatState.messages.length === 0) {
    return `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <div style="font-size: 48px; margin-bottom: 16px;">💬</div>
        <div style="font-weight: 600; margin-bottom: 8px;">Commencez la conversation</div>
        <div style="font-size: 14px;">Posez vos questions sur le produit ou la boutique</div>
      </div>
    `;
  }
  
  return chatState.messages.map(message => {
    const isOwn = message.senderId === chatState.currentUserId;
    const time = new Date(message.createdAt).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    return `
      <div style="display: flex; ${isOwn ? 'justify-content: flex-end' : 'justify-content: flex-start'};">
        <div style="max-width: 70%; ${isOwn ? 'background: var(--primary); color: white;' : 'background: white; color: var(--text-primary); border: 1px solid var(--border);'} padding: 12px 16px; border-radius: 16px; ${isOwn ? 'border-bottom-right-radius: 4px;' : 'border-bottom-left-radius: 4px;'} box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="margin-bottom: 4px; line-height: 1.4;">${message.content}</div>
          <div style="font-size: 11px; opacity: 0.7; text-align: right;">${time}</div>
        </div>
      </div>
    `;
  }).join('');
}

function handleChatKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}

function sendMessage() {
  const chatInput = document.getElementById('chat-input');
  if (!chatInput) return;
  
  const content = chatInput.value.trim();
  if (!content) return;
  
  // Créer le message
  const message = {
    id: Date.now(),
    conversationId: chatState.currentConversationId,
    senderId: chatState.currentUserId,
    senderName: getCurrentUserName(),
    content: content,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  
  // Ajouter à la liste des messages
  chatState.messages.push(message);
  
  // Sauvegarder localement
  saveMessagesLocally();
  
  // Mettre à jour la conversation
  updateConversationLastMessage(message);
  
  // Vider l'input
  chatInput.value = '';
  
  // Re-render les messages
  updateMessagesDisplay();
  
  // Simuler une réponse automatique du vendeur
  setTimeout(() => {
    simulateSellerResponse();
  }, 1000 + Math.random() * 2000);
}

function simulateSellerResponse() {
  const responses = [
    "Bonjour ! Merci pour votre message. Comment puis-je vous aider ?",
    "Oui, ce produit est disponible. Avez-vous des questions spécifiques ?",
    "Nous livrons partout au Maroc. Les frais de livraison sont gratuits dès 200 DH.",
    "Ce produit est de très bonne qualité, fait artisanalement. Je vous le recommande !",
    "Nous avons d'autres variantes disponibles. Voulez-vous que je vous montre ?",
    "Le délai de livraison est de 2-3 jours ouvrés pour votre ville.",
    "Nous offrons une garantie satisfaction. Si le produit ne vous convient pas, retour gratuit !",
    "Merci pour votre intérêt ! N'hésitez pas si vous avez d'autres questions."
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  const conversation = chatState.conversations.find(conv => conv.id === chatState.currentConversationId);
  if (!conversation) return;
  
  const sellerMessage = {
    id: Date.now() + 1,
    conversationId: chatState.currentConversationId,
    senderId: `shop_${conversation.shopId}`,
    senderName: conversation.shopName,
    content: randomResponse,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  
  chatState.messages.push(sellerMessage);
  saveMessagesLocally();
  updateConversationLastMessage(sellerMessage);
  updateMessagesDisplay();
  
  // Notification sonore (optionnel)
  playNotificationSound();
}

function updateMessagesDisplay() {
  const messagesContainer = document.getElementById('chat-messages');
  if (messagesContainer) {
    messagesContainer.innerHTML = renderMessages();
    scrollToBottom();
  }
}

function scrollToBottom() {
  setTimeout(() => {
    const messagesContainer = document.getElementById('chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, 100);
}

function updateConversationLastMessage(message) {
  const conversation = chatState.conversations.find(conv => conv.id === chatState.currentConversationId);
  if (conversation) {
    conversation.lastMessage = message.content;
    conversation.lastMessageTime = message.createdAt;
    
    // Si c'est un message du vendeur, incrémenter les non-lus
    if (message.senderId !== chatState.currentUserId) {
      conversation.unreadCount++;
      chatState.unreadCount++;
    }
    
    saveConversationsLocally();
    updateFloatingButtonBadge();
  }
}

function updateFloatingButtonBadge() {
  const floatingBtn = document.getElementById('floating-chat-btn');
  if (floatingBtn) {
    floatingBtn.remove();
    createFloatingChatButton();
  }
}

function toggleChatPanel() {
  const existingPanel = document.getElementById('chat-panel');
  
  if (existingPanel) {
    closeChatPanel();
  } else {
    // Ouvrir la liste des conversations ou la dernière conversation
    if (chatState.conversations.length === 1) {
      openConversation(chatState.conversations[0].id);
    } else {
      showConversationsList();
    }
  }
}

function showConversationsList() {
  // Créer une liste des conversations (pour plus tard)
  // Pour l'instant, ouvrir la première conversation
  if (chatState.conversations.length > 0) {
    openConversation(chatState.conversations[0].id);
  }
}

function closeChatPanel() {
  const chatPanel = document.getElementById('chat-panel');
  if (chatPanel) {
    chatPanel.remove();
  }
}

function loadConversations() {
  const saved = localStorage.getItem('sooky_conversations');
  if (saved) {
    chatState.conversations = JSON.parse(saved);
    
    // Calculer le nombre total de messages non lus
    chatState.unreadCount = chatState.conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  }
}

function loadMessages(conversationId) {
  const saved = localStorage.getItem(`sooky_messages_${conversationId}`);
  if (saved) {
    chatState.messages = JSON.parse(saved);
  } else {
    chatState.messages = [];
  }
}

function saveConversationsLocally() {
  localStorage.setItem('sooky_conversations', JSON.stringify(chatState.conversations));
}

function saveMessagesLocally() {
  if (chatState.currentConversationId) {
    localStorage.setItem(`sooky_messages_${chatState.currentConversationId}`, JSON.stringify(chatState.messages));
  }
}

function simulateRealTimeConnection() {
  chatState.isConnected = true;
  console.log('Chat connecté (simulation)');
  
  // En production, ici on initialiserait WebSocket ou Supabase Realtime
}

function playNotificationSound() {
  // Créer un son de notification simple
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Notification sonore non disponible');
  }
}

// Fonctions utilitaires
function getCurrentUserId() {
  const user = JSON.parse(localStorage.getItem('sooky_user') || '{}');
  return user.id || user.email || null;
}

function getCurrentUserName() {
  const user = JSON.parse(localStorage.getItem('sooky_user') || '{}');
  return user.full_name || user.email?.split('@')[0] || 'Utilisateur';
}

function getCurrentUserAvatar() {
  const user = JSON.parse(localStorage.getItem('sooky_user') || '{}');
  return user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(getCurrentUserName())}&background=6366f1&color=fff`;
}

function getShopName(shopId) {
  const shopNames = {
    '1': 'Épicerie Bennani',
    '2': 'Artisanat Fassi',
    '3': 'Argan Bleu',
    '4': 'Poterie Salé'
  };
  return shopNames[shopId] || 'Boutique Sooky';
}

function getShopAvatar(shopId) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(getShopName(shopId))}&background=ec4899&color=fff`;
}

// Exposer les fonctions globalement
window.startConversation = startConversation;
window.toggleChatPanel = toggleChatPanel;
window.closeChatPanel = closeChatPanel;
window.sendMessage = sendMessage;
window.handleChatKeyPress = handleChatKeyPress;