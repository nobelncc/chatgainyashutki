import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET all coupons
export async function GET() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(coupons);
}

// CREATE a new coupon
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, discountType, discountValue, minOrderAmount, expiryDate, usageLimit } = body;

  if (!code || !discountType || !discountValue) {
    return NextResponse.json(
      { error: "code, discountType, and discountValue are required" },
      { status: 400 }
    );
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: code.toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}