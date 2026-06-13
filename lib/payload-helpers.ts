import { getPayload } from 'payload'
import config from '@/payload/config'

/**
 * Mendapatkan instance Payload Local API
 */
export async function getPayloadInstance() {
  return getPayload({ config })
}

/**
 * Mengambil list Events yang sudah dipublish
 */
export async function getEvents() {
  const payload = await getPayloadInstance()
  const result = await payload.find({
    collection: 'cms_events',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-startDate',
  })
  return result.docs
}

/**
 * Mengambil list Berita (News) yang sudah dipublish
 */
export async function getNews() {
  const payload = await getPayloadInstance()
  const result = await payload.find({
    collection: 'cms_news',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
  })
  return result.docs
}

/**
 * Mengambil list Artikel (Articles) yang sudah dipublish
 */
export async function getArticles() {
  const payload = await getPayloadInstance()
  const result = await payload.find({
    collection: 'cms_articles',
    where: {
      status: {
        equals: 'published',
      },
    },
    sort: '-createdAt',
  })
  return result.docs
}
