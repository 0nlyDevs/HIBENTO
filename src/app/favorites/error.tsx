"use client";

export default function FavoritesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        <p className="text-4xl mb-4">⚠</p>
        <h1 className="text-xl font-bold text-charcoal mb-2">Failed to load</h1>
        <p className="text-sm text-charcoal/60 mb-6">
          {error.message || "An unexpected error occurred"}
        </p>
        <button
          onClick={() => reset()}
          className="btn-primary"
        >
          RELOAD
        </button>
      </div>
    </div>
  );
}
