import { z } from 'zod';

export const EngagementMetricsSchema = z.object({
  replies: z.number(),
  reposts: z.number(),
  likes: z.number(),
  bookmarks: z.number().nullish()
});

export type EngagementMetrics = z.infer<typeof EngagementMetricsSchema>;
  