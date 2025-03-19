import { drizzle } from 'drizzle-orm/d1';
import { twitterPosts } from './schema/xPosts';
import { fetchFromJina } from "./services/jina";
import { analyzePost } from "./services/ai";
export interface Env {
  X_WATCHER_DB: D1Database;
  JINA_API_KEY: string;
  GEMINI_API_KEY: string;
  X_WATCHER_BROWSER: Fetcher;
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
        const res = await fetchFromJina(post.url, env.JINA_API_KEY);
        console.log(res);
        const metrics = await analyzePost(res, env.GEMINI_API_KEY);
        console.log('analysis', metrics);
        // Add to results
        results.push({
          id: post.id,
          url: post.url,
          metrics
        });
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