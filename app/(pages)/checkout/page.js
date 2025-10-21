import CheckoutPageClient from './CheckoutPageClient';

export const metadata = {
  title: 'Checkout - Complete Your Order | Your Store',
  description: 'Review your order and complete your purchase securely. Cash on Delivery payment option available.',
  keywords: 'checkout, payment, order, shopping cart, cash on delivery, COD',
  openGraph: {
    title: 'Secure Checkout - Complete Your Order',
    description: 'Review your order details and complete your purchase with Cash on Delivery.',
    type: 'website',
  },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}