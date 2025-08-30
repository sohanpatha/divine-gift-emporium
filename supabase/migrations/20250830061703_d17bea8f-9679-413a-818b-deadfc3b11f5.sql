-- Add sample product data for the demo
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Laxmi Ganapathi Gift Corner', 'laxmi-ganapathi-gift-corner', 'Traditional gifts and spiritual items', '/placeholder.svg'),
  ('Sports Center', 'sports-center', 'Premium sports equipment and accessories', '/placeholder.svg'),
  ('Frames', 'frames', 'Beautiful photo frames and wall decorations', '/placeholder.svg'),
  ('Gifts', 'gifts', 'Special gifts for every occasion', '/placeholder.svg'),
  ('Customization Gifts', 'customization-gifts', 'Personalized gifts and custom items', '/placeholder.svg'),
  ('T-Shirt Printing', 't-shirt-printing', 'Custom t-shirt printing services', '/placeholder.svg'),
  ('Teddies', 'teddies', 'Cute teddy bears and plush toys', '/placeholder.svg')
ON CONFLICT (slug) DO NOTHING;

-- Add some sample products
INSERT INTO products (name, description, price, original_price, discount_percentage, image_url, category_id, stock_quantity, brand, is_featured, rating, review_count, is_active) 
SELECT 
  'Premium Cricket Bat',
  'Professional grade cricket bat made from finest English willow',
  2999,
  3999,
  25,
  '/placeholder.svg',
  c.id,
  50,
  'SG',
  true,
  4.5,
  127,
  true
FROM categories c WHERE c.slug = 'sports-center'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, discount_percentage, image_url, category_id, stock_quantity, brand, is_featured, rating, review_count, is_active) 
SELECT 
  'Custom Photo Frame',
  'Beautiful wooden photo frame with custom engraving',
  899,
  1299,
  30,
  '/placeholder.svg',
  c.id,
  25,
  'FrameCraft',
  true,
  4.2,
  89,
  true
FROM categories c WHERE c.slug = 'frames'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, discount_percentage, image_url, category_id, stock_quantity, brand, is_featured, rating, review_count, is_active) 
SELECT 
  'Personalized Teddy Bear',
  'Soft cuddly teddy bear with custom message',
  799,
  999,
  20,
  '/placeholder.svg',
  c.id,
  100,
  'TeddyLove',
  true,
  4.8,
  245,
  true
FROM categories c WHERE c.slug = 'teddies'
ON CONFLICT DO NOTHING;