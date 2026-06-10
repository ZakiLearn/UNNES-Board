'use client';

import React, { useActionState } from 'react';
import { setPseudonym } from '@/app/auth/actions';

export default function OnboardingPage() {
  const [state, formAction, isPending] = useActionState(setPseudonym, null);

  return (
    <div className="min-h-screen bg-cream text-neo-black flex items-center justify-center p-6">
      <div className="w-full max-w-md neo-card bg-white space-y-6">
        <div className="space-y-2 text-center">
          <div className="inline-block bg-orange p-3 rounded-md border-2 border-neo-black shadow-neo-sm text-2xl mb-2">
            👤
          </div>
          <h1 className="text-3xl font-heading font-black uppercase tracking-tight">
            Nama Samaran Anda
          </h1>
          <p className="text-sm font-heading font-bold text-neo-black/60 leading-relaxed">
            Sebelum menjelajah UNNES Board, tentukan nama samaran Anda. Nama samaran ini bersifat **permanen** dan tidak dapat diubah di kemudian hari.
          </p>
        </div>

        {state?.error && (
          <div className="p-3 border-2 border-neo-black bg-orange rounded-md text-xs font-bold text-neo-black">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div className="form-group">
            <label className="form-label" htmlFor="alias">Nama Samaran (Alias)</label>
            <input
              id="alias"
              name="alias"
              type="text"
              required
              minLength={3}
              maxLength={20}
              placeholder="Contoh: KsatriaSekaran, AslabCemas"
              className="form-control"
            />
            <p className="text-[10px] font-heading font-bold text-neo-black/50 mt-2">
              Gunakan nama samaran yang sopan dan unik. Panjang 3-20 karakter.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full neo-btn blue disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? "Menyimpan..." : "Simpan Permanen & Mulai 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}
