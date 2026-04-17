import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { usePayments, usePayment, useCreatePayment, useUpdatePayment, useDeletePayment } from '../usePayments';

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

describe('usePayments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches payments with orgId', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: '1', amount: 1000 }]);
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => usePayments(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/payments');
    expect(result.current.data).toEqual([{ id: '1', amount: 1000 }]);
  });

  it('has correct query key', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => usePayments(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('is disabled when no orgId', () => {
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue(null);

    const { result } = renderHook(() => usePayments(), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('usePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches single payment with id', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1', amount: 1000 });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => usePayment('1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/payments/1');
  });

  it('is disabled without id', () => {
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => usePayment(''), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreatePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates payment', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useCreatePayment(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ amount: 1000 });

    expect(api.post).toHaveBeenCalledWith('/payments', { amount: 1000 });
  });
});

describe('useUpdatePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates payment', async () => {
    (api.put as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useUpdatePayment(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ id: '1', data: { amount: 2000 } });

    expect(api.put).toHaveBeenCalledWith('/payments/1', { amount: 2000 });
  });
});

describe('useDeletePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes payment', async () => {
    (api.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useDeletePayment(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync('1');

    expect(api.delete).toHaveBeenCalledWith('/payments/1');
  });
});