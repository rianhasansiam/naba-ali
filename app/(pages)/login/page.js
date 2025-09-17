import LoginPageClient from './LoginPageClient';

// Metadata for SEO
export const metadata = {
  title: "Login - NABA ALI | Access Your Account",
  description: "Sign in to your NABA ALI account to access exclusive fashion collections.",
};

// Simple login page
export default function LoginPage() {
  // Login page data (server-side)
  const loginData = {
    brandInfo: {
      name: "NABA ALI",
      tagline: "Premium Fashion Destination",
      description: "Welcome back to your premium fashion experience"
    },
    formData: {
      title: "Welcome Back",
      subtitle: "Sign in to your account",
      emailPlaceholder: "Enter your email address",
      passwordPlaceholder: "Enter your password",
      loginButtonText: "Sign In",
      rememberMeText: "Remember me",
      forgotPasswordText: "Forgot your password?",
      noAccountText: "Don't have an account?",
      signUpText: "Sign up here",
      forgotPasswordLink: "/forgot-password",
      signUpLink: "/signup"
    },
    authConfig: {
      enableGoogleAuth: true,
      enableRememberMe: true,
      showForgotPassword: true,
      showSignUpLink: true
    },
    backgroundImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80",
    benefits: [
      {
        iconName: "ShoppingBag",
        title: "Track Your Orders",
        description: "Monitor your purchases and delivery status"
      },
      {
        iconName: "Heart",
        title: "Save Favorites",
        description: "Create wishlists and save your favorite items"
      },
      {
        iconName: "Truck",
        title: "Fast Shipping",
        description: "Get access to expedited shipping options"
      },
      {
        iconName: "Star",
        title: "VIP Access",
        description: "Early access to new collections and discounts"
      }
    ]
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <LoginPageClient loginData={loginData} />
    </main>
  );
}
