import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: [
    'chat_connection',
    'comment',
    'community',
    'community_member',
    'community_message',
    'direct_message',
    'poll',
    'poll_option',
    'poll_vote',
    'post',
    'profile',
    'reaction',
    'tag',
    'marketplace_item',
    'marketplace_transaction',
  ],
})
