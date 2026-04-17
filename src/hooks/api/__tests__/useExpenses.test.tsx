import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useExpenses, useExpense, useCreateExpense, useUpdateExpense, useDeleteExpense } from '../useExpenses';

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

describe('useExpenses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches expenses with orgId', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: '1', amount: 500 }]);
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useExpenses(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/expenses');
    expect(result.current.data).toEqual([{ id: '1', amount: 500 }]);
  });

  it('has correct query key', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useExpenses(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('is disabled when no orgId', () => {
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { result } = renderHook(() => useExpenses(), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches single expense with id', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1', amount: 500 });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useExpense('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/expenses/1');
  });

  it('is disabled without id', () => {
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useExpense(''), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates expense and invalidates queries', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useCreateExpense(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ amount: 500, description: 'Repair' });

    expect(api.post).toHaveBeenCalledWith('/expenses', { amount: 500, description: 'Repair' });
  });
});

describe('useUpdateExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates expense', async () => {
    (api.put as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useUpdateExpense(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ id: '1', data: { amount: 600 } });

    expect(api.put).toHaveBeenCalledWith('/expenses/1', { amount: 600 });
  });
});

describe('useDeleteExpense', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes expense', async () => {
    (api.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useDeleteExpense(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync('1');

    expect(api.delete).toHaveBeenCalledWith('/expenses/1');
  });
});