import React, { useState, useEffect } from 'react';
// === [ЗМІНА] Імпортуємо компонент Head ===
import Head from 'next/head';

const translations = {
  en: { dir: 'ltr', subtitle: "Free vehicle specification check", placeholder: "Enter VIN...", button: "CHECK", country: "Country", engine: "Engine", model: "Model", make: "Make", ad: "ADVERTISEMENT" },
  uk: { dir: 'ltr', subtitle: "Безкоштовна розшифровка специфікацій", placeholder: "Введіть VIN...", button: "ПЕРЕВІРИТИ", country: "Країна", engine: "Двигун", model: "Модель", make: "Марка", ad: "РЕКЛАМА" },
  es: { dir: 'ltr', subtitle: "Comprobación gratuita de especificaciones", placeholder: "Ingrese VIN...", button: "VERIFICAR", country: "País", engine: "Motor", model: "Modelo", make: "Marca", ad: "ANUNCIO" },
  de: { dir: 'ltr', subtitle: "Kostenlose Fahrzeug-Prüfung", placeholder: "VIN eingeben...", button: "PRÜFEN", country: "Land", engine: "Motor", model: "Modell", make: "Marke", ad: "ANZEIGE" },
  zh: { dir: 'ltr', subtitle: "免费车辆规格查询", placeholder: "输入17位VIN码...", button: "查询", country: "生产国", engine: "发动机", model: "型号", make: "品牌", ad: "广告" },
  ar: { dir: 'rtl', subtitle: "فحص مواصفات السيارة مجاناً", placeholder: "أدخل رمز VIN...", button: "تحقق", country: "البلد", engine: "المحرك", model: "الموديل", make: "العلامة التجارية", ad: "إعلان" }
};

export default function VinDecoder() {
  const [lang, setLang] = useState('en');
  const [vin, setVin] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";

    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        setLang(browserLang);
      }
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('userLanguage', newLang);
  };

  const t = translations[lang];

  const decodeVin = async (e) => {
    e.preventDefault();
    if (vin.length !== 17) return alert(lang === 'ar' ? "مطلوب 17 رمزاً" : "17 characters required");
    setLoading(true);
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vin}?format=json`);
      const result = await res.json();
      setData(result.Results[0]);
    } catch (err) { alert("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div dir={t.dir} className="container">

      {/* === [ЗМІНА] Додаємо Head для підключення PNG favicon === */}
      <Head>
        <title>VIN DECODER - {t.subtitle}</title>
        {/* Цей рядок каже браузеру використовувати /favicon.png */}
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>
      {/* ======================================================= */}
      
      <div className="ad-placeholder top-ad">
        <span>{t.ad}</span>
      </div>

      <div className="lang-switcher">
        {Object.keys(translations).map(l => (
          <button key={l} onClick={() => changeLanguage(l)} className={lang === l ? 'active' : ''}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="header">
        <h1>
          <span className="yellow">VIN</span><span className="white">DECODER</span>
        </h1>
        <p className="subtitle">{t.subtitle}</p>
      </div>
      
      <form onSubmit={decodeVin} className="vin-form">
        <div className="input-group">
          <input 
            type="text" 
            maxLength="17" 
            value={vin} 
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder={t.placeholder}
          />
          <button type="submit">
            {loading ? '...' : t.button}
          </button>
        </div>
      </form>

      {data && data.Make && (
        <div className="results-wrapper">
          <div className="main-content">
            <div className="results-card">
              <h2 className="vehicle-name">{data.ModelYear} {data.Make} {data.Model}</h2>
              <div className="data-grid">
                <div className="data-item"><span>{t.make}</span><b>{data.Make}</b></div>
                <div className="data-item"><span>{t.model}</span><b>{data.Model}</b></div>
                <div className="data-item"><span>{t.engine}</span><b>{data.DisplacementL}L {data.EngineConfiguration}</b></div>
                <div className="data-item"><span>{t.country}</span><b>{data.PlantCountry}</b></div>
              </div>

              <div className="ad-placeholder native-ad">
                <span>{t.ad}</span>
              </div>
            </div>
          </div>

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
        .container { min-height: 100vh; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box; color: #fff; }
        
        .ad-placeholder { background-color: #0a0a0a; border: 1px dashed #333; display: flex; align-items: center; justify-content: center; color: #555; font-size: 10px; letter-spacing: 2px; border-radius: 8px; margin: 20px auto; overflow: hidden; text-align: center; direction: ltr !important; }
        .top-ad { max-width: 728px; height: 90px; }
        .native-ad { width: 100%; height: 120px; margin-top: 25px; border-color: #facc1533; }
        .sidebar-ad { width: 300px; height: 600px; margin: 0; }

        .lang-switcher { display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; margin-bottom: 30px; direction: ltr; }
        .lang-switcher button { background: #111; color: #fff; border: 1px solid #222; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold; }
        .lang-switcher button.active { background: #facc15; color: #000; border-color: #facc15; }

        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { font-size: clamp(2.5rem, 10vw, 4rem); font-weight: 900; margin: 0; letter-spacing: -3px; line-height: 1; direction: ltr; }
        .header .yellow { color: #facc15; }
        .header .white { color: #fff; }
        .subtitle { color: #888; font-size: 1rem; font-weight: bold; margin-top: 10px; }

        .vin-form { max-width: 500px; margin: 0 auto 40px; }
        .input-group { display: flex; flex-direction: column; gap: 10px; }
        
        .input-group input { 
          padding: 18px; font-size: 18px; border: 1px solid #333; border-radius: 12px; 
          background: #0a0a0a; color: #fff; text-align: center; outline: none; width: 100%; box-sizing: border-box;
        }
        .input-group button { 
          padding: 18px; font-size: 18px; background: #facc15; border: none; border-radius: 12px; 
          font-weight: bold; color: #000; cursor: pointer; width: 100%;
        }

        .results-wrapper { max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .results-card { background: #0a0a0a; padding: 30px; border-radius: 20px; border: 1px solid #1a1a1a; flex: 1; }
        .vehicle-name { color: #facc15; margin-top: 0; text-align: center; font-size: 1.8rem; margin-bottom: 25px; direction: ltr; }
        
        .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .data-item { text-align: inherit; }
        .data-item span { color: #aaa; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 5px; font-weight: 600; }
        .data-item b { color: #fff; font-size: 1.2rem; display: block; }
        
        .sidebar { display: flex; justify-content: center; }
        .footer { text-align: center; margin-top: 60px; color: #555; font-size: 11px; direction: ltr; }

        @media (min-width: 900px) {
          .input-group { flex-direction: row; gap: 0; }
          [dir='ltr'] .input-group input { border-radius: 12px 0 0 12px; border-right: none; }
          [dir='ltr'] .input-group button { border-radius: 0 12px 12px 0; width: auto; padding: 0 40px; }
          [dir='rtl'] .input-group input { border-radius: 0 12px 12px 0; border-left: none; }
          [dir='rtl'] .input-group button { border-radius: 12px 0 0 12px; width: auto; padding: 0 40px; }
          .results-wrapper { flex-direction: row; align-items: flex-start; }
          .sidebar-ad { display: flex; }
        }

        @media (max-width: 600px) {
          .sidebar-ad { width: 100%; height: 250px; }
          .top-ad { height: 50px; width: 320px; }
          .data-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
