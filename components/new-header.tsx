import { Terminal } from "lucide-react";
import Link from "next/link";

export default function NewHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary-foreground hover:text-primary">
          <Terminal className="h-5 w-5 text-primary-purple drop-shadow" />
          <span className="text-accent-cyan">LazyVim Polls</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden gap-6 md:flex">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary-purple/10 hover:text-primary-blue"
          >
            Dashboard
          </Link>
          <Link
            href="/polls/my-polls"
            className="rounded-md px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary-purple/10 hover:text-primary-blue"
          >
            My Polls
          </Link>
          <Link
            href="/analytics"
            className="rounded-md px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary-purple/10 hover:text-primary-blue"
          >
            Analytics
          </Link>
          <Link
            href="/settings"
            className="rounded-md px-3 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-primary-purple/10 hover:text-primary-blue"
          >
            Settings
          </Link>
        </nav>
      </div>
    </header>
  );
}