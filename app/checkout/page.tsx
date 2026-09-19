"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/lib/cart-context";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setApplyingCoupon(true);
    setCouponMessage("");

    const res = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponCode, orderAmount: subtotal }),
    });
    const data = await res.json();

    if (data.valid) {
      setDiscount(data.discount);
      setCouponMessage(`✓ কুপন প্রযোজ্য — ৳${data.discount} ছাড়`);
    } else {
      setDiscount(0);
      setCouponMessage(data.error || "Invalid coupon");
    }
    setApplyingCoupon(false);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPlacing(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        phone,
        address,
        couponCode: discount > 0 ? couponCode : undefined,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }),
    });

    if (!res.ok) {
      setError("অর্ডার করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      setPlacing(false);
      return;
    }

    const order = await res.json();
    clearCart();
    router.push(`/order-confirmed?id=${order.id}`);
  };

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">তোমার কার্ট খালি।</p>
        <Link href="/shop" className="text-brand-gold font-semibold hover:underline">
          Shop করতে যান
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-blue mb-6">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handlePlaceOrder} className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="font-semibold text-brand-blue">Delivery Information</h2>

          {error && <p className="bg-red-100 text-red-700 text-sm p-2 rounded">{error}</p>}

          <div>
            <label className="block text-sm text-gray-700 mb-1">নাম</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">ফোন নম্বর</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">সম্পূর্ণ ঠিকানা</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
            💵 <strong>Cash on Delivery</strong> — পণ্য হাতে পেয়ে টাকা পরিশোধ করুন।
          </div>

          <button
            type="submit"
            disabled={placing}
            className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white py-3 rounded font-semibold disabled:opacity-50"
          >
            {placing ? "অর্ডার হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
          </button>
        </form>

        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="font-semibold text-brand-blue mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-2">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 border rounded px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-600 outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={applyingCoupon}
              className="bg-brand-blue hover:bg-brand-blue-dark text-white px-4 rounded text-sm font-medium disabled:opacity-50"
            >
              Apply
            </button>
          </div>
          {couponMessage && (
            <p className={`text-xs mb-4 ${discount > 0 ? "text-green-600" : "text-red-500"}`}>
              {couponMessage}
            </p>
          )}

          <div className="border-t pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>−৳{discount}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-brand-blue text-lg pt-1">
              <span>Total</span>
              <span>৳{total}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}