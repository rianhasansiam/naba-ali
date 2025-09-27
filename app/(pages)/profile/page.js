import SimpleProfilePageWrapper from './SimpleProfilePageWrapper';

export const metadata = {
  title: 'My Profile - SkyZonee | Account Dashboard',
  description: 'Manage your SkyZonee account, view orders, and customize your preferences.',
  keywords: 'profile, account, orders, SkyZonee account, user dashboard',
  openGraph: {
    title: 'My Profile - SkyZonee | Account Dashboard',
    description: 'Manage your SkyZonee account, view orders, and customize your preferences.',
    type: 'website',
  },
};

export default function ProfilePage() {
  return <SimpleProfilePageWrapper />;
}