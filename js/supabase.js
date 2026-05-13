// ============================================
// SOOKY - CLIENT SUPABASE
// ============================================

// Configuration Supabase (à remplacer par tes vraies clés)
const SUPABASE_URL = 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = 'your-anon-key'

// Client Supabase simple (sans npm pour l'instant)
class SookySupabase {
  constructor() {
    this.url = SUPABASE_URL;
    this.key = SUPABASE_ANON_KEY;
    this.headers = {
      'apikey': this.key,
      'Authorization': `Bearer ${this.key}`,
      'Content-Type': 'application/json'
    };
  }

  // GET - Récupérer des données
  async select(table, options = {}) {
    let url = `${this.url}/rest/v1/${table}`;
    
    if (options.select) url += `?select=${options.select}`;
    if (options.eq) url += `${url.includes('?') ? '&' : '?'}${options.eq.column}=eq.${options.eq.value}`;
    if (options.limit) url += `${url.includes('?') ? '&' : '?'}limit=${options.limit}`;
    if (options.order) url += `${url.includes('?') ? '&' : '?'}order=${options.order}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });

    return await response.json();
  }

  // POST - Insérer des données
  async insert(table, data) {
    const response = await fetch(`${this.url}/rest/v1/${table}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  // PATCH - Mettre à jour
  async update(table, data, condition) {
    const response = await fetch(`${this.url}/rest/v1/${table}?${condition.column}=eq.${condition.value}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  // DELETE - Supprimer
  async delete(table, condition) {
    const response = await fetch(`${this.url}/rest/v1/${table}?${condition.column}=eq.${condition.value}`, {
      method: 'DELETE',
      headers: this.headers
    });

    return await response.json();
  }
}

// Instance globale
const supabase = new SookySupabase();

// API Sooky - Fonctions spécifiques
const SookyAPI = {
  // Récupérer tous les produits
  async getProducts(options = {}) {
    return await supabase.select('products', {
      select: 'id,name,price,images,rating,total_reviews,shop_id,shops(name,city)',
      limit: options.limit || 50,
      order: options.order || 'created_at.desc'
    });
  },

  // Récupérer un produit par ID
  async getProduct(id) {
    const result = await supabase.select('products', {
      select: 'id,name,description,price,images,rating,total_reviews,stock,category,shop_id,shops(name,city,rating)',
      eq: { column: 'id', value: id }
    });
    return result[0];
  },

  // Récupérer les boutiques
  async getShops(options = {}) {
    return await supabase.select('shops', {
      select: 'id,name,description,city,category,rating,total_reviews,is_verified',
      limit: options.limit || 20,
      order: 'rating.desc'
    });
  },

  // Récupérer une boutique par ID
  async getShop(id) {
    const result = await supabase.select('shops', {
      select: 'id,name,description,city,category,rating,total_reviews,is_verified,logo_url,cover_url',
      eq: { column: 'id', value: id }
    });
    return result[0];
  },

  // Récupérer les produits d'une boutique
  async getShopProducts(shopId) {
    return await supabase.select('products', {
      select: 'id,name,price,images,rating,total_reviews',
      eq: { column: 'shop_id', value: shopId }
    });
  },

  // Rechercher produits et boutiques
  async search(query) {
    // Recherche produits
    const products = await supabase.select('products', {
      select: 'id,name,price,images,rating,total_reviews,shop_id,shops(name)',
      limit: 10
    });

    // Recherche boutiques
    const shops = await supabase.select('shops', {
      select: 'id,name,city,category,rating,total_reviews',
      limit: 5
    });

    // Filtrer côté client (en attendant la recherche full-text)
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.shops?.name.toLowerCase().includes(query.toLowerCase())
    );

    const filteredShops = shops.filter(s => 
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.city.toLowerCase().includes(query.toLowerCase())
    );

    return {
      products: filteredProducts.slice(0, 5),
      shops: filteredShops.slice(0, 3)
    };
  },

  // Récupérer les avis d'un produit
  async getProductReviews(productId) {
    return await supabase.select('reviews', {
      select: 'id,rating,comment,created_at,profiles(full_name)',
      eq: { column: 'product_id', value: productId },
      order: 'created_at.desc'
    });
  }
};

// Export global
window.supabase = supabase;
window.SookyAPI = SookyAPI;