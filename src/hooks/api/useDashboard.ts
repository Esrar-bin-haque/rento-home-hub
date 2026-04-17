import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { DashboardStats } from '@/types/api';

export function useDashboard(orgId: string | null) {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard', orgId],
    queryFn: () => api.get('/dashboard'),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}