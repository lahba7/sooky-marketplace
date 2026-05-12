# Changelog — Sooky

## Version 2.0 — Refonte complète (12 Mai 2026)

### 🎯 Changements majeurs

#### Repositionnement
- ✅ **Focus acheteur** : Homepage centrée sur les produits (comme Etsy)
- ✅ **"Vendre sur Sooky"** déplacé en haut à droite (discret mais accessible)
- ✅ **Navigation simplifiée** : Recherche + Panier + Connexion + CTA vendeur

#### Structure organisée
- ✅ Dossiers séparés : `css/`, `js/`, `images/`
- ✅ CSS global dans `css/style.css`
- ✅ JavaScript dans `js/main.js`
- ✅ Pages HTML à la racine

#### Pages créées
1. **index.html** — Homepage avec grille de 12 produits
2. **produit.html** — Page produit détaillée (galerie, avis, produits similaires)
3. **vendre.html** — Landing page pour vendeurs (features, pricing, CTA)
4. **boutiques.html** — Liste de toutes les boutiques avec filtres (catégorie, ville, tri)
5. **boutique.html** — Page boutique individuelle avec ses produits

#### Design
- ✅ Barre de catégories horizontale (scrollable)
- ✅ Grille de produits responsive (auto-fill)
- ✅ Cards produits avec image, nom, prix, boutique, rating
- ✅ Boutons favoris fonctionnels
- ✅ Navigation sticky
- ✅ Footer complet

#### Fonctionnalités
- ✅ Recherche (UI prête, backend à implémenter)
- ✅ Favoris (toggle avec animation)
- ✅ Galerie produit (changement d'image)
- ✅ Sélecteur de quantité
- ✅ Avis clients
- ✅ Produits similaires
- ✅ **Filtres boutiques** (catégorie, ville, tri)
- ✅ **Navigation boutiques** (lien dans nav principale)

---

## Version 1.0 — Prototype initial (12 Mai 2026)

### Ce qui a été créé
- Page d'accueil longue (tout sur une page)
- Focus sur les vendeurs (pas les produits)
- Sections : Hero, Catégories, Boutiques, How it works, Témoignage, CTA, Footer

### Problèmes identifiés
- ❌ Trop centré sur les vendeurs
- ❌ Pas assez de focus sur les produits
- ❌ Tout sur une seule page (pas scalable)
- ❌ Pas de structure de dossiers
- ❌ CSS/JS inline dans HTML

### Décision
→ **Refonte complète** pour adopter le modèle Etsy

---

## Prochaines étapes (Version 2.1)

### Pages prioritaires
- [ ] `boutique.html` - Page boutique avec tous ses produits
- [ ] `categories.html` - Filtrage par catégorie
- [ ] `panier.html` - Panier d'achat fonctionnel
- [ ] `connexion.html` - Auth client
- [ ] `inscription.html` - Onboarding vendeur (3 étapes)

### Fonctionnalités
- [ ] Système de panier (localStorage ou Context API)
- [ ] Filtres avancés (prix, ville, rating)
- [ ] Pagination produits
- [ ] Recherche fonctionnelle
- [ ] Système d'avis

### Backend (Phase suivante)
- [ ] Setup Next.js + Supabase
- [ ] Base de données (voir SPECIFICATIONS.md)
- [ ] API endpoints
- [ ] Authentification
- [ ] Upload d'images

---

## Notes de design

### Palette de couleurs
- **Terracotta** (#C8553D) : Primary, CTA, prix
- **Saffron** (#E8A33D) : Accents, badges, étoiles
- **Teal** (#1E5F66) : Success, confirmations
- **Cream** (#FBF5EC) : Background
- **Ink** (#1A1715) : Texte principal

### Typographie
- **Fraunces** : Titres, prix, nombres
- **Inter** : Corps de texte, UI

### Composants réutilisables
- `.btn` : Boutons (primary, outline, large)
- `.product-card` : Card produit
- `.section-title` : Titres de section
- `.category-pill` : Pills de catégorie

---

**Dernière mise à jour** : 12 Mai 2026
