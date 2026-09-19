"use client";

import { useState } from "react";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
};

type Order = {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_STEPS = ["pending", "confirmed", "shipped", "delivered"];

const statusLabel: Record<string, string> = {
  pending: "অপেক্ষমান",
  confirmed: "নিশ্চিত হয়েছে",
  shipped: "পাঠানো হয়েছে",
  delivered: "ডেলিভারি সম্পন্ন",
  cancelled: "বাতিল হয়েছে",
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    const res = await fetch(`/api/orders/${orderId.trim()}`);

    if (!res.ok) {
      setError("এই Order ID দিয়ে কোনো অর্ডার পাওয়া যায়নি।");
      setLoading(false);
      return;
    }

    setOrder(await res.json());
    setLoading(false);
  };

  const currentStepIndex = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-blue mb-6">Track Your Order</h1>

      <form onSubmit={handleSearch} className="bg-white p-5 rounded-lg shadow flex gap-2 mb-8">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
          placeholder="Order ID দিন"
          className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-gold hover:bg-brand-gold-dark text-white px-5 rounded font-medium disabled:opacity-50"
        >
          {loading ? "খোঁজা হচ্ছে..." : "খুঁজুন"}
        </button>
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {order && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-semibold text-brand-blue">{order.customerName}</p>
              <p className="text-sm text-gray-500">{order.phone}</p>
              <p className="text-sm text-gray-500">{order.address}</p>
            </div>
            <p className="text-sm text-gray-400">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>

          {order.status === "cancelled" ? (
            <p className="text-red-600 font-medium mb-6">এই অর্ডারটি বাতিল করা হয়েছে।</p>
          ) : (
            <div className="flex items-center justify-between mb-8">
              {STATUS_STEPS.map((step, idx) => (
                <div key={step} className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                      idx <= currentStepIndex
                        ? "bg-brand-gold text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <p className="text-xs mt-2 text-center text-gray-600">{statusLabel[step]}</p>
                  {idx < STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-0.5 ${
                        idx < currentStepIndex ? "bg-brand-gold" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.product.name} × {item.quantity}</span>
                <span>৳{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold text-brand-blue pt-2 border-t">
              <span>Total</span>
              <span>৳{order.totalAmount}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}