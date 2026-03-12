import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-zinc-300">
      <Header />
      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-zinc-500 mb-12">Last updated: {new Date().toLocaleDateString()}</p>
        
        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li><strong>Account Information:</strong> We collect your email address when you create an account to access the dashboard.</li>
              <li><strong>API Usage Data:</strong> We track the number of requests routed through your API Gateway to enforce billing tier limits and provide you with traffic analytics.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Provide, maintain, and improve our API Gateway services.</li>
              <li>Process transactions and send related information, including confirmations and invoices.</li>
              <li>Monitor and analyze traffic patterns and API performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Data Sharing</h2>
            <p>
              We <strong>never sell</strong> your data. We only share information with third-party service providers who need access to such information to carry out work on our behalf, such as processing payments via Razorpay.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. Information is securely stored within our SQLite instances hosted on Render with industry-standard encryption practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. User Rights</h2>
            <p>
              You may update, correct, or delete your account information at any time by logging into your online dashboard or by emailing us directly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Contact Information</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:founder@backport.dev" className="text-emerald-400 hover:text-emerald-300 transition-colors">founder@backport.dev</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
