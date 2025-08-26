import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  isNew?: boolean;
  discount?: number;
}

const ProductCard = ({ 
  name, 
  price, 
  originalPrice, 
  rating, 
  reviews, 
  image, 
  category,
  isNew,
  discount 
}: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-card-hover transition-smooth overflow-hidden">
      <div className="relative">
        <div className="aspect-square overflow-hidden bg-secondary">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <span className="bg-success text-success-foreground text-xs px-2 py-1 rounded-md font-medium">
              New
            </span>
          )}
          {discount && (
            <span className="bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-md font-medium">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-2 right-2 bg-background/80 hover:bg-background"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground uppercase tracking-wide">{category}</p>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-fast">
            {name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-warning text-warning' : 'text-muted-foreground'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">₹{price.toLocaleString()}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button variant="cart" className="w-full mt-3 font-medium">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;