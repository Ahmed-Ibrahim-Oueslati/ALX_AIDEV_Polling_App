"use server"

import { createClient } from "@supabase/supabase-js"
import { z } from "zod"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { Database } from "../types/supabase-types"

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const PollSchema = z.object({
  question: z.string().min(1, "Question is required"),
  options: z.array(z.string().min(1)).min(2, "At least 2 options required"),
})

/**
 * Creates a new poll and its associated options.
 * @param {string} question - The poll question.
 * @param {string[]} options - An array of poll options.
 * @returns {Promise<{ error?: string }>} An object indicating success or an error message.
 */
export async function createPollAction(
  question: string,
  options: string[]
): Promise<{ error?: string }> {
  const result = PollSchema.safeParse({ question, options });
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Authentication required" };
  }

  try {
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        title: question,
        created_by: user.id,
      })
      .select()
      .single();

    if (pollError || !poll) {
      console.error("Error creating poll:", pollError);
      return { error: "Failed to create poll" };
    }

    const optionRows = options.map((text) => ({
      poll_id: poll.id,
      text,
    }));

    const { error: optionsError } = await supabase
      .from("options")
      .insert(optionRows);

    if (optionsError) {
      console.error("Error creating poll options:", optionsError);
      return { error: "Failed to create poll options" };
    }

    revalidatePath("/polls");
    redirect(`/polls/${poll.id}`);
    return {};
  } catch (error) {
    console.error("Unexpected error in createPollAction:", error);
    return { error: "An unexpected error occurred" };
  }
}