# Structure du projet Sooky

```
sooky/
│
├── 🏠 index.html                    # Homepage (point d'entrée)
│
├── 📁 pages/                        # Toutes les pages du site
│   ├── produit.html                 # Page produit détaillée
│   ├── boutique.html                # Page boutique individuelle
│   ├── boutiques.html               # Liste de toutes les boutiques
│   ├── vendre.html                  # Landing page vendeurs
│   ├── panier.html                  # (à créer) Panier d'achat
│   ├── connexion.html               # (à créer) Login/Signup
│   ├── inscription.html             # (à créer) Onboarding vendeur
│   ├── categories.html              # (à créer) Produits par catégorie
│   └── recherche.html               # (à créer) Résultats recherche
│
├── 🎨 css/                          # Styles
│   └── style.css                    # Styles globaux
│
├── ⚙️ js/                           # JavaScript
│   └── main.js                      # Fonctions principales
│
├── 🖼️ images/                       # Images du site
│   └── (vide pour l'instant)
│
├── 📚 docs/                         # Documentation
│   ├── README.md                    # Doc complète du projet
│   ├── SPECIFICATIONS.md            # Specs techniques détaillées
│   ├── PLAN_ACTION.md               # Roadmap MVP 6 semaines
│   ├── IDEES_FUTURES.md             # Fonctionnalités futures
│   ├── CHANGELOG.md                 # Historique des changements
│   └── DEMARRAGE.md                 # Guide de démarrage
│
├── 📄 README.md                     # Vue d'ensemble (ce fichier)
├── 📄 STRUCTURE.md                  # Structure du projet (ce fichier)
└── 🚫 .gitignore                    # Fichiers à ignorer par Git
```

## 🗺️ Navigation du site

### Parcours acheteur
```
index.html (Homepage)
    │
    ├─→ pages/produit.html (Clic sur un produit)
    │       └─→ pages/boutique.html (Clic sur nom boutique)
    │
    ├─→ pages/boutiques.html (Menu "Boutiques")
    │       └─→ pages/boutique.html (Clic sur une boutique)
    │
    ├─→ pages/categories.html (Clic sur catégorie)
    │       └─→ pages/produit.html (Clic sur produit)
    │
    └─→ pages/panier.html (Icône panier)
            └─→ pages/connexion.html (Checkout)
```

### Parcours vendeur
```
index.html (Homepage)
    │
    └─→ pages/vendre.html (Bouton "Vendre sur Sooky")
            └─→ pages/inscription.html (Bouton "Créer ma boutique")
```

## 📦 Pages par statut

### ✅ Créées et fonctionnelles
- `index.html` — Homepage avec grille de produits
- `pages/produit.html` — Page produit avec galerie, avis, etc.
- `pages/boutique.html` — Page boutique avec ses produits
- `pages/boutiques.html` — Liste boutiques avec filtres
- `pages/vendre.html` — Landing page vendeurs

### 🚧 À créer (prioritaires)
- `pages/panier.html` — Panier d'achat
- `pages/connexion.html` — Authentification
- `pages/inscription.html` — Onboarding vendeur
- `pages/categories.html` — Filtrage par catégorie
- `pages/recherche.html` — Résultats de recherche

### 💡 À créer (secondaires)
- `pages/profil.html` — Profil utilisateur
- `pages/commandes.html` — Historique commandes
- `pages/favoris.html` — Produits favoris
- `pages/aide.html` — Centre d'aide
- `pages/contact.html` — Contact

## 🎯 Conventions

### Nommage des fichiers
- **Pages** : `nom-page.html` (kebab-case)
- **CSS** : `style.css` (un seul fichier global)
- **JS** : `main.js` (un seul fichier global)

### Structure HTML
- Toujours inclure la navigation complète
- Toujours inclure le footer
- Utiliser les classes CSS réutilisables

### Liens relatifs
- Depuis `index.html` → `pages/nom-page.html`
- Depuis `pages/` → `../index.html` (retour home)
- Depuis `pages/` → `../css/style.css` (CSS)
- Depuis `pages/` → `../js/main.js` (JS)

## 🔄 Workflow de développement

1. **Créer une nouvelle page** dans `pages/`
2. **Copier la structure** d'une page existante (nav + footer)
3. **Mettre à jour les liens** CSS/JS (`../css/`, `../js/`)
4. **Ajouter le contenu** spécifique
5. **Tester** en local
6. **Commit** avec message descriptif

---

**Dernière mise à jour** : 12 Mai 2026
