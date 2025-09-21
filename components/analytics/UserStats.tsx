// User-specific analytics (optional)
import { UserAnalyticsSummary } from "@/lib/analytics/types";

export default function UserStats({ summary }: { summary: UserAnalyticsSummary }) {
  if (!summary) {
    return <div className="text-gray-500">No user analytics available.</div>;
  }
  return (
    <div className="rounded-lg border p-4 bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">Your Polling Stats</h2>
      <div className="flex flex-col gap-2">
        <div>Polls Created: <span className="font-bold">{summary.pollsCreated}</span></div>
        <div>Total Votes Cast: <span className="font-bold">{summary.totalVotesCast}</span></div>
      </div>
    </div>
  );
}