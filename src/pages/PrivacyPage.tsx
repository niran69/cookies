export function PrivacyPage() {
  return (
    <div className="pt-24 min-h-screen section-pad py-10">
      <div className="max-w-4xl mx-auto glass p-8 rounded-2xl">
        <h1 className="font-serif text-3xl font-bold text-cream-100 mb-6">
          Privacy Policy
        </h1>

        <p className="text-cream-200/70 mb-4">
          At Design Arena Cookies, we respect your privacy and are committed to protecting your personal information.
        </p>

        <h2 className="text-gold-300 font-semibold mt-6 mb-2">Information We Collect</h2>
        <p className="text-cream-200/70 mb-4">
          We collect your name, phone number, email, and delivery address when you place an order.
        </p>

        <h2 className="text-gold-300 font-semibold mt-6 mb-2">How We Use Information</h2>
        <p className="text-cream-200/70 mb-4">
          Your information is used only for order processing, delivery, and customer support.
        </p>

        <h2 className="text-gold-300 font-semibold mt-6 mb-2">Data Security</h2>
        <p className="text-cream-200/70">
          We take reasonable measures to protect your personal data and do not sell or share your information with third parties.
        </p>
      </div>
    </div>
  );
}