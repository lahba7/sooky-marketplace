# 🚀 Guide de déploiement Sooky

## Option 1 : Vercel (Recommandé - 5 minutes)

### Étape 1 : Créer un compte Vercel
1. Va sur [vercel.com](https://vercel.com)
2. Clique sur "Sign Up"
3. Connecte-toi avec GitHub (recommandé)

### Étape 2 : Préparer le projet
```bash
cd sooky
git init
git add .
git commit -m "Initial commit - Sooky marketplace"
```

### Étape 3 : Créer un repo GitHub
1. Va sur [github.com/new](https://github.com/new)
2. Nom du repo : `sooky-marketplace`
3. Clique sur "Create repository"

### Étape 4 : Pousser le code
```bash
git remote add origin https://github.com/TON-USERNAME/sooky-marketplace.git
git branch -M main
git push -u origin main
```

### Étape 5 : Déployer sur Vercel
1. Va sur [vercel.com/new](https://vercel.com/new)
2. Clique sur "Import Git Repository"
3. Sélectionne ton repo `sooky-marketplace`
4. Clique sur "Deploy"
5. ✅ **C'est fait !** Ton site est en ligne en 30 secondes

### 🌐 Ton site sera accessible sur :
```
https://sooky-marketplace.vercel.app
```

### 🎯 Domaine personnalisé (optionnel)
1. Va dans Settings > Domains
2. Ajoute ton domaine (ex: sooky.ma)
3. Configure les DNS selon les instructions

---

## Option 2 : Netlify (Alternative)

### Méthode rapide (Drag & Drop)
1. Va sur [app.netlify.com/drop](https://app.netlify.com/drop)
2. Glisse-dépose le dossier `sooky`
3. ✅ Site en ligne instantanément !

### Méthode Git (Recommandée)
1. Crée un compte sur [netlify.com](https://netlify.com)
2. Clique sur "Add new site" > "Import an existing project"
3. Connecte ton repo GitHub
4. Build settings :
   - Build command : (laisser vide)
   - Publish directory : `.`
5. Clique sur "Deploy"

### 🌐 Ton site sera accessible sur :
```
https://sooky-marketplace.netlify.app
```

---

## Option 3 : GitHub Pages (Gratuit)

### Étape 1 : Activer GitHub Pages
1. Va dans ton repo GitHub
2. Settings > Pages
3. Source : "Deploy from a branch"
4. Branch : `main` / folder : `/ (root)`
5. Clique sur "Save"

### Étape 2 : Attendre 2-3 minutes

### 🌐 Ton site sera accessible sur :
```
https://TON-USERNAME.github.io/sooky-marketplace
```

---

## Option 4 : Cloudflare Pages (Performance maximale)

### Étape 1 : Créer un compte
1. Va sur [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connecte-toi avec GitHub

### Étape 2 : Créer un projet
1. Clique sur "Create a project"
2. Sélectionne ton repo
3. Build settings :
   - Build command : (laisser vide)
   - Build output directory : `.`
4. Clique sur "Save and Deploy"

### 🌐 Ton site sera accessible sur :
```
https://sooky-marketplace.pages.dev
```

---

## 📊 Comparaison des options

| Critère | Vercel | Netlify | GitHub Pages | Cloudflare |
|---------|--------|---------|--------------|------------|
| **Vitesse déploiement** | ⚡⚡⚡ | ⚡⚡⚡ | ⚡⚡ | ⚡⚡⚡ |
| **CDN mondial** | ✅ | ✅ | ✅ | ✅ |
| **HTTPS auto** | ✅ | ✅ | ✅ | ✅ |
| **Domaine gratuit** | ✅ | ✅ | ✅ | ✅ |
| **Domaine custom** | ✅ Gratuit | ✅ Gratuit | ✅ Gratuit | ✅ Gratuit |
| **Analytics** | ✅ | ✅ | ❌ | ✅ |
| **Formulaires** | ❌ | ✅ | ❌ | ✅ |
| **Facilité** | 🟢 | 🟢 | 🟢 | 🟡 |

---

## 🎯 Recommandation finale

### Pour Sooky, je recommande **Vercel** car :
1. ✅ Déploiement le plus rapide
2. ✅ Interface la plus simple
3. ✅ CDN ultra-performant
4. ✅ Parfait pour évoluer vers Next.js plus tard
5. ✅ Analytics intégrés
6. ✅ Preview deployments automatiques

---

## 🔄 Mises à jour automatiques

Une fois déployé, chaque fois que tu push sur GitHub :
```bash
git add .
git commit -m "Mise à jour du design"
git push
```

➡️ **Ton site se met à jour automatiquement en 30 secondes !**

---

## 🆘 Besoin d'aide ?

### Problèmes courants

**1. Le site ne s'affiche pas correctement**
- Vérifie que tous les chemins sont relatifs (pas de `/` au début)
- Vérifie que `index.html` est à la racine

**2. Les images ne s'affichent pas**
- Vérifie les chemins des images
- Utilise des URLs complètes pour les images externes

**3. Le CSS ne se charge pas**
- Vérifie le chemin dans `<link href="css/style.css">`
- Vérifie que le fichier existe bien

### Support
- Vercel : [vercel.com/support](https://vercel.com/support)
- Netlify : [docs.netlify.com](https://docs.netlify.com)
- GitHub Pages : [docs.github.com/pages](https://docs.github.com/pages)

---

**Créé le** : 12 Mai 2026  
**Dernière mise à jour** : 12 Mai 2026
