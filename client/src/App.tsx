import { Suspense, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { router } from '@/app/router';
import { queryClient } from '@/app/queryClient';
import { Toaster } from '@/components/ui/Toaster';
import { FullPageLoader } from '@/components/ui/ByteLoader';
import { useAuthStore } from '@/store/authStore';

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<FullPageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
