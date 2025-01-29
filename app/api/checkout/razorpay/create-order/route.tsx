import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.TEST_RAZORPAY_KEY_ID!,
  key_secret: process.env.TEST_RAZORPAY_KEY_SECRET!,
});
export async function POST(req: Request, res: Response) {
  try {
    const { amount } = await req.json();
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Checkout creation error:", error);
    return new Response("Internal server error", { status: 422 });
  }
}
