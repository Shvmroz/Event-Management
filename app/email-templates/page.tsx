import MainLayout from '@/components/layout/MainLayout';
import EmailTemplatesPageClient from './EmailTemplatesPageClient';

export default function EmailTemplatesPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="table">
      <EmailTemplatesPageClient />
    </MainLayout>
  );
}