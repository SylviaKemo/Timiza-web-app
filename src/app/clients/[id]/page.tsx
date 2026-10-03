import type { Metadata } from 'next';
import { ClientDetailsView } from '@/components/clients/ClientDetailsView';

export const metadata: Metadata = { title: 'Client' };

export default async function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientDetailsView key={id} clientId={decodeURIComponent(id)} />;
}
