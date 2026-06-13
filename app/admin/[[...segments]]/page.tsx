import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
import { importMap } from '@/payload/importMap'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({
    config,
    params,
    searchParams,
  })

const Page = ({ params, searchParams }: Args) => {
  return (
    <RootPage
      config={config}
      params={params}
      searchParams={searchParams}
      importMap={importMap}
    />
  )
}

export default Page


