import { Redis } from '@upstash/redis';

const EXTERNAL_DATA_URL = 'https://vindecoder.space';

// Підключаємо базу даних
const redis = Redis.fromEnv();

function generateSiteMap(makes, vins) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${EXTERNAL_DATA_URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>

     <url>
       <loc>${EXTERNAL_DATA_URL}/privacy</loc>
       <changefreq>monthly</changefreq>
       <priority>0.3</priority>
     </url>
     <url>
       <loc>${EXTERNAL_DATA_URL}/terms</loc>
       <changefreq>monthly</changefreq>
       <priority>0.3</priority>
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

     ${vins
       .map((vin) => {
         return `
     <url>
         <loc>${EXTERNAL_DATA_URL}/vin/${vin}</loc>
         <changefreq>monthly</changefreq>
         <priority>0.6</priority>
     </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  // 1. Отримуємо останні VIN-коди з Redis (беремо останні 500 штук для крутого SEO)
  let vins = [];
  try {
    vins = await redis.lrange('recent_vins', 0, 499);
  } catch (error) {
    console.error("Помилка завантаження VIN для sitemap:", error);
  }

  // 2. Список марок
  const makes = ['ford', 'hyundai', 'kia', 'toyota', 'honda', 'mercedes-benz', 'bmw', 'volkswagen', 'tesla', 'chevrolet', 'dodge', 'jeep'];

  // 3. Генеруємо XML
  const sitemap = generateSiteMap(makes, vins);

  // 4. Віддаємо як правильний XML файл
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default SiteMap;
