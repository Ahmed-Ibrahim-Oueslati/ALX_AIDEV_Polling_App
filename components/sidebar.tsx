
'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/polls", label: "Polls" },
  { href: "/polls/create", label: "Create Poll" },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 h-screen w-64 bg-card p-4">
      <nav className="flex flex-col space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-lg font-semibold",
              pathname === link.href ? "text-primary" : "text-foreground"
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
