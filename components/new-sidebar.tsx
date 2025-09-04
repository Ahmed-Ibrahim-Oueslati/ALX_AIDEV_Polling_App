'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Home, Plus, List, BarChart2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Dashboard', href: '/', icon: Home },
  { label: 'Create Poll', href: '/polls/create', icon: Plus },
  { label: 'My Polls', href: '/polls/my-polls', icon: List },
  { label: 'Analytics', href: '/analytics', icon: BarChart2 },
]

export default function NewSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-title">Navigation</div>
        {navLinks.map(({ label, href, icon: Icon }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={cn(
              'sidebar-item w-full text-left',
              pathname === href && 'active'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-title">Quick Actions</div>
        <Button
          variant="outline"
          className="btn w-full mb-2 flex items-center justify-center gap-2"
          onClick={() => router.push('/polls/create')}
        >
          <Plus className="h-4 w-4" />
          New Poll
        </Button>
        <Button
          variant="outline"
          className="btn btn-secondary w-full flex items-center justify-center gap-2"
          onClick={() => alert('Export coming soon')}
        >
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>
    </aside>
  )
}
