import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { OrgMember, OrgMemberInviteInput, OrgMemberUpdateInput } from '@/types/api';
import { toast } from 'sonner';

export function useOrgMembers(orgId: string | null) {
  return useQuery({
    queryKey: ['org-members', orgId],
    queryFn: () => api.get(`/orgs/${orgId}/members`),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

export function useInviteMember(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OrgMemberInviteInput) => api.post(`/orgs/${orgId}/invite`, data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['org-members', orgId] });
        toast.success('Invitation sent successfully');
      }
    },
  });
}

export function useUpdateMemberRole(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: OrgMemberUpdateInput }) =>
      api.put(`/orgs/${orgId}/members/${userId}`, data),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['org-members', orgId] });
      }
    },
  });
}

export function useRemoveMember(orgId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => api.delete(`/orgs/${orgId}/members/${userId}`),
    onError: (error) => { toast.error(error.message || 'An error occurred'); },
    onSuccess: () => {
      if (orgId) {
        queryClient.invalidateQueries({ queryKey: ['org-members', orgId] });
        toast.success('Member removed successfully');
      }
    },
  });
}