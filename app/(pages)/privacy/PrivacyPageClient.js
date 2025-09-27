'use client';

import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Settings, 
  UserCheck, 
  Cookie, 
  Globe,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  FileText,
  Users,
  CreditCard,
  Smartphone
} from 'lucide-react';

const PrivacyPageClient = () => {
  const sections = [
    {
      id: 'overview',
      title: 'Privacy Policy Overview',
      icon: Shield,
      content: [
        'At SkyZonee, we are committed to protecting your privacy and ensuring the security of your personal information.',
        'This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.',
        'By using our services, you agree to the collection and use of information in accordance with this policy.',
        'We encourage you to read this policy carefully and contact us if you have any questions.'
      ]
    },
    {
      id: 'information-collected',
      title: 'Information We Collect',
      icon: Database,
      content: [
        'Personal Information: Name, email address, phone number, shipping and billing addresses.',
        'Payment Information: Credit card details, billing information (processed securely through third-party payment processors).',
        'Account Information: Username, password, purchase history, wishlist items.',
        'Technical Information: IP address, browser type, device information, operating system.',
        'Usage Data: Pages visited, time spent on site, click patterns, referral sources.'
      ]
    },
    {
      id: 'how-we-collect',
      title: 'How We Collect Information',
      icon: Settings,
      content: [
        'Directly from you when you create an account, make a purchase, or contact us.',
        'Automatically through cookies and similar technologies when you browse our website.',
        'From third parties such as social media platforms when you connect your accounts.',
        'Through analytics tools that help us understand website usage and performance.',
        'From customer service interactions and feedback surveys.'
      ]
    },
    {
      id: 'how-we-use',
      title: 'How We Use Your Information',
      icon: UserCheck,
      content: [
        'Process and fulfill your orders, including shipping and customer service.',
        'Communicate with you about your orders, account, and promotional offers.',
        'Improve our website, products, and services based on your feedback and usage patterns.',
        'Personalize your shopping experience and provide relevant product recommendations.',
        'Prevent fraud, protect against security threats, and maintain the safety of our platform.',
        'Comply with legal obligations and enforce our terms and conditions.'
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing and Disclosure',
      icon: Users,
      content: [
        'Service Providers: We share information with trusted third-party service providers who assist in operating our business.',
        'Payment Processors: Payment information is shared with secure payment processing companies.',
        'Shipping Partners: We share delivery information with shipping and logistics partners.',
        'Legal Requirements: We may disclose information when required by law or to protect our rights.',
        'Business Transfers: Information may be transferred in connection with mergers, acquisitions, or asset sales.',
        'We do not sell, trade, or rent your personal information to third parties for marketing purposes.'
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        'We implement industry-standard security measures to protect your personal information.',
        'All sensitive data is encrypted during transmission using SSL/TLS technology.',
        'Payment information is processed through PCI DSS compliant payment processors.',
        'Regular security audits and updates are conducted to maintain system integrity.',
        'Access to personal information is restricted to authorized personnel only.',
        'However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.'
      ]
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      icon: Cookie,
      content: [
        'Essential Cookies: Required for basic website functionality and security.',
        'Performance Cookies: Help us analyze website usage and improve performance.',
        'Functionality Cookies: Remember your preferences and provide personalized features.',
        'Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness.',
        'You can control cookie settings through your browser, but this may affect website functionality.',
        'We also use web beacons, pixel tags, and similar technologies for analytics and marketing purposes.'
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      icon: Eye,
      content: [
        'Access: You can request access to the personal information we hold about you.',
        'Correction: You can request correction of inaccurate or incomplete personal information.',
        'Deletion: You can request deletion of your personal information, subject to certain limitations.',
        'Portability: You can request a copy of your data in a structured, machine-readable format.',
        'Opt-out: You can opt-out of marketing communications at any time.',
        'Account Control: You can update your account information and privacy preferences through your account settings.'
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: FileText,
      content: [
        'We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy.',
        'Account information is retained while your account remains active and for a reasonable period after closure.',
        'Transaction records are kept for accounting, tax, and legal compliance purposes.',
        'Marketing information is retained until you opt-out or we determine it is no longer needed.',
        'Some information may be retained longer if required by law or for legitimate business interests.'
      ]
    },
    {
      id: 'third-party-links',
      title: 'Third-Party Links and Services',
      icon: Globe,
      content: [
        'Our website may contain links to third-party websites and services.',
        'We are not responsible for the privacy practices of these third parties.',
        'We encourage you to read the privacy policies of any third-party sites you visit.',
        'Third-party plugins and integrations may collect information according to their own policies.',
        'Social media features may collect information about your interaction with these features.'
      ]
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: Smartphone,
      content: [
        'Your information may be processed and stored in countries other than your residence.',
        'We ensure appropriate safeguards are in place for international data transfers.',
        'We comply with applicable data protection laws regarding cross-border transfers.',
        'Standard contractual clauses and adequacy decisions are used where required.',
        'Your consent to this privacy policy includes consent to such transfers.'
      ]
    },
    {
      id: 'childrens-privacy',
      title: 'Children\'s Privacy',
      icon: AlertTriangle,
      content: [
        'Our services are not intended for children under 13 years of age.',
        'We do not knowingly collect personal information from children under 13.',
        'If you are a parent or guardian and believe your child has provided us with personal information, please contact us.',
        'We will take steps to remove such information from our systems.',
        'Users between 13 and 18 should have parental consent before using our services.'
      ]
    },
    {
      id: 'policy-updates',
      title: 'Policy Updates',
      icon: Settings,
      content: [
        'We may update this Privacy Policy from time to time to reflect changes in our practices.',
        'Material changes will be communicated through email or prominent website notices.',
        'The "Last Updated" date will be revised to reflect when changes were made.',
        'Your continued use of our services after changes constitutes acceptance of the updated policy.',
        'We encourage you to review this policy periodically.'
      ]
    },
    {
      id: 'contact-us',
      title: 'Contact Us About Privacy',
      icon: Mail,
      content: [
        'If you have questions about this Privacy Policy or our data practices, please contact us:',
        'Privacy Officer: privacy@nabaali.com',
        'General Inquiries: support@nabaali.com',
        'Phone: +1 (555) 123-4567',
        'Address: 123 Fashion Street, Style City, SC 12345',
        'We will respond to your inquiries within a reasonable timeframe.'
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
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your personal information.
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
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white"
        >
          <h3 className="text-2xl font-bold mb-4">
            Manage Your Privacy
          </h3>
          <p className="mb-6 max-w-2xl mx-auto opacity-90">
            Take control of your personal information and privacy settings.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all">
              <Settings className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Privacy Settings</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all">
              <Eye className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">View My Data</span>
            </button>
            <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-4 transition-all">
              <Mail className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Contact Privacy Team</span>
            </button>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-12 bg-gray-900 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Privacy Questions?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Our privacy team is here to help you understand and manage your personal information.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center space-x-2 text-white">
              <Mail className="w-5 h-5" />
              <span className="text-sm">privacy@nabaali.com</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white">
              <Phone className="w-5 h-5" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-white">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">Privacy Office</span>
            </div>
          </div>
        </motion.div>

        {/* Back to Top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Shield className="w-5 h-5 mr-2" />
            Back to Top
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPageClient;