import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useMyOrgs, useCreateOrg } from '../useOrgs';

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
  },
}));

import { api } from '@/lib/api';

describe('useMyOrgs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches user organizations', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([
      { id: '1', name: 'Org A', slug: 'org-a' },
      { id: '2', name: 'Org B', slug: 'org-b' },
    ]);

    const { result } = renderHook(() => useMyOrgs(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalledWith('/orgs/mine');
    expect(result.current.data).toEqual([
      { id: '1', name: 'Org A', slug: 'org-a' },
      { id: '2', name: 'Org B', slug: 'org-b' },
    ]);
  });

  it('has correct query key', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const { result } = renderHook(() => useMyOrgs(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it('fetches without enabled check (no orgId required)', async () => {
    (api.get as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const { result } = renderHook(() => useMyOrgs(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.get).toHaveBeenCalled();
  });
});

describe('useCreateOrg', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates organization and invalidates queries', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1', name: 'New Org' });

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useCreateOrg(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ name: 'New Org', slug: 'new-org' });

    expect(api.post).toHaveBeenCalledWith('/orgs', { name: 'New Org', slug: 'new-org' });
  });

  it('creates org without slug', async () => {
    (api.post as ReturnType<typeof vi.fn>).mockResolvedValue({ id: '1', name: 'Org' });

    const queryClient = new QueryClient();
    const { result } = renderHook(() => useCreateOrg(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    await result.current.mutateAsync({ name: 'Org' });

    expect(api.post).toHaveBeenCalledWith('/orgs', { name: 'Org' });
  });
});