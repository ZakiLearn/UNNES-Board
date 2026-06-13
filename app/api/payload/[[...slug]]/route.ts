import { REST_GET, REST_POST, REST_OPTIONS, REST_PUT, REST_PATCH, REST_DELETE } from '@payloadcms/next/routes'
import config from '@/payload/config'

export const GET = REST_GET(config)
export const POST = REST_POST(config)
export const OPTIONS = REST_OPTIONS(config)
export const PUT = REST_PUT(config)
export const PATCH = REST_PATCH(config)
export const DELETE = REST_DELETE(config)
export const HEAD = REST_GET(config) // Mapping HEAD to REST_GET
