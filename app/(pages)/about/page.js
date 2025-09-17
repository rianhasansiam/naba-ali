import AboutPageClient from './AboutPageClient';

// Metadata for SEO
export const metadata = {
  title: "About Us - NABA ALI | Premium Fashion Brand Story",
  description: "Discover the story behind NABA ALI and our commitment to premium fashion. Learn about our journey, values, and team since 2018.",
  keywords: "about NABA ALI, fashion brand story, premium clothing company, fashion team, company history",
  openGraph: {
    title: "About Us - NABA ALI | Premium Fashion Brand",
    description: "Discover the story behind NABA ALI and our commitment to premium fashion.",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
        width: 1200,
        height: 630,
        alt: "NABA ALI About Us"
      }
    ]
  },
  alternates: {
    canonical: '/about',
  },
};

// Simple about page
export default function AboutPage() {
  // Company information (server-side data)
  const aboutData = {
    hero: {
      title: "About NABA ALI",
      subtitle: "Premium Fashion Since 2018",
      description: "We create fashion that empowers individuals to express their unique style with confidence.",
      backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
    },
    
    story: {
      title: "Our Story",
      subtitle: "A Journey of Fashion Excellence",
      content: [
        "NABA ALI was founded in 2018 with a vision to create premium fashion that's accessible to everyone. We believe that quality clothing should empower confidence and self-expression.",
        "Our journey began with a simple idea: fashion should be both beautiful and meaningful. Every piece we create tells a story of craftsmanship, attention to detail, and dedication to excellence.",
        "Today, we continue to push boundaries in fashion while staying true to our core values of quality, sustainability, and customer satisfaction."
      ],
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80"
    },
    
    mission: {
      title: "Our Mission & Values",
      subtitle: "What Drives Us Forward",
      values: [
        {
          iconName: "Heart",
          title: "Quality First",
          description: "We use only the finest materials and expert craftsmanship."
        },
        {
          iconName: "Leaf",
          title: "Sustainable Fashion", 
          description: "Committed to ethical practices and environmental responsibility."
        },
        {
          iconName: "Users",
          title: "Customer Focus",
          description: "Your satisfaction and style are our top priorities."
        }
      ]
    },
    
    team: {
      title: "Meet Our Team",
      subtitle: "The Creative Minds Behind NABA ALI",
      members: [
        {
          name: "Sarah Johnson",
          role: "Founder & CEO",
          bio: "Leading NABA ALI with vision and passion for premium fashion.",
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=400&h=400&fit=crop&auto=format",
          social: {
            linkedin: "https://linkedin.com/in/sarah-johnson",
            twitter: "https://twitter.com/sarah_johnson",
            instagram: "https://instagram.com/sarah.johnson"
          }
        },
        {
          name: "Michael Chen", 
          role: "Head Designer",
          bio: "Creating innovative designs that define modern fashion trends.",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
          social: {
            linkedin: "https://linkedin.com/in/michael-chen",
            twitter: "https://twitter.com/michael_chen",
            instagram: "https://instagram.com/michael.chen"
          }
        },
        {
          name: "Emily Davis",
          role: "Creative Director", 
          bio: "Bringing creative excellence to every fashion collection.",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format",
          social: {
            linkedin: "https://linkedin.com/in/emily-davis",
            twitter: "https://twitter.com/emily_davis",
            instagram: "https://instagram.com/emily.davis"
          }
        }
      ]
    },

    stats: {
      title: "Our Journey in Numbers",
      subtitle: "Milestones that Define Our Success",
      achievements: [
        {
          number: "50K+",
          label: "Happy Customers",
          description: "Satisfied customers worldwide"
        },
        {
          number: "200+",
          label: "Fashion Items",
          description: "Unique pieces in our collection"
        },
        {
          number: "7",
          label: "Years Experience",
          description: "In premium fashion industry"
        },
        {
          number: "25+",
          label: "Countries",
          description: "Global shipping reach"
        }
      ]
    },

    awards: {
      title: "Recognition & Awards",
      subtitle: "Celebrating Excellence in Fashion",
      awards: [
        {
          title: "Best Fashion Brand 2023",
          organization: "Fashion Excellence Awards",
          year: "2023",
          description: "Recognized for outstanding quality and customer service."
        },
        {
          title: "Sustainable Fashion Leader",
          organization: "Eco Fashion Council",
          year: "2022",
          description: "Leading the way in sustainable fashion practices."
        },
        {
          title: "Innovation in Design",
          organization: "Fashion Design Institute",
          year: "2021",
          description: "Awarded for innovative approach to modern fashion."
        }
      ]
    },

    cta: {
      title: "Ready to Experience NABA ALI?",
      subtitle: "Join thousands of satisfied customers who trust our premium fashion",
      buttonText: "Shop Now",
      buttonLink: "/allProducts",
      secondaryButtonText: "Contact Us",
      secondaryButtonLink: "/contact"
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <AboutPageClient aboutData={aboutData} />
    </main>
  );
}
