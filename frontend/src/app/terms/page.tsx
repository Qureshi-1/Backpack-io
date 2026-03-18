import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Backport",
  description: "Backport Terms of Service – rules and conditions for using the Backport API Gateway.",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 text-sm mb-8 inline-block">← Back to Home</Link>
        <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
        <p className="text-zinc-500 mb-10">Last updated: March 2026</p>

        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="leading-relaxed text-zinc-400">By creating an account or using the Backport API Gateway service ("Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Permitted Use</h2>
            <p className="leading-relaxed text-zinc-400 mb-3">You may use the Service to proxy, secure, and monitor HTTP API traffic to your legitimate backend servers. You agree <strong className="text-white">NOT</strong> to:</p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Use the Service to route traffic involving illegal activity.</li>
              <li>Deliberately attempt to bypass rate limits or quotas.</li>
              <li>Use the Service to attack, scan, or probe third-party systems without explicit authorization.</li>
              <li>Reverse engineer or attempt to extract the source code of the hosted cloud service.</li>
              <li>Resell or sublicense the Service without prior written permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Usage Limits & Plans</h2>
            <p className="leading-relaxed text-zinc-400">Each plan has documented request limits. Exceeding your plan limits will result in requests being throttled (HTTP 429) until your next billing cycle. Persistent and intentional circumvention of limits may result in account suspension.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Billing & Payments</h2>
            <p className="leading-relaxed text-zinc-400">Paid plans are billed monthly or annually in advance. All payments are processed securely. Refunds may be issued at our discretion within 7 days of a charge if the Service was materially non-functional. Downgrades take effect at the next billing cycle.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Service Availability</h2>
            <p className="leading-relaxed text-zinc-400">We target 99.9% uptime for paid plans. We do not guarantee uninterrupted service and are not liable for losses arising from downtime, latency, or service interruptions beyond our reasonable control.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">6. Open Source</h2>
            <p className="leading-relaxed text-zinc-400">The core Backport software is MIT licensed and available on GitHub. These Terms govern the hosted cloud service (Backport Cloud), not your use of the open-source code itself.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">7. Termination</h2>
            <p className="leading-relaxed text-zinc-400">We reserve the right to suspend or terminate accounts that violate these Terms. You may cancel your account at any time from the billing settings page.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">8. Limitation of Liability</h2>
            <p className="leading-relaxed text-zinc-400">To the maximum extent permitted by law, Backport is not liable for indirect, incidental, or consequential damages arising from your use of the Service. Our total liability is limited to the amount you paid us in the last 3 months.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">9. Changes to Terms</h2>
            <p className="leading-relaxed text-zinc-400">We may update these Terms from time to time. Significant changes will be notified via email. Continued use of the Service after changes constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">10. Contact</h2>
            <p className="leading-relaxed text-zinc-400">For legal inquiries: <a href="mailto:support@backportio.com" className="text-emerald-400 hover:underline">support@backportio.com</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
