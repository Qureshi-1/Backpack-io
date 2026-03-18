import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Backport",
  description: "Backport Privacy Policy – how we collect, use, and protect your data.",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm mb-8 inline-block">← Back to Home</Link>
        <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
        <p className="text-zinc-500 mb-10">Last updated: March 2026</p>

        <div className="mb-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-5 py-4 text-emerald-400 font-medium">
          🔒 Backport does <strong>NOT</strong> store your API request or response bodies. We operate strictly as a transparent edge gateway — your payload data is never persisted.
        </div>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Data We Collect</h2>
            <p className="leading-relaxed mb-3">We collect the minimum data required to operate and improve the service:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li><strong className="text-white">Account data:</strong> Email address and hashed password for authentication.</li>
              <li><strong className="text-white">Request metadata:</strong> HTTP method, path, latency (ms), and status code — displayed in your dashboard analytics. No request/response bodies are logged.</li>
              <li><strong className="text-white">Usage metrics:</strong> Request counts per plan period for billing and quota enforcement.</li>
              <li><strong className="text-white">Gateway config:</strong> Target URL and feature toggles you configure.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>To authenticate you and manage your account.</li>
              <li>To render live analytics in your dashboard.</li>
              <li>To enforce plan-based request quotas.</li>
              <li>To send transactional emails (signup confirmation, plan changes).</li>
              <li>We do <strong className="text-white">not</strong> sell your data to any third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Data Retention</h2>
            <p className="leading-relaxed text-zinc-400">Request metadata logs are retained for up to 30 days for paid plans and 24 hours for Hobby plans. Account data is retained as long as your account is active. You may request deletion at any time by emailing us.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Cookies &amp; Tracking</h2>
            <p className="leading-relaxed text-zinc-400">We use a minimal session cookie for authentication only. We do not use third-party advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Your GDPR Rights</h2>
            <p className="leading-relaxed text-zinc-400 mb-3">If you are in the EU/EEA, you have the right to access, correct, delete, or export your personal data. To exercise any of these rights, email <a href="mailto:support@backportio.com" className="text-emerald-400 hover:underline">support@backportio.com</a>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Security</h2>
            <p className="leading-relaxed text-zinc-400">All data in transit is encrypted with TLS 1.3. Passwords are hashed using bcrypt. API keys are stored as hashed values and never displayed in full after creation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Contact</h2>
            <p className="leading-relaxed text-zinc-400">For privacy questions: <a href="mailto:support@backportio.com" className="text-emerald-400 hover:underline">support@backportio.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
