import MainLayout from '@/components/layout/MainLayout';
import ChangePasswordPageClient from './ChangePasswordPageClient';

export default function ChangePasswordPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="form">
      <ChangePasswordPageClient />
    </MainLayout>
  );
}