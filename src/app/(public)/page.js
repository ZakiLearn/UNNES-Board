'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import HeroSection from '@/components/landing/HeroSection';
import StaticMockupFeed from '@/components/landing/StaticMockupFeed';

export default function LandingPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/feed');
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <main>
      <HeroSection />
      <StaticMockupFeed />
    </main>
  );
}
