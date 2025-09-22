import MainLayout from '@/components/layout/MainLayout';
import TeamPageClient from './TeamPageClient';

export default function TeamPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="table">
      <TeamPageClient />
    </MainLayout>
  );
}