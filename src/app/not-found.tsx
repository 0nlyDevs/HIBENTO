import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-espresso">404</h1>
        <p className="mb-4 text-xl text-espresso/70">Oops! Page not found</p>
        <Link href="/" className="text-terracotta underline hover:text-terracotta/90">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
