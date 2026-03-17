export default function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: "jmfolio",
    description: "",
    url: "https://yourdomain.com",
    telephone: "+1-234-567-8900",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 Beach Road",
      addressLocality: "Your City",
      addressRegion: "Your State",
      postalCode: "00000",
      addressCountry: "US",
    },
    image: "https://yourdomain.com/images/og-cover.jpg",
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
