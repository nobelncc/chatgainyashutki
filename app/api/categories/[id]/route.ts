import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// UPDATE a category
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, slug, image } = body;

  const category = await prisma.category.update({
    where: { id },
    data: { name, slug, image },
  });

  return NextResponse.json(category);
}

// DELETE a category
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ message: "Category deleted successfully" });
}