import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized user" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { orderId, amount, currency = "INR" } = await req.json();

    if (!orderId || !amount) {
      return new Response(JSON.stringify({ error: "Missing required order parameters" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify order exists and belongs to user
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .select("id, order_number, total_amount, payment_status")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return new Response(JSON.stringify({ error: "Order not found or access denied" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID") || "rzp_test_college_demo";
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET") || "dummy_secret_demo";

    // Amount in paise
    const amountInPaise = Math.round(Number(order.total_amount) * 100);

    // Call Razorpay API
    const authBasic = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authBasic}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency,
        receipt: order.order_number,
        notes: {
          order_id: order.id,
          user_id: user.id,
          order_number: order.order_number,
        },
      }),
    });

    const rzpOrder = await rzpResponse.json();

    if (!rzpResponse.ok) {
      return new Response(JSON.stringify({ error: rzpOrder.error?.description || "Razorpay order creation failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Record initial pending payment
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    await serviceClient.from("payments").insert({
      order_id: order.id,
      payment_provider: "razorpay",
      provider_order_id: rzpOrder.id,
      amount: order.total_amount,
      currency: "INR",
      payment_status: "pending",
    });

    return new Response(
      JSON.stringify({
        razorpay_order_id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        key_id: razorpayKeyId,
        order_number: order.order_number,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
