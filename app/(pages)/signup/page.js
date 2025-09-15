import SignupPageClient from './SignupPageClient';

// Server-side data and configuration
const getSignupData = () => {
  return {
    seoData: {
      title: "Sign Up - NABA ALI | Join Premium Fashion Community",
      description: "Create your NABA ALI account to access exclusive fashion collections, personalized recommendations, and premium shopping experience.",
      keywords: "signup, register, create account, NABA ALI account, fashion signup, join fashion community"
    },
    brandInfo: {
      name: "NABA ALI",
      tagline: "Premium Fashion Destination",
      description: "Join our exclusive fashion community"
    },
    authConfig: {
      enableGoogleSignup: true,
      enableEmailSignup: true,
      requireTermsAcceptance: true,
      showLoginLink: true,
      enableNewsletterOptIn: true
    },
    formData: {
      title: "Create Your Account",
      subtitle: "Join the NABA ALI fashion community",
      firstNamePlaceholder: "Enter your first name",
      lastNamePlaceholder: "Enter your last name",
      emailPlaceholder: "Enter your email address",
      passwordPlaceholder: "Create a password",
      confirmPasswordPlaceholder: "Confirm your password",
      signupButtonText: "Create Account",
      googleButtonText: "Sign up with Google",
      termsText: "I agree to the Terms & Conditions and Privacy Policy",
      newsletterText: "Subscribe to our newsletter for exclusive offers",
      hasAccountText: "Already have an account?",
      loginText: "Sign in here",
      termsLink: "/terms",
      privacyLink: "/privacy",
      loginLink: "/login"
    },
    benefits: [
      {
        iconName: "Crown",
        title: "Exclusive Access",
        description: "Get first access to new collections and limited edition pieces"
      },
      {
        iconName: "Percent",
        title: "Member Discounts",
        description: "Enjoy special member-only discounts and seasonal sales"
      },
      {
        iconName: "Gift",
        title: "Birthday Rewards",
        description: "Receive special birthday gifts and personalized offers"
      },
      {
        iconName: "Zap",
        title: "Style Alerts",
        description: "Get notified when your favorite items go on sale"
      }
    ],
    passwordRequirements: [
      "At least 8 characters long",
      "Include uppercase and lowercase letters",
      "Include at least one number",
      "Include at least one special character"
    ],
    backgroundImage: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  };
};

// Metadata for SEO (Server-side)
export async function generateMetadata() {
  const signupData = getSignupData();
  
  return {
    title: signupData.seoData.title,
    description: signupData.seoData.description,
    keywords: signupData.seoData.keywords,
    openGraph: {
      title: signupData.seoData.title,
      description: signupData.seoData.description,
      type: 'website',
      images: [
        {
          url: signupData.backgroundImage,
          width: 1200,
          height: 630,
          alt: 'NABA ALI Signup'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: signupData.seoData.title,
      description: signupData.seoData.description,
      images: [signupData.backgroundImage]
    }
  };
}

export default function SignupPage() {
  // Server-side data fetching
  const signupData = getSignupData();

  return (
    <main className="min-h-screen">
      <SignupPageClient signupData={signupData} />
    </main>
  );
}
