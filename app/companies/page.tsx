import MainLayout from '@/components/layout/MainLayout';
import CompaniesPageClient from './CompaniesPageClient';

export default function CompaniesPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="table">
      <CompaniesPageClient />
    </MainLayout>
  );
}