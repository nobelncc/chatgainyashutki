import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  images: string[];
};

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/categories`, {
    cache: "no-store",
  });
  return res.json();
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/products`, {
    cache: "no-store",
  });
  return res.json();
}

export default async function HomePage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <main>
      {/* Banner */}
      <section className="bg-brand-gold text-white">
        <div className="max-w-6xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            খাঁটি ও তাজা শুটকি, আপনার দোরগোড়ায়
          </h1>
          <p className="mb-6 text-white/90">Cash on Delivery • সারাদেশে ডেলিভারি</p>
          <Link
            href="/shop"
            className="bg-brand-blue hover:bg-brand-blue-dark px-6 py-3 rounded font-semibold inline-block"
          >
            এখনই অর্ডার করুন
          </Link>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-brand-blue mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="border rounded-lg p-4 text-center hover:shadow-md transition bg-white"
              >
                <div className="w-16 h-16 mx-auto mb-2 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold font-bold text-xl">
                  {cat.name.charAt(0)}
                </div>
                <p className="font-medium text-brand-blue">{cat.name}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Featured Products</h2>
        {products.length === 0 ? (
          <p className="text-gray-500">Products খুব শীঘ্রই যোগ করা হবে।</p>
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
      </section>
    </main>
  );
}