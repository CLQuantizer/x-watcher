import { z } from 'zod';

export const EngagementMetricsSchema = z.object({
  views: z.number(),
  replies: z.number(),
  reposts: z.number(),
  likes: z.number(),
  bookmarks: z.number()
});

export type EngagementMetrics = z.infer<typeof EngagementMetricsSchema>;
  