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
    if (title.length < 60) score += 10;
  } else {
    issues.push('Missing title tag');
    suggestions.push('Add a descriptive title tag (50-60 characters)');
  }

  // Check meta description
  const metaDesc = doc.querySelector('meta[name="description"]');
  if (metaDesc?.getAttribute('content')) {
    score += 20;
  } else {
    issues.push('Missing meta description');
    suggestions.push('Add meta description (150-160 characters)');
  }

  // Check H1
  const h1 = doc.querySelector('h1');
  if (h1) {
    score += 20;
  } else {
    issues.push('Missing H1 heading');
    suggestions.push('Add a single H1 heading per page');
  }

  // Check structured data
  if (html.includes('application/ld+json')) {
    score += 15;
  } else {
    suggestions.push('Consider adding structured data (JSON-LD)');
  }

  // Check text content
  const textContent = doc.body?.textContent || '';
  if (textContent.length > 300) {
    score += 15;
  } else {
    suggestions.push('Add more text content (300+ words recommended)');
  }

  return {
    score: Math.min(100, score),
    details: {
      summary: issues.length > 0 ? issues.join(', ') : 'SEO basics look good!',
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
  };

  // Simulate AI visibility checks based on content structure
  const hasStructuredContent = html.includes('article') || html.includes('section');
  const hasSemanticHTML = html.includes('<header') && html.includes('<main');
  const hasOpenGraph = html.includes('og:title') || html.includes('og:description');

  if (hasStructuredContent) {
    score += 20;
    visibility.chatgpt = 'Likely Visible';
  }

  if (hasSemanticHTML) {
    score += 15;
    visibility.gemini = 'Likely Visible';
  }

  if (hasOpenGraph) {
    score += 15;
    visibility.copilot = 'Likely Visible';
  }

  return {
    score: Math.min(100, score),
    details: {
      summary: 'AI visibility simulated based on content structure',
      visibility,
      suggestions: [
        'Add structured data for better AI understanding',
        'Use semantic HTML elements',
        'Include Open Graph tags',
      ]
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

  // Calculate approximate page weight
  const pageSize = new TextEncoder().encode(html).length;
  const pageSizeKB = pageSize / 1024;

  if (pageSizeKB < 500) {
    score += 30;
  } else if (pageSizeKB < 1000) {
    score += 15;
  } else {
    issues.push(`Large page size: ${pageSizeKB.toFixed(2)} KB`);
  }

  // Count images
  const imageCount = (html.match(/<img/g) || []).length;
  if (imageCount < 10) {
    score += 10;
  } else {
    issues.push(`High image count: ${imageCount}`);
  }

  // Count scripts
  const scriptCount = (html.match(/<script/g) || []).length;
  if (scriptCount < 5) {
    score += 10;
  } else {
    issues.push(`High script count: ${scriptCount}`);
  }

  // Estimate CO2
  const co2Estimate = (pageSizeKB * 0.0002).toFixed(4);

  return {
    score: Math.min(100, score),
    details: {
      summary: `Page size: ${pageSizeKB.toFixed(2)} KB, Est. CO₂: ${co2Estimate}g`,
      pageSize: pageSizeKB,
      co2Estimate,
      issues,
      suggestions: [
        'Optimize images (use WebP, lazy loading)',
        'Minimize JavaScript bundles',
        'Enable gzip/brotli compression',
      ]
    }
  };
}

function analyzeUX(doc: any, html: string) {
  let score = 50; // Base score
  const issues: string[] = [];

  // Check heading hierarchy
  const h1Count = (html.match(/<h1/g) || []).length;
  const h2Count = (html.match(/<h2/g) || []).length;
  
  if (h1Count === 1) {
    score += 15;
  } else {
    issues.push(`Incorrect H1 count: ${h1Count} (should be 1)`);
  }

  if (h2Count > 0) {
    score += 10;
  }

  // Check for alt text on images
  const imagesWithoutAlt = doc.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt?.length === 0) {
    score += 15;
  } else {
    issues.push(`${imagesWithoutAlt?.length || 0} images missing alt text`);
  }

  // Check for form labels
  const forms = doc.querySelectorAll('form');
  const labels = doc.querySelectorAll('label');
  if (forms?.length > 0 && labels?.length >= forms?.length) {
    score += 10;
  }

  return {
    score: Math.min(100, score),
    details: {
      summary: issues.length > 0 ? issues.join(', ') : 'Good UX structure',
      issues,
      suggestions: [
        'Ensure proper heading hierarchy (H1 → H2 → H3)',
        'Add alt text to all images',
        'Use semantic HTML for better accessibility',
      ]
    }
  };
}
