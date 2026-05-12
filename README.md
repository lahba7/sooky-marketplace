# 🛍️ Sooky - Marketplace Marocaine

> La marketplace qui connecte les acheteurs avec les petits commerçants du Maroc. Produits uniques, artisanaux et locaux.

![Version](https://img.shields.io/badge/version-2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-en%20développement-yellow)

## ✨ Fonctionnalités

- 🎨 **Design 3D moderne** avec effets glassmorphism
- 🛒 **Marketplace complète** pour produits marocains
- 🏪 **Pages boutiques** avec filtres et recherche
- 🛍️ **Panier d'achat** interactif
- 👤 **Authentification** (connexion/inscription)
- 📱 **100% Responsive** (mobile, tablette, desktop)
- ⚡ **Performance optimisée** avec CDN
- 🎯 **SEO-friendly**

## 🚀 Démarrage rapide

### Prérequis
- Un navigateur web moderne
- Git (optionnel)

### Installation locale

```bash
# Cloner le projet
git clone https://github.com/TON-USERNAME/sooky-marketplace.git

# Aller dans le dossier
cd sooky-marketplace

# Ouvrir dans le navigateur
open index.html
# ou
python -m http.server 8000
# puis ouvrir http://localhost:8000
```

## 📁 Structure du projet

```
sooky/
├── 📄 index.html              # Page d'accueil
├── 📁 pages/                  # Pages du site
│   ├── produit.html          # Page produit
│   ├── boutique.html         # Page boutique
│   ├── boutiques.html        # Liste boutiques
│   ├── panier.html           # Panier
│   ├── connexion.html        # Connexion/Inscription
│   └── vendre.html           # Landing vendeurs
├── 🎨 css/
│   └── style.css             # Styles globaux
├── ⚙️ js/
│   └── main.js               # JavaScript
├── 🖼️ images/                # Images
├── 📚 docs/                   # Documentation
└── 📄 README.md              # Ce fichier
```

## 🎨 Design

### Palette de couleurs
- **Primary** : `#6366F1` (Indigo)
- **Secondary** : `#EC4899` (Rose)
- **Accent** : `#3B82F6` (Bleu)
- **Success** : `#10B981` (Vert)

### Typographie
- **Titres** : Fraunces (serif)
- **Corps** : Inter (sans-serif)

### Effets
- Glassmorphism sur navigation
- Ombres 3D profondes
- Gradients dynamiques
- Animations fluides

## 🌐 Déploiement

### Option 1 : Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

### Option 2 : Netlify
```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy
```

### Option 3 : GitHub Pages
1. Push sur GitHub
2. Settings > Pages
3. Source : main branch
4. ✅ Site en ligne !

📖 **Guide complet** : Voir [DEPLOIEMENT.md](DEPLOIEMENT.md)

## 🛠️ Technologies

- **HTML5** - Structure
- **CSS3** - Styles (Flexbox, Grid, Animations)
- **JavaScript** - Interactivité
- **Google Fonts** - Typographie

## 📱 Pages disponibles

- ✅ Homepage (index.html)
- ✅ Page produit (pages/produit.html)
- ✅ Page boutique (pages/boutique.html)
- ✅ Liste boutiques (pages/boutiques.html)
- ✅ Panier (pages/panier.html)
- ✅ Connexion (pages/connexion.html)
- ✅ Vendre (pages/vendre.html)
- 🚧 Catégories (en développement)
- 🚧 Profil utilisateur (en développement)
- 🚧 Dashboard vendeur (en développement)

## 🔜 Prochaines étapes

### Phase 1 : Frontend (En cours)
- [x] Design système 3D
- [x] Pages principales
- [ ] Page catégories
- [ ] Page recherche
- [ ] Animations avancées

### Phase 2 : Backend (À venir)
- [ ] API REST avec Node.js/Express
- [ ] Base de données (PostgreSQL)
- [ ] Authentification JWT
- [ ] Upload d'images
- [ ] Paiement en ligne

### Phase 3 : Features avancées
- [ ] Chat en temps réel
- [ ] Notifications push
- [ ] Système de reviews
- [ ] Analytics vendeurs
- [ ] Application mobile

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Crée une branche (`git checkout -b feature/AmazingFeature`)
3. Commit tes changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvre une Pull Request

## 📝 Changelog

Voir [CHANGELOG.md](docs/CHANGELOG.md) pour l'historique des versions.

## 📄 License

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus d'informations.

## 👥 Auteurs

- **Hamza** - *Développement initial* - [GitHub](https://github.com/TON-USERNAME)

## 🙏 Remerciements

- Design inspiré par Etsy et les marketplaces modernes
- Icônes : Heroicons
- Fonts : Google Fonts
- Images : Unsplash

## 📞 Contact

- **Email** : contact@sooky.ma
- **Website** : [sooky.ma](https://sooky.ma)
- **Twitter** : [@sooky_ma](https://twitter.com/sooky_ma)

---

**Fait avec ❤️ au Maroc 🇲🇦**
