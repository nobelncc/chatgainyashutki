"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/lib/cart-context";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">তোমার কার্ট খালি।</p>
        <Link href="/shop" className="text-brand-gold font-semibold hover:underline">
          Shop করতে যান
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-blue mb-6">Your Cart</h1>

      <div className="bg-white rounded-lg shadow divide-y">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-4 p-4">
            <div className="w-16 h-16 bg-gray-100 rounded relative flex-shrink-0">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover rounded" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Image</div>
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium text-brand-blue">{item.name}</p>
              <p className="text-brand-gold font-semibold">৳{item.price}</p>
            </div>

            <div className="flex items-center border rounded">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="px-3 py-1 text-gray-600"
              >
                −
              </button>
              <span className="px-3">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="px-3 py-1 text-gray-600"
              >
                +
              </button>
            </div>

            <p className="w-20 text-right font-medium">৳{item.price * item.quantity}</p>

            <button
              onClick={() => removeFromCart(item.productId)}
              className="text-red-500 hover:underline text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <Link href="/shop" className="text-brand-blue hover:underline text-sm">
          ← আরও কিনুন
        </Link>
        <div className="text-right">
          <p className="text-gray-500 text-sm mb-1">Total</p>
          <p className="text-2xl font-bold text-brand-blue mb-3">৳{total}</p>
          <Link
            href="/checkout"
            className="bg-brand-gold hover:bg-brand-gold-dark text-white px-6 py-3 rounded font-semibold inline-block"
          >
            Checkout করুন
          </Link>
        </div>
      </div>
    </main>
  );
}