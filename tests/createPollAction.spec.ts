import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPollAction } from '../lib/actions/poll-actions'
import { createMockSupabase } from './test-utils/mockSupabase'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// --- Mocks -----------------------------------------------------------------

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Keep reference; regenerated in beforeEach
let mockSupabaseFactory = createMockSupabase()

vi.mock('@supabase/supabase-js', () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createClient: vi.fn(() => mockSupabaseFactory.client) as any,
  }
})

// ---------------------------------------------------------------------------

describe('createPollAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSupabaseFactory = createMockSupabase()
  })

  it('happy path – creates poll and options then redirects', async () => {
    const title = 'Best JS framework?'
    const options = ['React', 'Vue']

    mockSupabaseFactory = createMockSupabase({
      user: { id: 123 },
      pollResult: { data: { id: 10, title }, error: null },
      optionsInsertResult: { error: null },
    })

    const result = await createPollAction(title, options)

    expect(result).toEqual({})
    expect(revalidatePath).toHaveBeenCalledWith('/polls')
    expect(redirect).toHaveBeenCalledWith('/polls/10')
    expect(mockSupabaseFactory.pollsInsertSpy).toHaveBeenCalled()
    expect(mockSupabaseFactory.optionsInsertSpy).toHaveBeenCalled()
  })

  it('validation failure – returns zod validation error', async () => {
    const result = await createPollAction('', ['A'])

    expect(result.error).toBeDefined()
    expect(result.error).toContain('Question')
    expect(redirect).not.toHaveBeenCalled()
  })

  it('options insert failure – returns error and no redirect', async () => {
    const title = 'Your favourite DB?'
    const options = ['Postgres', 'MySQL']

    mockSupabaseFactory = createMockSupabase({
      user: { id: 123 },
      pollResult: { data: { id: 20, title }, error: null },
      optionsInsertResult: { error: { message: 'db error' } },
    })

    const result = await createPollAction(title, options)

    expect(result).toEqual({ error: 'Failed to create poll options' })
    expect(redirect).not.toHaveBeenCalled()
  })
})