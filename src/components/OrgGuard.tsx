import { Navigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface OrgGuardProps {
  children: React.ReactNode;
}

export default function OrgGuard({ children }: OrgGuardProps) {
  const { user, currentOrg, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!currentOrg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold">Create or select an organization</h2>
          <p className="text-muted-foreground">Please create or select an organization to access this page.</p>
          <Link to="/orgs/new" className="text-primary hover:underline">Create Organization</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}