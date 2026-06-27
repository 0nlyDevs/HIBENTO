"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-charcoal min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            Something went wrong
          </h1>
          <p className="text-sm text-white/50 mb-6">
            {error.message || "An unexpected navigation error occurred"}
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-primary text-charcoal font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
