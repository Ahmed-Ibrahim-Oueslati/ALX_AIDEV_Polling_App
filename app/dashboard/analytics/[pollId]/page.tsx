// Detailed analytics for a specific poll (Server Component)
import PollStats from "../PollStats";
import { getPollDetailsAnalytics } from "@/lib/analytics/getPollAnalytics";

export default async function PollAnalyticsPage({ params }: { params: { pollId: string } }) {
  let details: any = null;
  let error: string | null = null;
  try {
    details = await getPollDetailsAnalytics(params.pollId);
  } catch (e: any) {
    error = e.message;
  }
  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }
  if (!details) {
    return <div className="text-gray-500">No analytics found for this poll.</div>;
  }
  return <PollStats details={details} />;
}