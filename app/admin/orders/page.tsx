"use client";

import { useEffect, useState } from "react";

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
  subtotal: number;
  discount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  coupon: { code: string } | null;
};

const STATUS_OPTIONS = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusColor: Record<string, string> = {
  pending: "bg-gray-200 text-gray-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-yellow-100 text-yellow-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-950 mb-6">Orders</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <>
                <tr key={o.id} className="border-t">
                  <td className="p-3">{o.customerName}</td>
                  <td className="p-3">{o.phone}</td>
                  <td className="p-3 font-medium">৳{o.totalAmount}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`text-sm rounded px-2 py-1 border-0 font-medium ${statusColor[o.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 text-gray-500 text-sm">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                      className="text-blue-700 hover:underline text-sm"
                    >
                      {expandedId === o.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>
                {expandedId === o.id && (
                  <tr className="bg-gray-50 border-t">
                    <td colSpan={6} className="p-4">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Address:</strong> {o.address}
                      </p>
                      <table className="w-full text-sm mb-2">
                        <thead>
                          <tr className="text-gray-500">
                            <th className="text-left py-1">Product</th>
                            <th className="text-left py-1">Qty</th>
                            <th className="text-left py-1">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {o.items.map((it) => (
                            <tr key={it.id}>
                              <td className="py-1">{it.product.name}</td>
                              <td className="py-1">{it.quantity}</td>
                              <td className="py-1">৳{it.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Subtotal: ৳{o.subtotal}</p>
                        {o.coupon && <p>Coupon applied: {o.coupon.code} (-৳{o.discount})</p>}
                        <p className="font-semibold text-blue-950">Total: ৳{o.totalAmount}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-gray-400">No orders yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}