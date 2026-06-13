import { RootLayout } from '@payloadcms/next/layouts'
import config from '@/payload/config'
import { importMap } from '@/payload/importMap'
import React from 'react'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) =>
  RootLayout({
    children,
    config,
    importMap,
  })

export default Layout
