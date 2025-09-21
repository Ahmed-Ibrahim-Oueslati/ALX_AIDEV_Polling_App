// Poll statistics display (Server Component)
import { PollAnalyticsDetails } from "@/lib/analytics/types";

export default function PollStats({ details }: { details: PollAnalyticsDetails }) {
  if (!details) {
    return <div className="text-gray-500">No analytics found for this poll.</div>;
  }
  return (
    <div className="rounded-lg border p-6 bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">Poll Analytics</h2>
      <div className="mb-2">Title: <span className="font-bold">{details.title}</span></div>
      <div className="mb-2">Total Votes: <span className="font-bold">{details.totalVotes}</span></div>
      <div className="mb-2">Created By: <span className="font-bold">{details.createdBy}</span></div>
      <div className="mb-2">Created At: <span className="font-bold">{details.createdAt}</span></div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Option Votes</h3>
        {details.optionVotes.map((opt) => (
          <div key={opt.optionId} className="flex justify-between">
            <span>{opt.text}</span>
            <span>{opt.voteCount} ({opt.percentage.toFixed(2)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}