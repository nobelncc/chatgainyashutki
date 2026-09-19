import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import cloudinary from "@/app/lib/cloudinary";

// GET all products
export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

// CREATE a new product
export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name, slug, description, price, discountPrice,
    stock, categoryId, images, // images: array of base64 strings
  } = body;

  if (!name || !slug || !price || !categoryId) {
    return NextResponse.json(
      { error: "name, slug, price, and categoryId are required" },
      { status: 400 }
    );
  }

  // Upload each image to Cloudinary
  let uploadedImageUrls: string[] = [];
  if (images && images.length > 0) {
    const uploads = await Promise.all(
      images.map((img: string) =>
        cloudinary.uploader.upload(img, { folder: "chatgainya-shutki" })
      )
    );
    uploadedImageUrls = uploads.map((u) => u.secure_url);
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      stock: stock ? parseInt(stock) : 0,
      categoryId,
      images: uploadedImageUrls,
    },
  });

  return NextResponse.json(product, { status: 201 });
}