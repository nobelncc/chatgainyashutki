"use client";

import { useEffect, useState } from "react";

type Coupon = {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  expiryDate: string | null;
  usageLimit: number | null;
  timesUsed: number;
  active: boolean;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const fetchCoupons = async () => {
    const res = await fetch("/api/coupons");
    setCoupons(await res.json());
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setCode(""); setDiscountType("percentage"); setDiscountValue("");
    setMinOrderAmount(""); setExpiryDate(""); setUsageLimit("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      code, discountType, discountValue,
      minOrderAmount: minOrderAmount || null,
      expiryDate: expiryDate || null,
      usageLimit: usageLimit || null,
    };

    if (editingId) {
      await fetch(`/api/coupons/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    setLoading(false);
    fetchCoupons();
  };

  const handleEdit = (c: Coupon) => {
    setEditingId(c.id);
    setCode(c.code);
    setDiscountType(c.discountType);
    setDiscountValue(String(c.discountValue));
    setMinOrderAmount(c.minOrderAmount ? String(c.minOrderAmount) : "");
    setExpiryDate(c.expiryDate ? c.expiryDate.split("T")[0] : "");
    setUsageLimit(c.usageLimit ? String(c.usageLimit) : "");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-950 mb-6">Coupons</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8 max-w-lg border-t-4 border-yellow-600 space-y-3"
      >
        <h2 className="font-semibold text-blue-950">
          {editingId ? "Edit Coupon" : "Add New Coupon"}
        </h2>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Coupon Code</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} required
            placeholder="e.g. EID2026"
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">Discount Type</label>
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (৳)</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">Discount Value</label>
            <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">Min Order Amount (৳)</label>
            <input type="number" value={minOrderAmount} onChange={(e) => setMinOrderAmount(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">Usage Limit</label>
            <input type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Expiry Date</label>
          <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50">
            {loading ? "Saving..." : editingId ? "Update" : "Add Coupon"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm}
              className="bg-gray-200 px-4 py-2 rounded font-medium">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Discount</th>
              <th className="p-3">Used</th>
              <th className="p-3">Expiry</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3 font-medium">{c.code}</td>
                <td className="p-3">
                  {c.discountType === "percentage" ? `${c.discountValue}%` : `৳${c.discountValue}`}
                </td>
                <td className="p-3">{c.timesUsed}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                <td className="p-3 text-gray-500">
                  {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "No expiry"}
                </td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(c)} className="text-blue-700 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center text-gray-400">No coupons yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}