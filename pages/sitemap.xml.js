const EXTERNAL_DATA_URL = 'https://vindecoder.space';

function generateSiteMap(makes) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     ${makes
       .map((make) => {
         return `
       <url>
           <loc>${EXTERNAL_DATA_URL}/make/${make.toLowerCase()}</loc>
           <lastmod>${new Date().toISOString()}</lastmod>
           <changefreq>weekly</changefreq>
           <priority>0.8</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  // Список популярних марок для індексації
  const makes = ['ford', 'hyundai', 'kia', 'toyota', 'honda', 'mercedes-benz', 'bmw', 'volkswagen', 'tesla', 'chevrolet', 'dodge', 'jeep'];

  const sitemap = generateSiteMap(makes);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default SiteMap;
