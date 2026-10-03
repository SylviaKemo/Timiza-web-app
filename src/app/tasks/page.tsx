import type { Metadata } from 'next';
import { MyTasksView } from '@/components/my-tasks/MyTasksView';

export const metadata: Metadata = { title: 'My Tasks' };

export default function MyTasksPage() {
  return <MyTasksView />;
}
