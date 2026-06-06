'use client';
import Link from 'next/link';

export default function GuestHeader() {
  return (
    <header className="sticky top-0 z-50 bg-cream border-b-2 border-neo-black px-4 md:px-5 py-4 mb-6">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center">
        <Link href="/" className="no-underline text-inherit">
          <div className="flex items-center gap-3">
            <div className="bg-orange border-2 border-neo-black rounded-sm w-10 h-10 flex items-center justify-center text-2xl font-black shadow-[2px_2px_0px_0px_#1A1A1A]">
              🏫
            </div>
            <div className="text-2xl font-black">
              UnnesBoard<span className="text-blue">.</span>
            </div>
          </div>
        </Link>

        <div className="flex gap-3">
          <Link href="/login" className="neo-btn small sky">
            Login
          </Link>
          <Link href="/register" className="neo-btn small blue">
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}
