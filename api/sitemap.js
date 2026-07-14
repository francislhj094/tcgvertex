// Vercel Serverless Function - Dynamic XML Sitemap Generator
// Programmatic SEO pipeline that builds a Google-conformant XML sitemap
// containing static pages, set directories, and high-value cards.

const POKEMON_TCG_API = 'https://api.pokemontcg.io/v2';

/**
 * Clean helper to escape special characters in XML
 */
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const startTime = Date.now();
  console.log('🚀 Generating dynamic sitemap...');

  const appUrl = process.env.VITE_APP_URL || 'https://tcgvertex.com';
  
  // Set headers for XML content type and Vercel CDN caching (cache for 24 hours, serve stale while revalidating)
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=86400, stale-while-revalidate=43200');

  try {
    const headers = {
      'X-Api-Key': process.env.POKEMON_TCG_API_KEY || ''
    };

    // Fetch sets and top valuable cards in parallel
    const [setsResult, cardsResult] = await Promise.allSettled([
      fetch(`${POKEMON_TCG_API}/sets?pageSize=200`, { headers }).then(r => r.ok ? r.json() : null),
      fetch(`${POKEMON_TCG_API}/cards?orderBy=-tcgplayer.prices.holofoil.market&pageSize=200`, { headers }).then(r => r.ok ? r.json() : null)
    ]);

    const sets = setsResult.status === 'fulfilled' && setsResult.value ? setsResult.value.data : [];
    const cards = cardsResult.status === 'fulfilled' && cardsResult.value ? cardsResult.value.data : [];

    console.log(`📊 Sitemap source data: Loaded ${sets.length} sets and ${cards.length} cards.`);

    // Build the XML tree
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // 1. Static Pages
    const staticPages = [
      { path: '', changefreq: 'daily', priority: '1.0' },
      { path: '/market', changefreq: 'daily', priority: '0.9' },
      { path: '/sets', changefreq: 'weekly', priority: '0.8' },
      { path: '/premium', changefreq: 'monthly', priority: '0.7' },
      { path: '/about', changefreq: 'monthly', priority: '0.5' },
      { path: '/contact', changefreq: 'monthly', priority: '0.5' }
    ];

    staticPages.forEach(page => {
      xml += `
  <url>
    <loc>${appUrl}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // 2. Set Detail Pages
    sets.forEach(set => {
      if (set.id) {
        xml += `
  <url>
    <loc>${appUrl}/sets/${escapeXml(set.id)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.70</priority>
  </url>`;
      }
    });

    // 3. High-Value Card Detail Pages
    cards.forEach(card => {
      if (card.id) {
        xml += `
  <url>
    <loc>${appUrl}/card/${escapeXml(card.id)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.80</priority>
  </url>`;
      }
    });

    xml += '\n</urlset>';

    const duration = Date.now() - startTime;
    console.log(`✅ Sitemap XML generated successfully in ${duration}ms containing ${sets.length + cards.length + staticPages.length} links.`);

    return res.status(200).send(xml);

  } catch (error) {
    console.error('❌ Error generating sitemap XML:', error.message);
    
    // Fallback: Return basic static sitemap on complete failure to prevent crawler errors
    let fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${appUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${appUrl}/market</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
    
    return res.status(200).send(fallbackXml);
  }
}
