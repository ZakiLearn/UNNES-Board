import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Events } from './collections/Events'
import { News } from './collections/News'
import { Articles } from './collections/Articles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Events, News, Articles],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'super-secret-backup-key',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      host: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).hostname : 'aws-1-ap-northeast-1.pooler.supabase.com',
      port: process.env.DATABASE_URL ? parseInt(new URL(process.env.DATABASE_URL).port || '6543') : 6543,
      user: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).username : 'postgres.wtcesbrlgfnkqakrsfjm',
      password: process.env.DATABASE_URL ? decodeURIComponent(new URL(process.env.DATABASE_URL).password || '') : 'LLfQzUNh75wEflkw',
      database: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL).pathname.substring(1) : 'postgres',
      ssl: {
        rejectUnauthorized: false
      }
    },
    push: true,
  }),
  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.SUPABASE_S3_BUCKET || 'media',
      config: {
        credentials: {
          accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY || '',
        },
        endpoint: process.env.SUPABASE_S3_ENDPOINT || '',
        region: process.env.SUPABASE_S3_REGION || 'ap-northeast-1',
        forcePathStyle: true,
      },
    }),
  ],
})
