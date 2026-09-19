import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET a single product
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

// UPDATE a product
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, slug, description, price, discountPrice, stock, categoryId, status, images } = body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      name, slug, description,
      price: price ? parseFloat(price) : undefined,
      discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
      stock: stock !== undefined ? parseInt(stock) : undefined,
      categoryId, status,
      images: images ?? undefined,
    },
  });

  return NextResponse.json(product);
}

// DELETE a product
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ message: "Product deleted successfully" });
}