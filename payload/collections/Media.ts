import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  access: {
    read: () => true,
    create: ({ req }) => {
      const user = req.user
      return user?.role === 'admin' || user?.role === 'moderator'
    },
    update: ({ req }) => {
      const user = req.user
      return user?.role === 'admin' || user?.role === 'moderator'
    },
    delete: ({ req }) => {
      const user = req.user
      return user?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
