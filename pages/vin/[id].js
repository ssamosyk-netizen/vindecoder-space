import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { 
    dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", error: "Error loading data", ad: "ADVERTISEMENT",
    partnerTitle: "Full European / Global Report Available", partnerDesc: "Get hidden damages, mileage rollbacks, and historical photos.", partnerBtn: "GET FULL REPORT",
    sections: { general: "General Information", engine: "Engine & Drivetrain", body: "Body & Chassis" },
    fields: { make: "Make", model: "Model", year: "Year", engine: "Engine", fuel: "Fuel Type", country: "Country" }
  },
  uk: { 
    dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", error: "Помилка завантаження", ad: "РЕКЛАМА",
    partnerTitle: "Доступний повний звіт для Європи / Азії", partnerDesc: "Перевірте скручений пробіг, приховані ДТП та історичні фотографії.", partnerBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ",
    sections: { general: "Загальна інформація", engine: "Двигун та трансмісія", body: "Кузов та шасі" },
    fields: { make: "Марка", model: "Модель", year: "Рік", engine: "Двигун", fuel: "Паливо", country: "Країна" }
  }
};

export default function VinResult() {
  const router = useRouter();
  const { id, region } = router.query; // ЛОВИМО РЕГІОН З ПОСИЛАННЯ
  const [lang, setLang] = useState('en');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";
    
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);
    
    if (!router.isReady) return;
    if (id) fetchVinData(id);
  }, [router.isReady, id]);

  const fetchVinData = async (vinCode) => {
    try {
      setLoading(true);
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vinCode}?format=json`);
      const result = await res.json();
      setData(result.Results[0]);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const t = translations[lang] || translations.en;

  if (loading) return (
    <div className="loader-container">
      <h1 className="logo"><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
      <div className="spinner"></div><p>Decoding {id || 'vehicle'}...</p>
      <style jsx>{`.loader-container { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; color: #888; font-family: sans-serif; } .logo { font-size: 2rem; font-weight: 900; margin-bottom: 20px; } .yellow { color: #facc15; } .white { color: #fff; } .spinner { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #facc15; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{id} Specs | VIN DECODER</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')}><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
        <p className="subtitle">{t.subtitle} <b>{id}</b></p>
      </div>

      {data && (
        <div className="results-wrapper">
          <main className="main-content">
            
            {/* СПЕЦІАЛЬНИЙ БАНЕР ДЛЯ ЄВРОПИ ТА АЗІЇ */}
            {(region === 'eu' || region === 'asia') && (
              <div className="partner-banner">
                <div className="banner-content">
                  <h2>{t.partnerTitle}</h2>
                  <p>{t.partnerDesc}</p>
                </div>
                <button className="partner-btn" onClick={() => alert("Тут буде ваше реферальне посилання на CarVertical або EpicVIN!")}>
                  {t.partnerBtn}
                </button>
              </div>
            )}

            <section className="info-section">
              <h3>{t.sections.general}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.make}</span><b>{data.Make || '—'}</b></div>
                <div className="data-item"><span>{t.fields.model}</span><b>{data.Model || '—'}</b></div>
                <div className="data-item"><span>{t.fields.year}</span><b>{data.ModelYear || '—'}</b></div>
                <div className="data-item"><span>{t.fields.country}</span><b>{data.PlantCountry || '—'}</b></div>
              </div>
            </section>

            <div className="ad-placeholder native-ad"><span>{t.ad}</span></div>

            <section className="info-section">
              <h3>{t.sections.engine}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.engine}</span><b>{data.DisplacementL ? `${data.DisplacementL}L` : '—'} {data.EngineConfiguration}</b></div>
                <div className="data-item"><span>{t.fields.fuel}</span><b>{data.FuelTypePrimary || '—'}</b></div>
              </div>
            </section>
            
            <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
          </main>

          <aside className="sidebar">
            <div className="ad-placeholder sidebar-ad"><span>{t.ad}<br/><br/>(300x600)</span></div>
          </aside>
        </div>
      )}

      <footer className="footer"><p>© 2026 VIN DECODER</p></footer>

      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: sans-serif; line-height: 1.5; }
        .container { padding: 20px; min-height: 100vh; box-sizing: border-box; }
        .header { text-align: center; margin-bottom: 40px; cursor: pointer;}
        .header h1 { font-size: 2.5rem; font-weight: 900; margin: 0; direction: ltr; letter-spacing: -2px;}
        .yellow { color: #facc15; } .white { color: #fff; }
        .subtitle { color: #888; margin-top: 10px; }
        
        .results-wrapper { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }
        .main-content { flex: 1; min-width: 0; }
        
        /* СТИЛІ БАНЕРА ПАРТНЕРА */
        .partner-banner { background: linear-gradient(135deg, #1a1a1a 0%, #2d2000 100%); border: 1px solid #facc15; padding: 25px; border-radius: 15px; margin-bottom: 30px; display: flex; flex-direction: column; gap: 20px; align-items: center; text-align: center; box-shadow: 0 4px 20px rgba(250, 204, 21, 0.1); }
        .partner-banner h2 { color: #facc15; margin: 0; font-size: 1.4rem; }
        .partner-banner p { color: #ccc; margin: 10px 0 0 0; font-size: 0.95rem; }
        .partner-btn { background: #facc15; color: #000; font-weight: 900; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 1rem; text-transform: uppercase; transition: 0.2s; width: 100%; max-width: 300px; }
        .partner-btn:hover { background: #fff; }

        .info-section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 15px; margin-bottom: 20px; }
        .info-section h3 { color: #facc15; margin-top: 0; font-size: 0.9rem; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 20px; }
        .data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .data-item span { color: #666; font-size: 11px; text-transform: uppercase; font-weight: bold; }
        .data-item b { display: block; font-size: 1.1rem; margin-top: 4px; color: #eee; }
        
        .ad-placeholder { background: #080808; border: 1px dashed #333; display: flex; align-items: center; justify-content: center; color: #555; font-size: 11px; font-weight: bold; letter-spacing: 2px; border-radius: 10px; }
        .native-ad { height: 100px; margin: 25px 0; width: 100%; }
        .sidebar { display: none; }
        .sidebar-ad { width: 300px; height: 600px; position: sticky; top: 20px; }
        .back-btn { background: #facc15; color: #000; border: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; }
        .footer { text-align: center; margin-top: 80px; color: #222; font-size: 11px; direction: ltr; }

        @media (min-width: 900px) {
          .results-wrapper { flex-direction: row; align-items: flex-start; }
          .sidebar { display: block; }
          .partner-banner { flex-direction: row; text-align: left; justify-content: space-between; }
          .partner-btn { width: auto; }
        }
      `}</style>
    </div>
  );
}
