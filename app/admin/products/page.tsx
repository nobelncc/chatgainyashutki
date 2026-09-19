"use client";

import { useEffect, useState } from "react";

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  status: string;
  images: string[];
  categoryId: string;
  category: { name: string };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const fetchProducts = async () => {
    const res = await fetch("/api/products");
    setProducts(await res.json());
  };
  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const resetForm = () => {
    setEditingId(null);
    setName(""); setSlug(""); setDescription("");
    setPrice(""); setDiscountPrice(""); setStock("");
    setCategoryId(""); setImageFiles([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const base64Images = await Promise.all(imageFiles.map(fileToBase64));

    const payload = {
      name, slug, description,
      price, discountPrice: discountPrice || null,
      stock, categoryId,
      images: base64Images,
    };

    if (editingId) {
      await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    resetForm();
    setLoading(false);
    fetchProducts();
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setSlug(p.slug);
    setPrice(String(p.price));
    setDiscountPrice(p.discountPrice ? String(p.discountPrice) : "");
    setStock(String(p.stock));
    setCategoryId(p.categoryId);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-950 mb-6">Products</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8 max-w-lg border-t-4 border-yellow-600 space-y-3"
      >
        <h2 className="font-semibold text-blue-950">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Slug</label>
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">Price (৳)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">Discount Price (৳)</label>
            <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">Stock</label>
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none" />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
              className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-yellow-600 outline-none">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">Images</label>
          <input type="file" multiple accept="image/*"
            onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
            className="w-full border rounded px-3 py-2" />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50">
            {loading ? "Saving..." : editingId ? "Update" : "Add Product"}
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
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">
                  {p.images[0] ? (
                    <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded" />
                  )}
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3 text-gray-500">{p.category?.name}</td>
                <td className="p-3">
                  {p.discountPrice ? (
                    <>
                      <span className="line-through text-gray-400 mr-1">৳{p.price}</span>
                      <span className="text-yellow-700 font-medium">৳{p.discountPrice}</span>
                    </>
                  ) : (
                    <>৳{p.price}</>
                  )}
                </td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-700 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-gray-400">No products yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}