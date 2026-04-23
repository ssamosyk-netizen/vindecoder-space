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
    // Прибираємо білу обводку
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
        <div className="content-wrapper">
          <div className="results-card">
            <h2 className="vehicle-name">{data.ModelYear} {data.Make} {data.Model}</h2>
            <div className="data-grid">
              <div className="data-item"><span>{t.make}</span><b>{data.Make}</b></div>
              <div className="data-item"><span>{t.model}</span><b>{data.Model}</b></div>
              <div className="data-item"><span>{t.engine}</span><b>{data.DisplacementL}L {data.EngineConfiguration}</b></div>
              <div className="data-item"><span>{t.country}</span><b>{data.PlantCountry}</b></div>
            </div>
            
            <div className="ad-placeholder">
                <span>{t.ad}</span>
            </div>
          </div>
          
          <button className="back-btn" onClick={() => router.push('/')}>
            ← {t.back}
          </button>
        </div>
      )}

      <style jsx global>{`
        body { background-color: #000; margin: 0; padding: 0; }
        .container { min-height: 100vh; background-color: #000; color: #fff; padding: 20px; font-family: sans-serif; box-sizing: border-box; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { cursor: pointer; font-size: 2.5rem; fontWeight: 900; letter-spacing: -2px; margin: 0; }
        .yellow { color: #facc15; }
        .white { color: #fff; }
        .subtitle { color: #888; margin-top: 10px; }
        .content-wrapper { maxWidth: 800px; margin: 0 auto; }
        .results-card { background-color: #0a0a0a; padding: 30px; border-radius: 20px; border: 1px solid #1a1a1a; }
        .vehicle-name { color: #facc15; text-align: center; margin-bottom: 30px; font-size: 1.8rem; }
        .data-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 25px; }
        .data-item span { color: #aaa; font-size: 11px; text-transform: uppercase; font-weight: bold; }
        .data-item b { color: #fff; font-size: 1.2rem; display: block; margin-top: 5px; }
        .ad-placeholder { margin-top: 30px; background-color: #050505; height: 150px; border: 1px dashed #222; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #333; font-size: 10px; letter-spacing: 2px; }
        .back-btn { margin-top: 20px; background: none; border: none; color: #facc15; cursor: pointer; font-weight: bold; font-size: 1rem; }
        
        [dir='rtl'] .header h1 { direction: ltr; }
        @media (max-width: 600px) {
          .header h1 { font-size: 2rem; }
          .data-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}
