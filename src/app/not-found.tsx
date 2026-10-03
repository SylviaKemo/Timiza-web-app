import { EmptyState } from '@/components/ui/EmptyState';
import { ArrowLink } from '@/components/ui/PageHeader';

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      description="The page you're looking for doesn't exist."
      action={<ArrowLink href="/">Back to overview</ArrowLink>}
    />
  );
}
