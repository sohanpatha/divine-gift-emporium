-- Insert comprehensive product categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Laxmi Ganapathi Gifts', 'laxmi-ganapathi-gifts', 'Divine and spiritual gifts including idols, decorative items and religious artifacts', '/src/assets/category-gifts.jpg'),
('Sports Center', 'sports-center', 'Complete sports equipment for cricket, football, fitness and outdoor activities', '/src/assets/category-cricket.jpg'),
('Photo Frames', 'photo-frames', 'Beautiful frames for memories, available in various sizes and materials', '/src/assets/category-gifts.jpg'),
('Gift Items', 'gift-items', 'Perfect gifts for all occasions - birthdays, anniversaries, festivals', '/src/assets/category-gifts.jpg'),
('Customization Gifts', 'customization-gifts', 'Personalized gifts with custom names, photos and messages', '/src/assets/category-gifts.jpg'),
('T-Shirt Printing', 't-shirt-printing', 'Custom t-shirt printing with your designs, logos and text', '/src/assets/category-gifts.jpg'),
('Teddies & Toys', 'teddies-toys', 'Soft toys, teddy bears and playthings for kids and adults', '/src/assets/category-gifts.jpg'),
('Fitness Equipment', 'fitness-equipment', 'Home gym equipment, weights, yoga mats and fitness accessories', '/src/assets/category-fitness.jpg')
ON CONFLICT (slug) DO UPDATE SET
name = EXCLUDED.name,
description = EXCLUDED.description,
image_url = EXCLUDED.image_url;

-- Insert sample products for each category
WITH category_ids AS (
  SELECT id, slug FROM public.categories
)
INSERT INTO public.products (name, description, price, original_price, discount_percentage, image_url, images, brand, category_id, stock_quantity, is_featured, rating, review_count) 
SELECT * FROM (VALUES
  -- Laxmi Ganapathi Gifts
  ('Brass Ganesha Idol', 'Beautiful handcrafted brass Ganesha idol for home and office decoration', 2499, 3499, 29, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'Divine Arts', (SELECT id FROM category_ids WHERE slug = 'laxmi-ganapathi-gifts'), 50, true, 4.8, 245),
  ('Silver Lakshmi Photo Frame', 'Elegant silver-plated photo frame with Lakshmi design', 1899, 2499, 24, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'Sacred Crafts', (SELECT id FROM category_ids WHERE slug = 'laxmi-ganapathi-gifts'), 30, false, 4.6, 128),
  ('Copper Diya Set', 'Traditional copper diyas for festivals and daily prayers', 899, 1299, 31, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'Heritage Collection', (SELECT id FROM category_ids WHERE slug = 'laxmi-ganapathi-gifts'), 100, false, 4.5, 89),
  
  -- Sports Center
  ('Professional Cricket Bat', 'Premium English willow cricket bat for professional players', 4999, 6999, 29, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'SS', (SELECT id FROM category_ids WHERE slug = 'sports-center'), 25, true, 4.9, 156),
  ('Football Size 5', 'Official size FIFA approved football for matches and practice', 1299, 1799, 28, '/src/assets/product-football.jpg', ARRAY['/src/assets/product-football.jpg'], 'Nike', (SELECT id FROM category_ids WHERE slug = 'sports-center'), 40, true, 4.7, 203),
  ('Cricket Helmet', 'ISI marked cricket helmet with superior protection', 2499, 3299, 24, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'SG', (SELECT id FROM category_ids WHERE slug = 'sports-center'), 15, false, 4.6, 78),
  
  -- Fitness Equipment
  ('Adjustable Dumbbells Set', 'Professional adjustable dumbbells for home workout', 3999, 5499, 27, '/src/assets/product-dumbbells.jpg', ARRAY['/src/assets/product-dumbbells.jpg'], 'PowerMax', (SELECT id FROM category_ids WHERE slug = 'fitness-equipment'), 20, true, 4.8, 234),
  ('Yoga Mat Premium', 'Non-slip premium yoga mat with carrying strap', 899, 1299, 31, '/src/assets/product-dumbbells.jpg', ARRAY['/src/assets/product-dumbbells.jpg'], 'YogaLife', (SELECT id FROM category_ids WHERE slug = 'fitness-equipment'), 60, false, 4.5, 145),
  ('Resistance Bands Set', 'Complete resistance bands set for strength training', 1299, 1799, 28, '/src/assets/product-dumbbells.jpg', ARRAY['/src/assets/product-dumbbells.jpg'], 'FitStrong', (SELECT id FROM category_ids WHERE slug = 'fitness-equipment'), 35, false, 4.4, 92),
  
  -- Photo Frames
  ('Wooden Photo Frame 8x10', 'Premium wooden photo frame with glass protection', 599, 899, 33, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'FrameArt', (SELECT id FROM category_ids WHERE slug = 'photo-frames'), 80, false, 4.3, 67),
  ('Digital Photo Frame 10 inch', 'HD digital photo frame with remote control', 4999, 6999, 29, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'DigitalFrame Pro', (SELECT id FROM category_ids WHERE slug = 'photo-frames'), 12, true, 4.7, 189),
  
  -- Gift Items
  ('Chocolate Gift Box', 'Premium assorted chocolates in elegant gift box', 1299, 1799, 28, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'Sweet Delights', (SELECT id FROM category_ids WHERE slug = 'gift-items'), 50, false, 4.6, 234),
  ('Perfume Gift Set', 'Luxury perfume gift set for men and women', 2999, 3999, 25, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'Fragrance Plus', (SELECT id FROM category_ids WHERE slug = 'gift-items'), 25, true, 4.8, 156),
  
  -- T-Shirt Printing
  ('Custom Printed T-Shirt', 'High quality custom printed t-shirt with your design', 599, 899, 33, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'PrintWear', (SELECT id FROM category_ids WHERE slug = 't-shirt-printing'), 100, false, 4.5, 189),
  ('Polo Shirt Custom Print', 'Premium polo shirt with custom printing service', 899, 1299, 31, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'PrintWear', (SELECT id FROM category_ids WHERE slug = 't-shirt-printing'), 75, false, 4.4, 123),
  
  -- Teddies & Toys
  ('Giant Teddy Bear 4ft', 'Super soft giant teddy bear perfect for gifting', 2999, 3999, 25, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'TeddyLand', (SELECT id FROM category_ids WHERE slug = 'teddies-toys'), 15, true, 4.9, 267),
  ('Cute Teddy Bear 2ft', 'Adorable soft teddy bear for kids and adults', 899, 1299, 31, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'TeddyLand', (SELECT id FROM category_ids WHERE slug = 'teddies-toys'), 40, false, 4.7, 198),
  
  -- Customization Gifts
  ('Personalized Photo Mug', 'Custom photo mug with your favorite memories', 399, 599, 33, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'CustomCrafts', (SELECT id FROM category_ids WHERE slug = 'customization-gifts'), 200, false, 4.6, 345),
  ('Engraved Wooden Plaque', 'Custom engraved wooden plaque for special occasions', 1299, 1799, 28, '/src/assets/product-cricket-bat.jpg', ARRAY['/src/assets/product-cricket-bat.jpg'], 'CustomCrafts', (SELECT id FROM category_ids WHERE slug = 'customization-gifts'), 50, true, 4.8, 156)
) AS products_data(name, description, price, original_price, discount_percentage, image_url, images, brand, category_id, stock_quantity, is_featured, rating, review_count);