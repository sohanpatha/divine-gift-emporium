import { useEffect, useState } from "react";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "@/hooks/use-toast";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    original_price: number;
    image_url: string;
    stock_quantity: number;
    category: {
      name: string;
    };
  };
}

const Wishlist = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          id,
          product:products(
            id,
            name,
            price,
            original_price,
            image_url,
            stock_quantity,
            category:categories(name)
          )
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (wishlistItemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', wishlistItemId);

      if (error) throw error;

      setWishlistItems(prev => prev.filter(item => item.id !== wishlistItemId));
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      });
    }
  };

  const addToCartFromWishlist = async (productId: string) => {
    await addToCart(productId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2">Sign in to view your wishlist</h2>
              <p className="text-muted-foreground mb-6">
                Save your favorite items for later by signing in to your account.
              </p>
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-6">
                Start adding items to your wishlist by clicking the heart icon on products you love.
              </p>
              <Button onClick={() => window.location.href = '/'}>
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full md:w-48 flex-shrink-0">
                      <div className="aspect-square bg-secondary rounded-lg overflow-hidden">
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wide">
                          {item.product.category.name}
                        </p>
                        <h3 className="text-xl font-semibold text-foreground">
                          {item.product.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-foreground">
                          ₹{Number(item.product.price).toLocaleString()}
                        </span>
                        {item.product.original_price && (
                          <span className="text-lg text-muted-foreground line-through">
                            ₹{Number(item.product.original_price).toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          item.product.stock_quantity > 0 ? 'bg-success' : 'bg-destructive'
                        }`} />
                        <span className={item.product.stock_quantity > 0 ? 'text-success' : 'text-destructive'}>
                          {item.product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                          onClick={() => addToCartFromWishlist(item.product.id)}
                          disabled={item.product.stock_quantity === 0}
                          className="flex-1 sm:flex-initial"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => window.location.href = `/product/${item.product.id}`}
                          className="flex-1 sm:flex-initial"
                        >
                          View Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;