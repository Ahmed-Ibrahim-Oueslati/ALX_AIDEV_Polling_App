import Link from 'next/link';

export default function NewHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-primary-600">
          Polling App
        </Link>
        <nav className="flex gap-4">
          <Link href="/polls" className="text-gray-700 hover:text-primary-600">
            My Polls
          </Link>
          <Link href="/polls/create" className="text-gray-700 hover:text-primary-600">
            Create Poll
          </Link>
        </nav>
      </div>
    </header>
  );
}