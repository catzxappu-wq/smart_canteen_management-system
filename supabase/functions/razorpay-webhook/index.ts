import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    const rawBody = await req.text();

    if (webhookSecret && signature) {
      const encoder = new TextEncoder();
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(webhookSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );

      const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(rawBody));
      const generatedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (generatedSignature !== signature) {
        return new Response(JSON.stringify({ error: "Invalid webhook signature" }), { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;

    if (!paymentEntity) {
      return new Response(JSON.stringify({ status: "ignored_no_payment" }), { status: 200 });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const rzpOrderId = paymentEntity.order_id;
    const rzpPaymentId = paymentEntity.id;
    const notes = paymentEntity.notes || {};
    const orderId = notes.order_id;

    if (event === "payment.captured" || event === "order.paid") {
      // Idempotent update: only update if not already paid
      if (orderId) {
        await serviceClient
          .from("orders")
          .update({
            payment_status: "paid",
            order_status: "Confirmed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .neq("payment_status", "paid");

        await serviceClient.from("payments").upsert({
          order_id: orderId,
          payment_provider: "razorpay",
          provider_order_id: rzpOrderId,
          provider_payment_id: rzpPaymentId,
          amount: paymentEntity.amount / 100,
          currency: paymentEntity.currency || "INR",
          payment_status: "captured",
          verified_at: new Date().toISOString(),
        }, { onConflict: "order_id" });
      }
    } else if (event === "payment.failed") {
      if (orderId) {
        await serviceClient
          .from("orders")
          .update({
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .eq("payment_status", "pending");
      }
    }

    return new Response(JSON.stringify({ status: "processed", event }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
