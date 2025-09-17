import AboutPageClient from './AboutPageClient';

// Metadata for SEO
export const metadata = {
  title: "About Us - NABA ALI | Premium Fashion Brand",
  description: "Discover the story behind NABA ALI and our commitment to premium fashion.",
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
      content: "NABA ALI was founded in 2018 with a vision to create premium fashion that's accessible to everyone. We believe that quality clothing should empower confidence and self-expression.",
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
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b17c?w=400&h=400&fit=crop&auto=format"
        },
        {
          name: "Michael Chen", 
          role: "Head Designer",
          bio: "Creating innovative designs that define modern fashion trends.",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format"
        },
        {
          name: "Emily Davis",
          role: "Creative Director", 
          bio: "Bringing creative excellence to every fashion collection.",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format"
        }
      ]
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <AboutPageClient aboutData={aboutData} />
    </main>
  );
}
