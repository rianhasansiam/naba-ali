import ContactPageClient from './ContactPageClient';

// Metadata for SEO
export const metadata = {
  title: "Contact Us - SkyZonee | Customer Support & Help",
  description: "Get in touch with SkyZonee for questions about our premium fashion collections. Email, phone, and visit us in New York.",
  keywords: "contact SkyZonee, customer support, fashion help, customer service, contact information",
  openGraph: {
    title: "Contact Us - SkyZonee | Customer Support",
    description: "Get in touch with SkyZonee for any questions about our premium fashion collections.",
    type: "website",
  },
  alternates: {
    canonical: '/contact',
  },
};

// Simple contact page
export default function ContactPage() {
  // Contact information (this is server-side data)
  const contactData = {
    title: "Contact Us",
    subtitle: "Have questions? We're here to help!",
    description: "Get in touch with us for any questions about our products or services.",
    address: "123 Fashion Street, New York, NY 10001",
    contactMethods: [
      {
        iconName: "Mail",
        label: "Email Us",
        value: "contact@nabaali.com",
        description: "We'll respond within 24 hours"
      },
      {
        iconName: "Phone",
        label: "Call Us",
        value: "+1 (555) 123-4567",
        description: "Mon-Fri from 9am to 6pm"
      },
      {
        iconName: "MapPin",
        label: "Visit Us",
        value: "123 Fashion Street",
        description: "New York, NY 10001"
      }
    ],
    businessHours: [
      { days: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
      { days: "Saturday", hours: "10:00 AM - 4:00 PM" },
      { days: "Sunday", hours: "Closed" }
    ],
    socialLinks: [
      { 
        iconName: "Facebook",
        url: "https://facebook.com/nabaali"
      },
      { 
        iconName: "Twitter",
        url: "https://twitter.com/nabaali"
      },
      { 
        iconName: "Instagram",
        url: "https://instagram.com/nabaali"
      }
    ],
    formConfig: {
      fields: [
        {
          name: "name",
          label: "Full Name",
          type: "text",
          required: true,
          placeholder: "Enter your full name"
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          placeholder: "Enter your email address"
        },
        {
          name: "subject",
          label: "Subject",
          type: "text",
          required: true,
          placeholder: "What is this regarding?"
        },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          required: true,
          placeholder: "Tell us how we can help you...",
          rows: 6
        }
      ]
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <ContactPageClient contactData={contactData} />
    </main>
  );
}
