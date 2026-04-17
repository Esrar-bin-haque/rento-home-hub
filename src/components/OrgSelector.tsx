import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useMyOrgs, useCreateOrg } from '@/hooks/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChevronDown, Building2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function OrgSelector() {
  const { currentOrg, setCurrentOrg } = useAuth();
  const { data: orgs = [], isLoading } = useMyOrgs();
  const createOrg = useCreateOrg();
  const [newOrgName, setNewOrgName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreate = async () => {
    if (!newOrgName.trim()) return;
    try {
      await createOrg.mutateAsync({ name: newOrgName.trim() });
      setNewOrgName('');
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create organization');
    }
  };

  const handleSwitch = (orgId: string) => {
    setCurrentOrg(orgId);
  };

  if (isLoading || !orgs.length) return null;

  const current = orgs.find(o => o.id === currentOrg);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Building2 className="h-4 w-4" />
            {current?.name || 'Select Organization'}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {orgs.map(org => (
            <DropdownMenuItem
              key={org.id}
              onClick={() => handleSwitch(org.id)}
              className={org.id === currentOrg ? 'bg-accent' : ''}
            >
              {org.name}
            </DropdownMenuItem>
          ))}
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Organization
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Organization</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Organization name"
            value={newOrgName}
            onChange={(e) => setNewOrgName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createOrg.isPending || !newOrgName.trim()}>
              {createOrg.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}