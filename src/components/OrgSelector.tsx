import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Building2 } from 'lucide-react';

export function OrgSelector() {
  const { orgs, currentOrg, setCurrentOrg } = useAuth();

  if (!orgs.length) return null;

  const current = orgs.find(o => o.id === currentOrg);

  return (
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
            onClick={() => setCurrentOrg(org.id)}
            className={org.id === currentOrg ? 'bg-accent' : ''}
          >
            {org.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}