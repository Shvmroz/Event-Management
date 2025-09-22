import MainLayout from '@/components/layout/MainLayout';
import EmailConfigurationPageClient from './EmailConfigurationPageClient';

export default function EmailConfigurationPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="form">
      <EmailConfigurationPageClient />
    </MainLayout>
  );
}