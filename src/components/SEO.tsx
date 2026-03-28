import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  keywords?: string;
  // Fallbacks if not provided
}

export default function SEO({
  title = "Neoplatron - Advanced Fuel Efficiency Solutions",
  description = "Neoplatron offers revolutionary ADPT technology to increase vehicle mileage, reduce emissions, and optimize fuel efficiency for bikes, cars, trucks, and heavy machinery.",
  canonical,
  keywords = "fuel efficiency, increase mileage, Neoplatron, hydrogen fuel kit India, ADPT technology, reduce vehicle emissions, better fuel economy, mileage enhancer, green mobility",
}: SEOProps) {
  const currentUrl = canonical ? canonical : window.location.href;
  const canonicalUrl = currentUrl.startsWith('http') ? currentUrl : `https://neoplatron.com${currentUrl}`;

  // Organization structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://neoplatron.com",
    "name": "NEOPLATRON India Private Limited",
    "logo": "https://neoplatron.com/logo.png",
    "description": "Leading the world towards a net zero-emission future powered by innovation, technology, and responsibility using Advanced Digital Plasma Technology (ADPT).",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-1234567890", // Placeholder if we don't have the exact phone
      "contactType": "Customer Service"
    }
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* Default OG Image if you have one - assuming a logo or primary banner */}
      <meta property="og:image" content="https://neoplatron.com/logo.png" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content="https://neoplatron.com/logo.png" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
}
