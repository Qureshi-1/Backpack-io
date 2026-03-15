export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-zinc-300">
      <h1 className="text-4xl font-bold text-white mb-8">About Backport</h1>
      <p className="mb-6 leading-relaxed">
        Backport was built to solve a simple problem: Adding API Gateway features to your backend shouldn't require you to write complex middleware or deploy heavy enterprise solutions like Kong.
      </p>
      <p className="mb-6 leading-relaxed">
        We rely on the power of modern reverse proxies to provide rate-limiting, edge-caching, and Web Application Firewall capabilities out of the box, in memory, with zero code changes.
      </p>
    </div>
  );
}
