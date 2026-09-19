import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET all orders
export async function GET() {
  const orders = await prisma.order.findMany({
    include: {
      items: { include: { product: true } },
      coupon: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

// CREATE a new order (customer checkout)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { customerName, phone, address, items, couponCode } = body;
  // items: [{ productId, quantity }]

  if (!customerName || !phone || !address || !items || items.length === 0) {
    return NextResponse.json(
      { error: "customerName, phone, address, and items are required" },
      { status: 400 }
    );
  }

  // Fetch products to get current prices
  const productIds = items.map((i: { productId: string }) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  let subtotal = 0;
  const orderItemsData = items.map((item: { productId: string; quantity: number }) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new Error(`Product ${item.productId} not found`);
    const price = product.discountPrice ?? product.price;
    subtotal += price * item.quantity;
    return {
      productId: item.productId,
      quantity: item.quantity,
      price,
    };
  });

  // Handle coupon if provided
  let discount = 0;
  let couponId: string | null = null;
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });
    if (coupon && coupon.active) {
      discount =
        coupon.discountType === "percentage"
          ? (subtotal * coupon.discountValue) / 100
          : coupon.discountValue;
      couponId = coupon.id;

      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { timesUsed: { increment: 1 } },
      });
    }
  }

  const totalAmount = subtotal - discount;

  const order = await prisma.order.create({
    data: {
      customerName,
      phone,
      address,
      subtotal,
      discount,
      totalAmount,
      couponId,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

  return NextResponse.json(order, { status: 201 });
}