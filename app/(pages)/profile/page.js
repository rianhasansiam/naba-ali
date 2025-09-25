import ProfilePageWrapper from './ProfilePageWrapper';

export const metadata = {
  title: 'My Profile - NABA ALI | Account Dashboard',
  description: 'Manage your NABA ALI account, view orders, update addresses, and customize your preferences.',
  keywords: 'profile, account, orders, NABA ALI account, user dashboard',
  openGraph: {
    title: 'My Profile - NABA ALI | Account Dashboard',
    description: 'Manage your NABA ALI account, view orders, update addresses, and customize your preferences.',
    type: 'website',
  },
};

export default function ProfilePage() {
  return <ProfilePageWrapper />;
}