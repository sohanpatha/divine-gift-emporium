import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Package, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  shipping_address: any;
  order_items: Array<{
    quantity: number;
    price: number;
    products: {
      name: string;
      image_url?: string;
    } | null;
  }>;
}

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price,
            products (
              name,
              image_url
            )
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-sports">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-white">Loading orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
            <p className="text-muted-foreground">Track and manage your order history</p>
          </div>

          <Card className="card-minimal">
            <CardContent className="p-8">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="p-4 bg-muted/20 rounded-full w-fit mx-auto mb-4">
                    <Package className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    When you make your first purchase, it will appear here.
                  </p>
                  <Button onClick={() => navigate('/')} className="h-11 px-8">
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="card-minimal border">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-lg">Order #{order.order_number}</h3>
                            <p className="text-sm text-muted-foreground">
                              Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right space-y-2">
                            <p className="font-bold text-xl">₹{order.total_amount.toLocaleString()}</p>
                            <div className="flex gap-2">
                              <Badge className={`${getStatusColor(order.status)} font-medium`}>
                                {order.status}
                              </Badge>
                              <Badge className={`${getPaymentStatusColor(order.payment_status)} font-medium`}>
                                {order.payment_status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          {order.order_items.map((item, index) => (
                            <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                              <div className="flex items-center space-x-4">
                                {item.products?.image_url && (
                                  <img 
                                    src={item.products.image_url} 
                                    alt={item.products.name || 'Product'}
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                )}
                                <div className="space-y-1">
                                  <p className="font-semibold">{item.products?.name || 'Product'}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <Separator className="my-6" />

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Shipping to: {order.shipping_address?.city}, {order.shipping_address?.state}
                          </div>
                          <Button variant="outline" size="sm" className="h-9">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

  export default Orders;