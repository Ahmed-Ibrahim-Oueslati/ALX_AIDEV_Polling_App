// Utility for fetching analytics data
import { PollAnalyticsSummary, PollAnalyticsDetails, UserAnalyticsSummary, OptionVote } from "./types";
import { createClient } from "../supabase/server";

/**
 * Calculates the total number of votes for a given array of poll options.
 * @param pollOptions An array of poll options with their votes.
 * @returns The total number of votes.
 */
function calculateTotalVotes(pollOptions: any[]): number {
  return pollOptions.reduce((sum: number, opt: any) => sum + (opt.votes?.length || 0), 0);
}

/**
 * Maps raw poll options data to the OptionVote type.
 * @param pollOptions An array of raw poll options data.
 * @returns An array of OptionVote objects.
 */
function mapOptionVotes(pollOptions: any[], totalVotes: number): OptionVote[] {
  return pollOptions.map((opt: any) => ({
    optionId: opt.id,
    text: opt.text,
    voteCount: opt.votes?.length || 0,
    percentage: totalVotes === 0 ? 0 : ((opt.votes?.length || 0) / totalVotes) * 100,
  }));
}

export async function getPollAnalytics(userId: string): Promise<PollAnalyticsSummary[]> {
  const supabase = await createClient();
  // Secure query: fetch polls created by user
  const { data, error } = await supabase
    .from("polls")
    .select("id, title, poll_options(id, text, votes(id))")
    .eq("created_by", userId);
  if (error) throw new Error(error.message);
  if (!data) return [];
  return data.map((poll: any) => {
    const totalVotes = calculateTotalVotes(poll.poll_options);
    return {
      pollId: poll.id,
      title: poll.title,
      totalVotes: totalVotes,
      optionVotes: mapOptionVotes(poll.poll_options, totalVotes),
    };
  });
}

export async function getPollDetailsAnalytics(pollId: string): Promise<PollAnalyticsDetails> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("polls")
    .select("id, title, created_at, created_by, poll_options(id, text, votes(id))")
    .eq("id", pollId)
    .single();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Poll not found");
  const totalVotes = calculateTotalVotes(data.poll_options);
  return {
    pollId: data.id,
    title: data.title,
    totalVotes: totalVotes,
    optionVotes: mapOptionVotes(data.poll_options, totalVotes),
    createdAt: data.created_at,
    createdBy: data.created_by,
  };
}

export async function getUserAnalytics(userId: string): Promise<UserAnalyticsSummary> {
  const supabase = await createClient();
  // Polls created
  const { data: polls, error: pollsError } = await supabase
    .from("polls")
    .select("id")
    .eq("created_by", userId);
  if (pollsError) throw new Error(pollsError.message);
  // Votes cast
  const { data: votes, error: votesError } = await supabase
    .from("votes")
    .select("id")
    .eq("user_id", userId);
  if (votesError) throw new Error(votesError.message);
  return {
    userId,
    pollsCreated: polls?.length || 0,
    totalVotesCast: votes?.length || 0,
  };
}