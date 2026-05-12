# Plan d'action — Sooky Marketplace

## 🎯 Objectif
Lancer un MVP fonctionnel de Sooky en 4-6 semaines avec les fonctionnalités essentielles.

---

## 📅 Semaine 1-2 : Setup & Backend

### Jour 1-2 : Configuration projet
- [ ] Créer repo GitHub
- [ ] Setup Next.js 14 avec TypeScript
- [ ] Configurer Tailwind CSS + shadcn/ui
- [ ] Setup Supabase project
- [ ] Configurer variables d'environnement

### Jour 3-5 : Base de données
- [ ] Créer schéma SQL (users, shops, products, orders)
- [ ] Configurer Row Level Security (RLS)
- [ ] Créer migrations Supabase
- [ ] Tester CRUD operations

### Jour 6-10 : Authentification
- [ ] Setup Supabase Auth
- [ ] Page inscription/connexion
- [ ] Gestion des rôles (customer/seller)
- [ ] Protected routes
- [ ] Session management

---

## 📅 Semaine 3 : Frontend Public

### Jour 11-13 : Homepage
- [ ] Hero section
- [ ] Grille catégories
- [ ] Liste boutiques featured
- [ ] Section "Comment ça marche"
- [ ] Footer

### Jour 14-15 : Pages boutiques
- [ ] Liste boutiques avec filtres
- [ ] Page boutique individuelle
- [ ] Affichage produits
- [ ] Responsive design

---

## 📅 Semaine 4 : Parcours achat

### Jour 16-18 : Panier & Commande
- [ ] Système de panier (Context API ou Zustand)
- [ ] Page panier
- [ ] Formulaire commande
- [ ] Validation formulaire (Zod)

### Jour 19-21 : Paiement
- [ ] Intégration CMI (test mode)
- [ ] Page confirmation paiement
- [ ] Webhooks paiement
- [ ] Emails confirmation

---

## 📅 Semaine 5 : Dashboard Vendeur

### Jour 22-24 : Interface vendeur
- [ ] Layout dashboard
- [ ] Page d'accueil dashboard (stats)
- [ ] Liste commandes
- [ ] Gestion statuts commandes

### Jour 25-28 : Gestion produits
- [ ] Liste produits
- [ ] Formulaire ajout produit
- [ ] Upload images (Cloudinary)
- [ ] Modification/suppression produits

---

## 📅 Semaine 6 : Polish & Launch

### Jour 29-31 : Notifications
- [ ] Setup Twilio pour SMS
- [ ] Notification nouvelle commande (vendeur)
- [ ] Notification confirmation (client)
- [ ] Emails transactionnels

### Jour 32-35 : Tests & Optimisation
- [ ] Tests E2E critiques (Playwright)
- [ ] Optimisation performance (images, lazy loading)
- [ ] SEO (meta tags, sitemap)
- [ ] Accessibilité (a11y)

### Jour 36-42 : Soft Launch
- [ ] Deploy sur Vercel
- [ ] Configurer domaine sooky.ma
- [ ] Onboarding 10 boutiques pilotes
- [ ] Monitoring (Sentry, Analytics)
- [ ] Feedback & itérations

---

## 🚀 Post-Launch (Semaines 7-12)

### Priorité 1 : Acquisition
- [ ] Landing page optimisée SEO
- [ ] Campagne Facebook/Instagram Ads
- [ ] Partenariats avec associations de commerçants
- [ ] Programme de parrainage

### Priorité 2 : Rétention
- [ ] Système d'avis clients
- [ ] Programme de fidélité
- [ ] Newsletter automatisée
- [ ] Support client WhatsApp

### Priorité 3 : Features
- [ ] Recherche avancée
- [ ] Filtres géographiques (carte)
- [ ] Application mobile (React Native)
- [ ] Intégration livraison (Glovo, etc.)

---

## 💡 Quick Wins (À faire en parallèle)

### Marketing
- [ ] Créer page Instagram @sooky.ma
- [ ] Créer page Facebook
- [ ] Préparer kit de communication pour vendeurs
- [ ] Vidéo démo 60 secondes

### Légal
- [ ] CGU (Conditions Générales d'Utilisation)
- [ ] CGV (Conditions Générales de Vente)
- [ ] Politique de confidentialité
- [ ] Mentions légales

### Business
- [ ] Ouvrir compte bancaire professionnel
- [ ] Créer structure juridique (SARL, etc.)
- [ ] Contrat type avec vendeurs
- [ ] Assurance RC Pro

---

## 🎯 Métriques à suivre dès le début

### Acquisition
- Nombre de visiteurs uniques
- Taux de conversion visiteur → inscription vendeur
- Coût d'acquisition par vendeur (CAC)

### Engagement
- Nombre de boutiques actives (au moins 1 commande/semaine)
- Nombre de produits ajoutés par boutique
- Temps moyen sur le site

### Revenus
- GMV (Gross Merchandise Value)
- Nombre de transactions
- Panier moyen
- Commission totale

---

## ⚠️ Risques & Mitigation

### Risque 1 : Pas assez de vendeurs
**Mitigation** : 
- Onboarding manuel des 50 premiers
- Offrir 3 mois sans commission
- Support dédié

### Risque 2 : Problèmes techniques paiement
**Mitigation** :
- Tests exhaustifs en environnement test
- Fallback sur cash à la livraison
- Support technique réactif

### Risque 3 : Concurrence (Jumia, Glovo, etc.)
**Mitigation** :
- Focus sur les petits commerçants (niche)
- Commission ultra-compétitive (3%)
- Relation humaine et support en darija

---

## 📞 Contacts utiles

### Technique
- Supabase Support : support@supabase.io
- Vercel Support : support@vercel.com
- CMI : https://www.cmi.co.ma/contact

### Business
- AMITH (Association Marocaine des Industries du Textile)
- Chambres de Commerce locales
- Incubateurs startups (Startup Maroc, etc.)

---

## ✅ Checklist avant lancement

- [ ] Tests paiement en production
- [ ] Backup base de données configuré
- [ ] Monitoring erreurs (Sentry)
- [ ] Analytics configuré
- [ ] Support client prêt (WhatsApp Business)
- [ ] 10 boutiques pilotes onboardées
- [ ] CGU/CGV validées par avocat
- [ ] Domaine configuré + SSL
- [ ] Emails transactionnels testés
- [ ] Plan de communication prêt

---

**Let's build something amazing! 🚀🇲🇦**
