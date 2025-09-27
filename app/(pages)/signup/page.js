import SignupPageClient from './SignupPageClient';

// Metadata for SEO
export const metadata = {
  title: "Sign Up - SkyZonee | Join Our Fashion Community",
  description: "Create your SkyZonee account to access exclusive fashion collections.",
};

// Simple signup page
export default function SignupPage() {
  // Signup page data (server-side)
  const signupData = {
    brandInfo: {
      name: "SkyZonee",
      tagline: "Premium Fashion Community"
    },
    formData: {
      title: "Join SkyZonee",
      subtitle: "Create your account",
      firstNamePlaceholder: "Enter your first name",
      lastNamePlaceholder: "Enter your last name",
      emailPlaceholder: "Enter your email address",
      passwordPlaceholder: "Create a password",
      confirmPasswordPlaceholder: "Confirm your password",
      submitButtonText: "Create Account",
      termsText: "I agree to the Terms & Conditions and Privacy Policy",
      newsletterText: "Subscribe to our newsletter for exclusive offers",
      hasAccountText: "Already have an account?",
      loginText: "Sign in here",
      termsLink: "/terms",
      privacyLink: "/privacy",
      loginLink: "/login"
    },
    authConfig: {
      enableGoogleAuth: true,
      enableNewsletter: true,
      showLoginLink: true
    },
    passwordRequirements: [
      "At least 8 characters long",
      "Include uppercase and lowercase letters",
      "Include at least one number",
      "Include at least one special character"
    ],
    benefitsSection: {
      title: "Join Our Fashion Community",
      subtitle: "Experience premium fashion with exclusive member benefits",
      benefits: [
        {
          icon: "Crown",
          title: "Exclusive Access",
          description: "Get first access to new collections and limited edition pieces"
        },
        {
          icon: "Percent",
          title: "Member Discounts",
          description: "Enjoy special member-only discounts and seasonal sales"
        },
        {
          icon: "Gift",
          title: "Birthday Rewards",
          description: "Receive special birthday gifts and personalized offers"
        },
        {
          icon: "Zap",
          title: "Style Alerts",
          description: "Get notified when your favorite items go on sale"
        }
      ],
      stats: {
        totalUsers: "10,000",
        rating: "4.9★"
      }
    },
    backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <SignupPageClient signupData={signupData} />
    </main>
  );
}
