-- Create admin access policy for products table
-- First, we need to allow product management for admin users
-- For now, we'll use a simple approach where any authenticated user can manage products
-- In production, you would want to add a proper role-based system

-- Add policies for product management
CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
TO authenticated
USING (true);

-- Add policies for category management
CREATE POLICY "Authenticated users can insert categories" 
ON public.categories 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" 
ON public.categories 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete categories" 
ON public.categories 
FOR DELETE 
TO authenticated
USING (true);