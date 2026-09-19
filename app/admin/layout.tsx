import Link from "next/link";
import { auth, signOut } from "@/app/lib/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen flex">
      {session && (
        <aside className="w-56 bg-blue-950 text-white flex flex-col">
          <div className="p-5 border-b border-blue-900">
            <h2 className="font-bold text-yellow-500">Chatgainya Shutki</h2>
            <p className="text-xs text-blue-300">Admin Panel</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 rounded hover:bg-blue-900 text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
            className="p-3 border-t border-blue-900"
          >
            <button className="w-full text-left px-3 py-2 rounded hover:bg-blue-900 text-sm text-red-300">
              Logout
            </button>
          </form>
        </aside>
      )}
      <main className="flex-1">{children}</main>
    </div>
  );
}