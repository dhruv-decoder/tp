import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-24 sm:px-6">
      <h1 className="font-serif text-[30px] text-ink">Not found</h1>
      <p className="mt-2 text-ink-2">
        That entry or page does not exist. Entry ids change only when an instrument is merged or split; the{" "}
        <Link href="/method#changelog" className="text-accent">changelog</Link> lists those.
      </p>
      <Link href="/" className="mt-6 inline-block text-accent hover:underline">
        Back to the atlas →
      </Link>
    </div>
  );
}
