import AboutPageClient from './AboutPageClient';

// Server-side data and configuration
const getAboutData = () => {
  return {
    seoData: {
      title: "About Us - NABA ALI | Premium Fashion Brand",
      description: "Discover the story behind NABA ALI, our commitment to premium fashion, and the team that brings exceptional style to life. Learn about our journey in the fashion industry.",
      keywords: "about naba ali, fashion brand story, premium clothing, fashion team, company history"
    },
    hero: {
      title: "About NABA ALI",
      subtitle: "Crafting Premium Fashion Since 2018",
      description: "Where elegance meets innovation, and every piece tells a story of exceptional craftsmanship and timeless style.",
      backgroundImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    },
    story: {
      title: "Our Story",
      subtitle: "A Journey of Passion & Excellence",
      content: [
        "NABA ALI was born from a simple yet powerful vision: to create fashion that empowers individuals to express their unique style with confidence. Founded in 2018 by visionary designers who believed that premium fashion should be accessible without compromising on quality or ethics.",
        "What started as a small boutique studio has grown into a globally recognized brand, known for our meticulous attention to detail, sustainable practices, and commitment to empowering our customers through exceptional fashion experiences.",
        "Every piece in our collection is carefully curated and crafted with the finest materials, ensuring that when you wear NABA ALI, you're not just wearing clothing – you're wearing a piece of art that reflects your personality and values."
      ],
      image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    },
    mission: {
      title: "Our Mission & Values",
      subtitle: "What Drives Us Forward",
      values: [
        {
          iconName: "Heart",
          title: "Passion for Excellence",
          description: "We pour our heart into every design, ensuring each piece meets our highest standards of quality and style."
        },
        {
          iconName: "Leaf",
          title: "Sustainable Fashion",
          description: "Committed to ethical practices and environmental responsibility in every aspect of our production process."
        },
        {
          iconName: "Users",
          title: "Customer Empowerment",
          description: "We believe fashion should empower confidence and self-expression for every individual who wears our pieces."
        },
        {
          iconName: "Award",
          title: "Uncompromising Quality",
          description: "Using only premium materials and expert craftsmanship to create fashion that stands the test of time."
        },
        {
          iconName: "Globe",
          title: "Global Accessibility",
          description: "Making premium fashion accessible to style enthusiasts around the world through innovative design and fair pricing."
        },
        {
          iconName: "Sparkles",
          title: "Innovation & Creativity",
          description: "Constantly pushing boundaries in design and technology to bring you the latest in fashion innovation."
        }
      ]
    },
    team: {
      title: "Meet Our Team",
      subtitle: "The Creative Minds Behind NABA ALI",
      members: [
        {
          name: "Naba Ali",
          role: "Founder & Creative Director",
          bio: "With over 15 years in fashion design, Naba brings vision and passion to every collection, ensuring NABA ALI remains at the forefront of contemporary fashion.",
          image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=988&q=80",
          social: {
            linkedin: "https://linkedin.com/in/nabaali",
            instagram: "https://instagram.com/nabaali.fashion"
          }
        },
        {
          name: "Sarah Johnson",
          role: "Head of Design",
          bio: "Sarah leads our design team with creativity and precision, translating trends into timeless pieces that resonate with our customers' lifestyle.",
          image: "https://images.unsplash.com/photo-1594736797933-d0d9e7a7b837?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
          social: {
            linkedin: "https://linkedin.com/in/sarahjohnson",
            instagram: "https://instagram.com/sarah.designs"
          }
        },
        {
          name: "Michael Chen",
          role: "Head of Operations",
          bio: "Michael ensures our operations run smoothly, from sourcing the finest materials to delivering exceptional customer experiences worldwide.",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
          social: {
            linkedin: "https://linkedin.com/in/michaelchen",
            twitter: "https://twitter.com/mchen_ops"
          }
        },
        {
          name: "Emily Rodriguez",
          role: "Head of Sustainability",
          bio: "Emily champions our commitment to sustainable fashion, ensuring every step of our process respects both people and planet.",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80",
          social: {
            linkedin: "https://linkedin.com/in/emilyrodriguez",
            instagram: "https://instagram.com/emily.sustain"
          }
        }
      ]
    },
    stats: {
      title: "Our Impact",
      subtitle: "Numbers That Matter",
      achievements: [
        {
          number: "50K+",
          label: "Happy Customers",
          description: "Across 25+ countries worldwide"
        },
        {
          number: "500+",
          label: "Unique Designs",
          description: "Carefully crafted collections"
        },
        {
          number: "98%",
          label: "Customer Satisfaction",
          description: "Based on verified reviews"
        },
        {
          number: "5",
          label: "Awards Won",
          description: "Fashion industry recognition"
        },
        {
          number: "100%",
          label: "Sustainable Materials",
          description: "Committed to eco-friendly fashion"
        },
        {
          number: "24/7",
          label: "Customer Support",
          description: "Always here to help you"
        }
      ]
    },
    awards: {
      title: "Recognition & Awards",
      subtitle: "Celebrating Our Achievements",
      awards: [
        {
          year: "2024",
          title: "Best Emerging Fashion Brand",
          organization: "Fashion Week International",
          description: "Recognized for innovative design and sustainable practices"
        },
        {
          year: "2023",
          title: "Sustainable Fashion Award",
          organization: "Green Fashion Council",
          description: "Leading the way in eco-conscious fashion production"
        },
        {
          year: "2023",
          title: "Customer Excellence Award",
          organization: "Retail Excellence Association",
          description: "Outstanding customer service and satisfaction ratings"
        },
        {
          year: "2022",
          title: "Rising Star Designer",
          organization: "Fashion Industry Awards",
          description: "Naba Ali recognized as breakthrough designer of the year"
        },
        {
          year: "2022",
          title: "Innovation in Fashion Tech",
          organization: "Fashion Forward Summit",
          description: "Pioneering use of technology in fashion design process"
        }
      ]
    },
    cta: {
      title: "Join Our Fashion Journey",
      subtitle: "Be Part of Something Beautiful",
      description: "Discover our latest collections and become part of the NABA ALI community. Follow us for style inspiration, behind-the-scenes content, and exclusive updates.",
      buttonText: "Explore Collections",
      buttonLink: "/products"
    }
  };
};

// Metadata for SEO (Server-side)
export async function generateMetadata() {
  const aboutData = getAboutData();
  
  return {
    title: aboutData.seoData.title,
    description: aboutData.seoData.description,
    keywords: aboutData.seoData.keywords,
    openGraph: {
      title: aboutData.seoData.title,
      description: aboutData.seoData.description,
      type: 'website',
      images: [
        {
          url: aboutData.hero.backgroundImage,
          width: 1200,
          height: 630,
          alt: 'NABA ALI Fashion Brand'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: aboutData.seoData.title,
      description: aboutData.seoData.description,
      images: [aboutData.hero.backgroundImage]
    }
  };
}

export default function AboutPage() {
  // Server-side data fetching
  const aboutData = getAboutData();

  return (
    <main className="min-h-screen">
      <AboutPageClient aboutData={aboutData} />
    </main>
  );
}
