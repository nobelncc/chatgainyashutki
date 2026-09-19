import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-brand-blue text-white sticky top-0 z-50 shadow">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-brand-gold">
          চটগাঁইয়া শুটকি
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-brand-gold">Home</Link>
          <Link href="/shop" className="hover:text-brand-gold">Shop</Link>
          <Link href="/track-order" className="hover:text-brand-gold">Track Order</Link>
          <Link href="/about" className="hover:text-brand-gold">About</Link>
          <Link href="/contact" className="hover:text-brand-gold">Contact</Link>
        </nav>
        <Link
          href="/cart"
          className="bg-brand-gold hover:bg-brand-gold-dark px-4 py-2 rounded text-sm font-semibold"
        >
          Cart
        </Link>
      </div>
    </header>
  );
}