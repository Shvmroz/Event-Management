import MainLayout from '@/components/layout/MainLayout';
import SettingsPageClient from './SettingsPageClient';

export default function SettingsPage() {
  return (
    <MainLayout requireAuth={true} skeletonType="settings">
      <SettingsPageClient />
    </MainLayout>
  );
}