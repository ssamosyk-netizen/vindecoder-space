import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: {
    dir: 'ltr',
    title: "VIN Report for",
    loading: "Decoding VIN, please wait...",
    error: "Sorry, we couldn't decode this VIN. It might be invalid or too old.",
    details: "Vehicle Specifications",
    engine: "Engine & Performance",
    production: "Manufacturing",
    getHistoryTitle: "Want to know the car's hidden history?",
    getHistoryText: "Check for accidents, mileage rollbacks, theft, and salvage titles.",
    getHistoryBtn: "GET FULL HISTORY REPORT",
    supportTitle: "Support our free project!",
    supportBtn: "☕ Buy us a coffee",
    policy: "Privacy Policy",
    terms: "Terms of Service",
    footer: "© 2026 VIN DECODER | PROFESSIONAL DATA"
  },
  uk: {
    dir: 'ltr',
    title: "Звіт по VIN-коду",
    loading: "Розшифровуємо VIN, зачекайте...",
    error: "Вибачте, ми не змогли розшифрувати цей VIN. Він може бути некоректним або застарілим.",
    details: "Технічні характеристики",
    engine: "Двигун та Трансмісія",
    production: "Виробництво",
    getHistoryTitle: "Бажаєте дізнатися приховану історію авто?",
    getHistoryText: "Перевірте наявність ДТП, скручений пробіг, крадіжки та статус Salvage.",
    getHistoryBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ (CARFAX/AUTOCHECK)",
    supportTitle: "Підтримайте наш безкоштовний проект!",
    supportBtn: "☕ Пригостити кавою",
    policy: "Політика конфіденційності",
    terms: "Умови використання",
    footer: "© 2026 VIN DECODER | ПРОФЕСІЙНІ ДАНІ"
  }
};

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'UK' }
];

export default function VinReport() {
  const router = useRouter();
  const { id } = router.query;
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('userLanguage', newLang);
  };

  const t = translations[lang] || translations.en;

  useEffect(() => {
    if (!id) return;
    const fetchVinData = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${id}?format=json`);
        if (!response.ok) throw new Error('Network error');
        const json = await response.json();
        if (json.Results && json.Results[0] && json.Results[0].Make) {
          setVehicleData(json.Results[0]);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVinData();
  }, [id]);

  const affiliateLink = `https://www.epicvin.com/en/check-vin-number-report?vin=${id}&affiliate=YOUR_ID`;
  const donationLink = `https://buymeacoffee.com/yourprofile`;
  const ogImageUrl = `https://vindecoder.space/api/og?vin=${id || ''}&make=${vehicleData?.Make || ''}&model=${vehicleData?.Model || ''}&year=${vehicleData?.ModelYear || ''}`;

  return (
    <div className="container" dir={t.dir}>
      <Head>
        <title>{id} | {vehicleData?.Make || ''} {vehicleData?.Model || ''} | VIN DECODER</title>
        <meta name="description" content={`Full technical report for VIN ${id}. Specifications, engine data and manufacturer details.`} />
        <meta property="og:title" content={`${id} | Free VIN Report`} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>

      <header className="header">
        <div className="logo" onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span>DECODER
        </div>
        <div className="lang-switcher">
          {languages.map((l) => (
            <span key={l.code} className={lang === l.code ? 'active' : ''} onClick={() => toggleLang(l.code)}>
              {l.label}
            </span>
          ))}
        </div>
      </header>

      <main className="content">
        <h1 className="report-title">{t.title} <span className="yellow">{id}</span></h1>

        {loading ? (
          <div className="status-box"><div className="spinner"></div><p>{t.loading}</p></div>
        ) : error ? (
          <div className="status-box error"><p>{t.error}</p><button className="back-btn" onClick={() => router.push('/')}>Go Back</button></div>
        ) : (
          <>
            <div className="monetization-banner">
              <div className="banner-text">
                <h3>⚠️ {t.getHistoryTitle}</h3>
                <p>{t.getHistoryText}</p>
              </div>
              <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="action-btn">{t.getHistoryBtn}</a>
            </div>

            <div className="data-grid">
              <div className="data-card">
                <h3>{t.details}</h3>
                <ul>
                  <li><span>Make:</span> {vehicleData.Make}</li>
                  <li><span>Model:</span> {vehicleData.Model}</li>
                  <li><span>Year:</span> {vehicleData.ModelYear}</li>
                  <li><span>Body Style:</span> {vehicleData.BodyClass}</li>
                  <li><span>Drive Type:</span> {vehicleData.DriveType}</li>
                  <li><span>Doors:</span> {vehicleData.Doors}</li>
                </ul>
              </div>

              <div className="data-card">
                <h3>{t.engine}</h3>
                <ul>
                  <li><span>Displacement:</span> {vehicleData.DisplacementL}L</li>
                  <li><span>Engine:</span> {vehicleData.EngineConfiguration}{vehicleData.EngineCylinders}</li>
                  <li><span>Power:</span> {vehicleData.EngineHP ? `${vehicleData.EngineHP} HP` : 'N/A'}</li>
                  <li><span>Fuel:</span> {vehicleData.FuelTypePrimary}</li>
                  <li><span>Brakes:</span> {vehicleData.BrakeSystemType || 'N/A'}</li>
                </ul>
              </div>

              <div className="data-card">
                <h3>{t.production}</h3>
                <ul>
                  <li><span>Manufacturer:</span> {vehicleData.Manufacturer}</li>
                  <li><span>Country:</span> {vehicleData.PlantCountry}</li>
                  <li><span>Plant City:</span> {vehicleData.PlantCity}</li>
                  <li><span>Series:</span> {vehicleData.Series || 'N/A'}</li>
                </ul>
              </div>
            </div>

            <div className="support-banner">
              <h3>{t.supportTitle}</h3>
              <a href={donationLink} target="_blank" rel="noopener noreferrer" className="donate-btn">{t.supportBtn}</a>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-links">
          <span onClick={() => router.push('/privacy')}>{t.policy}</span>
          <span className="dot">•</span>
          <span onClick={() => router.push('/terms')}>{t.terms}</span>
        </div>
        <p className="copyright">{t.footer}</p>
      </footer>

      <style jsx global>{`
        body { margin: 0; background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
      `}</style>
      <style jsx>{`
        .container { padding: 0 20px; max-width: 1100px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 30px 0; }
        .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px; }
        .yellow { color: #facc15; }
        .lang-switcher { display: flex; gap: 10px; font-size: 12px; font-weight: bold; }
        .lang-switcher span { cursor: pointer; padding: 5px 10px; border-radius: 5px; color: #444; }
        .lang-switcher span.active { color: #facc15; border: 1px solid #facc15; }
        .content { flex: 1; max-width: 800px; margin: 0 auto; width: 100%; }
        .report-title { text-align: center; margin-bottom: 40px; text-transform: uppercase; font-size: clamp(1.2rem, 4vw, 2rem); }
        .status-box { text-align: center; padding: 60px 0; background: #0a0a0a; border-radius: 20px; border: 1px solid #1a1a1a; }
        .spinner { width: 30px; height: 30px; border: 3px solid #222; border-left-color: #facc15; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .monetization-banner { background: #111; padding: 25px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border: 1px solid #333; }
        .action-btn { background: #facc15; color: #000; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 900; font-size: 13px; text-transform: uppercase; }
        .data-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 40px; }
        .data-card { background: #0a0a0a; padding: 25px; border-radius: 15px; border: 1px solid #1a1a1a; }
        .data-card h3 { color: #facc15; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 15px; }
        .data-card ul { list-style: none; padding: 0; margin: 0; }
        .data-card li { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #080808; font-size: 14px; }
        .data-card li span { color: #555; font-weight: bold; }
        .support-banner { text-align: center; padding: 30px; border-top: 1px solid #111; }
        .donate-btn { color: #555; text-decoration: none; font-size: 14px; }
        .footer { padding: 40px 0; text-align: center; font-size: 12px; color: #333; }
        .footer-links { margin-bottom: 10px; color: #555; }
        .footer-links span { cursor: pointer; margin: 0 10px; }
        @media (max-width: 768px) {
          .monetization-banner { flex-direction: column; text-align: center; gap: 20px; }
          .action-btn { width: 100%; }
        }
      `}</style>
    </div>
  );
}
