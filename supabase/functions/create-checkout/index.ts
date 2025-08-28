import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutItem {
  product_id: string;
  quantity: number;
  price: number;
  name: string;
}

interface CheckoutRequest {
  items: CheckoutItem[];
  shipping_address: {
    full_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone: string;
  };
  billing_address?: any;
}

serve(async (req) => {
  console.log("Create checkout function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY is not set");
      throw new Error("Stripe configuration missing");
    }

    console.log("Initializing Supabase client");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    console.log("Getting user from auth header");
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) {
      console.error("Auth error:", userError);
      throw new Error(`Authentication failed: ${userError.message}`);
    }
    
    const user = userData.user;
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    console.log("User authenticated:", user.email);

    const body: CheckoutRequest = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    if (!body.items || body.items.length === 0) {
      throw new Error("No items provided for checkout");
    }

    if (!body.shipping_address) {
      throw new Error("Shipping address is required");
    }

    console.log("Initializing Stripe");
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check for existing Stripe customer
    console.log("Checking for existing Stripe customer");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("Found existing customer:", customerId);
    }

    // Calculate total amount
    const totalAmount = body.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    console.log("Total amount:", totalAmount);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    console.log("Generated order number:", orderNumber);

    // Create order record first
    console.log("Creating order record");
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        total_amount: totalAmount,
        shipping_address: body.shipping_address,
        billing_address: body.billing_address || body.shipping_address,
        status: "pending",
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    console.log("Order created:", orderData.id);

    // Create order items
    console.log("Creating order items");
    const orderItems = body.items.map(item => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (orderItemsError) {
      console.error("Order items creation error:", orderItemsError);
      throw new Error(`Failed to create order items: ${orderItemsError.message}`);
    }

    console.log("Order items created successfully");

    // Create Stripe checkout session
    console.log("Creating Stripe checkout session");
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: body.items.map(item => ({
        price_data: {
          currency: "inr",
          product_data: { 
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to paisa
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${req.headers.get("origin")}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${orderData.id}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      metadata: {
        order_id: orderData.id,
        user_id: user.id,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    console.log("Stripe session created:", session.id);

    // Update order with Stripe session ID
    await supabase
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", orderData.id);

    console.log("Order updated with Stripe session ID");

    return new Response(JSON.stringify({ 
      url: session.url,
      order_id: orderData.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error in create-checkout:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});