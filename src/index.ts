import puppeteer from "@cloudflare/puppeteer";
import { drizzle } from 'drizzle-orm/d1';
import { twitterPosts } from './schema/xPosts';

export interface Env {
  X_WATCHER_DB: D1Database;
  JINA_API_KEY: string;
  X_WATCHER_BROWSER: Fetcher;
}

// Interface for the engagement metrics
interface EngagementMetrics {
  replies: number;
  reposts: number;
  likes: number;
  bookmarks: number;
}

// Function to extract metrics using regex
function extractEngagementMetrics(content: string): EngagementMetrics | null {
  // Individual regex patterns for each metric
  const repliesRegex = /aria-label="(\d+) Replies\. Reply"/;
  const repostsRegex = /aria-label="(\d+) reposts\. Repost"/;
  const likesRegex = /aria-label="(\d+) Likes\. Like"/;
  const bookmarksRegex = /aria-label="(\d+) Bookmarks\. Bookmark"/;

  // Extract each metric individually
  const repliesMatch = content.match(repliesRegex);
  const repostsMatch = content.match(repostsRegex);
  const likesMatch = content.match(likesRegex);
  const bookmarksMatch = content.match(bookmarksRegex);

  // If none of the metrics are found, return null
  if (!repliesMatch && !repostsMatch && !likesMatch && !bookmarksMatch) {
    console.error('No metrics found in content');
    return null;
  }

  // Extract and parse numbers from the matched groups
  return {
    replies: repliesMatch ? parseInt(repliesMatch[1], 10) : 0,
    reposts: repostsMatch ? parseInt(repostsMatch[1], 10) : 0,
    likes: likesMatch ? parseInt(likesMatch[1], 10) : 0,
    bookmarks: bookmarksMatch ? parseInt(bookmarksMatch[1], 10) : 0,
  };
}

export default {
  async scheduled(event, env, ctx): Promise<void> {
    let resp = await fetch('https://api.cloudflare.com/client/v4/ips');
    let wasSuccessful = resp.ok ? 'success' : 'fail';
    console.log(`trigger fired at ${event.cron}: ${wasSuccessful}`);
  },

  async fetch(request: Request, env: Env) {
    const db = drizzle(env.X_WATCHER_DB);
    const posts = await db.select().from(twitterPosts).all();
    const results = [];
    
    for (const post of posts) {
      try {
        // Launch browser and navigate to post URL
        const browser = await puppeteer.launch(env.X_WATCHER_BROWSER);
        const page = await browser.newPage();
        await page.goto(post.url);
		await page.waitForSelector('article');
		const content = await page.content();
        
        const metrics = extractEngagementMetrics(content);
        
        // Add to results
        results.push({
          id: post.id,
          url: post.url,
          metrics
        });
        
        await browser.close();
      } catch (error:any) {
        console.error(`Error processing post ${post.id}: ${error.message}`);
        results.push({
          id: post.id,
          url: post.url,
          error: error.message
        });
      }
    }
    
    return Response.json(results);
  },
} satisfies ExportedHandler<Env>;