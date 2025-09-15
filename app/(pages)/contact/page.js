import ContactPageClient from './ContactPageClient';

// Server-side data and configuration
const getContactData = () => {
  return {
    title: "Contact Us",
    subtitle: "Have questions about our products? Need help with your order? We're here to help! Reach out to us and we'll get back to you as soon as possible.",
    description: "Whether you're looking for product information, need assistance with an order, or want styling advice, our team is ready to help. We pride ourselves on excellent customer service and quick response times.",
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
        description: "Mon-Fri from 8am to 5pm"
      },
      {
        iconName: "MapPin",
        label: "Visit Us",
        value: "123 Fashion Street",
        description: "New York, NY 10001"
      }
    ],
    businessHours: [
      { days: "Monday - Friday", hours: "8:00 AM - 6:00 PM" },
      { days: "Saturday", hours: "9:00 AM - 4:00 PM" },
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
      },
      { 
        iconName: "Linkedin",
        url: "https://linkedin.com/company/nabaali"
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
      ],
      submitEndpoint: "/api/contact",
      successMessage: "Thank you for your message! We'll get back to you within 24 hours.",
      errorMessage: "Sorry, there was an error sending your message. Please try again."
    },
    seoData: {
      title: "Contact Us - NABA ALI | Premium Fashion",
      description: "Get in touch with NABA ALI for any questions about our premium fashion collection. We're here to help with orders, returns, and styling advice.",
      keywords: "contact, customer service, fashion help, NABA ALI support"
    }
  };
};

// Metadata for SEO (Server-side)
export async function generateMetadata() {
  const contactData = getContactData();
  
  return {
    title: contactData.seoData.title,
    description: contactData.seoData.description,
    keywords: contactData.seoData.keywords,
    openGraph: {
      title: contactData.seoData.title,
      description: contactData.seoData.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: contactData.seoData.title,
      description: contactData.seoData.description,
    }
  };
}

export default function ContactPage() {
  // Server-side data fetching
  const contactData = getContactData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <ContactPageClient contactData={contactData} />
    </main>
  );
}
