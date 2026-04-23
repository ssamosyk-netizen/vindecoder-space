import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { 
    dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", error: "Error loading data",
    sections: { general: "General Information", engine: "Engine & Drivetrain", body: "Body & Chassis", origin: "Manufacturing Information" },
    fields: { make: "Make", model: "Model", year: "Year", trim: "Trim", type: "Vehicle Type", engine: "Engine Displacement", cylinders: "Cylinders", fuel: "Fuel Type", drive: "Drive Type", transmission: "Transmission", body: "Body Class", doors: "Doors", country: "Country", plant: "Plant City" }
  },
  uk: { 
    dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", error: "Помилка завантаження",
    sections: { general: "Загальна інформація", engine: "Двигун та трансмісія", body: "Кузов та шасі", origin: "Інформація про виробництво" },
    fields: { make: "Марка", model: "Модель", year: "Рік", trim: "Комплектація", type: "Тип ТЗ", engine: "Об'єм двигуна", cylinders: "Циліндри", fuel: "Тип палива", drive: "Привід", transmission: "Трансмісія", body: "Клас кузова", doors: "Двері", country: "Країна", plant: "Місто заводу" }
  }
};

export default function VinResult() {
  const router = useRouter();
  const { id } = router.query;
  const [lang, setLang] = useState('en');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";
    
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
    
    // ВАЖЛИВО: Чекаємо, поки роутер точно прочитає посилання
    if (!router.isReady) return;

    if (id) {
      fetchVinData(id);
    } else {
      setLoading(false);
      setErrorMsg("VIN code missing in URL");
    }
  }, [router.isReady, id]);

  const fetchVinData = async (vinCode) => {
    try {
      setLoading(true);
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vinCode}?format=json`);
      if (!res.ok) throw new Error("API connection failed");
      const result = await res.json();
      setData(result.Results[0]);
    } catch (err) { 
      console.error(err);
      setErrorMsg("Could not connect to database.");
    } finally { 
      setLoading(false); 
    }
  };

  const t = translations[lang] || translations.en;

  // Новий, красивий екран завантаження
  if (loading) return (
    <div className="loader-container">
      <h1 className="logo"><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
      <div className="spinner"></div>
      <p>Decoding {id || 'vehicle'}...</p>
      <style jsx>{`
        .loader-container { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; color: #888; font-family: sans-serif; }
        .logo { font-size: 2rem; font-weight: 900; letter-spacing: -1px; margin-bottom: 20px; }
        .yellow { color: #facc15; } .white { color: #fff; }
        .spinner { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #facc15; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{id} Specs | VIN DECODER</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')}>
          <span className="yellow">VIN</span><span className="white">DECODER</span>
        </h1>
        <p className="subtitle">{t.subtitle} <b>{id}</b></p>
      </div>

      {errorMsg && (
        <div className="error-box">
          <p>{t.error}: {errorMsg}</p>
          <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
        </div>
      )}

      {data && !errorMsg && (
        <div className="results-wrapper">
          <main className="main-content">
            <section className="info-section">
              <h3>{t.sections.general}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.make}</span><b>{data.Make || '—'}</b></div>
                <div className="data-item"><span>{t.fields.model}</span><b>{data.Model || '—'}</b></div>
                <div className="data-item"><span>{t.fields.year}</span><b>{data.ModelYear || '—'}</b></div>
                <div className="data-item"><span>{t.fields.trim}</span><b>{data.Trim || '—'}</b></div>
                <div className="data-item"><span>{t.fields.type}</span><b>{data.VehicleType || '—'}</b></div>
              </div>
            </section>

            <section className="info-section">
              <h3>{t.sections.engine}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.engine}</span><b>{data.DisplacementL ? `${data.DisplacementL}L` : ''} {data.EngineConfiguration}</b></div>
                <div className="data-item"><span>{t.fields.cylinders}</span><b>{data.EngineNumberofCylinders || '—'}</b></div>
                <div className="data-item"><span>{t.fields.fuel}</span><b>{data.FuelTypePrimary || '—'}</b></div>
                <div className="data-item"><span>{t.fields.drive}</span><b>{data.DriveType || '—'}</b></div>
              </div>
            </section>
            
            <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
          </main>
        </div>
      )}

      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; }
        .container { padding: 20px; min-height: 100vh; box-sizing: border-box; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { cursor: pointer; font-size: 2.5rem; font-weight: 900; letter-spacing: -2px; margin: 0; direction: ltr; }
        .yellow { color: #facc15; }
        .white { color: #fff; }
        .subtitle { color: #888; margin-top: 10px; font-weight: bold; }
        .error-box { text-align: center; color: #ff4444; padding: 40px; background: #110000; border-radius: 12px; max-width: 600px; margin: 0 auto; }
        .results-wrapper { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }
        .main-content { flex: 1; min-width: 0; }
        .info-section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 15px; margin-bottom: 20px; }
        .info-section h3 { color: #facc15; margin-top: 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 20px; }
        .data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .data-item { text-align: inherit; }
        .data-item span { color: #666; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
        .data-item b { display: block; font-size: 1.1rem; margin-top: 4px; color: #eee; }
        .back-btn { background: #facc15; color: #000; border: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 20px; font-size: 1rem; transition: 0.2s; }
        .back-btn:hover { opacity: 0.8; }
      `}</style>
    </div>
  );
}
