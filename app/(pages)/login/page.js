import LoginPageClient from './LoginPageClient';

// Server-side data and configuration
const getLoginData = () => {
  return {
    seoData: {
      title: "Login - NABA ALI | Access Your Fashion Account",
      description: "Sign in to your NABA ALI account to access exclusive fashion collections, track orders, and manage your style preferences.",
      keywords: "login, sign in, account access, NABA ALI account, fashion login"
    },
    brandInfo: {
      name: "NABA ALI",
      tagline: "Premium Fashion Destination",
      description: "Welcome back to your premium fashion experience"
    },
    authConfig: {
      enableGoogleAuth: true,
      enableEmailAuth: true,
      enableRememberMe: true,
      showForgotPassword: true,
      showSignUpLink: true
    },
    formData: {
      title: "Welcome Back",
      subtitle: "Sign in to your account",
      emailPlaceholder: "Enter your email address",
      passwordPlaceholder: "Enter your password",
      loginButtonText: "Sign In",
      googleButtonText: "Continue with Google",
      rememberMeText: "Remember me",
      forgotPasswordText: "Forgot your password?",
      noAccountText: "Don't have an account?",
      signUpText: "Sign up here",
      forgotPasswordLink: "/forgot-password",
      signUpLink: "/signup"
    },
    benefits: [
      {
        iconName: "ShoppingBag",
        title: "Track Your Orders",
        description: "Monitor your purchases and delivery status in real-time"
      },
      {
        iconName: "Heart",
        title: "Save Favorites",
        description: "Create wishlists and save your favorite fashion pieces"
      },
      {
        iconName: "Truck",
        title: "Fast Shipping",
        description: "Get exclusive access to expedited shipping options"
      },
      {
        iconName: "Star",
        title: "VIP Access",
        description: "Early access to new collections and special discounts"
      }
    ],
    backgroundImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
  };
};

// Metadata for SEO (Server-side)
export async function generateMetadata() {
  const loginData = getLoginData();
  
  return {
    title: loginData.seoData.title,
    description: loginData.seoData.description,
    keywords: loginData.seoData.keywords,
    openGraph: {
      title: loginData.seoData.title,
      description: loginData.seoData.description,
      type: 'website',
      images: [
        {
          url: loginData.backgroundImage,
          width: 1200,
          height: 630,
          alt: 'NABA ALI Login'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: loginData.seoData.title,
      description: loginData.seoData.description,
      images: [loginData.backgroundImage]
    }
  };
}

export default function LoginPage() {
  // Server-side data fetching
  const loginData = getLoginData();

  return (
    <main className="min-h-screen">
      <LoginPageClient loginData={loginData} />
    </main>
  );
}
