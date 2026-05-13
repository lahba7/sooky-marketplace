// ============================================
// SOOKY - DONNÉES DYNAMIQUES DEPUIS SUPABASE
// ============================================

// Remplacer les données statiques par l'API Supabase
document.addEventListener('DOMContentLoaded', async function() {
  await loadDynamicContent();
});

async function loadDynamicContent() {
  const currentPage = window.location.pathname;
  
  try {
    if (currentPage.includes('index.html') || currentPage.endsWith('/')) {
      await loadHomepageProducts();
    } else if (currentPage.includes('boutiques.html')) {
      await loadShopsPage();
    } else if (currentPage.includes('boutique.html')) {
      await loadShopPage();
    } else if (currentPage.includes('produit.html')) {
      await loadProductPage();
    } else if (currentPage.includes('categories.html')) {
      await loadCategoryPage();
    }
  } catch (error) {
    console.error('Erreur chargement données:', error);
    // Fallback sur données statiques si erreur
  }
}

// HOMEPAGE - Charger produits dynamiques
async function loadHomepageProducts() {
  const products = await SookyAPI.getProducts({ limit: 12 });
  if (!products || products.length === 0) return;

  const productsGrid = document.querySelector('.products-grid');
  if (!productsGrid) return;

  productsGrid.innerHTML = products.map(product => `
    <a href="pages/produit.html?id=${product.id}" class="product-card">
      <div class="product-image" style="background-image: url('${product.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80'}')">
        ${product.price < 100 ? '<span class="product-badge">Promo</span>' : ''}
        <button class="favorite-btn" onclick="event.preventDefault(); toggleFavorite(${product.id})" data-product-id="${product.id}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="product-info">
        <div class="product-shop">${product.shops?.name || 'Boutique'}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-price">${product.price} DH</div>
        <div class="product-rating">
          <span class="star">★</span> ${product.rating} (${product.total_reviews})
        </div>
      </div>
    </a>
  `).join('');

  // Réinitialiser les favoris
  if (window.updateFavUI) updateFavUI();
}

// BOUTIQUES PAGE - Charger toutes les boutiques
async function loadShopsPage() {
  const shops = await SookyAPI.getShops({ limit: 20 });
  if (!shops || shops.length === 0) return;

  const shopsGrid = document.querySelector('.shops-grid');
  if (!shopsGrid) return;

  shopsGrid.innerHTML = shops.map(shop => `
    <a href="boutique.html?id=${shop.id}" class="shop-card">
      <div class="shop-cover" style="background-image: url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80')">
        ${shop.is_verified ? '<span class="shop-badge verified">✓ Vérifié</span>' : '<span class="shop-badge">Nouveau</span>'}
        <div class="shop-logo">${shop.name.substring(0, 2).toUpperCase()}</div>
      </div>
      <div class="shop-info">
        <div class="shop-meta">
          <div class="shop-location">📍 ${shop.city}</div>
          <div class="shop-rating"><span class="star">★</span> ${shop.rating} (${shop.total_reviews})</div>
        </div>
        <h3 class="shop-name">${shop.name}</h3>
        <p class="shop-description">${shop.description}</p>
        <div class="shop-tags">
          <span class="shop-tag">${shop.category}</span>
          ${shop.is_verified ? '<span class="shop-tag">Vérifié</span>' : ''}
        </div>
        <div class="shop-footer">
          <div class="shop-products"><strong>127</strong> produits</div>
          <div class="visit-btn">Visiter →</div>
        </div>
      </div>
    </a>
  `).join('');

  // Mettre à jour le compteur
  const resultsCount = document.querySelector('.results-count strong');
  if (resultsCount) resultsCount.textContent = shops.length;
}

// BOUTIQUE PAGE - Charger une boutique spécifique
async function loadShopPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const shopId = urlParams.get('id');
  if (!shopId) return;

  const [shop, products] = await Promise.all([
    SookyAPI.getShop(shopId),
    SookyAPI.getShopProducts(shopId)
  ]);

  if (!shop) return;

  // Mettre à jour les infos de la boutique
  const shopName = document.querySelector('.shop-info h1');
  const shopDescription = document.querySelector('.shop-description');
  const shopLogo = document.querySelector('.shop-logo-big');
  
  if (shopName) shopName.textContent = shop.name;
  if (shopDescription) shopDescription.textContent = shop.description;
  if (shopLogo) shopLogo.textContent = shop.name.substring(0, 2).toUpperCase();

  // Mettre à jour les métadonnées
  const shopMeta = document.querySelector('.shop-meta');
  if (shopMeta) {
    shopMeta.innerHTML = `
      <span>📍 ${shop.city}</span>
      <span>⭐ ${shop.rating} (${shop.total_reviews} avis)</span>
      <span>🕐 Ouvert · Ferme à 22h</span>
      ${shop.is_verified ? '<span>✓ Boutique vérifiée</span>' : ''}
    `;
  }

  // Charger les produits de la boutique
  if (products && products.length > 0) {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
      productsGrid.innerHTML = products.map(product => `
        <a href="produit.html?id=${product.id}" class="product-card">
          <div class="product-image" style="background-image: url('${product.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80'}')">
            <button class="favorite-btn" onclick="event.preventDefault(); toggleFavorite(${product.id})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>
          <div class="product-info">
            <div class="product-shop">${shop.name}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price} DH</div>
            <div class="product-rating">
              <span class="star">★</span> ${product.rating} (${product.total_reviews})
            </div>
          </div>
        </a>
      `).join('');
    }
  }
}

// PRODUIT PAGE - Charger un produit spécifique
async function loadProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  if (!productId) return;

  const [product, reviews] = await Promise.all([
    SookyAPI.getProduct(productId),
    SookyAPI.getProductReviews(productId)
  ]);

  if (!product) return;

  // Mettre à jour les infos du produit
  const productName = document.querySelector('.product-details h1');
  const productPrice = document.querySelector('.price');
  const productDescription = document.querySelector('.product-description p');
  const shopLink = document.querySelector('.shop-link');
  const mainImage = document.querySelector('.main-image');

  if (productName) productName.textContent = product.name;
  if (productPrice) productPrice.textContent = `${product.price} DH`;
  if (productDescription) productDescription.textContent = product.description;
  if (shopLink) {
    shopLink.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
      ${product.shops?.name} · ${product.shops?.city}
    `;
    shopLink.href = `boutique.html?id=${product.shop_id}`;
  }

  if (mainImage && product.images?.[0]) {
    mainImage.style.backgroundImage = `url('${product.images[0]}')`;
  }

  // Mettre à jour la note
  const ratingDiv = document.querySelector('.product-details > div[style*="flex"]');
  if (ratingDiv) {
    ratingDiv.innerHTML = `
      <div style="color: var(--warning); font-size: 18px;">★★★★★</div>
      <span style="font-weight: 600;">${product.rating}</span>
      <span style="color: var(--text-muted);">(${product.total_reviews} avis)</span>
    `;
  }

  // Charger les avis
  if (reviews && reviews.length > 0) {
    const reviewsSection = document.querySelector('.reviews-section');
    if (reviewsSection) {
      const reviewsHTML = reviews.slice(0, 3).map(review => `
        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="reviewer-name">${review.profiles?.full_name || 'Utilisateur'}</div>
              <div class="review-date">${formatDate(review.created_at)}</div>
            </div>
            <div class="review-stars">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
          </div>
          <p>${review.comment}</p>
        </div>
      `).join('');

      const existingReviews = reviewsSection.querySelector('.review-card');
      if (existingReviews) {
        existingReviews.parentNode.innerHTML = reviewsHTML;
      }
    }
  }
}

// CATEGORIES PAGE - Charger produits par catégorie
async function loadCategoryPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category') || 'Alimentation';
  
  const products = await SookyAPI.getProducts({ limit: 20 });
  if (!products) return;

  // Filtrer par catégorie (côté client pour l'instant)
  const filteredProducts = products.filter(p => 
    p.category === category || category === 'all'
  );

  const productsGrid = document.querySelector('.products-grid');
  if (productsGrid && filteredProducts.length > 0) {
    productsGrid.innerHTML = filteredProducts.map(product => `
      <a href="produit.html?id=${product.id}" class="product-card">
        <div class="product-image" style="background-image: url('${product.images?.[0] || 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80'}')">
          <button class="favorite-btn" onclick="event.preventDefault(); toggleFavorite(${product.id})">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div class="product-info">
          <div class="product-shop">${product.shops?.name || 'Boutique'}</div>
          <div class="product-name">${product.name}</div>
          <div class="product-price">${product.price} DH</div>
          <div class="product-rating">
            <span class="star">★</span> ${product.rating} (${product.total_reviews})
          </div>
        </div>
      </a>
    `).join('');
  }

  // Mettre à jour le compteur
  const resultsInfo = document.querySelector('.results-info strong');
  if (resultsInfo) resultsInfo.textContent = filteredProducts.length;
}

// RECHERCHE DYNAMIQUE - Remplacer les données statiques
async function performDynamicSearch(query) {
  try {
    const results = await SookyAPI.search(query);
    return results;
  } catch (error) {
    console.error('Erreur recherche:', error);
    // Fallback sur recherche statique
    return window.SookySearch?.performSearch(query) || { products: [], shops: [] };
  }
}

// Utilitaires
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
  return `Il y a ${Math.ceil(diffDays / 30)} mois`;
}

// Export global
window.loadDynamicContent = loadDynamicContent;
window.performDynamicSearch = performDynamicSearch;