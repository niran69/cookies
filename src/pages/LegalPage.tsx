export function LegalPage() {
  return (
    <div className="pt-24 min-h-screen section-pad py-10">
      <div className="max-w-4xl mx-auto glass p-8 rounded-2xl">
        <h1 className="font-serif text-3xl font-bold text-cream-100 mb-6">
          Legal Information
        </h1>

        <p className="text-cream-200/70 mb-4">
          Design Arena Cookies operates as a licensed home bakery business.
        </p>

        <h2 className="text-gold-300 font-semibold mt-6 mb-2">Business Details</h2>
        <p className="text-cream-200/70 mb-4">
          Business Name: Design Arena Cookies
        </p>
        <p className="text-cream-200/70 mb-4">
          License Number: XXXXXXXX
        </p>

        <h2 className="text-gold-300 font-semibold mt-6 mb-2">Liability</h2>
        <p className="text-cream-200/70">
          We are not responsible for delays caused by third‑party delivery services or events beyond our control.
        </p>
      </div>
    </div>
  );
}