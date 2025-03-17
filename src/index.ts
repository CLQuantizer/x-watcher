import { drizzle } from 'drizzle-orm/d1';
import { twitterPosts } from './schema/xPosts';
import { fetchFromJina } from './services/jina';

export interface Env {
	X_WATCHER_DB: D1Database;
	JINA_API_KEY: string;
}

export default {
	// The scheduled handler is invoked at the interval set in our wrangler.jsonc's
	// [[triggers]] configuration.
	async scheduled(event, env, ctx): Promise<void> {
		// We'll keep it simple and make an API call to a Cloudflare API:
		let resp = await fetch('https://api.cloudflare.com/client/v4/ips');
		let wasSuccessful = resp.ok ? 'success' : 'fail';

		// You could store this result in KV, write to a D1 Database, or publish to a Queue.
		// In this template, we'll just log the result:
		console.log(`trigger fired at ${event.cron}: ${wasSuccessful}`);
	},

	async fetch(request: Request, env: Env) {
		const db = drizzle(env.X_WATCHER_DB);
		const posts = await db.select().from(twitterPosts).all();
		
		// Fetch Jina data for each post's URL
		for (const post of posts) {
			try {
				const jinaData = await fetchFromJina(post.url, env.JINA_API_KEY);
				console.log(`Jina data for post ${post.id}:`, jinaData);
			} catch (error) {
				console.error(`Error fetching Jina data for post ${post.id}:`, error);
			}
		}
		
		return Response.json(posts);
	},
} satisfies ExportedHandler<Env>;
