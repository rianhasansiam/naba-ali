'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Scale, 
  FileText, 
  Clock, 
  CreditCard, 
  Truck, 
  UserCheck, 
  AlertTriangle,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const TermsPageClient = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: UserCheck,
      content: [
        'By accessing and using the NABA ALI website and services, you accept and agree to be bound by the terms and provision of this agreement.',
        'If you do not agree to abide by the above, please do not use this service.',
        'These terms constitute a legally binding agreement between you and NABA ALI.'
      ]
    },
    {
      id: 'definitions',
      title: 'Definitions',
      icon: FileText,
      content: [
        '"We", "us", "our" refers to NABA ALI and its affiliates.',
        '"You", "your" refers to the user or customer accessing our services.',
        '"Products" refers to all items available for purchase on our platform.',
        '"Services" refers to all services provided through our website and platform.'
      ]
    },
    {
      id: 'account',
      title: 'User Accounts',
      icon: Shield,
      content: [
        'You must create an account to make purchases and access certain features.',
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to provide accurate, current, and complete information during registration.',
        'You must notify us immediately of any unauthorized use of your account.',
        'We reserve the right to suspend or terminate accounts that violate these terms.'
      ]
    },
    {
      id: 'orders',
      title: 'Orders and Purchases',
      icon: CreditCard,
      content: [
        'All orders are subject to acceptance by NABA ALI.',
        'We reserve the right to refuse or cancel any order for any reason.',
        'Prices are subject to change without notice until order confirmation.',
        'Payment must be received before order processing begins.',
        'Order confirmation does not guarantee product availability.'
      ]
    },
    {
      id: 'shipping',
      title: 'Shipping and Delivery',
      icon: Truck,
      content: [
        'Shipping costs and delivery times vary by location and shipping method.',
        'We are not responsible for delays caused by shipping carriers.',
        'Risk of loss and title for products pass to you upon delivery.',
        'You must inspect packages upon delivery and report any damage immediately.',
        'Delivery attempts are made during regular business hours.'
      ]
    },
    {
      id: 'returns',
      title: 'Returns and Exchanges',
      icon: Clock,
      content: [
        'Returns must be initiated within 30 days of purchase.',
        'Items must be in original condition with tags attached.',
        'Custom or personalized items cannot be returned unless defective.',
        'Return shipping costs are the responsibility of the customer unless the item is defective.',
        'Refunds will be processed within 5-10 business days after we receive the returned item.'
      ]
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: Scale,
      content: [
        'All content on this website is the property of NABA ALI or its licensors.',
        'You may not reproduce, distribute, or create derivative works without permission.',
        'Product names, logos, and brands are trademarks of their respective owners.',
        'Unauthorized use of our intellectual property may result in legal action.'
      ]
    },
    {
      id: 'prohibited-use',
      title: 'Prohibited Uses',
      icon: AlertTriangle,
      content: [
        'You may not use our service for any illegal or unauthorized purpose.',
        'You may not violate any laws in your jurisdiction when using our service.',
        'You may not transmit malicious code, viruses, or any harmful content.',
        'You may not attempt to gain unauthorized access to our systems.',
        'Commercial use of our content without permission is prohibited.'
      ]
    },
    {
      id: 'limitation',
      title: 'Limitation of Liability',
      icon: Shield,
      content: [
        'NABA ALI shall not be liable for any indirect, incidental, or consequential damages.',
        'Our total liability shall not exceed the amount paid by you for the specific product or service.',
        'We do not warrant that our service will be uninterrupted or error-free.',
        'Some jurisdictions do not allow the exclusion of certain warranties or limitations of liability.'
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: Shield,
      content: [
        'Your privacy is important to us. Please review our Privacy Policy.',
        'We collect and use your information as described in our Privacy Policy.',
        'We implement appropriate security measures to protect your information.',
        'We do not sell or rent your personal information to third parties.'
      ]
    },
    {
      id: 'modifications',
      title: 'Modifications to Terms',
      icon: FileText,
      content: [
        'We reserve the right to modify these terms at any time.',
        'Changes will be effective immediately upon posting on this page.',
        'Your continued use of our service constitutes acceptance of modified terms.',
        'We encourage you to review these terms periodically.'
      ]
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: Mail,
      content: [
        'If you have any questions about these Terms and Conditions, please contact us:',
        'Email: legal@nabaali.com',
        'Phone: +1 (555) 123-4567',
        'Address: 123 Fashion Street, Style City, SC 12345'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms and Conditions
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Please read these terms and conditions carefully before using our services.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.content.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-12 bg-gray-900 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Need Help?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            If you have any questions about these terms and conditions, 
            please don&apos;t hesitate to contact our customer support team.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-white">
              <Mail className="w-5 h-5" />
              <span className="text-sm">legal@nabaali.com</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white">
              <Phone className="w-5 h-5" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">Support Center</span>
            </div>
          </div>
        </motion.div>

        {/* Back to Top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            Back to Top
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPageClient;