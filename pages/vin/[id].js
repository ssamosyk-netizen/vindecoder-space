import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { dir: 'ltr', title: "VIN Report for", loading: "Decoding...", error: "Invalid VIN.", details: "Specs", engine: "Engine", production: "Manufacturing", getHistoryBtn: "GET FULL HISTORY", footer: "© 2026 VIN DECODER" },
  uk: { dir: 'ltr', title: "Звіт по VIN-коду", loading: "Розшифровка...", error: "VIN не знайдено.", details: "Характеристики", engine: "Двигун", production: "Виробництво", getHistoryBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ", footer: "© 2026 VIN DECODER" }
};

export default function VinReport() {
  const router = useRouter();
  const { id } = router.query;
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchVin = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${id}?format=json`);
        const json = await res.json();
        if (json.Results && json.Results[0] && json.Results[0].Make) setVehicleData(json.Results[0]);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchVin();
  }, [id]);

  const t = translations[lang] || translations.en;
  const v = vehicleData || {};
  const vehicleName = `${v.ModelYear || ''} ${v.Make || ''} ${v.Model || ''}`.trim();
  const ogImg = `https://vindecoder.space/api/og?vin=${id||''}&make=${v.Make||''}&model=${v.Model||''}&year=${v.ModelYear||''}`;

  return (
    <div className="container" dir={t.dir}>
      <Head>
        <title>{vehicleName ? `${vehicleName} | ${id}` : `${id} | VIN Report`}</title>
        <meta name="description" content={`Technical specifications for ${vehicleName}. VIN: ${id}`} />
        <meta property="og:title" content={`${vehicleName || id} | Free VIN Report`} />
        <meta property="og:image" content={ogImg} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImg} />
      </Head>

      <header className="header">
        <div className="logo" onClick={() => router.push('/')} style={{cursor:'pointer'}}><span className="yellow">VIN</span>DECODER</div>
        <div className="langs">
          {Object.keys(translations).map(l => (
            <span key={l} className={lang === l ? 'active' : ''} onClick={() => {setLang(l); localStorage.setItem('userLanguage', l);}}>{l.toUpperCase()}</span>
          ))}
        </div>
      </header>

      <main className="content">
        <h1 className="report-title">{t.title} <span className="yellow">{id}</span></h1>

        {loading ? (
          <div className="status-box"><div className="spinner"></div><p>{t.loading}</p></div>
        ) : !vehicleData ? (
          <div className="status-box"><p>{t.error}</p><button className="back-btn" onClick={() => router.push('/')}>Go Back</button></div>
        ) : (
          <>
            <div className="cta-box">
              <div className="cta-text">
                <h3>{lang === 'uk' ? `Повна історія ${vehicleName}` : `Full History for ${vehicleName}`}</h3>
                <p>{lang === 'uk' ? 'Перевірте ДТП, пробіг та фото з аукціонів США.' : 'Check accidents, mileage and US auction photos.'}</p>
              </div>
              <a href={`https://www.epicvin.com/en/check-vin-number-report?vin=${id}&affiliate=YOUR_ID`} target="_blank" rel="noreferrer" className="action-btn">{t.getHistoryBtn}</a>
            </div>

            <div className="grid">
              <div className="card">
                <h3>{t.details}</h3>
                <ul>
                  <li><span>Make:</span> {v.Make}</li>
                  <li><span>Model:</span> {v.Model}</li>
                  <li><span>Year:</span> {v.ModelYear}</li>
                  <li><span>Trim:</span> {v.Trim || 'N/A'}</li>
                  <li><span>Body Style:</span> {v.BodyClass}</li>
                  <li><span>Doors:</span> {v.Doors}</li>
                  <li><span>Drive Type:</span> {v.DriveType}</li>
                </ul>
              </div>

              <div className="card">
                <h3>{t.engine}</h3>
                <ul>
                  <li><span>Displacement:</span> {v.DisplacementL}L</li>
                  <li><span>Config:</span> {v.EngineConfiguration}{v.EngineCylinders}</li>
                  <li><span>Power:</span> {v.EngineHP ? `${v.EngineHP} HP` : 'N/A'}</li>
                  <li><span>Fuel:</span> {v.FuelTypePrimary}</li>
                  <li><span>Brakes:</span> {v.BrakeSystemType || 'N/A'}</li>
                </ul>
              </div>

              <div className="card">
                <h3>{t.production}</h3>
                <ul>
                  <li><span>Manufacturer:</span> {v.Manufacturer}</li>
                  <li><span>Country:</span> {v.PlantCountry}</li>
                  <li><span>Plant:</span> {v.PlantCity}, {v.PlantState}</li>
                  <li><span>Series:</span> {v.Series || 'N/A'}</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-links"><span onClick={() => router.push('/privacy')}>Privacy</span> • <span onClick={() => router.push('/terms')}>Terms</span></div>
        <p>{t.footer}</p>
      </footer>

      <style jsx global>{`body{background:#000;color:#fff;margin:0;font-family:-apple-system,sans-serif;overflow-x:hidden;}`}</style>
      <style jsx>{`
        .container{padding:0 20px;max-width:1000px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;}
        .header{display:flex;justify-content:space-between;align-items:center;padding:25px 0;}
        .logo{font-size:1.4rem;font-weight:900;letter-spacing:-1px;}
        .yellow{color:#facc15;}
        .langs{display:flex;gap:8px;font-size:10px;font-weight:bold;}
        .langs span{cursor:pointer;padding:4px 8px;color:#444;}
        .langs span.active{color:#facc15;border:1px solid #facc15;border-radius:4px;}
        .report-title{font-size:clamp(1.4rem,4vw,2rem);text-align:center;margin-bottom:30px;text-transform:uppercase;}
        .status-box{text-align:center;padding:60px 20px;background:#0a0a0a;border-radius:20px;border:1px solid #1a1a1a;}
        .spinner{width:30px;height:30px;border:3px solid #222;border-left-color:#facc15;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 10px;}
        @keyframes spin{100%{transform:rotate(360deg);}}
        .back-btn{background:#222;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;margin-top:15px;}
        .cta-box{background:#111;padding:25px;border-radius:20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:30px;border:1px solid #333;}
        .cta-text h3{margin:0 0 5px;font-size:1.1rem;}
        .cta-text p{margin:0;color:#777;font-size:0.9rem;}
        .action-btn{background:#facc15;color:#000;text-decoration:none;padding:12px 24px;border-radius:12px;font-weight:900;font-size:13px;text-transform:uppercase;white-space:nowrap;}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;margin-bottom:40px;}
        .card{background:#0a0a0a;padding:25px;border-radius:15px;border:1px solid #1a1a1a;}
        .card h3{color:#facc15;font-size:11px;text-transform:uppercase;border-bottom:1px solid #222;padding-bottom:8px;margin-bottom:15px;letter-spacing:1px;}
        .card ul{list-style:none;padding:0;margin:0;}
        .card li{display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #080808;font-size:14px;color:#eee;}
        .card li span{color:#555;font-weight:bold;}
        .footer{padding:40px 0;text-align:center;font-size:11px;color:#333;}
        .footer-links{margin-bottom:10px;color:#555;}
        .footer-links span{cursor:pointer;margin:0 8px;}
        @media(max-width:768px){.cta-box{flex-direction:column;text-align:center;gap:20px;}.action-btn{width:100%;}}
      `}</style>
    </div>
  );
}
