import { Badge } from '@/components/ui/Badge';

/** "Active" when the client has at least one project in progress. */
export function ClientStatusBadge({ active, long = false }: { active: boolean; long?: boolean }) {
  return active ? (
    <Badge tone="success">{long ? 'Active client' : 'Active'}</Badge>
  ) : (
    <Badge tone="neutral">Inactive</Badge>
  );
}
