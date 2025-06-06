import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (adminOnly && user.role !== 'Admin') {
        router.push('/');
      }
    }
  }, [user, loading, adminOnly, router]);

  if (loading || !user || (adminOnly && user.role !== 'Admin')) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <>{children}</>;
}
