import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const twitterPosts = sqliteTable('twitter_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  url: text('url').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`),
  lastChecked: text('last_checked')
    .default(sql`CURRENT_TIMESTAMP`),
  status: integer('status', { mode: 'boolean' }).default(true),
});