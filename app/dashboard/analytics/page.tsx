// Main analytics dashboard page (Server Component)
import PollAnalyticsCard from "@/components/analytics/PollAnalyticsCard";
import { getPollAnalytics } from "@/lib/analytics/getPollAnalytics";
import { Suspense } from "react";
import UserStats from "@/components/analytics/UserStats";

export default async function AnalyticsDashboard() {
  // TODO: Replace with actual user ID from auth context
  const userId = "TODO_USER_ID";
  let analytics: any[] = [];
  let userStats: any = null;
  let error: string | null = null;
  try {
    analytics = await getPollAnalytics(userId);
    userStats = await getUserAnalytics(userId);
  } catch (e: any) {
    error = e.message;
  }
  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }
  return (
    <div className="p-6">
      <Suspense fallback={<div>Loading user stats...</div>}>
        {userStats && <UserStats summary={userStats} />}
      </Suspense>
      <div className="grid gap-4 mt-6 md:grid-cols-2 lg:grid-cols-3">
        {analytics.length === 0 ? (
          <div className="col-span-full text-gray-500">No polls found.</div>
        ) : (
          analytics.map((poll) => (
            <PollAnalyticsCard key={poll.pollId} summary={poll} />
          ))
        )}
      </div>
    </div>
  );
}