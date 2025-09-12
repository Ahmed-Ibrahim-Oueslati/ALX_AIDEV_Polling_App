import Link from 'next/link';

export default function NewSidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4 shadow-md">
      <nav className="space-y-4">
        <Link href="/polls" className="block text-gray-700 hover:text-primary-600">
          My Polls
        </Link>
        <Link href="/polls/create" className="block text-gray-700 hover:text-primary-600">
          Create Poll
        </Link>
      </nav>
    </aside>
  );
}