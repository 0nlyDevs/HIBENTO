import Link from "next/link";

export function NotFoundState({
  title,
  backHref,
  backLabel,
}: {
  title: string;
  backHref: string;
  backLabel?: string;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-ivory/80">{title}</h1>
      <Link
        href={backHref}
        className="text-sm text-ivory/55 hover:text-ivory underline"
      >
        {backLabel || "Back"}
      </Link>
    </div>
  );
}
