import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId || !orderId) {
        toast({
          title: "Invalid order",
          description: "Order information is missing.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      try {
        console.log('Verifying payment for session:', sessionId, 'order:', orderId);
        
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { session_id: sessionId, order_id: orderId },
        });

        if (error) {
          console.error('Payment verification error:', error);
          throw new Error(error.message);
        }

        console.log('Payment verification result:', data);

        if (data.success) {
          // Fetch order details
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (name, image_url)
              )
            `)
            .eq('id', orderId)
            .single();

          if (orderError) {
            console.error('Error fetching order:', orderError);
          } else {
            setOrderDetails(order);
          }

          toast({
            title: "Payment successful!",
            description: "Your order has been confirmed.",
          });
        } else {
          toast({
            title: "Payment verification failed",
            description: "There was an issue verifying your payment.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast({
          title: "Verification failed",
          description: error instanceof Error ? error.message : "Failed to verify payment",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, orderId, navigate]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-sports flex items-center justify-center">
        <Card className="w-full max-w-md backdrop-blur-sm bg-card/90">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Verifying your payment...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-sports">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="backdrop-blur-sm bg-card/90">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
              <p className="text-muted-foreground">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {orderDetails && (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Order Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Order Number:</span>
                        <p className="font-medium">{orderDetails.order_number}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Amount:</span>
                        <p className="font-medium">₹{orderDetails.total_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <p className="font-medium capitalize">{orderDetails.status}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Payment:</span>
                        <p className="font-medium capitalize text-green-600">{orderDetails.payment_status}</p>
                      </div>
                    </div>
                  </div>

                  {orderDetails.order_items && orderDetails.order_items.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-3">Items Ordered</h3>
                      <div className="space-y-2">
                        {orderDetails.order_items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded">
                            <div className="flex items-center space-x-3">
                              {item.products?.image_url && (
                                <img 
                                  src={item.products.image_url} 
                                  alt={item.products.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div>
                                <p className="font-medium">{item.products?.name || 'Product'}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {orderDetails.shipping_address && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <div className="text-sm space-y-1">
                        <p className="font-medium">{orderDetails.shipping_address.full_name}</p>
                        <p>{orderDetails.shipping_address.address_line_1}</p>
                        {orderDetails.shipping_address.address_line_2 && (
                          <p>{orderDetails.shipping_address.address_line_2}</p>
                        )}
                        <p>
                          {orderDetails.shipping_address.city}, {orderDetails.shipping_address.state} {orderDetails.shipping_address.postal_code}
                        </p>
                        <p>{orderDetails.shipping_address.country}</p>
                        <p>Phone: {orderDetails.shipping_address.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">What's next?</p>
                    <p className="text-blue-700">
                      You'll receive an email confirmation shortly. We'll notify you when your order ships.
                      Expected delivery: 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => navigate('/orders')} 
                  className="flex-1"
                  variant="outline"
                >
                  <Package className="h-4 w-4 mr-2" />
                  View All Orders
                </Button>
                <Button 
                  onClick={() => navigate('/')} 
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;