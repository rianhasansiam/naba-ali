import Script from 'next/script'

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "NABA ALI",
    "url": "https://nabaali.com",
    "logo": "https://nabaali.com/logo.png",
    "description": "Premium fashion store offering quality clothing and accessories for everyone.",
    "sameAs": [
      "https://facebook.com/nabaali",
      "https://twitter.com/nabaali", 
      "https://instagram.com/nabaali"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Fashion Street",
      "addressLocality": "New York",
      "addressRegion": "NY",
      "postalCode": "10001",
      "addressCountry": "US"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service",
      "email": "contact@nabaali.com"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "NABA ALI Fashion Collection",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Premium Fashion Collection",
            "category": "Clothing"
          }
        }
      ]
    }
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}