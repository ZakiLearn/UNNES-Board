import { REST_GET, REST_POST, REST_OPTIONS, REST_PUT, REST_PATCH, REST_DELETE } from '@payloadcms/next/routes'
import config from '@payload-config'

type RouteContext = {
  params: Promise<{
    slug?: string[]
  }>
}

export const GET = (request: Request, context: RouteContext) => REST_GET(config)(request, context as any)
export const POST = (request: Request, context: RouteContext) => REST_POST(config)(request, context as any)
export const OPTIONS = (request: Request, context: RouteContext) => REST_OPTIONS(config)(request)
export const PUT = (request: Request, context: RouteContext) => REST_PUT(config)(request, context as any)
export const PATCH = (request: Request, context: RouteContext) => REST_PATCH(config)(request, context as any)
export const DELETE = (request: Request, context: RouteContext) => REST_DELETE(config)(request, context as any)
export const HEAD = (request: Request, context: RouteContext) => REST_GET(config)(request, context as any)

