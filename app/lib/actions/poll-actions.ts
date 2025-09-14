"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { z } from 'zod';

// Zod schema for poll creation
const CreatePollSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters.").max(200, "Title must be 200 characters or less."),
  description: z.string().max(1000, "Description must be 1000 characters or less.").optional(),
  options: z.array(z.string().min(1, "Option cannot be empty.")).min(2, "At least two options are required."),
  endDate: z.date().optional(),
  isPublic: z.boolean().default(true),
});

/**
 * @function createPoll
 * @description Server action to create a new poll. It validates the input, authenticates the user,
 * and inserts the new poll into the database.
 * @param {FormData} formData - The form data containing the poll question and options.
 * @returns {Promise<{ poll: any | null, error: string | null }>} An object with the created poll or an error message.
 */
export async function createPoll(formData: FormData) {
  const supabase = await createClient();

  // Get the current user from the session.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { poll: null, error: "Authentication required" };
  }

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    options: formData.getAll('options').filter(Boolean),
    endDate: formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined,
    isPublic: formData.get('isPublic') === 'true',
  };

  const validation = CreatePollSchema.safeParse(rawData);
  if (!validation.success) {
    return { poll: null, error: validation.error.flatten().fieldErrors };
  }

  const { title, description, options, endDate, isPublic } = validation.data;

  try {
    // Use a transaction to ensure data integrity
    const { data: poll, error: dbError } = await supabase.rpc('create_full_poll', {
      p_title: title,
      p_description: description,
      p_user_id: user.id,
      p_end_date: endDate,
      p_is_public: isPublic,
      p_options: options
    });

    if (dbError) {
      console.error('Database error in createPoll:', dbError);
      return { poll: null, error: 'Failed to create poll. Please try again.' };
    }

    // Trigger real-time notification for public polls
    if (isPublic) {
      // await notifyNewPoll(poll); // Assuming a notification function exists
    }

    revalidatePath("/polls");
    return { poll, error: null };

  } catch (error) {
    console.error('Unexpected error in createPoll:', error);
    return { poll: null, error: 'An unexpected error occurred. Please try again.' };
  }
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

  // Fetch polls and their related options
  const { data, error } = await supabase
    .from("polls")
    .select(`
      *,
      options:options (*)
    `)
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
export async function submitVote(pollId: string, optionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Require user to be logged in to vote.
  if (!user) return { error: "You must be logged in to vote." };

  try {
    const { data, error } = await supabase.rpc('process_vote', {
      p_poll_id: pollId,
      p_option_id: optionId,
      p_user_id: user.id,
    });

    if (error) {
      // Handle specific database errors with user-friendly messages
      switch (error.code) {
        case 'P0001': // Custom error codes from the DB function
          return { error: 'This poll has ended.' };
        case 'P0002':
          return { error: 'You have already voted on this poll.' };
        case 'P0003':
          return { error: 'Poll not found.' };
        case 'P0004':
          return { error: 'Selected option is not valid.' };
        default:
          console.error('Vote processing error:', error);
          return { error: 'Failed to record vote. Please try again.' };
      }
    }

    // Broadcast real-time update to all poll viewers
    await supabase
      .channel(`poll:${pollId}`)
      .send({
        type: 'broadcast',
        event: 'vote_update',
        payload: {
          optionId,
          newCount: data.new_vote_count,
          totalVotes: data.total_votes
        }
      });

    revalidatePath(`/polls/${pollId}`);
    revalidatePath('/polls');
    
    return { error: null };

  } catch (error) {
    console.error('Unexpected error in submitVote:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
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
