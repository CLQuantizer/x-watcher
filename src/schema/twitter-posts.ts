import { drizzle } from 'drizzle-orm/d1';

export interface Env {
  <BINDING_NAME>: D1Database;
}

export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.<BINDING_NAME>);
    const result = await db.select().from(users).all()
    return Response.json(result);
  },
};
