"use client";

import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingId) {
      await fetch(`/api/categories/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
    } else {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });
    }

    setName("");
    setSlug("");
    setEditingId(null);
    setLoading(false);
    fetchCategories();
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-blue-950 mb-6">Categories</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8 max-w-md border-t-4 border-yellow-600"
      >
        <h2 className="font-semibold text-blue-950 mb-4">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>

        <label className="block text-sm text-gray-700 mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-yellow-600 outline-none"
        />

        <label className="block text-sm text-gray-700 mb-1">Slug</label>
        <input
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          placeholder="e.g. dry-fish"
          className="w-full border rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-yellow-600 outline-none"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
          >
            {editingId ? "Update" : "Add Category"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setSlug("");
              }}
              className="bg-gray-200 px-4 py-2 rounded font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="p-3">{cat.name}</td>
                <td className="p-3 text-gray-500">{cat.slug}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-700 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-4 text-center text-gray-400">
                  No categories yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}