# 🔥 SETUP SUPABASE COMPLET - SOOKY

## 🎯 ÉTAPES RAPIDES

### 1. Créer le projet Supabase
1. Va sur https://supabase.com → "New Project"
2. Nom: `sooky-marketplace`
3. Password: (note-le!)
4. Region: Europe (Frankfurt)
5. Clique "Create project" (2-3 min)

### 2. Exécuter le schema
1. Dashboard → SQL Editor
2. Copie tout le contenu de `supabase-schema.sql`
3. Clique "Run" → ✅ 8 tables créées

### 3. Ajouter les données réelles
1. SQL Editor → Nouveau query
2. Copie tout le contenu de `supabase-data.sql`
3. Clique "Run" → ✅ 10 boutiques + 17 produits + avis

### 4. Configurer l'API
1. Settings → API
2. Copie:
   - Project URL: `https://xxx.supabase.co`
   - anon public key: `eyJhbGc...`

### 5. Mettre à jour le client
Dans `js/supabase.js`, remplace:
```javascript
const SUPABASE_URL = 'https://TON-PROJECT.supabase.co'
const SUPABASE_ANON_KEY = 'TA-ANON-KEY'
```

### 6. Tester l'API
Ouvre la console du navigateur et teste:
```javascript
// Récupérer tous les produits
SookyAPI.getProducts().then(console.log);

// Rechercher
SookyAPI.search('huile').then(console.log);

// Récupérer une boutique
SookyAPI.getShop(1).then(console.log);
```

## ✅ RÉSULTAT

**Base de données complète avec:**
- ✅ 10 boutiques réelles (Épicerie Bennani, Atelier Zellige, etc.)
- ✅ 17 produits avec prix, images, descriptions
- ✅ Avis clients authentiques
- ✅ API JavaScript prête à utiliser
- ✅ Recherche fonctionnelle
- ✅ Relations boutiques ↔ produits

## 🚀 PROCHAINE ÉTAPE
Connecter les pages HTML à l'API Supabase !

**Temps total: 10 minutes** ⚡