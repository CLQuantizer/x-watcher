import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const twitterPosts = sqliteTable('twitter_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  url: text('url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});