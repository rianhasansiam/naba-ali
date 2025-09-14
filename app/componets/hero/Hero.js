import React from 'react';
import HeroClient from './HeroClient';

const Hero = () => {
  // Hero content data
  const heroData = {
    title: "Discover",
    subtitle: "Premium",
    mainTitle: "Fashion",
    description: "Elevate your style with our curated collection of luxury items. Quality, comfort, and sophistication in every piece.",
    stats: [
      { number: "500+", label: "Premium Products" },
      { number: "50K+", label: "Happy Customers" },
      { number: "99%", label: "Satisfaction Rate" }
    ],
    productName: "Premium Products",
    productPrice: "$100",
    productEmoji: "👟"
  };

  return (
    <HeroClient 
      title={heroData.title}
      subtitle={heroData.subtitle}
      mainTitle={heroData.mainTitle}
      description={heroData.description}
      stats={heroData.stats}
      productName={heroData.productName}
      productPrice={heroData.productPrice}
      productEmoji={heroData.productEmoji}
    />
  );
};

export default Hero;
