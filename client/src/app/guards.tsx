import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { FullPageLoader } from '@/components/ui/ByteLoader';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user, status } = useAuthStore();
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="grid min-h-dvh place-items-center bg-[#0f1012]">
        <FullPageLoader />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
