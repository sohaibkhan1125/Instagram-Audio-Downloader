import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ 
  title = "Instagram Audio Downloader - Download M4A Audio from Instagram Posts & Reels",
  description = "Download high-quality M4A audio from any Instagram post or reel instantly. Free, fast, and secure Instagram audio downloader. No registration required.",
  keywords = "instagram audio downloader, download instagram audio, instagram reel audio, instagram post audio, m4a downloader, instagram music downloader, free audio downloader, instagram audio extractor",
  image = "/og-image.png",
  url = "https://instaaudio.com"
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
