// app/api/checkout/[checkoutId]/validate-coupon/route.ts

import { ObjectId } from "mongodb";
import { db } from "@/lib/db";
import { auth } from "@/auth";

interface RequestBody {
  eventId: string;
  couponCode: string;
}

interface PromoCode {
  code: string;
  discountType: "flat" | "percent";
  discountValue: number;
  minOrderValue: number;
}

export async function POST(
  req: Request,
  { params }: { params: { checkoutId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return new Response("Unauthorized", { status: 403 });
    }

    // Get checkout ID from params
    const checkoutId = params.checkoutId;
    if (!checkoutId || typeof checkoutId !== "string") {
      return new Response("Invalid checkout ID", { status: 400 });
    }

    // Parse request body
    const body: RequestBody = await req.json();
    const { eventId, couponCode } = body;

    if (!eventId || !couponCode) {
      return new Response("Missing required fields", { status: 400 });
    }

    const client = await db;

    // Fetch checkout details
    const checkouts = client.db().collection("checkouts");
    const checkout = await checkouts.findOne({
      _id: new ObjectId(checkoutId),
    });

    if (!checkout) {
      return new Response("Checkout not found", { status: 404 });
    }

    // Calculate cart total
    const cartTotal = checkout.cart.reduce((sum: number, item: any) => {
      return sum + item.price * item.quantity;
    }, 0);

    // Fetch event details
    const events = client.db().collection("events");
    const event = await events.findOne({
      _id: new ObjectId(eventId),
    });

    if (!event) {
      return new Response("Event not found", { status: 404 });
    }

    // Find matching promo code
    const promoCode = event.promoCodes?.find(
      (promo: PromoCode) =>
        promo.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!promoCode) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid coupon code",
        }),
        { status: 400 }
      );
    }

    // Validate minimum order value
    if (cartTotal < promoCode.minOrderValue) {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Minimum order value of ${promoCode.minOrderValue} required for this coupon`,
          minOrderValue: promoCode.minOrderValue,
          cartTotal: cartTotal,
        }),
        { status: 400 }
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discountType === "flat") {
      discountAmount = promoCode.discountValue;
    } else if (promoCode.discountType === "percent") {
      discountAmount = (cartTotal * promoCode.discountValue) / 100;
    }

    // Calculate final amount
    const finalAmount = cartTotal - discountAmount;

    // Prepare response
    const response = {
      success: true,
      message: "Coupon applied successfully",
      couponDetails: {
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
      },
      calculation: {
        originalAmount: cartTotal,
        discountAmount: discountAmount,
        finalAmount: finalAmount,
      },
    };

    // Update checkout with applied coupon
    await checkouts.updateOne(
      { _id: new ObjectId(checkoutId) },
      {
        $set: {
          appliedCoupon: promoCode,
          discountAmount: discountAmount,
          finalAmount: finalAmount,
        },
      }
    );

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
