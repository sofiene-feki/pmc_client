import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    twitterHandle = "@pmcluxembourg"
}) => {
    const siteName = "PMC Luxembourg";
    const fullTitle = title ? `${title} | ${siteName}` : siteName;
    const defaultDescription = "PMC Luxembourg - L'excellence de la signalisation et des plaques d'immatriculation personnalisées au Luxembourg.";

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            {keywords && <meta name="keywords" content={keywords} />}

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:title" content={ogTitle || fullTitle} />
            <meta property="og:description" content={ogDescription || description || defaultDescription} />
            {ogImage && <meta property="og:image" content={ogImage} />}
            {ogUrl && <meta property="og:url" content={ogUrl} />}
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={ogTitle || fullTitle} />
            <meta name="twitter:description" content={ogDescription || description || defaultDescription} />
            {ogImage && <meta name="twitter:image" content={ogImage} />}
            {twitterHandle && <meta name="twitter:site" content={twitterHandle} />}

            {/* Canonical Link */}
            {ogUrl && <link rel="canonical" href={ogUrl} />}
        </Helmet>
    );
};

export default SEO;
