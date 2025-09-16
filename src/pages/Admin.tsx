import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  image_url: string;
  images: string[];
  brand: string;
  category_id: string;
  stock_quantity: number;
  is_featured: boolean;
  rating: number;
  review_count: number;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const { toast } = useToast();

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    original_price: "",
    discount_percentage: "",
    image_url: "",
    brand: "",
    category_id: "",
    stock_quantity: "",
    is_featured: false,
    rating: "0",
    review_count: "0"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (categoriesError) throw categoriesError;

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      setCategories(categoriesData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const productData = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        original_price: productForm.original_price ? parseFloat(productForm.original_price) : null,
        discount_percentage: productForm.discount_percentage ? parseInt(productForm.discount_percentage) : 0,
        image_url: productForm.image_url,
        images: productForm.image_url ? [productForm.image_url] : [],
        brand: productForm.brand,
        category_id: productForm.category_id,
        stock_quantity: parseInt(productForm.stock_quantity),
        is_featured: productForm.is_featured,
        rating: parseFloat(productForm.rating),
        review_count: parseInt(productForm.review_count)
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully"
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product created successfully"
        });
      }

      setShowProductDialog(false);
      setEditingProduct(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully"
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      original_price: product.original_price?.toString() || "",
      discount_percentage: product.discount_percentage?.toString() || "",
      image_url: product.image_url || "",
      brand: product.brand || "",
      category_id: product.category_id,
      stock_quantity: product.stock_quantity?.toString() || "0",
      is_featured: product.is_featured || false,
      rating: product.rating?.toString() || "0",
      review_count: product.review_count?.toString() || "0"
    });
    setShowProductDialog(true);
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      original_price: "",
      discount_percentage: "",
      image_url: "",
      brand: "",
      category_id: "",
      stock_quantity: "",
      is_featured: false,
      rating: "0",
      review_count: "0"
    });
  };

  const handleNewProduct = () => {
    setEditingProduct(null);
    resetForm();
    setShowProductDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
            <p className="text-muted-foreground">Manage your store's products and inventory</p>
          </div>
          <Button onClick={handleNewProduct} className="hover-glow">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card key={product.id} className={`hover-lift animate-fade-in stagger-${(index % 3) + 1}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{product.category.name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProduct(product)}
                      className="hover-glow"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">Stock: {product.stock_quantity}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Brand: {product.brand}</span>
                    <span>Rating: {product.rating}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Product Dialog */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                placeholder="Enter product name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={productForm.brand}
                onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                placeholder="Enter brand name"
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="original_price">Original Price (₹)</Label>
              <Input
                id="original_price"
                type="number"
                value={productForm.original_price}
                onChange={(e) => setProductForm({...productForm, original_price: e.target.value})}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Discount %</Label>
              <Input
                id="discount"
                type="number"
                value={productForm.discount_percentage}
                onChange={(e) => setProductForm({...productForm, discount_percentage: e.target.value})}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity</Label>
              <Input
                id="stock"
                type="number"
                value={productForm.stock_quantity}
                onChange={(e) => setProductForm({...productForm, stock_quantity: e.target.value})}
                placeholder="0"
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={productForm.category_id} onValueChange={(value) => setProductForm({...productForm, category_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={productForm.image_url}
                onChange={(e) => setProductForm({...productForm, image_url: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0-5)</Label>
              <Input
                id="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={productForm.rating}
                onChange={(e) => setProductForm({...productForm, rating: e.target.value})}
                placeholder="4.5"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="review_count">Review Count</Label>
              <Input
                id="review_count"
                type="number"
                value={productForm.review_count}
                onChange={(e) => setProductForm({...productForm, review_count: e.target.value})}
                placeholder="0"
              />
            </div>
            
            <div className="col-span-2 flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={productForm.is_featured}
                onChange={(e) => setProductForm({...productForm, is_featured: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="is_featured">Featured Product</Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setShowProductDialog(false)}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} className="hover-glow">
              <Save className="h-4 w-4" />
              {editingProduct ? 'Update' : 'Create'} Product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;