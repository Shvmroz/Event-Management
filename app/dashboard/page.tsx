import MainLayout from '@/components/layout/MainLayout';
import DashboardPageClient from './DashboardPageClient';

export default function DashboardPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="dashboard">
      <DashboardPageClient />
    </MainLayout>
  );
}