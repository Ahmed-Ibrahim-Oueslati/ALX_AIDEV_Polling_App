"use server"

import { createClient } from "@supabase/supabase-js"
import { z } from "zod"
import { revalidatePath, redirect } from "next/navigation"
import { Database } from "../types/supabase-types"

const PollSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string().min(1)).min(2, "At least 2 options required"),
})

export async function createPollAction(
  question: string,
  options: string[]
): Promise<{ error?: string }> {
  // Validate input
  const result = PollSchema.safeParse({ question, options })
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  // Supabase client (use env vars)
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Get user (assume session available via Supabase Auth helpers)
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: "Authentication required" }
  }

  try {
    // Insert poll
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        title: question,
        created_by: user.id,
      })
      .select()
      .single()
    if (pollError || !poll) {
      return { error: "Failed to create poll" }
    }

    // Insert options
    const optionRows = options.map((text) => ({ poll_id: poll.id, text }))
    const { error: optionsError } = await supabase
      .from("options")
      .insert(optionRows)
    if (optionsError) {
      return { error: "Failed to create poll options" }
    }

    revalidatePath("/polls")
    redirect(`/polls/${poll.id}`)
    return {}
  } catch (error) {
    return { error: "Failed to create poll" }
  }
}