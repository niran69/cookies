export function TermsPage() {
  return (
    <div className="pt-24 min-h-screen section-pad py-10">
      <div className="max-w-4xl mx-auto glass p-8 rounded-2xl">
        <h1 className="font-serif text-3xl font-bold text-cream-100 mb-6">
          Terms & Conditions
        </h1>

        <p className="text-cream-200/70 mb-4">
          By placing an order with Design Arena Cookies, you agree to the following terms and conditions.
        </p>

        <h2 className="text-gold-300 font-semibold mt-6 mb-2">Orders & Payments</h2>
        <p className="text-cream-200/70 mb-4">
          Orders are confirmed only after WhatsApp confirmation. Prices are subject to change without notice.
        </p>

        <h2 className="text-gold-300 font-semibold mt-6 mb-2">Cancellations</h2>
        <p className="text-cream-200/70 mb-4">
          Orders once confirmed may not be canceled once preparation has started.
        </p>

        <h2 className="text-gold-300 font-semibold mt-6 mb-2">Delivery</h2>
        <p className="text-cream-200/70">
          Delivery times are estimates and may vary due to unforeseen circumstances.
        </p>
      </div>
    </div>
  );
}