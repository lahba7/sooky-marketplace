# Sooky — Ta boutique en ligne en 5 minutes

## 🇲🇦 À propos

**Sooky est l'Etsy marocain** — une marketplace qui donne une vitrine digitale à TOUS les petits commerçants du Maroc. 

Au lieu de créer un site e-commerce coûteux et complexe, les commerçants obtiennent une boutique en ligne professionnelle en 5 minutes, avec paiement intégré, gestion des commandes et tableau de bord simple.

### 🎯 Mission
Permettre à chaque petit commerçant marocain (épicerie, restaurant, salon de coiffure, boutique de mode, artisan...) de vendre en ligne sans compétences techniques ni gros budget.

## ✨ Fonctionnalités actuelles

### Pour les clients :
- **Page d'accueil** avec découverte des boutiques locales
- **12 catégories** de commerces (restaurants, mode, beauté, épicerie, etc.)
- **Listing de boutiques** avec filtres (ville, type, livraison)
- **Pages boutiques individuelles** avec catalogue produits
- **Système de panier** et commande en ligne

### Pour les commerçants :
- **Inscription en 3 étapes** (5 minutes chrono)
- **Vitrine professionnelle** automatique
- **Gestion des produits** et prix
- **Notifications** commandes (SMS/WhatsApp)
- **Tableau de bord** simple
- **Commission de 3%** seulement (vs 15-30% ailleurs)
- **Paiement sous 48h** sur compte bancaire

## 🎨 Design

- **Palette de couleurs** inspirée du Maroc :
  - Terracotta (#C8553D)
  - Safran (#E8A33D)
  - Teal (#1E5F66)
  - Crème (#FBF5EC)
  
- **Typographies** :
  - Fraunces (serif) pour les titres
  - Inter (sans-serif) pour le corps de texte

- **Style** : Moderne, chaleureux, artisanal

## 🚀 Démarrage rapide

1. Ouvrez simplement `index.html` dans votre navigateur
2. Aucune installation ou dépendance requise
3. Le site est entièrement statique (HTML/CSS/JS vanilla)

## 📁 Structure du projet

```
sooky/
├── css/
│   └── style.css                 # Styles globaux
├── js/
│   └── main.js                   # JavaScript principal
├── images/                       # Images du site (vide pour l'instant)
├── index.html                    # Homepage (grille de produits)
├── produit.html                  # Page produit détaillée
├── vendre.html                   # Page "Vendre sur Sooky"
├── README.md                     # Documentation
├── SPECIFICATIONS.md             # Specs techniques
├── PLAN_ACTION.md                # Roadmap MVP
├── IDEES_FUTURES.md              # Fonctionnalités futures
└── .gitignore                    # Fichiers à ignorer
```

### Pages à créer prochainement :
- `boutique.html` - Page boutique individuelle
- `categories.html` - Liste produits par catégorie
- `panier.html` - Panier d'achat
- `connexion.html` - Connexion/Inscription client
- `inscription.html` - Inscription vendeur (formulaire multi-étapes)
- `recherche.html` - Résultats de recherche

## 🔮 Roadmap technique

### Phase 1 : MVP (Minimum Viable Product)
- [ ] Backend API (Node.js + Express ou Supabase)
- [ ] Base de données (PostgreSQL)
- [ ] Authentification (JWT ou Supabase Auth)
- [ ] Upload d'images (Cloudinary ou S3)
- [ ] Système de panier fonctionnel
- [ ] Intégration paiement (CMI, Stripe)
- [ ] Notifications SMS (Twilio ou local)
- [ ] Dashboard vendeur basique

### Phase 2 : Croissance
- [ ] Application mobile (React Native)
- [ ] Système de livraison intégré
- [ ] Programme de fidélité
- [ ] Avis et notes clients
- [ ] Analytics pour vendeurs
- [ ] Marketing automation
- [ ] Support multilingue (FR/AR/Darija)

### Phase 3 : Scale
- [ ] API publique pour partenaires
- [ ] Marketplace B2B
- [ ] Système de franchise
- [ ] Expansion internationale

## 💡 Technologies utilisées

- HTML5
- CSS3 (Variables CSS, Grid, Flexbox, Animations)
- JavaScript Vanilla
- Google Fonts (Fraunces, Inter)
- Unsplash (images de démonstration)

## 💡 Stack technique recommandé

### Option 1 : Full JavaScript (Rapide)
- **Frontend** : Next.js 14 (React + SSR)
- **Backend** : Supabase (PostgreSQL + Auth + Storage + Realtime)
- **Paiement** : CMI (Maroc) + Stripe (International)
- **SMS** : Twilio ou service local marocain
- **Hosting** : Vercel (frontend) + Supabase Cloud

### Option 2 : Full Stack classique
- **Frontend** : React + Vite
- **Backend** : Node.js + Express
- **Database** : PostgreSQL + Prisma ORM
- **Auth** : JWT + bcrypt
- **Storage** : AWS S3 ou Cloudinary
- **Hosting** : VPS (OVH, DigitalOcean)

### Option 3 : Low-code (Prototype rapide)
- **Bubble.io** ou **Webflow** + Airtable
- Permet de valider le concept avant de coder

## 🎯 Business Model

- **Commission** : 3% par transaction
- **Pas de frais d'inscription**
- **Pas d'abonnement mensuel**
- **Services premium** (optionnels) :
  - Mise en avant boutique : 200 DH/mois
  - Photos professionnelles : 500 DH
  - Formation e-commerce : 1000 DH

## 📊 Métriques clés à suivre

- Nombre de boutiques actives
- GMV (Gross Merchandise Value)
- Taux de conversion
- Panier moyen
- Taux de rétention vendeurs
- NPS (Net Promoter Score)

---

**Fait avec ❤️ pour tous les commerçants du Maroc**
