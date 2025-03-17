import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite';

export const twitterPosts = sqliteTable('twitter_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  url: text('url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  lastChecked: integer('last_checked', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
});

export type TwitterPost = typeof twitterPosts.$inferSelect;
export type NewTwitterPost = typeof twitterPosts.$inferInsert; 