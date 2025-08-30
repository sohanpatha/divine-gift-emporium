import { Search, ShoppingCart, User, Menu, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="gradient-primary rounded-lg p-2">
              <span className="text-xl font-bold text-white">LG</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Laxmi Ganapathi</h1>
              <p className="text-xs text-muted-foreground">Gift Corner Sports Center</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search for sports equipment, gifts, and more..."
                className="pl-10 pr-4 h-12 border-2 focus:border-primary bg-background"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const query = (e.target as HTMLInputElement).value;
                    if (query.trim()) {
                      navigate(`/categories?search=${encodeURIComponent(query)}`);
                    }
                  }
                }}
              />
              <Button 
                variant="hero" 
                size="sm" 
                className="absolute right-1 top-1 bottom-1 px-6"
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="Search for sports"]') as HTMLInputElement;
                  const query = input?.value;
                  if (query?.trim()) {
                    navigate(`/categories?search=${encodeURIComponent(query)}`);
                  }
                }}
              >
                Search
              </Button>
            </div>
          </div>

           {/* Navigation Links */}
           <div className="hidden lg:flex items-center gap-6 mr-6">
             <Button variant="ghost" onClick={() => navigate('/')}>
               Home
             </Button>
             <Button variant="ghost" onClick={() => navigate('/categories')}>
               All Categories
             </Button>
             <Button variant="ghost" onClick={() => navigate('/categories/sports-center')}>
               Sports
             </Button>
             <Button variant="ghost" onClick={() => navigate('/categories/gifts')}>
               Gifts
             </Button>
           </div>

           {/* Navigation Icons */}
           <div className="flex items-center gap-2">
             <Button 
               variant="ghost" 
               size="icon" 
               className="relative hidden sm:flex"
               onClick={() => navigate('/wishlist')}
             >
               <Heart className="h-5 w-5" />
             </Button>
             
             <Button 
               variant="ghost" 
               size="icon" 
               className="relative"
               onClick={() => navigate('/cart')}
             >
               <ShoppingCart className="h-5 w-5" />
               {getTotalItems() > 0 && (
                 <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                   {getTotalItems()}
                 </span>
               )}
             </Button>

             {user ? (
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <Button variant="ghost" size="icon">
                     <User className="h-5 w-5" />
                   </Button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end">
                   <DropdownMenuItem disabled>
                     {user.email}
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={() => navigate('/orders')}>
                     My Orders
                   </DropdownMenuItem>
                   <DropdownMenuItem onClick={() => navigate('/profile')}>
                     Profile
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem onClick={signOut}>
                     <LogOut className="h-4 w-4 mr-2" />
                     Sign Out
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
             ) : (
               <Button variant="outline" onClick={() => navigate('/auth')}>
                 Sign In
               </Button>
             )}

             <Button variant="ghost" size="icon" className="md:hidden">
               <Menu className="h-5 w-5" />
             </Button>
           </div>
        </div>

        {/* Mobile Search */}
        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              className="pl-10 pr-20"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value;
                  if (query.trim()) {
                    navigate(`/categories?search=${encodeURIComponent(query)}`);
                  }
                }
              }}
            />
            <Button 
              variant="hero" 
              size="sm" 
              className="absolute right-1 top-1 bottom-1"
              onClick={() => {
                const input = document.querySelector('input[placeholder="Search products..."]') as HTMLInputElement;
                const query = input?.value;
                if (query?.trim()) {
                  navigate(`/categories?search=${encodeURIComponent(query)}`);
                }
              }}
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;