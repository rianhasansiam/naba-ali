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
    address: "Paduar Bazar Bishwa Road Cumilla, Bangladesh",
    contactMethods: [
      {
        iconName: "Mail",
        label: "Email Us",
        value: "engnazrulislam2025@gmail.com",
        description: "We'll respond within 24 hours"
      },
      {
        iconName: "Phone",
        label: "Call Us",
        value: "+965 6577 8584",
        description: "Mon-Fri "
      },
      {
        iconName: "MapPin",
        label: "Visit Us",
        value: "Paduar Bazar Bishwa Road Cumilla",
        description: "Cumilla, Bangladesh"
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
        url: "https://www.facebook.com/profile.php?id=61580873192277&rdid=kWv2f0UwQSaKnsOq&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1TT28ZZv4Q%2F#"
      },
      { 
        iconName: "Whatsapp",
        url: "https://wa.me/qr/XIGA4XU3GM37K1"
      },
      { 
        iconName: "Instagram",
        url: "https://www.instagram.com/eng_nazrulislam"
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
