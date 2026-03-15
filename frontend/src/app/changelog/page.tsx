export default function Changelog() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-zinc-300">
      <h1 className="text-4xl font-bold text-white mb-8">Changelog</h1>
      <div className="space-y-8">
        <div className="border-l-2 border-emerald-500 pl-6">
          <h2 className="text-2xl font-semibold text-white mb-2">v1.1.0 - The Performance Update</h2>
          <p className="text-sm text-zinc-500 mb-4">March 2026</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-300">
            <li>Introduced in-memory LRU caching for GET requests</li>
            <li>Added WAF strict mode for SQLi prevention</li>
            <li>Real-time dashboard analytics integration</li>
          </ul>
        </div>
        <div className="border-l-2 border-zinc-700 pl-6">
          <h2 className="text-2xl font-semibold text-white mb-2">v1.0.0 - Public Beta</h2>
          <p className="text-sm text-zinc-500 mb-4">February 2026</p>
          <ul className="list-disc list-inside space-y-2 text-zinc-300">
            <li>Initial release of the gateway</li>
            <li>Support for Rate Limiting and Idempotency keys</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
