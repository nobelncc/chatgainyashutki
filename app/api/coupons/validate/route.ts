import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  const { code, orderAmount } = await req.json();

  const coupon = await prisma.coupon.findUnique({
    where: { code: code?.toUpperCase() },
  });

  if (!coupon || !coupon.active) {
    return NextResponse.json({ valid: false, error: "Invalid coupon code" }, { status: 404 });
  }

  if (coupon.expiryDate && new Date() > coupon.expiryDate) {
    return NextResponse.json({ valid: false, error: "Coupon has expired" }, { status: 400 });
  }

  if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
    return NextResponse.json({ valid: false, error: "Coupon usage limit reached" }, { status: 400 });
  }

  if (coupon.minOrderAmount && orderAmount < coupon.minOrderAmount) {
    return NextResponse.json(
      { valid: false, error: `Minimum order amount is ${coupon.minOrderAmount}` },
      { status: 400 }
    );
  }

  const discount =
    coupon.discountType === "percentage"
      ? (orderAmount * coupon.discountValue) / 100
      : coupon.discountValue;

  return NextResponse.json({ valid: true, discount, coupon });
}