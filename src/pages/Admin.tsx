import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Package, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  discount_percentage: number;
  image_url: string;
  stock_quantity: number;
  brand: string;
  is_featured: boolean;
  category_id: string;
  category?: { name: string };
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
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        supabase
          .from('products')
          .select(`
            *,
            category:categories(name)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .order('name')
      ]);

      if (productsRes.error) throw productsRes.error;
      if (categoriesRes.error) throw categoriesRes.error;

      setProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (formData: FormData) => {
    try {
      const productData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        original_price: parseFloat(formData.get('original_price') as string) || null,
        discount_percentage: parseInt(formData.get('discount_percentage') as string) || 0,
        image_url: formData.get('image_url') as string,
        stock_quantity: parseInt(formData.get('stock_quantity') as string),
        brand: formData.get('brand') as string,
        category_id: formData.get('category_id') as string,
        is_featured: formData.get('is_featured') === 'true',
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      setIsProductDialogOpen(false);
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
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
        description: "Product deleted successfully",
      });
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center animate-fade-in">Loading admin panel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <div className="gradient-primary rounded-lg p-3 hover-glow">
            <Package className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your products and categories easily</p>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products ({products.length})
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Categories ({categories.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center animate-slide-up">
              <h2 className="text-2xl font-semibold">Manage Products</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" className="flex items-center gap-2 hover-glow">
                    <Plus className="h-4 w-4" />
                    Add New Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      handleProductSubmit(formData);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Product Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={editingProduct?.name}
                          placeholder="e.g., Cricket Bat Professional"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="brand">Brand *</Label>
                        <Input
                          id="brand"
                          name="brand"
                          defaultValue={editingProduct?.brand}
                          placeholder="e.g., SS, Nike, Adidas"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        defaultValue={editingProduct?.description}
                        placeholder="Describe your product features and benefits..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="price">Selling Price (₹) *</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={editingProduct?.price}
                          placeholder="1999"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="original_price">Original Price (₹)</Label>
                        <Input
                          id="original_price"
                          name="original_price"
                          type="number"
                          step="0.01"
                          min="0"
                          defaultValue={editingProduct?.original_price}
                          placeholder="2999"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount_percentage">Discount %</Label>
                        <Input
                          id="discount_percentage"
                          name="discount_percentage"
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={editingProduct?.discount_percentage}
                          placeholder="20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                        <Input
                          id="stock_quantity"
                          name="stock_quantity"
                          type="number"
                          min="0"
                          defaultValue={editingProduct?.stock_quantity}
                          placeholder="50"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="category_id">Category *</Label>
                        <Select name="category_id" defaultValue={editingProduct?.category_id} required>
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
                    </div>

                    <div>
                      <Label htmlFor="image_url">Product Image URL *</Label>
                      <Input
                        id="image_url"
                        name="image_url"
                        type="url"
                        defaultValue={editingProduct?.image_url}
                        placeholder="https://example.com/product-image.jpg"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Tip: Upload your image to any image hosting service and paste the URL here
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_featured"
                        name="is_featured"
                        value="true"
                        defaultChecked={editingProduct?.is_featured}
                        className="rounded"
                      />
                      <Label htmlFor="is_featured">Feature this product on homepage</Label>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button type="submit" variant="hero">
                        {editingProduct ? 'Update Product' : 'Create Product'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsProductDialogOpen(false);
                          setEditingProduct(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <Card key={product.id} className={`hover-lift hover-glow animate-fade-in stagger-${(index % 3) + 1}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{product.brand}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingProduct(product);
                            setIsProductDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-smooth hover:scale-105"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-lg">₹{Number(product.price).toLocaleString()}</p>
                        {product.original_price && (
                          <p className="text-sm text-muted-foreground line-through">
                            ₹{Number(product.original_price).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                        Stock: {product.stock_quantity}
                      </Badge>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">{product.category?.name}</Badge>
                      {product.is_featured && <Badge variant="secondary">Featured</Badge>}
                      {product.discount_percentage > 0 && (
                        <Badge variant="destructive">{product.discount_percentage}% OFF</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12 animate-scale-in">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-6">Start building your catalog by adding your first product</p>
                <Button
                  variant="hero"
                  onClick={() => setIsProductDialogOpen(true)}
                  className="hover-glow"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center animate-slide-up">
              <h2 className="text-2xl font-semibold">Available Categories</h2>
              <Badge variant="outline" className="text-sm">
                {categories.length} categories ready for products
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <Card key={category.id} className={`hover-lift hover-glow animate-fade-in stagger-${(index % 3) + 1}`}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{category.name}</span>
                      <Badge variant="outline" className="text-xs">{category.slug}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-secondary rounded-lg overflow-hidden mb-3">
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-full object-cover transition-smooth hover:scale-105"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-muted/30 rounded-lg p-6 animate-fade-in">
              <h3 className="font-semibold mb-2">💡 How to add products to categories:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Go to the "Products" tab above</li>
                <li>Click "Add New Product" button</li>
                <li>Fill in product details and select the category</li>
                <li>Your product will automatically appear in that category</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;