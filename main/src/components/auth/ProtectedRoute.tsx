import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute component for role-based access control
 * 
 * Usage:
 * - <ProtectedRoute requireAuth> - Only authenticated users
 * - <ProtectedRoute requireAdmin> - Only admin users
 */
const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireAuth = true 
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md px-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check admin permission
  if (requireAdmin && !isAdmin) {
    // Redirect non-admins to home with a message
    return <Navigate to="/" state={{ error: 'Access denied. Admin privileges required.' }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
