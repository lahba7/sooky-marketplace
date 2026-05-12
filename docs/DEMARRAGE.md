# 🚀 Guide de démarrage — Sooky

## Voir le site localement

### Option 1 : Ouvrir directement dans le navigateur
1. Navigue vers le dossier `sooky`
2. Double-clique sur `index.html`
3. Le site s'ouvre dans ton navigateur par défaut

### Option 2 : Serveur local (recommandé)
```bash
# Avec Python 3
cd sooky
python3 -m http.server 8000

# Avec Node.js (si npx installé)
cd sooky
npx serve

# Avec PHP
cd sooky
php -S localhost:8000
```

Puis ouvre http://localhost:8000 dans ton navigateur.

---

## Structure des pages

### 🏠 Homepage (`index.html`)
- **Objectif** : Découverte de produits (comme Etsy)
- **Contenu** : Grille de 12 produits, barre de catégories
- **Navigation** : Recherche, Panier, "Vendre sur Sooky"

### 📦 Page Produit (`produit.html`)
- **Objectif** : Détails produit + achat
- **Contenu** : Galerie photos, description, prix, avis, produits similaires
- **Actions** : Ajouter au panier, Acheter maintenant

### 💼 Page Vendeur (`vendre.html`)
- **Objectif** : Convaincre les commerçants de s'inscrire
- **Contenu** : Features, pricing (3%), étapes, CTA
- **Action** : "Créer ma boutique gratuitement"

---

## Personnalisation rapide

### Changer les couleurs
Édite `css/style.css` ligne 1-10 :
```css
:root {
  --terracotta: #C8553D;     /* Couleur principale */
  --saffron: #E8A33D;        /* Accents */
  --teal: #1E5F66;           /* Success */
  --cream: #FBF5EC;          /* Background */
  --ink: #1A1715;            /* Texte */
}
```

### Ajouter un produit
Dans `index.html`, copie-colle un bloc `.product-card` et modifie :
- `href="produit.html?id=XX"` (ID unique)
- `background-image: url('...')` (image)
- `.product-shop` (nom boutique)
- `.product-name` (nom produit)
- `.product-price` (prix)
- `.product-rating` (note et nombre d'avis)

### Ajouter une catégorie
Dans `index.html`, dans `.categories-list`, ajoute :
```html
<a href="categories.html?cat=nouvelle" class="category-pill">
  🎯 Nouvelle Catégorie
</a>
```

---

## Prochaines étapes de développement

### Phase 1 : Compléter les pages statiques (1-2 jours)
- [ ] Créer `boutique.html` (page boutique avec ses produits)
- [ ] Créer `categories.html` (liste produits filtrés)
- [ ] Créer `panier.html` (panier d'achat)
- [ ] Créer `connexion.html` (login/signup)
- [ ] Créer `inscription.html` (onboarding vendeur)

### Phase 2 : Ajouter de l'interactivité (2-3 jours)
- [ ] Système de panier (localStorage)
- [ ] Filtres produits (prix, ville, catégorie)
- [ ] Recherche fonctionnelle
- [ ] Pagination
- [ ] Formulaires de contact

### Phase 3 : Backend & Base de données (2-3 semaines)
- [ ] Setup Next.js 14
- [ ] Configurer Supabase
- [ ] Créer schéma DB (voir SPECIFICATIONS.md)
- [ ] API endpoints
- [ ] Authentification
- [ ] Upload d'images

### Phase 4 : Paiement & Livraison (1-2 semaines)
- [ ] Intégration CMI (Maroc)
- [ ] Intégration Stripe (International)
- [ ] Système de notifications (SMS, Email)
- [ ] Gestion des commandes

### Phase 5 : Dashboard Vendeur (2 semaines)
- [ ] Interface vendeur
- [ ] Gestion produits
- [ ] Gestion commandes
- [ ] Analytics basiques

---

## Ressources utiles

### Images gratuites
- **Unsplash** : https://unsplash.com (utilisé actuellement)
- **Pexels** : https://pexels.com
- **Pixabay** : https://pixabay.com

### Icônes
- **Lucide** : https://lucide.dev
- **Heroicons** : https://heroicons.com
- **Feather Icons** : https://feathericons.com

### Fonts
- **Google Fonts** : https://fonts.google.com
  - Fraunces (serif) : Titres
  - Inter (sans-serif) : Corps de texte

### Inspiration design
- **Etsy** : https://etsy.com (référence principale)
- **Faire** : https://faire.com
- **Gumroad** : https://gumroad.com

---

## Commandes Git utiles

```bash
# Initialiser Git
git init
git add .
git commit -m "Initial commit - Sooky v2.0"

# Créer repo GitHub
# (créer le repo sur github.com puis)
git remote add origin https://github.com/ton-username/sooky.git
git branch -M main
git push -u origin main

# Workflow quotidien
git add .
git commit -m "Description des changements"
git push
```

---

## Déploiement rapide (gratuit)

### Netlify (recommandé pour statique)
1. Va sur https://netlify.com
2. Drag & drop le dossier `sooky`
3. Site en ligne en 30 secondes !

### Vercel
1. Va sur https://vercel.com
2. Import depuis GitHub
3. Deploy automatique

### GitHub Pages
```bash
# Dans ton repo GitHub
Settings → Pages → Source: main branch
```

---

## Besoin d'aide ?

### Documentation
- `README.md` : Vue d'ensemble
- `SPECIFICATIONS.md` : Détails techniques
- `PLAN_ACTION.md` : Roadmap MVP
- `IDEES_FUTURES.md` : Fonctionnalités futures

### Contact
- Email : (à ajouter)
- WhatsApp : (à ajouter)
- GitHub Issues : (à ajouter)

---

**Bon développement ! 🚀🇲🇦**
