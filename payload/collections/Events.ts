import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'cms_events',
  admin: {
    useAsTitle: 'title',
    group: 'Updates',
  },
  access: {
    read: () => true, // Public read
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
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'startDate',
      type: 'date',
    },
    {
      name: 'endDate',
      type: 'date',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      required: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
    },
  ],
  timestamps: true,
}
