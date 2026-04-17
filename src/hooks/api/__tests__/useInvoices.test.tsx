import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useInvoices, useInvoice, useCreateInvoice, useMarkInvoicePaid, useDeleteInvoice } from '../useInvoices';

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

describe('useInvoices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches invoices with orgId', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([{ id: '1', status: 'pending' }]);
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useInvoices('org-123'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/invoices');
    expect(result.current.data).toEqual([{ id: '1', status: 'pending' }]);
  });

  it('has correct query key', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useInvoices('org-123'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('is disabled when no orgId', () => {
    const { result } = renderHook(() => useInvoices(null), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useInvoice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches single invoice with id', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1', status: 'pending' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const { result } = renderHook(() => useInvoice('org-123', '1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/invoices/1');
  });

  it('is disabled without id', () => {
    const { result } = renderHook(() => useInvoice('org-123', null), { wrapper: createWrapper() });

    expect(result.current.fetchStatus).toBe('idle');
  });
});

describe('useCreateInvoice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates invoice', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useCreateInvoice('org-123'), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ amount: 1000 });

    expect(api.post).toHaveBeenCalledWith('/invoices', { amount: 1000 });
  });
});

describe('useMarkInvoicePaid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('marks invoice as paid', async () => {
    (api.put as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1', status: 'paid' });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useMarkInvoicePaid('org-123'), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync('1');

    expect(api.put).toHaveBeenCalledWith('/invoices/1/mark-paid', {});
  });
});

describe('useDeleteInvoice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes invoice', async () => {
    (api.delete as ReturnType<typeof vi.fn>).mockResolvedValue({ success: true });
    (api.getOrgId as ReturnType<typeof vi.fn>).mockReturnValue('org-123');

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useDeleteInvoice('org-123'), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync('1');

    expect(api.delete).toHaveBeenCalledWith('/invoices/1');
  });
});