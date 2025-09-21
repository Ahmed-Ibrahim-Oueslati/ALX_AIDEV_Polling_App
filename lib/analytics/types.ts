// TypeScript types for analytics
export interface OptionVote {
  optionId: string;
  text: string;
  voteCount: number;
  percentage: number;
}

export interface PollAnalyticsSummary {
  pollId: string;
  title: string;
  totalVotes: number;
  optionVotes: OptionVote[];
}

export interface PollAnalyticsDetails extends PollAnalyticsSummary {
  createdAt: string;
  createdBy: string;
}

export interface UserAnalyticsSummary {
  userId: string;
  pollsCreated: number;
  totalVotesCast: number;
}

export interface ChartProps {
  data: any;
  options: any;
}