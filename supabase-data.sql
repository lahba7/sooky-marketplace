-- ============================================
-- SOOKY - DONNÉES RÉELLES POUR SUPABASE
-- ============================================

-- Insérer les boutiques
INSERT INTO shops (name, slug, description, city, category, rating, total_reviews, is_verified, is_active) VALUES
('Épicerie Bennani', 'epicerie-bennani', 'Épicerie de quartier depuis 1985. Produits frais, fruits et légumes, produits d''épicerie fine et produits du terroir marocain.', 'Casablanca', 'Alimentation', 4.9, 284, true, true),
('Atelier Zellige Fès', 'atelier-zellige-fes', 'Carreaux artisanaux et mosaïques sur-mesure, fabriqués main par la famille Bennani depuis 4 générations.', 'Fès', 'Artisanat', 5.0, 189, true, true),
('Argan Bleu', 'argan-bleu', 'Coopérative féminine — huile d''argan pressée à froid, savons naturels et cosmétiques bio certifiés.', 'Essaouira', 'Beauté', 5.0, 48, true, true),
('Maison Khalil', 'maison-khalil', 'Maroquinerie de Fès — sacs, poufs et accessoires en cuir véritable tannés à l''ancienne au cœur de la médina.', 'Fès', 'Mode', 4.8, 412, true, true),
('Tapis Beni', 'tapis-beni', 'Tapis berbères authentiques tissés à la main par les femmes des villages de l''Atlas. Pièces uniques.', 'Atlas', 'Maison', 4.9, 167, true, true),
('Safi Faïence', 'safi-faience', 'Poterie et céramique émaillée de Safi — vaisselle, tajines et objets déco peints à la main.', 'Safi', 'Maison', 4.7, 96, true, true),
('Lalla Kenza', 'lalla-kenza', 'Maison de caftans et tenues traditionnelles modernes pour mariées, créations exclusives signées Kenza Ait Si.', 'Casablanca', 'Mode', 4.9, 521, true, true),
('Miel du Rif', 'miel-du-rif', 'Miel pur et naturel récolté dans les montagnes du Rif. Thym, eucalyptus, fleurs sauvages.', 'Chefchaouen', 'Alimentation', 5.0, 78, false, true),
('Babouches Fassi', 'babouches-fassi', 'Babouches traditionnelles en cuir brodées main. Modèles pour hommes, femmes et enfants.', 'Fès', 'Mode', 4.8, 234, true, true),
('Fromage Atlas', 'fromage-atlas', 'Fromages artisanaux de chèvre et brebis produits dans les montagnes de l''Atlas.', 'Atlas', 'Alimentation', 4.8, 145, false, true);

-- Insérer les produits
INSERT INTO products (shop_id, name, slug, description, price, stock, category, images, rating, total_reviews, is_active) VALUES
-- Épicerie Bennani (shop_id: 1)
(1, 'Huile d''olive extra vierge artisanale', 'huile-olive-artisanale', 'Huile d''olive extra vierge de première pression à froid, produite artisanalement dans notre oliveraie familiale près de Meknès. Récoltée à la main et pressée dans les 24 heures pour préserver tous les arômes et bienfaits.', 85.00, 45, 'Alimentation', '{"https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80"}', 4.9, 127, true),
(1, 'Couscous complet bio 1kg', 'couscous-bio', 'Couscous complet biologique, semoule de blé dur cultivée sans pesticides dans la région de Meknès.', 35.00, 60, 'Alimentation', '{"https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=80"}', 4.7, 89, true),
(1, 'Confiture d''abricot maison', 'confiture-abricot', 'Confiture artisanale d''abricots du Maroc, sans conservateurs, cuite au chaudron de cuivre.', 45.00, 25, 'Alimentation', '{"https://images.unsplash.com/photo-1610832745705-1f3b0e4e0f6f?w=600&q=80"}', 4.8, 67, true),

-- Atelier Zellige Fès (shop_id: 2)
(2, 'Carreaux zellige bleu traditionnel (lot de 10)', 'zellige-bleu', 'Carreaux zellige bleu cobalt fabriqués selon la tradition séculaire de Fès. Chaque carreau est unique, façonné et émaillé à la main.', 450.00, 20, 'Artisanat', '{"https://images.unsplash.com/photo-1610055568854-43b9b3a4eed2?w=600&q=80"}', 5.0, 89, true),
(2, 'Fontaine zellige sur mesure', 'fontaine-zellige', 'Fontaine murale en zellige traditionnel, dimensions personnalisables. Délai de fabrication 3-4 semaines.', 2800.00, 5, 'Artisanat', '{"https://images.unsplash.com/photo-1610055568854-43b9b3a4eed2?w=600&q=80"}', 5.0, 23, true),

-- Argan Bleu (shop_id: 3)
(3, 'Huile d''argan cosmétique pure 100ml', 'huile-argan-cosmetique', 'Huile d''argan pure pressée à froid par notre coopérative féminine. Certifiée bio, idéale pour les soins du visage et des cheveux.', 120.00, 80, 'Beauté', '{"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"}', 4.8, 234, true),
(3, 'Savon noir naturel à l''eucalyptus', 'savon-noir-eucalyptus', 'Savon noir traditionnel enrichi à l''huile d''eucalyptus, exfoliant naturel pour le hammam.', 45.00, 120, 'Beauté', '{"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80"}', 4.9, 312, true),

-- Maison Khalil (shop_id: 4)
(4, 'Sac en cuir véritable fait main', 'sac-cuir-fait-main', 'Sac à main en cuir véritable tanné selon les méthodes traditionnelles de Fès. Coutures main, finitions soignées.', 680.00, 15, 'Mode', '{"https://images.unsplash.com/photo-1609001489147-6c1c8f5f0e72?w=600&q=80"}', 4.9, 156, true),
(4, 'Pouf en cuir marocain', 'pouf-cuir-marocain', 'Pouf traditionnel en cuir naturel, broderies berbères. Parfait pour la décoration orientale.', 450.00, 25, 'Maison', '{"https://images.unsplash.com/photo-1609001489147-6c1c8f5f0e72?w=600&q=80"}', 4.8, 134, true),

-- Tapis Beni (shop_id: 5)
(5, 'Tapis berbère Beni Ouarain 200x150cm', 'tapis-beni-ouarain', 'Tapis berbère authentique tissé à la main par les femmes de l''Atlas. Laine naturelle, motifs géométriques traditionnels.', 2800.00, 8, 'Maison', '{"https://images.unsplash.com/photo-1604423481675-d96cc5b87bd9?w=600&q=80"}', 5.0, 67, true),

-- Safi Faïence (shop_id: 6)
(6, 'Tajine en céramique peint main', 'tajine-ceramique', 'Tajine traditionnel en céramique de Safi, peint à la main avec des motifs berbères. Utilisable pour la cuisson.', 280.00, 30, 'Maison', '{"https://images.unsplash.com/photo-1606914469633-ddd62ec10ce1?w=600&q=80"}', 4.7, 92, true),
(6, 'Vase en céramique émaillée', 'vase-ceramique', 'Vase décoratif en céramique émaillée de Safi, motifs floraux traditionnels peints à la main.', 180.00, 40, 'Maison', '{"https://images.unsplash.com/photo-1582582494705-f8ce0b0c24f0?w=600&q=80"}', 4.8, 89, true),

-- Lalla Kenza (shop_id: 7)
(7, 'Caftan moderne brodé main', 'caftan-moderne', 'Caftan moderne en soie brodé main, coupe contemporaine avec finitions traditionnelles. Disponible sur mesure.', 1850.00, 12, 'Mode', '{"https://images.unsplash.com/photo-1610018556010-6a11691bc905?w=600&q=80"}', 4.9, 203, true),

-- Miel du Rif (shop_id: 8)
(8, 'Miel de thym pur 500g', 'miel-thym', 'Miel de thym pur récolté dans les montagnes du Rif. Cristallisation naturelle, propriétés antiseptiques.', 150.00, 35, 'Alimentation', '{"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"}', 5.0, 178, true),
(8, 'Miel d''eucalyptus 250g', 'miel-eucalyptus', 'Miel d''eucalyptus aux vertus expectorantes, idéal pour les maux de gorge et la toux.', 95.00, 28, 'Alimentation', '{"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80"}', 4.9, 89, true),

-- Fromage Atlas (shop_id: 10)
(10, 'Fromage de chèvre artisanal', 'fromage-chevre', 'Fromage de chèvre artisanal affiné en cave, produit dans les montagnes de l''Atlas avec le lait de nos chèvres.', 65.00, 20, 'Alimentation', '{"https://images.unsplash.com/photo-1587049352846-4a222e784acc?w=600&q=80"}', 4.8, 145, true),

-- Babouches Fassi (shop_id: 9)
(9, 'Babouches en cuir brodées', 'babouches-brodees', 'Babouches traditionnelles en cuir souple brodées main avec fils d''or et d''argent. Pointures 36 à 45.', 320.00, 50, 'Mode', '{"https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&q=80"}', 4.7, 112, true),

-- Dattes du Sud
(1, 'Dattes Medjool premium 1kg', 'dattes-medjool', 'Dattes Medjool premium du sud du Maroc, calibre extra-large, moelleuses et sucrées naturellement.', 95.00, 40, 'Alimentation', '{"https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80"}', 4.9, 267, true);

-- Insérer quelques avis
INSERT INTO reviews (user_id, product_id, shop_id, rating, comment, created_at) VALUES
-- Avis pour l'huile d'olive (product_id: 1)
(NULL, 1, 1, 5, 'Excellente huile d''olive ! Le goût est authentique et on sent vraiment la qualité. Je recommande vivement pour ceux qui cherchent du vrai produit marocain.', NOW() - INTERVAL '2 days'),
(NULL, 1, 1, 5, 'Livraison rapide et produit bien emballé. L''huile est délicieuse, parfaite pour mes salades. Je vais en recommander !', NOW() - INTERVAL '1 week'),
(NULL, 1, 1, 4, 'Très bonne huile, goût fruité comme décrit. Juste un peu cher mais la qualité est au rendez-vous.', NOW() - INTERVAL '2 weeks'),

-- Avis pour l'huile d'argan (product_id: 5)
(NULL, 5, 3, 5, 'Produit exceptionnel ! Ma peau n''a jamais été aussi douce. L''huile pénètre bien sans laisser de film gras.', NOW() - INTERVAL '3 days'),
(NULL, 5, 3, 5, 'Coopérative sérieuse, produit authentique. Je commande régulièrement depuis 2 ans.', NOW() - INTERVAL '1 month'),

-- Avis pour le tapis berbère (product_id: 9)
(NULL, 9, 5, 5, 'Magnifique tapis, finitions parfaites. Il apporte une vraie chaleur à notre salon. Livraison soignée.', NOW() - INTERVAL '5 days'),
(NULL, 9, 5, 5, 'Qualité exceptionnelle, motifs authentiques. C''est exactement ce que je cherchais pour ma décoration.', NOW() - INTERVAL '2 weeks');

-- Mettre à jour les compteurs (optionnel, normalement fait par des triggers)
UPDATE shops SET total_sales = (SELECT COUNT(*) FROM order_items WHERE shop_id = shops.id);
UPDATE products SET total_sales = (SELECT COALESCE(SUM(quantity), 0) FROM order_items WHERE product_id = products.id);