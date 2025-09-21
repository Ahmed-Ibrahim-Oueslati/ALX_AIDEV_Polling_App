// Card for displaying poll analytics summary
import { PollAnalyticsSummary } from "@/lib/analytics/types";
import Link from "next/link";

export default function PollAnalyticsCard({ summary }: { summary: PollAnalyticsSummary }) {
  if (!summary) {
    return <div className="text-gray-500">No poll analytics available.</div>;
  }
  return (
    <div className="rounded-lg border p-4 bg-white shadow">
      <h3 className="font-semibold text-md mb-2">{summary.title}</h3>
      <div>Total Votes: <span className="font-bold">{summary.totalVotes}</span></div>
      <div className="mt-2">
        {summary.optionVotes.map((opt) => (
          <div key={opt.optionId} className="flex justify-between">
            <span>{opt.text}</span>
            <span>{opt.voteCount} ({opt.percentage.toFixed(2)}%)</span>
          </div>
        ))}
      </div>
      <a href={`/dashboard/analytics/${summary.pollId}`} className="block mt-4 text-blue-600 hover:underline">View Details</a>
    </div>
  );
}