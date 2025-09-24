export async function generateMetadata() {
  return {
    title: "My Profile - NABA ALI | Account Management",
    description: "Manage your NABA ALI account, view order history, update personal information, and customize your fashion preferences.",
    keywords: "profile, account, user settings, order history, NABA ALI account management",
    robots: 'noindex, nofollow', // Private page
    openGraph: {
      title: "My Profile - NABA ALI | Account Management",
      description: "Manage your NABA ALI account, view order history, update personal information, and customize your fashion preferences.",
      type: 'website'
    }
  };
}

export default function ProfileLayout({ children }) {
  return children;
}