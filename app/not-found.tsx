import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-24 sm:px-6">
      <h1 className="font-serif text-[30px] text-ink">Page not found</h1>
      <Link href="/" className="mt-4 inline-block text-accent hover:underline">
        Back to the map →
      </Link>
    </div>
  );
}
