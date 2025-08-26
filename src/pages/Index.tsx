import { Truck, Shield, RotateCcw, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";

// Import images
import heroImage from "@/assets/hero-sports.jpg";
import cricketCategory from "@/assets/category-cricket.jpg";
import footballCategory from "@/assets/category-football.jpg";
import giftsCategory from "@/assets/category-gifts.jpg";
import fitnessCategory from "@/assets/category-fitness.jpg";
import cricketBat from "@/assets/product-cricket-bat.jpg";
import football from "@/assets/product-football.jpg";
import dumbbells from "@/assets/product-dumbbells.jpg";

const Index = () => {
  const categories = [
    { name: "Cricket Equipment", image: cricketCategory, productCount: 150 },
    { name: "Football & Soccer", image: footballCategory, productCount: 89 },
    { name: "Fitness & Gym", image: fitnessCategory, productCount: 120 },
    { name: "Gifts & Accessories", image: giftsCategory, productCount: 200 },
  ];

  const featuredProducts = [
    {
      id: "1",
      name: "Professional Cricket Bat",
      price: 2499,
      originalPrice: 2999,
      rating: 4.5,
      reviews: 128,
      image: cricketBat,
      category: "Cricket",
      isNew: true,
      discount: 17
    },
    {
      id: "2", 
      name: "Premium Football",
      price: 899,
      rating: 4.2,
      reviews: 89,
      image: football,
      category: "Football"
    },
    {
      id: "3",
      name: "Adjustable Dumbbells Set",
      price: 3499,
      originalPrice: 3999,
      rating: 4.7,
      reviews: 156,
      image: dumbbells,
      category: "Fitness",
      discount: 13
    }
  ];

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free Delivery",
      description: "On orders above ₹999"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Payment",
      description: "100% secure transactions"
    },
    {
      icon: <RotateCcw className="h-6 w-6" />,
      title: "Easy Returns",
      description: "30-day return policy"
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "24/7 Support",
      description: "Expert customer service"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Premier
                <span className="gradient-primary bg-clip-text text-transparent"> Sports</span>
                <br />Destination
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Discover premium sports equipment, fitness gear, and perfect gifts for every athlete at Laxmi Ganapathi Gift Corner Sports Center.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="text-lg px-8">
                  Shop Now
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  Browse Categories
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Sports Equipment Collection"
                className="w-full h-auto rounded-2xl shadow-card-hover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our wide range of premium sports equipment and accessories
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <CategoryCard 
                key={index}
                name={category.name}
                image={category.image}
                productCount={category.productCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most popular and top-rated sports equipment
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="hero" size="lg" className="px-12">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Elevate Your Game?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their sports equipment needs
          </p>
          <Button variant="secondary" size="lg" className="px-12 text-lg font-semibold">
            Start Shopping Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="gradient-primary rounded-lg p-2">
                  <span className="text-xl font-bold text-white">LG</span>
                </div>
                <div>
                  <h3 className="font-bold">Laxmi Ganapathi</h3>
                  <p className="text-sm opacity-70">Gift Corner Sports Center</p>
                </div>
              </div>
              <p className="text-sm opacity-70">
                Your trusted partner for premium sports equipment and gifts since 1995.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-opacity">About Us</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Contact</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Track Order</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Cricket</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Football</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Fitness</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Gifts</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 text-sm opacity-70">
                <p>📍 Sports Complex, Main Road</p>
                <p>📞 +91 9876543210</p>
                <p>✉️ info@laxmiganapathi.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-background/20 mt-8 pt-8 text-center">
            <p className="text-sm opacity-70">
              © 2024 Laxmi Ganapathi Gift Corner Sports Center. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;