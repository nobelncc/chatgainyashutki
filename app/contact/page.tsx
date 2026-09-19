export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-brand-blue mb-4">যোগাযোগ করুন</h1>
      <div className="bg-white p-6 rounded-lg shadow space-y-2 text-gray-600">
        <p>ফোন: 01XXXXXXXXX</p>
        <p>ইমেইল: info@chatgainyashutki.com</p>
        <p>ঠিকানা: চট্টগ্রাম, বাংলাদেশ</p>
        <p>
          Facebook:{" "}
          <a href="https://www.facebook.com/profile.php?id=61582328025650" target="_blank" className="text-brand-gold hover:underline">
            আমাদের পেজ ভিজিট করুন
          </a>
        </p>
      </div>
    </main>
  );
}