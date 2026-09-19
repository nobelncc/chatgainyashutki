"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <main className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-brand-blue mb-2">অর্ডার সফল হয়েছে!</h1>
      <p className="text-gray-600 mb-1">ধন্যবাদ আপনার অর্ডারের জন্য।</p>
      <p className="text-gray-600 mb-6">
        আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো। Cash on Delivery-তে পণ্য গ্রহণ করুন।
      </p>
      {orderId && (
        <p className="text-sm text-gray-400 mb-6">
          Order ID: <span className="font-mono">{orderId}</span>
        </p>
      )}
      <Link
        href="/shop"
        className="bg-brand-gold hover:bg-brand-gold-dark text-white px-6 py-3 rounded font-semibold inline-block"
      >
        আরও কেনাকাটা করুন
      </Link>
    </main>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense>
      <ConfirmationContent />
    </Suspense>
  );
}