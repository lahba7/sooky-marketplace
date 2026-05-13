# 🔥 GUIDE SETUP SUPABASE POUR SOOKY

## Étape 1: Créer le projet
1. Va sur https://supabase.com
2. Clique "New Project"
3. Nom: `sooky-marketplace`
4. Database Password: (note-le bien!)
5. Region: Europe (Frankfurt)
6. Clique "Create project" (2-3 min)

## Étape 2: Exécuter le schema
1. Dans Supabase Dashboard → SQL Editor
2. Copie tout le contenu de `supabase-schema.sql`
3. Clique "Run"
4. ✅ 8 tables créées!

## Étape 3: Ajouter des données de test
```sql
-- Insérer boutique test
INSERT INTO shops (name, slug, description, city, category, rating, is_verified) 
VALUES ('Épicerie Bennani', 'epicerie-bennani', 'Épicerie de quartier depuis 1985', 'Casablanca', 'Alimentation', 4.9, true);

-- Insérer produits test
INSERT INTO products (shop_id, name, slug, description, price, stock, category, rating) VALUES
(1, 'Huile d''olive extra vierge', 'huile-olive', 'Première pression à froid', 85, 45, 'Alimentation', 4.9),
(1, 'Miel de thym pur 500g', 'miel-thym', 'Miel pur du Rif', 150, 30, 'Alimentation', 5.0);
```

## Étape 4: Configurer l'authentification
1. Authentication → Providers
2. Active: Email, Google (optionnel)
3. Site URL: `https://sooky-marketplace.vercel.app`
4. Redirect URLs: Ajoute ton domaine

## Étape 5: Obtenir les clés API
1. Settings → API
2. Copie:
   - `Project URL`
   - `anon public key`

## Étape 6: Créer .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=ton_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta_anon_key
```

## Étape 7: Installer le client Supabase
```bash
npm install @supabase/supabase-js
```

## Étape 8: Créer le client
Fichier: `js/supabase.js`
```javascript
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
export default supabase
```

✅ SUPABASE PRÊT!
