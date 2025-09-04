'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Polling App
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Link
              href="/polls"
              className="text-gray-600 hover:text-gray-900"
            >
              Polls
            </Link>
            {user && (
              <Link
                href="/polls/my-polls"
                className="text-gray-600 hover:text-gray-900"
              >
                My Polls
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.email}
              </span>
              <Button
                variant="outline"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}