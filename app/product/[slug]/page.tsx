import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/app/components/AddToCartButton";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  discountPrice: number | null;
  images: string[];
  stock: number;
  category: { name: string };
};

async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products`, {
    cache: "no-store",
  });
  const products: Product[] = await res.json();
  return products.find((p) => p.slug === slug) || null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden">
          {product.images[0] ? (
            <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">{product.category.name}</p>
          <h1 className="text-2xl font-bold text-brand-blue mb-3">{product.name}</h1>

          <div className="mb-4">
            {product.discountPrice ? (
              <p>
                <span className="line-through text-gray-400 mr-2">৳{product.price}</span>
                <span className="text-brand-gold text-2xl font-bold">৳{product.discountPrice}</span>
              </p>
            ) : (
              <p className="text-brand-gold text-2xl font-bold">৳{product.price}</p>
            )}
          </div>

          {product.description && (
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
          )}

          <p className="text-sm text-gray-500 mb-6">
            {product.stock > 0 ? `স্টকে আছে (${product.stock})` : "স্টকে নেই"}
          </p>

          <AddToCartButton product={product} />

          <p className="text-xs text-gray-400 mt-4">Cash on Delivery সুবিধা পাওয়া যাবে।</p>
        </div>
      </div>
    </main>
  );
}