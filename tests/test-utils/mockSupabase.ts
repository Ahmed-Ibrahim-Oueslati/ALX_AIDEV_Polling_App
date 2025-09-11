import { vi } from 'vitest'
import type { Database } from '../../lib/types/supabase-types'

interface MockOptions {
  user?: { id: string | number }
  /** Result returned by polls insert -> select -> single */
  pollResult?: {
    data: { id: number | string; title?: string } | null
    error: unknown | null
  }
  /** Result returned by options insert */
  optionsInsertResult?: {
    error: unknown | null
  }
}

/**
 * Factory that creates a mock Supabase client compatible with `createClient`.
 * All returned spies are reset for each invocation, so tests stay isolated.
 */
export function createMockSupabase({
  user = { id: 1 },
  pollResult = { data: { id: 1, title: '' }, error: null },
  optionsInsertResult = { error: null },
}: MockOptions = {}) {
  // --- auth.getUser -------------------------------------------------------
  const getUserMock = vi.fn().mockResolvedValue({
    data: { user },
    error: null,
  })

  // --- polls insert chain -------------------------------------------------
  const pollsInsertSpy = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue(pollResult),
    }),
  })

  // --- options insert -----------------------------------------------------
  const optionsInsertSpy = vi.fn().mockResolvedValue(optionsInsertResult)

  // --- from(table) routing ------------------------------------------------
  const fromMock = vi.fn(
    (table: keyof Database['public']['Tables']) => {
      if (table === 'polls') {
        return {
          insert: pollsInsertSpy,
        }
      }
      if (table === 'options') {
        return {
          insert: optionsInsertSpy,
        }
      }
      // fallback: return minimal stub to satisfy TypeScript
      return {
        insert: vi.fn(),
      }
    }
  )

  const client = {
    auth: { getUser: getUserMock },
    from: fromMock,
  }

  return {
    client,
    pollsInsertSpy,
    optionsInsertSpy,
    getUserMock,
  }
}

export type MockSupabaseReturn = ReturnType<typeof createMockSupabase>

/**
 * README: Using the mock
 * ---------------------------------------
 *   import { createMockSupabase } from './tests/test-utils/mockSupabase'
 *   const { client, pollsInsertSpy, optionsInsertSpy } = createMockSupabase()
 *   // Set client as return value of `createClient` mock before invoking code
 */