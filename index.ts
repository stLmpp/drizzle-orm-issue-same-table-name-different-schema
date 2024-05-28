import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';
import { config } from 'dotenv';

config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_CONNECTION_STRING!,
});

const db = drizzle(pool, {
  logger: false,
  schema,
});

await Promise.all([db.delete(schema.sch1Table), db.delete(schema.sch2Table)]);

const [insert1] = await db.insert(schema.sch2Table).values({}).returning();
await db.insert(schema.sch1Table).values({
  sch2Id: insert1!.sch2Id,
});

const result1 = await db.query.sch1Table.findMany({
  with: {
    // This should autocomplete
    sch2Table: true,
  },
});

console.log('result1', result1[0]?.sch2Table); // Error

const result2 = await db.query.sch1Table.findFirst({
  with: {
    // This should autocomplete
    sch2Table: true,
  },
});

console.log('result2', result2?.sch2Table); // Error

const result3 = await db.query.sch2Table.findMany({
  with: {
    // This should autocomplete
    sch1Table: true,
  },
});

console.log('result3', result3[0]?.sch1Table); // Error

const result4 = await db.query.sch2Table.findFirst({
  with: {
    // This should autocomplete
    sch1Table: true,
  },
});

console.log('result4', result4?.sch1Table); // Error

await pool.end();
