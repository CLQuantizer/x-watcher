import puppeteer from "@cloudflare/puppeteer";
import { drizzle } from 'drizzle-orm/d1';
import { twitterPosts } from './schema/xPosts';
import { fetchFromJina } from "./services/jina";

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
  views: number;
}

// Function to extract metrics using regex
function extractEngagementMetrics(content: string): EngagementMetrics | null {
  // Regex to match the aria-label with metrics
  const metricsRegex = /aria-label="(\d+) replies, (\d+) reposts, (\d+) likes, (\d+) (?:bookmarks|views)(?:, (\d+) views)?"/;
  const match = content.match(metricsRegex);
  
  if (!match) {
    console.error('Metrics not found in content');
    return null;
  }
  
  // Extract and parse numbers from the matched groups
  return {
    replies: parseInt(match[1], 10) || 0,
    reposts: parseInt(match[2], 10) || 0,
    likes: parseInt(match[3], 10) || 0,
    bookmarks: parseInt(match[4], 10) || 0,
    views: parseInt(match[5], 10) || 0
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
        const res = await fetchFromJina(post.url, env.JINA_API_KEY);
		console.log("jina res", res);
		// Wait for the content to load
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