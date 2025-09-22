import MainLayout from '@/components/layout/MainLayout';
import ProfilePageClient from './ProfilePageClient';

export default function ProfilePage() {
  return (
    <MainLayout requireAuth={true} skeletonType="profile">
      <ProfilePageClient />
    </MainLayout>
  );
}