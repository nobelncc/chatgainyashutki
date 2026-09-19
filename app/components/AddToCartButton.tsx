"use client";

import { useState } from "react";
import { useCart } from "@/app/lib/cart-context";
import { useRouter } from "next/navigation";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    discountPrice: number | null;
    images: string[];
    stock: number;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.discountPrice ?? product.price,
        image: product.images[0] || null,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (product.stock <= 0) {
    return (
      <button disabled className="bg-gray-300 text-gray-500 px-6 py-3 rounded font-semibold cursor-not-allowed">
        স্টকে নেই
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border rounded">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600">−</button>
        <span className="px-4">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 text-gray-600">+</button>
      </div>
      <button
        onClick={handleAdd}
        className="bg-brand-gold hover:bg-brand-gold-dark text-white px-6 py-3 rounded font-semibold"
      >
        {added ? "✓ যোগ হয়েছে" : "Add to Cart"}
      </button>
      <button
        onClick={() => {
          handleAdd();
          router.push("/cart");
        }}
        className="bg-brand-blue hover:bg-brand-blue-dark text-white px-6 py-3 rounded font-semibold"
      >
        Buy Now
      </button>
    </div>
  );
}