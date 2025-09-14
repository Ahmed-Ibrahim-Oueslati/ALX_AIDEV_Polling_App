"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * @function createPoll
 * @description Server action to create a new poll. It validates the input, authenticates the user,
 * and inserts the new poll into the database.
 * @param {FormData} formData - The form data containing the poll question and options.
 * @returns {Promise<{ error: string | null }>} An object with an error message if something went wrong, or null on success.
 */
export async function createPoll(formData: FormData) {
  const supabase = await createClient();

  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  // Validate that a question and at least two options are provided.
  if (!question || options.length < 2) {
    return { error: "Please provide a question and at least two options." };
  }

  // Get the current user from the session.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to create a poll." };
  }

  // Insert the new poll into the 'polls' table and get the new poll's ID.
  const { data: newPoll, error: pollError } = await supabase
    .from("polls")
    .insert({
      created_by: user.id,
      title: question, // Use 'title' column in the database
    })
    .select("id")
    .single();

  if (pollError) {
    return { error: pollError.message };
  }

  // Insert the options into the 'options' table.
  const optionsToInsert = options.map((option) => ({
    poll_id: newPoll.id,
    text: option,
  }));

  const { error: optionsError } = await supabase
    .from("options")
    .insert(optionsToInsert);

  if (optionsError) {
    // If options fail, consider deleting the poll to avoid orphaned polls.
    await supabase.from("polls").delete().eq("id", newPoll.id);
    return { error: optionsError.message };
  }

  // Revalidate the '/polls' path to show the new poll.
  revalidatePath("/polls");
  return { error: null };
}

/**
 * @function getUserPolls
 * @description Fetches all polls created by the currently authenticated user.
 * @returns {Promise<{ polls: any[], error: string | null }>} An object containing the user's polls or an error message.
 */
export async function getUserPolls() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { polls: [], error: "Not authenticated" };

  // Fetch polls where the 'created_by' matches the current user's ID.
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  if (error) return { polls: [], error: error.message };
  return { polls: data ?? [], error: null };
}

/**
 * @function getPollById
 * @description Fetches a single poll by its ID.
 * @param {string} id - The ID of the poll to fetch.
 * @returns {Promise<{ poll: any | null, error: string | null }>} An object containing the poll data or an error message.
 */
export async function getPollById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("polls")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { poll: null, error: error.message };
  return { poll: data, error: null };
}

/**
 * @function submitVote
 * @description Submits a vote for a specific poll option. It ensures the user is logged in and has not voted on this poll before.
 * @param {string} pollId - The ID of the poll being voted on.
 * @param {number} optionIndex - The index of the option being voted for.
 * @returns {Promise<{ error: string | null }>} An object with an error message if something went wrong, or null on success.
 */
export async function submitVote(pollId: string, optionIndex: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Require user to be logged in to vote.
  if (!user) return { error: "You must be logged in to vote." };

  // Check if the user has already voted on this poll.
  const { data: existingVote, error: existingVoteError } = await supabase
    .from("votes")
    .select("id")
    .eq("poll_id", pollId)
    .eq("user_id", user.id)
    .single();

  // Ignore the error that occurs when no record is found.
  if (existingVoteError && existingVoteError.code !== "PGRST116") {
    return { error: existingVoteError.message };
  }

  if (existingVote) {
    return { error: "You have already voted on this poll." };
  }

  // Insert the new vote into the 'votes' table.
  const { error } = await supabase.from("votes").insert([
    {
      poll_id: pollId,
      user_id: user.id,
      option_index: optionIndex,
    },
  ]);

  if (error) return { error: error.message };
  return { error: null };
}

/**
 * @function deletePoll
 * @description Deletes a poll. It ensures that the user is logged in and is the owner of the poll.
 * @param {string} id - The ID of the poll to delete.
 * @returns {Promise<{ error: string | null }>} An object with an error message if something went wrong, or null on success.
 */
export async function deletePoll(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to delete a poll." };
  }

  // Delete the poll only if the 'created_by' matches the current user's ID.
  const { error } = await supabase
    .from("polls")
    .delete()
    .eq("id", id)
    .eq("created_by", user.id);
    
  if (error) return { error: error.message };
  // Revalidate the '/polls' path to reflect the deletion.
  revalidatePath("/polls");
  return { error: null };
}

/**
 * @function updatePoll
 * @description Updates an existing poll's question and options.
 * It ensures the user is logged in and is the owner of the poll.
 * @param {string} pollId - The ID of the poll to update.
 * @param {FormData} formData - The form data containing the updated question and options.
 * @returns {Promise<{ error: string | null }>} An object with an error message if something went wrong, or null on success.
 */
export async function updatePoll(pollId: string, formData: FormData) {
  const supabase = await createClient();

  const question = formData.get("question") as string;
  const options = formData.getAll("options").filter(Boolean) as string[];

  if (!question || options.length < 2) {
    return { error: "Please provide a question and at least two options." };
  }

  // Get user from session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) {
    return { error: userError.message };
  }
  if (!user) {
    return { error: "You must be logged in to update a poll." };
  }

  // Update the poll question
  const { error: pollError } = await supabase
    .from("polls")
    .update({ title: question }) // Use 'title' column in the database
    .eq("id", pollId)
    .eq("created_by", user.id);

  if (pollError) {
    return { error: `Failed to update poll: ${pollError.message}` };
  }

  // Delete old options
  const { error: deleteError } = await supabase
    .from("options")
    .delete()
    .eq("poll_id", pollId);

  if (deleteError) {
    return { error: `Failed to remove old options: ${deleteError.message}` };
  }

  // Insert new options
  const newOptions = options.map((option) => ({
    poll_id: pollId,
    text: option,
  }));

  const { error: insertError } = await supabase
    .from("options")
    .insert(newOptions);

  if (insertError) {
    return { error: `Failed to add new options: ${insertError.message}` };
  }

  revalidatePath(`/polls/${pollId}/edit`);
  revalidatePath("/polls");
  return { error: null };
}
