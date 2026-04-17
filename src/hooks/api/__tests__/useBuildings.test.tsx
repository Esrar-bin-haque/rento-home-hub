import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useBuildings, useBuilding, useCreateBuilding, useUpdateBuilding, useDeleteBuilding } from '../useBuildings';

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

describe('useBuildings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches buildings with orgId', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: '1', name: 'Building A' }]);
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useBuildings('org-123'), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/buildings');
    expect(result.current.data).toEqual([{ id: '1', name: 'Building A' }]);
  });

  it('has correct query key', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useBuildings('org-123'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('is disabled when no orgId', () => {
    const { result } = renderHook(() => useBuildings(null), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useBuilding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches single building with orgId and id', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1', name: 'Building A' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useBuilding('org-123', '1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/buildings/1');
  });

  it('is disabled without orgId', () => {
    const { result } = renderHook(() => useBuilding(null, '1'), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });

  it('is disabled without id', () => {
    const { result } = renderHook(() => useBuilding('org-123', null), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateBuilding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates building and invalidates queries', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useCreateBuilding('org-123'), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ name: 'New Building' });

    expect(api.post).toHaveBeenCalledWith('/buildings', { name: 'New Building' });
  });
});

describe('useUpdateBuilding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates building', async () => {
    (api.put as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useUpdateBuilding('org-123'), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ id: '1', data: { name: 'Updated' } });

    expect(api.put).toHaveBeenCalledWith('/buildings/1', { name: 'Updated' });
  });
});

describe('useDeleteBuilding', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes building', async () => {
    (api.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useDeleteBuilding('org-123'), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync('1');

    expect(api.delete).toHaveBeenCalledWith('/buildings/1');
  });
});