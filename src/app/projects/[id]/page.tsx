import type { Metadata } from 'next';
import { ProjectDetailsView } from '@/components/project-details/ProjectDetailsView';
import type { ProjectTab } from '@/hooks/useAppNavigation';

export const metadata: Metadata = { title: 'Project' };

const TABS: ProjectTab[] = ['overview', 'tasks', 'files', 'activity'];

interface ProjectPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  const initialTab = TABS.find((t) => t === tab) ?? 'tasks';

  // Keyed so following a link to another tab of the same project resets the view.
  return <ProjectDetailsView key={`${id}-${initialTab}`} projectId={id} initialTab={initialTab} />;
}
