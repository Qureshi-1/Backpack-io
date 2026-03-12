import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Terms of Service",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-gray-300">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 pt-32">
        <h1 className="text-4xl font-bold text-green-400 mb-4">Terms of Service</h1>
        <p className="text-zinc-500 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Backport service ("Service"), you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">2. Description of Service</h2>
            <p>
              Backport provides an API Gateway proxy service with features like rate limiting, WAF (Web Application Firewall), LRU caching, and idempotency logic.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">3. User Accounts & API Keys</h2>
            <p>
              You are responsible for safeguarding the password and API keys that you use to access the Service and for any activities or actions under your account. Do not share your API keys publicly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">4. Payment Terms</h2>
            <p>
              Paid plans are billed in advance on a subscription basis. Payments are processed securely via Razorpay. We offer a fair refund policy; if you are not satisfied within your first month, contact us for a refund.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">5. Acceptable Use Policy</h2>
            <p>
              You agree not to misuse the Backport service. You may not use our API Gateway to proxy malicious traffic, circumvent rate limits of other providers, or distribute malware. We reserve the right to suspend accounts violating these policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">6. Termination</h2>
            <p>
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">7. Disclaimer of Warranties & Limitation of Liability</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. In no event shall Backport be liable for any indirect, incidental, special, consequential or punitive damages, including loss of profits or data, resulting from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">8. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of your jurisdiction without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-green-400 mb-4">9. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at: <a href="mailto:founder@backport.dev" className="text-emerald-400 hover:text-emerald-300 transition-colors">founder@backport.dev</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
