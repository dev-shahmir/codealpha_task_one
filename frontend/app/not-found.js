import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-wide py-32 text-center">
      <h1 className="font-display text-6xl mb-4">404</h1>
      <p className="text-ash mb-8">This page doesn&apos;t exist — or the piece has sold out of our records.</p>
      <Link href="/" className="btn-primary">Back Home</Link>
    </div>
  );
}
