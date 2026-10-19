import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-32 text-center">
      <p className="text-xs tracking-[0.3em] text-gold uppercase">404</p>
      <h1 className="mt-4 font-serif text-4xl">This page has gone missing</h1>
      <p className="mt-3 text-taupe">
        The page you’re looking for doesn’t exist or has moved.
      </p>
      <Link
        href="/shop"
        className="mt-8 bg-ink px-8 py-3.5 text-sm tracking-widest text-ivory uppercase hover:bg-gold"
      >
        Back to the shop
      </Link>
    </div>
  );
}
