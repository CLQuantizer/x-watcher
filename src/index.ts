import puppeteer from "@cloudflare/puppeteer";
import { drizzle } from 'drizzle-orm/d1';
import { twitterPosts } from './schema/xPosts';

export interface Env {
	X_WATCHER_DB: D1Database;
	JINA_API_KEY: string;
	X_WATCHER_BROWSER: Fetcher;
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
		
		for (const post of posts) {		
			// implement webbrowsing using cloudflare browser
			const browser = await puppeteer.launch(env.X_WATCHER_BROWSER);
			const page = await browser.newPage();
			await page.goto(post.url);
			const content = await page.content();
			console.log(content);
			await browser.close();
		}
		
		return Response.json(posts);
	},
} satisfies ExportedHandler<Env>;
