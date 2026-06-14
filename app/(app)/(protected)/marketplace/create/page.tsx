import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CreateListingForm from '../_components/CreateListingForm'

export default async function CreateListingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-heading font-black text-neo-black tracking-tight uppercase">
          Pasang Iklan Baru
        </h1>
        <p className="font-heading font-bold text-neo-black/80">
          Isi detail barang yang ingin Anda tawarkan kepada mahasiswa UNNES lainnya.
        </p>
      </div>

      <div className="neo-card bg-white p-6 sm:p-8">
        <CreateListingForm />
      </div>
    </div>
  )
}
