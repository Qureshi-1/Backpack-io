export default function Privacy() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-zinc-300">
      <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
      <p className="mb-4">Last updated: March 2026</p>
      <p className="mb-8 items-center rounded-md bg-emerald-500/10 px-4 py-3 font-medium text-emerald-400">
        Backport does NOT store your API request or response bodies. We operate strictly as an edge gateway layer.
      </p>
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Data Collection</h2>
      <p className="mb-6 leading-relaxed">
        We log basic request metadata (HTTP method, path, latency, and status code) for analytics rendering purposes in your dashboard. Full HTTP bodies are discarded immediately after request forwarding caching rules expire.
      </p>
      <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Account Data</h2>
      <p className="mb-6 leading-relaxed">
        We store the email address you provide for account operations and support interactions. Your data is rarely shared with third parties.
      </p>
    </div>
  );
}
