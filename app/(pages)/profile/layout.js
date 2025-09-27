export async function generateMetadata() {
  return {
    title: "My Profile - SkyZonee | Account Management",
    description: "Manage your SkyZonee account, view order history, update personal information, and customize your fashion preferences.",
    keywords: "profile, account, user settings, order history, SkyZonee account management",
    robots: 'noindex, nofollow', // Private page
    openGraph: {
      title: "My Profile - SkyZonee | Account Management",
      description: "Manage your SkyZonee account, view order history, update personal information, and customize your fashion preferences.",
      type: 'website'
    }
  };
}

export default function ProfileLayout({ children }) {
  return children;
}