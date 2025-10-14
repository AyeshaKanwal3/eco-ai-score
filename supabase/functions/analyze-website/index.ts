import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url, track, name } = await req.json();
    console.log(`Analyzing ${url} for ${name} - Track: ${track}`);

    // Fetch website HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'ReimagineWeb-Bot/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch website: ${response.statusText}`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    // Run analyses based on track
    const results: any = {
      name,
      url,
      seo: { score: 0, details: {} },
      geo: { score: 0, details: {} },
      compatibility: { score: 0, details: {} },
      eco: { score: 0, details: {} },
      ux: { score: 0, details: {} },
    };

    if (track === 'all' || track === 'seo') {
      results.seo = analyzeSEO(doc, html);
    }

    if (track === 'all' || track === 'geo') {
      results.geo = analyzeGEO(doc, html);
    }

    if (track === 'all' || track === 'compatibility') {
      results.compatibility = analyzeCompatibility(html);
    }

    if (track === 'all' || track === 'eco') {
      results.eco = analyzeEco(html);
    }

    if (track === 'all' || track === 'ux') {
      results.ux = analyzeUX(doc, html);
    }

    console.log('Analysis complete:', results);

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Analysis failed' 
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function analyzeSEO(doc: any, html: string) {
  let score = 0;
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check title
  const title = doc.querySelector('title')?.textContent;
  if (title) {
    score += 20;
    if (title.length < 60 && title.length > 30) {
      score += 10;
    } else if (title.length >= 60) {
      suggestions.push('Title tag is too long. Keep it under 60 characters for optimal display in search results.');
    } else {
      suggestions.push('Title tag is too short. Aim for 30-60 characters to provide context.');
    }
  } else {
    issues.push('Missing title tag');
    suggestions.push('Add a descriptive title tag (30-60 characters) with primary keywords');
  }

  // Check meta description
  const metaDesc = doc.querySelector('meta[name="description"]');
  const descContent = metaDesc?.getAttribute('content');
  if (descContent) {
    score += 20;
    if (descContent.length < 150 || descContent.length > 160) {
      suggestions.push('Meta description should be 150-160 characters for optimal display');
    }
  } else {
    issues.push('Missing meta description');
    suggestions.push('Add compelling meta description (150-160 characters) to improve CTR');
  }

  // Check H1
  const h1 = doc.querySelector('h1');
  if (h1) {
    score += 20;
    const h1Count = doc.querySelectorAll('h1').length;
    if (h1Count > 1) {
      issues.push(`Multiple H1 tags found (${h1Count}). Use only one H1 per page`);
    }
  } else {
    issues.push('Missing H1 heading');
    suggestions.push('Add a single, descriptive H1 heading that includes your primary keyword');
  }

  // Check structured data
  if (html.includes('application/ld+json')) {
    score += 15;
  } else {
    suggestions.push('Add structured data (JSON-LD) to enhance search result appearance');
  }

  // Check text content
  const textContent = doc.body?.textContent || '';
  if (textContent.length > 300) {
    score += 15;
    if (textContent.length < 600) {
      suggestions.push('Consider adding more content (600+ words) for better depth');
    }
  } else {
    suggestions.push('Add substantial text content (300+ words minimum, 600+ recommended)');
  }

  // Check for alt attributes on images
  const images = doc.querySelectorAll('img');
  const imagesWithoutAlt = Array.from(images).filter((img: any) => !img.getAttribute('alt'));
  if (imagesWithoutAlt.length > 0) {
    suggestions.push(`${imagesWithoutAlt.length} images are missing alt text for accessibility and SEO`);
  }

  return {
    score: Math.min(100, score),
    details: {
      summary: issues.length > 0 ? issues.join(', ') : 'Strong SEO foundation with proper metadata and structure',
      issues,
      suggestions,
      title: title || 'Not found',
      hasMetaDesc: !!metaDesc,
      hasH1: !!h1,
    }
  };
}

function analyzeGEO(doc: any, html: string) {
  let score = 50; // Base score
  const visibility: any = {
    chatgpt: 'Unknown',
    gemini: 'Unknown',
    copilot: 'Unknown',
    perplexity: 'Unknown',
  };

  const suggestions: string[] = [];

  // Check for structured content
  const hasStructuredContent = html.includes('<article') || html.includes('<section');
  const hasSemanticHTML = html.includes('<header') && html.includes('<main');
  const hasOpenGraph = html.includes('og:title') || html.includes('og:description');
  const hasJsonLd = html.includes('application/ld+json');
  const hasMicrodata = html.includes('itemscope') || html.includes('itemprop');

  if (hasStructuredContent) {
    score += 15;
    visibility.chatgpt = 'Likely Visible';
  } else {
    suggestions.push('Use semantic HTML5 elements (article, section, aside) for better AI understanding');
  }

  if (hasSemanticHTML) {
    score += 15;
    visibility.gemini = 'Likely Visible';
  } else {
    suggestions.push('Add semantic HTML structure with header, main, nav, footer elements');
  }

  if (hasOpenGraph) {
    score += 10;
    visibility.copilot = 'Likely Visible';
  } else {
    suggestions.push('Include Open Graph meta tags for better social and AI visibility');
  }

  if (hasJsonLd || hasMicrodata) {
    score += 10;
    visibility.perplexity = 'Likely Visible';
    suggestions.push('Great! Structured data helps AI models understand your content');
  } else {
    suggestions.push('Add JSON-LD structured data (Schema.org) for enhanced AI discoverability');
  }

  return {
    score: Math.min(100, score),
    details: {
      summary: score >= 70 ? 'Good AI visibility signals detected' : 'Limited AI optimization - improvements needed',
      visibility,
      suggestions
    }
  };
}

function analyzeCompatibility(html: string) {
  let score = 60; // Base score
  const issues: string[] = [];

  // Check for responsive meta tag
  if (html.includes('viewport')) {
    score += 15;
  } else {
    issues.push('Missing viewport meta tag');
  }

  // Check for modern HTML5 doctype
  if (html.toLowerCase().includes('<!doctype html>')) {
    score += 15;
  }

  // Check for inline styles (performance impact)
  const inlineStyleCount = (html.match(/style="/g) || []).length;
  if (inlineStyleCount < 10) {
    score += 10;
  } else {
    issues.push(`High inline style usage (${inlineStyleCount})`);
  }

  return {
    score: Math.min(100, score),
    details: {
      summary: issues.length > 0 ? issues.join(', ') : 'Good browser compatibility',
      issues,
      suggestions: [
        'Test across multiple browsers',
        'Use progressive enhancement',
        'Minimize inline styles',
      ]
    }
  };
}

function analyzeEco(html: string) {
  let score = 50; // Base score
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Calculate approximate page weight
  const pageSize = new TextEncoder().encode(html).length;
  const pageSizeKB = pageSize / 1024;

  if (pageSizeKB < 500) {
    score += 30;
  } else if (pageSizeKB < 1000) {
    score += 15;
    suggestions.push('Page size is moderate. Consider further optimization for better eco-friendliness');
  } else {
    issues.push(`Large page size: ${pageSizeKB.toFixed(2)} KB`);
    suggestions.push('Reduce page size by optimizing assets and removing unnecessary code');
  }

  // Count images
  const imageCount = (html.match(/<img/g) || []).length;
  if (imageCount < 10) {
    score += 10;
  } else if (imageCount < 20) {
    score += 5;
    suggestions.push('Moderate image count. Implement lazy loading for better performance');
  } else {
    issues.push(`High image count: ${imageCount}`);
    suggestions.push('Use lazy loading, WebP format, and consider image sprites');
  }

  // Count scripts
  const scriptCount = (html.match(/<script/g) || []).length;
  if (scriptCount < 5) {
    score += 10;
  } else if (scriptCount < 10) {
    score += 5;
  } else {
    issues.push(`High script count: ${scriptCount}`);
    suggestions.push('Bundle and minify JavaScript, defer non-critical scripts');
  }

  // Check for WebP usage
  const hasWebP = html.includes('.webp');
  if (hasWebP) {
    score += 5;
  } else {
    suggestions.push('Use WebP format for images to reduce file size by 25-35%');
  }

  // Estimate CO2
  const co2Estimate = (pageSizeKB * 0.0002).toFixed(4);

  return {
    score: Math.min(100, score),
    details: {
      summary: score >= 70 
        ? `Eco-friendly page: ${pageSizeKB.toFixed(2)} KB, ${co2Estimate}g CO₂`
        : `Page needs optimization: ${pageSizeKB.toFixed(2)} KB, ${co2Estimate}g CO₂`,
      pageSize: pageSizeKB,
      co2Estimate,
      issues,
      suggestions: [
        ...suggestions,
        'Enable gzip/brotli compression on server',
        'Use a CDN to reduce transfer distance',
        'Implement efficient caching strategies'
      ].slice(0, 5)
    }
  };
}

function analyzeUX(doc: any, html: string) {
  let score = 50; // Base score
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check heading hierarchy
  const h1Count = (html.match(/<h1/g) || []).length;
  const h2Count = (html.match(/<h2/g) || []).length;
  const h3Count = (html.match(/<h3/g) || []).length;
  
  if (h1Count === 1) {
    score += 15;
  } else if (h1Count === 0) {
    issues.push('Missing H1 heading');
    suggestions.push('Add exactly one H1 heading per page for proper hierarchy');
  } else {
    issues.push(`Multiple H1 headings found: ${h1Count} (should be 1)`);
    suggestions.push('Use only one H1 per page, use H2-H6 for subsections');
  }

  if (h2Count > 0) {
    score += 10;
    if (h3Count > 0) {
      score += 5;
    }
  } else {
    suggestions.push('Add H2 and H3 headings to create proper content hierarchy');
  }

  // Check for alt text on images
  const imagesWithoutAlt = doc.querySelectorAll('img:not([alt])');
  const imageCount = doc.querySelectorAll('img').length;
  if (imagesWithoutAlt?.length === 0 && imageCount > 0) {
    score += 15;
  } else if (imagesWithoutAlt?.length > 0) {
    issues.push(`${imagesWithoutAlt?.length} images missing alt text`);
    suggestions.push('Add descriptive alt text to all images for accessibility and SEO');
  }

  // Check for form labels
  const forms = doc.querySelectorAll('form');
  const inputs = doc.querySelectorAll('input');
  const labels = doc.querySelectorAll('label');
  if (forms?.length > 0) {
    if (labels?.length >= inputs?.length) {
      score += 10;
    } else {
      issues.push('Some form inputs are missing labels');
      suggestions.push('Associate every input with a label for better accessibility');
    }
  }

  // Check for ARIA attributes
  const hasAriaLabels = html.includes('aria-label') || html.includes('aria-labelledby');
  if (hasAriaLabels) {
    score += 5;
  } else {
    suggestions.push('Consider adding ARIA attributes for improved accessibility');
  }

  return {
    score: Math.min(100, score),
    details: {
      summary: issues.length > 0 
        ? issues.slice(0, 2).join('; ')
        : 'Good UX structure with proper hierarchy and accessibility',
      issues,
      suggestions: [
        ...suggestions,
        'Ensure sufficient color contrast (WCAG AA standard)',
        'Make interactive elements easily tappable (min 44×44px)',
        'Use consistent navigation across pages'
      ].slice(0, 5)
    }
  };
}
