import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  images: string[];
  category: { name: string; slug: string };
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allProducts = await getProducts();

  const products = category
    ? allProducts.filter((p) => p.category.slug === category)
    : allProducts;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-blue mb-6">
        {category ? `${products[0]?.category.name || category}` : "All Products"}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">কোনো পণ্য পাওয়া যায়নি।</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              className="border rounded-lg overflow-hidden hover:shadow-md transition bg-white"
            >
              <div className="aspect-square bg-gray-100 relative">
                {p.images[0] ? (
                  <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="font-medium text-brand-blue text-sm mb-1 line-clamp-1">{p.name}</p>
                {p.discountPrice ? (
                  <p>
                    <span className="line-through text-gray-400 text-xs mr-1">৳{p.price}</span>
                    <span className="text-brand-gold font-semibold">৳{p.discountPrice}</span>
                  </p>
                ) : (
                  <p className="text-brand-gold font-semibold">৳{p.price}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}