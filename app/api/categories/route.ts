import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET all categories
export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(categories);
}

// CREATE a new category
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, slug, image } = body;

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Name and slug are required" },
      { status: 400 }
    );
  }

  const category = await prisma.category.create({
    data: { name, slug, image },
  });

  return NextResponse.json(category, { status: 201 });
}