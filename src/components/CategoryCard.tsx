import { Card } from "@/components/ui/card";

interface CategoryCardProps {
  name: string;
  image: string;
  productCount: number;
}

const CategoryCard = ({ name, image, productCount }: CategoryCardProps) => {
  return (
    <Card className="group hover:shadow-card-hover transition-smooth cursor-pointer overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-bold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{productCount} Products</p>
        </div>
      </div>
    </Card>
  );
};

export default CategoryCard;