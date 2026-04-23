import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", country: "Country", engine: "Engine", model: "Model", make: "Make", ad: "ADVERTISEMENT" },
  uk: { dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", country: "Країна", engine: "Двигун", model: "Модель", make: "Марка", ad: "РЕКЛАМА" },
  es: { dir: 'ltr', subtitle: "Informe de especificaciones", back: "Volver", country: "País", engine: "Motor", model: "Modelo", make: "Marca", ad: "ANUNCIO" },
  de: { dir: 'ltr', subtitle: "Fahrzeugspezifikationsbericht", back: "Zurück", country: "Land", engine: "Motor", model: "Modell", make: "Marke", ad: "ANZEIGE" },
  zh: { dir: 'ltr', subtitle: "车辆规格报告", back: "返回", country: "生产国", engine: "发动机", model: "型号", make: "品牌", ad: "广告" },
  ar: { dir: 'rtl', subtitle: "تقرير مواصفات السيارة", back: "العودة", country: "البلد", engine: "المحرك", model: "الموديل", make: "العلامة التجارية", ad: "إعلان" }
};

export default function VinResult() {
  const router = useRouter();
  const { id } = router.query;
  const [lang, setLang] = useState('en');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";

    const savedLang = localStorage.getItem('userLanguage') || 'en';
    setLang(savedLang);
    if (id) fetchVinData(id);
  }, [id]);

  const fetchVinData = async (vinCode) => {
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vinCode}?format=json`);
      const result = await res.json();
      setData(result.Results[0]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div style={{backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>...</div>;

  const t = translations[lang] || translations.en;

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{id} - {data?.Make} {data?.Model} | VIN DECODER</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')}>
          <span className="yellow">VIN</span><span className="white">DECODER</span>
        </h1>
        <p className="subtitle">{t.subtitle} for <b>{id}</b></p>
      </div>

      {data && (
        <div className="results-wrapper">
          {/* ОСНОВНА ЧАСТИНА */}
          <main className="main-content">
            <div className="results-card">
              <h2 className="vehicle-name">{data.ModelYear} {data.Make} {data.Model}</h2>
              <div className="data-grid">
                <div className="data-item"><span>{t.make}</span><b>{data.Make || '—'}</b></div>
                <div className="data-item"><span>{t.model}</span><b>{data.Model || '—'}</b></div>
                <div className="data-item"><span>{t.engine}</span><b>{data.DisplacementL ? `${data.DisplacementL}L` : ''} {data.EngineConfiguration || '—'}</b></div>
                <div className="data-item"><span>{t.country}</span><b>{data.PlantCountry || '—'}</b></div>
              </div>
              
              {/* Реклама всередині картки */}
              <div className="ad-placeholder native-ad">
                <span>{t.ad}</span>
              </div>
            </div>
            
            <button className="back-btn" onClick={() => router.push('/')}>
              ← {t.back}
            </button>
          </main>

          {/* БІЧНА ПАНЕЛЬ З РЕКЛАМОЮ */}
          <aside className="sidebar">
            <div className="ad-placeholder sidebar-ad">
              <span>{t.ad}</span>
            </div>
          </aside>
        </div>
      )}

      <footer className="footer">
        <p>© 2026 VIN DECODER</p>
      </footer>

      <style jsx global>{`
        body { background-color: #000; margin: 0; padding: 0; line-height: 1.5; }
        .container { min-height: 100vh; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; box-sizing: border-box; color: #fff; }
        
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { cursor: pointer; font-size: 2.5rem; font-weight: 900; letter-spacing: -2px; margin: 0; direction: ltr; }
        .yellow { color: #facc15; }
        .white { color: #fff; }
        .subtitle { color: #888; margin-top: 10px; font-weight: bold; }

        /* Структура контенту */
        .results-wrapper { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .main-content { flex: 1; min-width: 0; }
        
        .results-card { background-color: #0a0a0a; padding: 30px; border-radius: 20px; border: 1px solid #1a1a1a; }
        .vehicle-name { color: #facc15; text-align: center; margin: 0 0 30px 0; font-size: 1.8rem; }
        
        .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .data-item span { color: #aaa; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
        .data-item b { color: #fff; font-size: 1.2rem; display: block; margin-top: 5px; }

        /* Рекламні блоки */
        .ad-placeholder { background-color: #0a0a0a; border: 1px dashed #222; display: flex; align-items: center; justify-content: center; color: #333; font-size: 10px; letter-spacing: 2px; border-radius: 12px; }
        .native-ad { height: 120px; margin-top: 30px; border-color: #facc1511; }
        .sidebar-ad { width: 300px; min-height: 600px; }
        .sidebar { display: none; }

        .back-btn { margin-top: 25px; background: none; border: none; color: #facc15; cursor: pointer; font-weight: bold; font-size: 1rem; transition: 0.2s; }
        .back-btn:hover { opacity: 0.7; }
        
        .footer { text-align: center; margin-top: 80px; color: #222; font-size: 11px; }

        /* Десктопна версія */
        @media (min-width: 900px) {
          .results-wrapper { flex-direction: row; align-items: flex-start; }
          .sidebar { display: block; }
          .main-content { max-width: calc(100% - 320px); }
        }

        @media (max-width: 600px) {
          .data-grid { grid-template-columns: 1fr; }
          .vehicle-name { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
