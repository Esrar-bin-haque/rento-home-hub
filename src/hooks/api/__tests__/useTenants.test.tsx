import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useTenants, useTenant, useCreateTenant, useUpdateTenant, useDeleteTenant } from '../useTenants';

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
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    getOrgId: vi.fn(),
  },
}));

import { api } from '@/lib/api';

describe('useTenants', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches tenants with orgId', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: '1', name: 'John Doe' }]);
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useTenants(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/tenants');
    expect(result.current.data).toEqual([{ id: '1', name: 'John Doe' }]);
  });

  it('has correct query key', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useTenants(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('is disabled when no orgId', () => {
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { result } = renderHook(() => useTenants(), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useTenant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches single tenant with id', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1', name: 'John Doe' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useTenant('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/tenants/1');
  });

  it('is disabled without id', () => {
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useTenant(null), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });

  it('is disabled without orgId', () => {
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { result } = renderHook(() => useTenant('1'), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateTenant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates tenant and invalidates queries', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useCreateTenant(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ name: 'Jane Doe', email: 'jane@test.com' });

    expect(api.post).toHaveBeenCalledWith('/tenants', { name: 'Jane Doe', email: 'jane@test.com' });
  });
});

describe('useUpdateTenant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates tenant', async () => {
    (api.put as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useUpdateTenant(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ id: '1', data: { name: 'Updated' } });

    expect(api.put).toHaveBeenCalledWith('/tenants/1', { name: 'Updated' });
  });
});

describe('useDeleteTenant', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes tenant', async () => {
    (api.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useDeleteTenant(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync('1');

    expect(api.delete).toHaveBeenCalledWith('/tenants/1');
  });
});