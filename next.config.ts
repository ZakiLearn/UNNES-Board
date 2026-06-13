import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [
    '@esbuild/win32-x64',
    'esbuild',
    'payload',
    '@payloadcms/db-postgres',
    'postgres',
    '@payloadcms/drizzle',
    'drizzle-orm',
    'pg',
    'drizzle-kit',
    '@smithy/core',
    '@aws-sdk/lib-storage',
    '@payloadcms/storage-s3'
  ],
};

export default withPayload(nextConfig);

