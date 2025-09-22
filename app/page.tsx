'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/contexts/AppContext';
import Spinner from '@/components/ui/spinner';

export default function Home() {
  const { isAuthenticated, loading } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after auth state is confirmed
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while checking auth
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner />
    </div>
  );
}