export default function Footer() {
  return (
    <footer className="bg-brand-blue text-blue-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm">
        <p className="text-brand-gold font-semibold text-lg mb-2">চটগাঁইয়া শুটকি</p>
        <p className="mb-4">Fresh & authentic dry fish, delivered to your door. Cash on Delivery available.</p>
        <div className="flex gap-4 text-xs">
          <a href="/about" className="hover:text-white">About Us</a>
          <a href="/contact" className="hover:text-white">Contact</a>
          <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>
          <a href="/terms" className="hover:text-white">Terms & Conditions</a>
        </div>
        <p className="mt-4 text-xs text-blue-300">
          © {new Date().getFullYear()} Chatgainya Shutki. All rights reserved.
        </p>
      </div>
    </footer>
  );
}