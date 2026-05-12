# Spécifications techniques — Sooky Marketplace

## 🎯 Vision produit

Sooky est une marketplace B2C qui connecte les petits commerçants marocains avec leurs clients. L'objectif est de rendre la vente en ligne accessible à TOUS les commerçants, même sans compétences techniques.

## 👥 Personas

### Persona 1 : Le Commerçant (Vendeur)
- **Profil** : Rachid, 45 ans, propriétaire d'une épicerie à Casablanca
- **Problème** : Perd des clients face aux grandes surfaces et aux apps de livraison
- **Besoin** : Vendre en ligne sans créer un site web coûteux
- **Tech-savviness** : Faible (utilise WhatsApp et Facebook)

### Persona 2 : Le Client (Acheteur)
- **Profil** : Salma, 32 ans, cadre à Rabat
- **Problème** : Veut soutenir les petits commerces mais manque de temps
- **Besoin** : Découvrir et commander chez les commerçants locaux facilement
- **Tech-savviness** : Moyenne (utilise apps de livraison régulièrement)

## 🏗️ Architecture technique

### Frontend
```
Next.js 14 (App Router)
├── app/
│   ├── (public)/
│   │   ├── page.tsx                    # Homepage
│   │   ├── boutiques/
│   │   │   ├── page.tsx                # Liste boutiques
│   │   │   └── [slug]/
│   │   │       └── page.tsx            # Page boutique
│   │   ├── categories/
│   │   │   └── [slug]/page.tsx         # Catégorie
│   │   └── panier/page.tsx             # Panier
│   ├── (auth)/
│   │   ├── connexion/page.tsx
│   │   └── inscription/page.tsx
│   └── (dashboard)/
│       └── vendeur/
│           ├── page.tsx                # Dashboard
│           ├── produits/page.tsx       # Gestion produits
│           ├── commandes/page.tsx      # Commandes
│           └── parametres/page.tsx     # Paramètres
├── components/
│   ├── ui/                             # Composants réutilisables
│   ├── boutique/                       # Composants boutique
│   └── dashboard/                      # Composants dashboard
└── lib/
    ├── supabase/                       # Client Supabase
    ├── utils/                          # Utilitaires
    └── hooks/                          # Custom hooks
```

### Backend (Supabase)

#### Tables principales

**users**
```sql
id: uuid (PK)
email: string
phone: string
full_name: string
role: enum ('customer', 'seller', 'admin')
created_at: timestamp
```

**shops**
```sql
id: uuid (PK)
owner_id: uuid (FK -> users)
name: string
slug: string (unique)
description: text
category: string
city: string
neighborhood: string
address: text
phone: string
opening_hours: jsonb
logo_url: string
cover_url: string
is_active: boolean
rating: decimal
total_orders: integer
created_at: timestamp
```

**products**
```sql
id: uuid (PK)
shop_id: uuid (FK -> shops)
name: string
description: text
price: decimal
compare_at_price: decimal (nullable)
images: text[] (array of URLs)
stock: integer
is_available: boolean
category: string
created_at: timestamp
```

**orders**
```sql
id: uuid (PK)
customer_id: uuid (FK -> users)
shop_id: uuid (FK -> shops)
status: enum ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')
items: jsonb (array of {product_id, quantity, price})
subtotal: decimal
delivery_fee: decimal
total: decimal
delivery_address: text
customer_phone: string
notes: text
created_at: timestamp
updated_at: timestamp
```

**reviews**
```sql
id: uuid (PK)
order_id: uuid (FK -> orders)
shop_id: uuid (FK -> shops)
customer_id: uuid (FK -> users)
rating: integer (1-5)
comment: text
created_at: timestamp
```

**transactions**
```sql
id: uuid (PK)
order_id: uuid (FK -> orders)
shop_id: uuid (FK -> shops)
amount: decimal
commission: decimal (3%)
net_amount: decimal
status: enum ('pending', 'completed', 'failed')
payment_method: string
payment_provider: string
provider_transaction_id: string
created_at: timestamp
```

### API Endpoints

#### Public
- `GET /api/shops` - Liste des boutiques (avec filtres)
- `GET /api/shops/[slug]` - Détails boutique
- `GET /api/products` - Liste produits (avec filtres)
- `GET /api/categories` - Liste catégories

#### Auth required (Customer)
- `POST /api/orders` - Créer commande
- `GET /api/orders/[id]` - Détails commande
- `POST /api/reviews` - Ajouter avis
- `GET /api/profile` - Profil utilisateur

#### Auth required (Seller)
- `GET /api/seller/dashboard` - Stats dashboard
- `GET /api/seller/orders` - Liste commandes
- `PATCH /api/seller/orders/[id]` - Mettre à jour statut
- `POST /api/seller/products` - Créer produit
- `PATCH /api/seller/products/[id]` - Modifier produit
- `DELETE /api/seller/products/[id]` - Supprimer produit
- `GET /api/seller/analytics` - Analytics

## 💳 Intégration paiement

### CMI (Maroc)
- Cartes bancaires marocaines
- Frais : ~2.5% + 2 DH par transaction
- Documentation : https://www.cmi.co.ma/

### Stripe (International)
- Cartes internationales
- Frais : 2.9% + 30¢ par transaction
- Webhooks pour confirmation paiement

### Cash à la livraison
- Option pour clients sans carte
- Paiement confirmé par livreur

## 📱 Notifications

### SMS (Twilio ou service local)
- Confirmation commande (client)
- Nouvelle commande (vendeur)
- Changement statut commande
- Code OTP pour authentification

### WhatsApp Business API
- Notifications riches avec images
- Suivi commande en temps réel
- Support client

### Email (Resend ou SendGrid)
- Confirmation inscription
- Récapitulatif commande
- Newsletter

## 🚚 Système de livraison

### Phase 1 : Livraison par le vendeur
- Le vendeur gère sa propre livraison
- Frais de livraison définis par le vendeur

### Phase 2 : Intégration partenaires
- Glovo API
- Jumia Food API
- Coursiers locaux

## 🔐 Sécurité

- **Auth** : Supabase Auth (JWT + Row Level Security)
- **HTTPS** : Obligatoire (Let's Encrypt)
- **Rate limiting** : Protection contre spam
- **Input validation** : Zod pour validation côté client/serveur
- **XSS protection** : Sanitization des inputs
- **CSRF protection** : Tokens CSRF
- **PCI compliance** : Pas de stockage de données carte (délégué à CMI/Stripe)

## 📊 Analytics & Monitoring

### Pour les vendeurs
- Ventes du jour/semaine/mois
- Produits les plus vendus
- Taux de conversion
- Avis clients

### Pour la plateforme
- Sentry : Error tracking
- Vercel Analytics : Performance
- Google Analytics : Comportement utilisateurs
- Mixpanel : Product analytics

## 🌍 Internationalisation

### Langues supportées
- Français (par défaut)
- Arabe (futur)
- Darija (interface simplifiée)

### Devise
- MAD (Dirham marocain)
- Conversion automatique pour affichage international

## 🎨 Design System

### Couleurs
```css
--terracotta: #C8553D;      /* Primary */
--saffron: #E8A33D;         /* Accent */
--teal: #1E5F66;            /* Success */
--cream: #FBF5EC;           /* Background */
--ink: #1A1715;             /* Text */
```

### Typographie
- **Headings** : Fraunces (serif)
- **Body** : Inter (sans-serif)

### Composants UI
- shadcn/ui (Radix UI + Tailwind)
- Lucide icons

## 🧪 Testing

### Unit tests
- Vitest pour logique métier
- React Testing Library pour composants

### E2E tests
- Playwright pour parcours critiques :
  - Inscription vendeur
  - Création produit
  - Passage commande
  - Paiement

### Performance
- Lighthouse CI (score > 90)
- Core Web Vitals monitoring

## 🚀 Déploiement

### Environnements
- **Dev** : localhost
- **Staging** : staging.sooky.ma
- **Production** : sooky.ma

### CI/CD
- GitHub Actions
- Tests automatiques sur PR
- Deploy automatique sur merge main

### Hosting
- **Frontend** : Vercel
- **Backend** : Supabase Cloud
- **Images** : Cloudinary ou Supabase Storage
- **Domain** : Namecheap ou autre registrar

## 📈 KPIs de succès

### Mois 1-3 (MVP)
- 50 boutiques inscrites
- 500 commandes
- 10,000 MAD GMV

### Mois 4-6 (Growth)
- 200 boutiques
- 2,000 commandes/mois
- 100,000 MAD GMV/mois

### Année 1
- 1,000 boutiques
- 10,000 commandes/mois
- 1M MAD GMV/mois

## 💰 Coûts estimés (mensuel)

### Infrastructure
- Vercel Pro : $20/mois
- Supabase Pro : $25/mois
- Cloudinary : $0-50/mois (selon usage)
- Twilio SMS : ~$50/mois (1000 SMS)
- Domain + SSL : $2/mois

**Total** : ~$150/mois pour démarrer

### Scaling (1000+ boutiques)
- Infrastructure : $500-1000/mois
- Support client : 2-3 personnes
- Marketing : Budget variable

---

**Document vivant** — À mettre à jour au fur et à mesure du développement
