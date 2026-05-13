// ============================================
// SOOKY - SYSTÈME DE RECHERCHE EN TEMPS RÉEL
// ============================================

// Base de données de produits (sera remplacée par Supabase plus tard)
const productsDatabase = [
  { id: 1, name: "Huile d'olive extra vierge artisanale", shop: "Épicerie Bennani", category: "Alimentation", price: 85, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80", rating: 4.9, reviews: 127 },
  { id: 2, name: "Carreaux zellige bleu traditionnel", shop: "Atelier Zellige Fès", category: "Artisanat", price: 450, image: "https://images.unsplash.com/photo-1610055568854-43b9b3a4eed2?w=200&q=80", rating: 5.0, reviews: 89 },
  { id: 3, name: "Huile d'argan cosmétique pure 100ml", shop: "Argan Bleu", category: "Beauté", price: 120, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80", rating: 4.8, reviews: 234 },
  { id: 4, name: "Sac en cuir véritable fait main", shop: "Maison Khalil", category: "Mode", price: 680, image: "https://images.unsplash.com/photo-1609001489147-6c1c8f5f0e72?w=200&q=80", rating: 4.9, reviews: 156 },
  { id: 5, name: "Tapis berbère Beni Ouarain 200x150cm", shop: "Tapis Beni", category: "Maison", price: 2800, image: "https://images.unsplash.com/photo-1604423481675-d96cc5b87bd9?w=200&q=80", rating: 5.0, reviews: 67 },
  { id: 6, name: "Tajine en céramique peint main", shop: "Safi Faïence", category: "Maison", price: 280, image: "https://images.unsplash.com/photo-1606914469633-ddd62ec10ce1?w=200&q=80", rating: 4.7, reviews: 92 },
  { id: 7, name: "Caftan moderne brodé main", shop: "Lalla Kenza", category: "Mode", price: 1850, image: "https://images.unsplash.com/photo-1610018556010-6a11691bc905?w=200&q=80", rating: 4.9, reviews: 203 },
  { id: 8, name: "Miel de thym pur 500g", shop: "Miel du Rif", category: "Alimentation", price: 150, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80", rating: 5.0, reviews: 178 },
  { id: 9, name: "Fromage de chèvre artisanal", shop: "Fromage Atlas", category: "Alimentation", price: 65, image: "https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=200&q=80", rating: 4.8, reviews: 145 },
  { id: 10, name: "Dattes Medjool premium 1kg", shop: "Dattes du Sud", category: "Alimentation", price: 95, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200&q=80", rating: 4.9, reviews: 267 },
  { id: 11, name: "Babouches en cuir brodées", shop: "Babouches Fassi", category: "Mode", price: 320, image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=200&q=80", rating: 4.7, reviews: 112 },
  { id: 12, name: "Vase en céramique émaillée", shop: "Poterie Safi", category: "Maison", price: 180, image: "https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?w=200&q=80", rating: 4.8, reviews: 89 },
  { id: 13, name: "Savon noir naturel à l'eucalyptus", shop: "Argan Bleu", category: "Beauté", price: 45, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80", rating: 4.9, reviews: 312 },
  { id: 14, name: "Couscous complet bio 1kg", shop: "Épicerie Bennani", category: "Alimentation", price: 35, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&q=80", rating: 4.7, reviews: 89 },
  { id: 15, name: "Pouf en cuir marocain", shop: "Maison Khalil", category: "Maison", price: 450, image: "https://images.unsplash.com/photo-1609001489147-6c1c8f5f0e72?w=200&q=80", rating: 4.8, reviews: 134 },
];

// Boutiques
const shopsDatabase = [
  { id: 1, name: "Épicerie Bennani", category: "Alimentation", city: "Casablanca", rating: 4.9, products: 127 },
  { id: 2, name: "Atelier Zellige Fès", category: "Artisanat", city: "Fès", rating: 5.0, products: 89 },
  { id: 3, name: "Argan Bleu", category: "Beauté", city: "Essaouira", rating: 5.0, products: 48 },
  { id: 4, name: "Maison Khalil", category: "Mode", city: "Fès", rating: 4.8, products: 156 },
  { id: 5, name: "Tapis Beni", category: "Maison", city: "Atlas", rating: 4.9, products: 52 },
  { id: 6, name: "Safi Faïence", category: "Maison", city: "Safi", rating: 4.7, products: 68 },
  { id: 7, name: "Lalla Kenza", category: "Mode", city: "Casablanca", rating: 4.9, products: 43 },
  { id: 8, name: "Miel du Rif", category: "Alimentation", city: "Chefchaouen", rating: 5.0, products: 12 },
];

// État de la recherche
let searchTimeout = null;
let currentSearchTerm = '';

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
  initializeSearch();
});

function initializeSearch() {
  const searchInputs = document.querySelectorAll('.search-bar input');
  
  searchInputs.forEach(input => {
    // Créer le conteneur de suggestions
    const suggestionsContainer = createSuggestionsContainer(input);
    
    // Événement de saisie
    input.addEventListener('input', function(e) {
      const query = e.target.value.trim();
      currentSearchTerm = query;
      
      // Debounce pour éviter trop de recherches
      clearTimeout(searchTimeout);
      
      if (query.length >= 2) {
        searchTimeout = setTimeout(() => {
          performSearch(query, suggestionsContainer);
        }, 300);
      } else {
        hideSuggestions(suggestionsContainer);
      }
    });
    
    // Fermer les suggestions en cliquant ailleurs
    document.addEventListener('click', function(e) {
      if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        hideSuggestions(suggestionsContainer);
      }
    });
    
    // Navigation au clavier
    input.addEventListener('keydown', function(e) {
      handleKeyboardNavigation(e, suggestionsContainer);
    });
  });
}

function createSuggestionsContainer(input) {
  const container = document.createElement('div');
  container.className = 'search-suggestions';
  container.style.cssText = `
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: white;
    border-radius: 16px;
    box-shadow: 0 16px 48px rgba(99, 102, 241, 0.16);
    border: 1px solid rgba(226, 232, 240, 0.5);
    max-height: 500px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
  `;
  
  input.parentElement.style.position = 'relative';
  input.parentElement.appendChild(container);
  
  return container;
}

function performSearch(query, container) {
  const lowerQuery = query.toLowerCase();
  
  // Utiliser l'API dynamique si disponible
  if (window.performDynamicSearch) {
    window.performDynamicSearch(query).then(results => {
      displaySuggestions(results.products || [], results.shops || [], container, query);
    }).catch(error => {
      console.error('Erreur API dynamique:', error);
      // Fallback sur recherche statique
      performStaticSearch(query, container);
    });
  } else {
    // Fallback sur recherche statique
    performStaticSearch(query, container);
  }
}

function performStaticSearch(query, container) {
  const lowerQuery = query.toLowerCase();
  
  // Rechercher dans les produits
  const productResults = productsDatabase.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.shop.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery)
  ).slice(0, 5);
  
  // Rechercher dans les boutiques
  const shopResults = shopsDatabase.filter(shop =>
    shop.name.toLowerCase().includes(lowerQuery) ||
    shop.category.toLowerCase().includes(lowerQuery) ||
    shop.city.toLowerCase().includes(lowerQuery)
  ).slice(0, 3);
  
  displaySuggestions(productResults, shopResults, container, query);
}

function displaySuggestions(products, shops, container, query) {
  if (products.length === 0 && shops.length === 0) {
    container.innerHTML = `
      <div style="padding: 24px; text-align: center; color: #94A3B8;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin: 0 auto 12px; opacity: 0.5;">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <div style="font-weight: 600; margin-bottom: 4px;">Aucun résultat</div>
        <div style="font-size: 14px;">Essayez avec d'autres mots-clés</div>
      </div>
    `;
    container.style.display = 'block';
    return;
  }
  
  let html = '';
  
  // Section Produits
  if (products.length > 0) {
    html += `
      <div style="padding: 16px 20px 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94A3B8;">
        Produits
      </div>
    `;
    
    products.forEach(product => {
      html += `
        <a href="pages/produit.html?id=${product.id}" class="search-result-item" style="display: flex; align-items: center; gap: 16px; padding: 12px 20px; text-decoration: none; color: inherit; transition: all 0.2s ease; border-left: 3px solid transparent;">
          <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; border-radius: 12px; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <div style="flex: 1; min-width: 0;">
            <div style="font-weight: 600; font-size: 15px; margin-bottom: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${highlightText(product.name, query)}</div>
            <div style="font-size: 13px; color: #94A3B8;">${product.shop}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; color: #6366F1; font-size: 16px;">${product.price} DH</div>
            <div style="font-size: 12px; color: #94A3B8;">★ ${product.rating}</div>
          </div>
        </a>
      `;
    });
  }
  
  // Section Boutiques
  if (shops.length > 0) {
    html += `
      <div style="padding: 16px 20px 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94A3B8; border-top: 1px solid #E2E8F0; margin-top: 8px;">
        Boutiques
      </div>
    `;
    
    shops.forEach(shop => {
      html += `
        <a href="pages/boutique.html?id=${shop.id}" class="search-result-item" style="display: flex; align-items: center; gap: 16px; padding: 12px 20px; text-decoration: none; color: inherit; transition: all 0.2s ease; border-left: 3px solid transparent;">
          <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #6366F1 0%, #EC4899 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
            ${shop.name.substring(0, 2).toUpperCase()}
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 15px; margin-bottom: 4px;">${highlightText(shop.name, query)}</div>
            <div style="font-size: 13px; color: #94A3B8;">${shop.city} • ${shop.products} produits</div>
          </div>
          <div style="font-size: 12px; color: #94A3B8;">★ ${shop.rating}</div>
        </a>
      `;
    });
  }
  
  // Lien "Voir tous les résultats"
  html += `
    <a href="pages/categories.html?q=${encodeURIComponent(query)}" style="display: block; padding: 16px 20px; text-align: center; font-weight: 600; font-size: 14px; color: #6366F1; text-decoration: none; border-top: 1px solid #E2E8F0; margin-top: 8px; transition: all 0.2s ease;">
      Voir tous les résultats pour "${query}" →
    </a>
  `;
  
  container.innerHTML = html;
  container.style.display = 'block';
  
  // Ajouter les effets hover
  const items = container.querySelectorAll('.search-result-item');
  items.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.background = '#F8FAFC';
      this.style.borderLeftColor = '#6366F1';
    });
    item.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
      this.style.borderLeftColor = 'transparent';
    });
  });
}

function highlightText(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark style="background: rgba(99, 102, 241, 0.15); color: #6366F1; padding: 2px 4px; border-radius: 4px; font-weight: 700;">$1</mark>');
}

function hideSuggestions(container) {
  container.style.display = 'none';
}

function handleKeyboardNavigation(e, container) {
  const items = container.querySelectorAll('.search-result-item');
  if (items.length === 0) return;
  
  const currentIndex = Array.from(items).findIndex(item => item.classList.contains('active'));
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    setActiveItem(items, nextIndex);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    setActiveItem(items, prevIndex);
  } else if (e.key === 'Enter' && currentIndex >= 0) {
    e.preventDefault();
    items[currentIndex].click();
  } else if (e.key === 'Escape') {
    hideSuggestions(container);
  }
}

function setActiveItem(items, index) {
  items.forEach((item, i) => {
    if (i === index) {
      item.classList.add('active');
      item.style.background = '#F8FAFC';
      item.style.borderLeftColor = '#6366F1';
      item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    } else {
      item.classList.remove('active');
      item.style.background = 'transparent';
      item.style.borderLeftColor = 'transparent';
    }
  });
}

// Export pour utilisation dans d'autres fichiers
window.SookySearch = {
  performSearch,
  productsDatabase,
  shopsDatabase
};
