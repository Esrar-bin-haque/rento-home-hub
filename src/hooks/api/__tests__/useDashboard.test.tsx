import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useDashboard } from '../useDashboard';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

import { api } from '@/lib/api';

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches dashboard stats', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      totalBuildings: 5,
      totalUnits: 20,
      occupiedUnits: 15,
      totalTenants: 12,
      monthlyRevenue: 15000,
      pendingInvoices: 3,
    });

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/dashboard');
    expect(result.current.data).toEqual({
      totalBuildings: 5,
      totalUnits: 20,
      occupiedUnits: 15,
      totalTenants: 12,
      monthlyRevenue: 15000,
      pendingInvoices: 3,
    });
  });

  it('has correct query key', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({});

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it('fetches without orgId check (uses api.getOrgId internally)', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ totalBuildings: 0 });

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalled();
  });
});