// import Razorpay from "razorpay";
import crypto from "crypto";

// const razorpay = new Razorpay({
//   key_id: process.env.TEST_RAZORPAY_KEY_ID!,
//   key_secret: process.env.TEST_RAZORPAY_KEY_SECRET!,
// });
export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.TEST_RAZORPAY_KEY_SECRET!)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return new Response(
        JSON.stringify({ message: "Payment verified successfully" }),
        { status: 200 }
      );
    } else {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 200,
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    return new Response(JSON.stringify({ error: "Error verifying payment" }), {
      status: 500,
    });
  }
}
