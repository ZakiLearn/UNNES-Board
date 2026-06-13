'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email dan kata sandi wajib diisi.' };
  }

  if (!email.endsWith('@students.unnes.ac.id')) {
    return { error: 'Hanya email mahasiswa UNNES (@students.unnes.ac.id) yang diperbolehkan.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/feed');
}

export async function signUp(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const nim = formData.get('nim') as string;

  if (!email || !password || !name || !nim) {
    return { error: 'Semua kolom formulir wajib diisi.' };
  }

  if (!email.endsWith('@students.unnes.ac.id')) {
    return { error: 'Hanya email mahasiswa UNNES (@students.unnes.ac.id) yang diperbolehkan.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        nim: nim,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data?.session) {
    redirect('/feed');
  } else {
    redirect('/login?message=Pendaftaran berhasil! Silakan periksa kotak masuk email Anda untuk melakukan verifikasi akun.');
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

import { db } from '@/lib/db';
import { profile } from '@/lib/db/schema';

export async function setPseudonym(prevState: any, formData: FormData) {
  const alias = formData.get('alias') as string;

  if (!alias || alias.trim() === '') {
    return { error: 'Nama samaran wajib diisi.' };
  }

  if (alias.length < 3 || alias.length > 20) {
    return { error: 'Nama samaran harus memiliki panjang 3 hingga 20 karakter.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Sesi kedaluwarsa. Silakan masuk kembali.' };
  }

  try {
    await db.insert(profile)
      .values({
        id: user.id,
        aliasName: alias.trim(),
        hasSetAlias: true,
      })
      .onConflictDoUpdate({
        target: profile.id,
        set: {
          aliasName: alias.trim(),
          hasSetAlias: true,
        },
      });

    await supabase.auth.updateUser({
      data: {
        hasSetAlias: true,
        aliasName: alias.trim(),
      },
    });
  } catch (error: any) {
    if (error.code === '23505') {
      return { error: 'Nama samaran ini sudah digunakan. Silakan cari nama samaran lain.' };
    }
    return { error: 'Gagal menyimpan nama samaran. Silakan coba lagi.' };
  }

  redirect('/feed');
}

