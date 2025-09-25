import CheckoutPageClient from './CheckoutPageClient';

export const metadata = {
  title: 'Checkout - Complete Your Order | Your Store',
  description: 'Review your order and complete your purchase securely. Fast checkout with multiple payment options.',
  keywords: 'checkout, payment, order, shopping cart, secure payment',
  openGraph: {
    title: 'Secure Checkout - Complete Your Order',
    description: 'Review your order details and complete your purchase with our secure checkout process.',
    type: 'website',
  },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}