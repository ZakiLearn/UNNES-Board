import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

const globalForDrizzle = globalThis as unknown as {
  pool: Pool | undefined
}

const connectionString = process.env.DATABASE_URL

const pool = globalForDrizzle.pool ?? new Pool({
  connectionString,
})

if (process.env.NODE_ENV !== 'production') {
  globalForDrizzle.pool = pool
}

export const db = drizzle(pool, { schema })
