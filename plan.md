# Poll Analytics Dashboard Feature Plan

## 1. Folder Structure

```
app/
  dashboard/
    analytics/
      page.tsx         // Main analytics dashboard page (Server Component)
      Chart.tsx        // Chart component (Client Component if interactive)
      PollStats.tsx    // Poll statistics display (Server Component)
      [pollId]/
        page.tsx       // Detailed analytics for a specific poll
components/
  analytics/
    PollAnalyticsCard.tsx   // Card for displaying poll analytics summary
    UserStats.tsx           // User-specific analytics (optional)
lib/
  analytics/
    getPollAnalytics.ts     // Server Action or utility for fetching analytics data
    getUserAnalytics.ts     // Server Action or utility for user analytics
```

---

## 2. Suggested Function Signatures

```typescript
// Fetch analytics for all polls (for dashboard)
export async function getPollAnalytics(userId: string): Promise<PollAnalyticsSummary[]>;

// Fetch analytics for a specific poll
export async function getPollDetailsAnalytics(pollId: string): Promise<PollAnalyticsDetails>;

// Optionally, fetch user-specific analytics
export async function getUserAnalytics(userId: string): Promise<UserAnalyticsSummary>;
```

Types (in `lib/types/analytics.ts`):

```typescript
export interface PollAnalyticsSummary {
  pollId: string;
  title: string;
  totalVotes: number;
  options: { optionId: string; text: string; voteCount: number }[];
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
```

---

## 3. Security Considerations

- **Authentication:** Only authenticated users should access analytics. Use Supabase Auth to verify user identity.
- **Authorization:** Users should only see analytics for polls they created. Check `created_by` field in your queries.
- **Data Exposure:** Never expose sensitive user data (emails, secrets) in analytics responses.
- **Rate Limiting:** Consider limiting requests to analytics endpoints to prevent abuse.
- **Server Actions:** Use Next.js Server Actions for all analytics data fetching to avoid exposing queries on the client.

---

## 4. Performance Considerations

- **Efficient Queries:** Use Supabase’s `.select()` with only necessary fields. Avoid `SELECT *`.
- **Pagination:** For dashboards with many polls, implement pagination or infinite scroll.
- **Indexes:** Ensure your database tables (polls, votes) have indexes on frequently queried fields (`poll_id`, `created_by`).
- **Caching:** Cache analytics data where possible (e.g., with SWR or server-side caching).
- **Batching:** Aggregate data in queries rather than in application logic (e.g., use SQL `COUNT`, `GROUP BY`).

---

## 5. UI Component Structure

- **Dashboard Page (`app/dashboard/analytics/page.tsx`):**
  - Fetch user’s polls and analytics data in a Server Component.
  - Render a grid/list of `PollAnalyticsCard` components.

- **PollAnalyticsCard (`components/analytics/PollAnalyticsCard.tsx`):**
  - Displays summary: poll title, total votes, option breakdown.
  - Link to detailed analytics page.

- **Chart Component (`app/dashboard/analytics/Chart.tsx`):**
  - Visualizes poll results (bar chart, pie chart).
  - Use a client component if interactive (e.g., with Chart.js or similar).

- **Detailed Poll Analytics (`app/dashboard/analytics/[pollId]/page.tsx`):**
  - Shows in-depth stats for a single poll.
  - Optionally, display user engagement, vote trends, etc.

- **UserStats (`components/analytics/UserStats.tsx`):**
  - Shows analytics for the current user (polls created, votes cast).

---

Let me know if you want code samples or further breakdowns for any part of this plan!