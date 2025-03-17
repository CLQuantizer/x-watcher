CREATE TABLE twitter_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_checked TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN NOT NULL DEFAULT TRUE
);

create table twitter_posts_snapshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    likes INTEGER NOT NULL,
    replies INTEGER NOT NULL,
    retweets INTEGER NOT NULL,
    bookmarks INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- add index on post_id
CREATE INDEX idx_post_id ON twitter_posts_snapshots (post_id);
