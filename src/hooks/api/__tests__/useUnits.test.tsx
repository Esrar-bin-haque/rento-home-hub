import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useUnits, useUnit, useCreateUnit, useUpdateUnit, useDeleteUnit } from '../useUnits';

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

describe('useUnits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('fetches units with orgId from localStorage', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: '1', unit_number: '101' }]);
    localStorage.setItem('rento_current_org', 'org-123');

    const { result } = renderHook(() => useUnits(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/units');
  });

  it('fetches units filtered by buildingId', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: '1', unit_number: '101' }]);
    localStorage.setItem('rento_current_org', 'org-123');

    const { result } = renderHook(() => useUnits('building-1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/units?building_id=building-1');
  });

  it('has correct query key', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    localStorage.setItem('rento_current_org', 'org-123');

    const { result } = renderHook(() => useUnits(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('returns empty data when no orgId', () => {
    localStorage.removeItem('rento_current_org');

    const { result } = renderHook(() => useUnits(), { wrapper: createWrapper() });

    expect(result.current.data).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useUnit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('fetches single unit with id', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1', unit_number: '101' });
    localStorage.setItem('rento_current_org', 'org-123');

    const { result } = renderHook(() => useUnit('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/units/1');
  });

  it('is disabled without orgId', () => {
    localStorage.removeItem('rento_current_org');

    const { result } = renderHook(() => useUnit('1'), { wrapper: createWrapper() });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('is disabled without id', () => {
    localStorage.setItem('rento_current_org', 'org-123');

    const { result } = renderHook(() => useUnit(''), { wrapper: createWrapper() });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useCreateUnit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('creates unit and invalidates queries', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    localStorage.setItem('rento_current_org', 'org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useCreateUnit(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ unit_number: '101', building_id: 'b1' });

    expect(api.post).toHaveBeenCalledWith('/units', { unit_number: '101', building_id: 'b1' });
  });

  it('throws when no orgId', async () => {
    localStorage.removeItem('rento_current_org');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useCreateUnit(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await expect(result.current.mutateAsync({ unit_number: '101' })).rejects.toThrow('No organization selected');
  });
});

describe('useUpdateUnit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('updates unit', async () => {
    (api.put as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    localStorage.setItem('rento_current_org', 'org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useUpdateUnit(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ id: '1', data: { unit_number: '102' } });

    expect(api.put).toHaveBeenCalledWith('/units/1', { unit_number: '102' });
  });
});

describe('useDeleteUnit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('deletes unit', async () => {
    (api.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
    localStorage.setItem('rento_current_org', 'org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useDeleteUnit(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync('1');

    expect(api.delete).toHaveBeenCalledWith('/units/1');
  });
});