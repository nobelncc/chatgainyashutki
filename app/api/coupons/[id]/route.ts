import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// UPDATE a coupon
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { code, discountType, discountValue, minOrderAmount, expiryDate, usageLimit, active } = body;

  const coupon = await prisma.coupon.update({
    where: { id },
    data: {
      code: code ? code.toUpperCase() : undefined,
      discountType,
      discountValue: discountValue ? parseFloat(discountValue) : undefined,
      minOrderAmount: minOrderAmount !== undefined ? parseFloat(minOrderAmount) : undefined,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      usageLimit: usageLimit !== undefined ? parseInt(usageLimit) : undefined,
      active,
    },
  });

  return NextResponse.json(coupon);
}

// DELETE a coupon
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return NextResponse.json({ message: "Coupon deleted successfully" });
}