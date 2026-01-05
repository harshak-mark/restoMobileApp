import { router } from 'expo-router';

import ProfileDrawer from '../../src/components/ProfileDrawer';

export default function SettingsScreen() {
  return <ProfileDrawer visible onClose={() => router.back()} />;
}
