import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { dir: 'ltr', subtitle: "Free vehicle specification check", placeholder: "Enter VIN...", button: "CHECK", history: "Recent Searches", ad: "ADVERTISEMENT" },
  uk: { dir: 'ltr', subtitle: "Безкоштовна розшифровка специфікацій", placeholder: "Введіть VIN...", button: "ПЕРЕВІРИТИ", history: "Останні перевірки", ad: "РЕКЛАМА" },
  es: { dir: 'ltr', subtitle: "Comprobación gratuita de especificaciones", placeholder: "Ingrese VIN...", button: "VERIFICAR", history: "Búsquedas recientes", ad: "ANUNCIO" },
  de: { dir: 'ltr', subtitle: "Kostenlose Fahrzeug-Prüfung", placeholder: "VIN eingeben...", button: "PRÜFEN", history: "Letzte Suchen", ad: "ANZEIGE" },
  zh: { dir: 'ltr', subtitle: "免费车辆规格查询", placeholder: "输入17位VIN码...", button: "查询", history: "最近查询", ad: "广告" },
  ar: { dir: 'rtl', subtitle: "فحص مواصفات السيارة مجاناً", placeholder: "أدخل رمز VIN...", button: "تحقق", history: "عمليات البحث الأخيرة", ad: "إعلان" }
};

// Статичний список для старту (щоб сайт не був порожнім)
const popularVins = ["1FA6P8CF5G", "1C4PJMDS7FW", "3VW637AJ7H"];

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [vin, setVin] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang) setLang(savedLang);

    // Завантажуємо історію з пам'яті браузера
    const savedHistory = JSON.parse(localStorage.getItem('vinHistory') || "[]");
    setHistory(savedHistory.length > 0 ? savedHistory : popularVins);
  }, []);

  const t = translations[lang] || translations.en;

  const handleSearch = (e) => {
    e.preventDefault();
    if (vin.length === 17) {
      // Зберігаємо в історію перед переходом
      const newHistory = [vin.toUpperCase(), ...history.filter(h => h !== vin.toUpperCase())].slice(0, 5);
      localStorage.setItem('vinHistory', JSON.stringify(newHistory));
      router.push(`/vin/${vin.toUpperCase()}`);
    } else {
      alert(lang === 'uk' ? "Потрібно 17 символів" : "17 symbols required");
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
        <div className="input-group">
          <input 
            type="text" 
            maxLength="17" 
            value={vin} 
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder={t.placeholder}
          />
          <button type="submit">{t.button}</button>
        </div>
      </form>

      {/* БЛОК ІСТОРІЇ */}
      <div className="history-section">
        <p>{t.history}:</p>
        <div className="history-chips">
          {history.map((h, i) => (
            <span key={i} onClick={() => router.push(`/vin/${h}`)} className="chip">
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="ad-block">{t.ad}</div>

      <footer className="footer">
        <p>© 2026 VIN DECODER</p>
      </footer>

      <style jsx global>{`
        body { background-color: #000; margin: 0; padding: 0; }
        .container { min-height: 100vh; padding: 20px; font-family: sans-serif; text-align: center; color: #fff; }
        .lang-switcher { display: flex; justify-content: center; gap: 6px; margin-bottom: 40px; }
        .lang-switcher button { background: #111; color: #fff; border: 1px solid #333; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; }
        .lang-switcher button.active { background: #facc15; color: #000; }
        
        .header h1 { font-size: clamp(2.5rem, 10vw, 4rem); font-weight: 900; letter-spacing: -3px; margin: 0; }
        .yellow { color: #facc15; }
        .white { color: #fff; }
        .subtitle { color: #888; font-weight: bold; margin-top: 10px; }

        .vin-form { max-width: 500px; margin: 40px auto; }
        .input-group { display: flex; flex-direction: column; gap: 10px; }
        .input-group input { padding: 18px; font-size: 18px; border: 1px solid #333; border-radius: 12px; background: #0a0a0a; color: #fff; text-align: center; outline: none; }
        .input-group button { padding: 18px; font-size: 18px; background: #facc15; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; }

        .history-section { margin-top: 20px; }
        .history-section p { color: #444; font-size: 12px; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; }
        .history-chips { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .chip { background: #111; border: 1px solid #222; padding: 6px 12px; border-radius: 20px; font-size: 12px; cursor: pointer; color: #aaa; transition: 0.2s; }
        .chip:hover { border-color: #facc15; color: #facc15; }

        .ad-block { max-width: 728px; height: 90px; background: #0a0a0a; border: 1px dashed #222; margin: 60px auto; display: flex; align-items: center; justify-content: center; color: #333; font-size: 10px; letter-spacing: 2px; }
        .footer { margin-top: 80px; color: #222; font-size: 11px; }

        @media (min-width: 600px) {
          .input-group { flex-direction: row; }
          .input-group input { border-radius: 12px 0 0 12px; flex: 1; }
          .input-group button { border-radius: 0 12px 12px 0; padding: 0 30px; }
        }
      `}</style>
    </div>
  );
}
