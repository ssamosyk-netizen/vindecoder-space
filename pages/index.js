import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { dir: 'ltr', subtitle: "Free vehicle specification check", placeholder: "Enter 17-digit VIN...", button: "CHECK", history: "Recent Searches", ad: "ADVERTISEMENT", regions: { us: "US / Canada", eu: "Europe", asia: "Asia / Global" } },
  uk: { dir: 'ltr', subtitle: "Безкоштовна розшифровка специфікацій", placeholder: "Введіть 17 символів VIN...", button: "ПЕРЕВІРИТИ", history: "Останні перевірки", ad: "РЕКЛАМА", regions: { us: "США / Канада", eu: "Європа", asia: "Азія / Інші" } },
  es: { dir: 'ltr', subtitle: "Comprobación gratuita de especificaciones", placeholder: "Ingrese el VIN...", button: "VERIFICAR", history: "Búsquedas recientes", ad: "ANUNCIO", regions: { us: "EE.UU. / Canadá", eu: "Europa", asia: "Asia / Global" } },
  de: { dir: 'ltr', subtitle: "Kostenlose Fahrzeug-Prüfung", placeholder: "VIN eingeben...", button: "PRÜFEN", history: "Letzte Suchen", ad: "ANZEIGE", regions: { us: "USA / Kanada", eu: "Europa", asia: "Asien / Global" } },
  zh: { dir: 'ltr', subtitle: "免费车辆规格查询", placeholder: "输入17位VIN码...", button: "查询", history: "最近查询", ad: "广告", regions: { us: "美国 / 加拿大", eu: "欧洲", asia: "亚洲 / 全球" } },
  ar: { dir: 'rtl', subtitle: "فحص مواصفات السيارة مجاناً", placeholder: "أدخل رمز VIN...", button: "تحقق", history: "عمليات البحث الأخيرة", ad: "إعلان", regions: { us: "أمريكا / كندا", eu: "أوروبا", asia: "آسيا / عالمي" } }
};

const popularVins = ["1FA6P8CF5G", "1J8G2E8A03Y515470", "3VW637AJ7H"];

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [vin, setVin] = useState('');
  const [region, setRegion] = useState('us');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";

    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);

    try {
      const savedHistory = JSON.parse(localStorage.getItem('vinHistory') || "[]");
      setHistory(Array.isArray(savedHistory) && savedHistory.length > 0 ? savedHistory : popularVins);
    } catch (e) {
      setHistory(popularVins);
    }
  }, []);

  const t = translations[lang] || translations.en;

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanVin = vin.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    if (cleanVin.length === 17) {
      try {
        const safeHistory = Array.isArray(history) ? history : popularVins;
        const newHistory = [cleanVin, ...safeHistory.filter(h => h !== cleanVin)].slice(0, 5);
        localStorage.setItem('vinHistory', JSON.stringify(newHistory));
      } catch (err) {}
      
      router.push(`/vin/${cleanVin}?region=${region}`);
    } else {
      alert(lang === 'uk' ? `Потрібно рівно 17 символів! Ви ввели: ${cleanVin.length}` : `17 symbols required! You entered: ${cleanVin.length}`);
    }
  };

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>VIN DECODER - {t.subtitle}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="lang-switcher">
        {Object.keys(translations).map(l => (
          <button key={l} onClick={() => { setLang(l); localStorage.setItem('userLanguage', l); }} className={lang === l ? 'active' : ''}>
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
      
      <form onSubmit={handleSearch} className="vin-form">
        <div className="region-selector">
          <button type="button" className={`region-btn ${region === 'us' ? 'active' : ''}`} onClick={() => setRegion('us')}>
            {t.regions.us}
          </button>
          <button type="button" className={`region-btn ${region === 'eu' ? 'active' : ''}`} onClick={() => setRegion('eu')}>
            {t.regions.eu}
          </button>
          <button type="button" className={`region-btn ${region === 'asia' ? 'active' : ''}`} onClick={() => setRegion('asia')}>
            {t.regions.asia}
          </button>
        </div>

        <div className="input-group">
          <input 
            type="text" 
            value={vin} 
            onChange={(e) => setVin(e.target.value)}
            placeholder={t.placeholder}
          />
          <button type="submit">{t.button}</button>
        </div>
      </form>

      <div className="history-section">
        <p>{t.history}</p>
        <div className="history-chips">
          {history.map((h, i) => (
            <span key={i} onClick={() => router.push(`/vin/${h}?region=us`)} className="chip">
              {h}
            </span>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>© 2026 VIN DECODER</p>
      </footer>

      <style jsx global>{`
        body { background-color: #000; margin: 0; padding: 0; line-height: 1.5; }
        .container { min-height: 100vh; padding: 20px; font-family: sans-serif; box-sizing: border-box; color: #fff; text-align: center; }
        .lang-switcher { display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; margin-bottom: 30px; direction: ltr; }
        .lang-switcher button { background: #111; color: #fff; border: 1px solid #222; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold; }
        .lang-switcher button.active { background: #facc15; color: #000; border-color: #facc15; }
        .header { margin-bottom: 40px; }
        .header h1 { font-size: clamp(2.5rem, 10vw, 4rem); font-weight: 900; margin: 0; letter-spacing: -3px; line-height: 1; direction: ltr; }
        .yellow { color: #facc15; } .white { color: #fff; }
        .subtitle { color: #888; font-size: 1rem; font-weight: bold; margin-top: 10px; }
        .vin-form { max-width: 600px; margin: 0 auto 30px; }
        .region-selector { display: flex; background: #0a0a0a; border: 1px solid #333; border-radius: 12px; padding: 5px; margin-bottom: 15px; }
        .region-btn { flex: 1; background: transparent; color: #888; border: none; padding: 12px; font-size: 0.9rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .region-btn.active { background: #333; color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.5); }
        .input-group { display: flex; flex-direction: column; gap: 10px; }
        .input-group input { padding: 18px; font-size: 18px; border: 1px solid #333; border-radius: 12px; background: #0a0a0a; color: #fff; text-align: center; outline: none; width: 100%; box-sizing: border-box; }
        .input-group input:focus { border-color: #facc15; }
        .input-group button { padding: 18px; font-size: 18px; background: #facc15; border: none; border-radius: 12px; font-weight: bold; color: #000; cursor: pointer; width: 100%; }
        .history-section { margin-bottom: 40px; }
        .history-section p { color: #444; font-size: 11px; text-transform: uppercase; margin-bottom: 12px; font-weight: bold; }
        .history-chips { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .chip { background: #0a0a0a; border: 1px solid #222; padding: 6px 14px; border-radius: 20px; font-size: 12px; cursor: pointer; color: #888; }
        .chip:hover { border-color: #facc15; color: #facc15; }
        .footer { text-align: center; margin-top: 60px; color: #222; font-size: 11px; direction: ltr; }
        @media (min-width: 600px) {
          .input-group { flex-direction: row; gap: 0; }
          .input-group input { border-radius: 12px 0 0 12px; border-right: none; }
          .input-group button { border-radius: 0 12px 12px 0; width: auto; padding: 0 40px; }
        }
      `}</style>
    </div>
  );
}
