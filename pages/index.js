import React, { useState, useEffect } from 'react';
import Head from 'next/head';

const translations = {
  en: { 
    dir: 'ltr', subtitle: "Free vehicle specification check", placeholder: "Enter 17-digit VIN...", button: "CHECK", history: "Recent Searches", ad: "ADVERTISEMENT",
    regions: { us: "US / Canada", eu: "Europe", asia: "Asia / Global" }
  },
  uk: { 
    dir: 'ltr', subtitle: "Безкоштовна розшифровка специфікацій", placeholder: "Введіть 17 символів VIN...", button: "ПЕРЕВІРИТИ", history: "Останні перевірки", ad: "РЕКЛАМА",
    regions: { us: "США / Канада", eu: "Європа", asia: "Азія / Інші" }
  },
  es: { 
    dir: 'ltr', subtitle: "Comprobación gratuita de especificaciones", placeholder: "Ingrese el VIN...", button: "VERIFICAR", history: "Búsquedas recientes", ad: "ANUNCIO",
    regions: { us: "EE.UU. / Canadá", eu: "Europa", asia: "Asia / Global" }
  },
  de: { 
    dir: 'ltr', subtitle: "Kostenlose Fahrzeug-Prüfung", placeholder: "VIN eingeben...", button: "PRÜFEN", history: "Letzte Suchen", ad: "ANZEIGE",
    regions: { us: "USA / Kanada", eu: "Europa", asia: "Asien / Global" }
  },
  zh: { 
    dir: 'ltr', subtitle: "免费车辆规格查询", placeholder: "输入17位VIN码...", button: "查询", history: "最近查询", ad: "广告",
    regions: { us: "美国 / 加拿大", eu: "欧洲", asia: "亚洲 / 全球" }
  },
  ar: { 
    dir: 'rtl', subtitle: "فحص مواصفات السيارة مجاناً", placeholder: "أدخل رمز VIN...", button: "تحقق", history: "عمليات البحث الأخيرة", ad: "إعلان",
    regions: { us: "أمريكا / كندا", eu: "أوروبا", asia: "آسيا / عالمي" }
  }
};

const popularVins = ["1FA6P8CF5G", "1C4PJMDS7FW", "3VW637AJ7H"];

export default function Home() {
  const [lang, setLang] = useState('en');
  const [vin, setVin] = useState('');
  const [region, setRegion] = useState('us');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";

    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }

    try {
      const savedHistory = JSON.parse(localStorage.getItem('vinHistory') || "[]");
      setHistory(Array.isArray(savedHistory) && savedHistory.length > 0 ? savedHistory : popularVins);
    } catch (e) {
      setHistory(popularVins);
    }
  }, []);

  const t = translations[lang] || translations.en;

  const handleSearch = () => {
    // Жорстко залишаємо ТІЛЬКИ букви і цифри (видаляємо дефіси, пробіли тощо)
    const cleanVin = vin.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    if (cleanVin.length === 17) {
      try {
        const safeHistory = Array.isArray(history) ? history : popularVins;
        const newHistory = [cleanVin, ...safeHistory.filter(h => h !== cleanVin)].slice(0, 5);
        localStorage.setItem('vinHistory', JSON.stringify(newHistory));
      } catch (err) {}
      
      // Переходимо за адресою
      window.location.href = `/vin/${cleanVin}?region=${region}`;
    } else {
      alert(`Увага! VIN має містити рівно 17 символів.\nЗараз їх: ${cleanVin.length}\nВаш код: ${cleanVin}`);
    }
  };

  // Щоб працював Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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
      
      {/* Замінили form на div, щоб браузер не втручався */}
      <div className="vin-form">
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
            onKeyDown={handleKeyDown}
            placeholder={t.placeholder}
          />
          <button type="button" onClick={handleSearch}>{t.button}</button>
        </div>
      </div>

      <div className="history-section">
        <p>{t.history}</p>
        <div className="history-chips">
          {history.map((h, i) => (
            <span key={i} onClick={() => { window.location.href = `/vin/${h}?region=${region}`; }} className="chip">
              {h}
            </span>
          ))}
        </div>
      </div>

      <div className="ad-placeholder top-ad">
        <span>{t.ad}</span>
      </div>

      <footer className="footer">
        <p>© 2026 VIN DECODER</p>
      </footer>

      <style jsx global>{`
        body { background-color: #000; margin: 0; padding: 0; line-height: 1.5; }
        .container { min-height: 100vh; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; box-sizing: border-box; color: #fff; text-align: center; }
        
        .lang-switcher { display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; margin-bottom: 30px; direction: ltr; }
        .lang-switcher button { background: #111; color: #fff; border: 1px solid #222; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold; transition: 0.2s; }
        .lang-switcher button.active { background: #facc15; color: #000; border-color: #facc15; }

        .header { margin-bottom: 40px; }
        .header h1 { font-size: clamp(2.5rem, 10vw, 4rem); font-weight: 900; margin: 0; letter-spacing: -3px; line-height: 1; direction: ltr; }
        .header .yellow { color: #facc15; }
        .header .white { color: #fff; }
        .subtitle { color: #888; font-size: 1rem; font-weight: bold; margin-top: 10px; }

        .vin-form { max-width: 600px; margin: 0 auto 30px; }
        
        .region-selector { display: flex; background: #0a0a0a; border: 1px solid #333; border-radius: 12px; padding: 5px; margin-bottom: 15px; }
        .region-btn { flex: 1; background: transparent; color: #888; border: none; padding: 12px; font-size: 0.9rem; font-weight: bold; border-radius: 8px; cursor: pointer; transition: 0.3s; }
        .region-btn:hover { color: #fff; }
        .region-btn.active { background: #333; color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.5); }

        .input-group { display: flex; flex-direction: column; gap: 10px; }
        .input-group input { 
          padding: 18px; font-size: 18px; border: 1px solid #333; border-radius: 12px; 
          background: #0a0a0a; color: #fff; text-align: center; outline: none; width: 100%; box-sizing: border-box; transition: 0.3s;
        }
        .input-group input:focus { border-color: #facc15; }
        .input-group button { 
          padding: 18px; font-size: 18px; background: #facc15; border: none; border-radius: 12px; 
          font-weight: bold; color: #000; cursor: pointer; width: 100%; transition: 0.2s;
        }
        .input-group button:hover { background: #eab308; }

        .history-section { margin-bottom: 40px; }
        .history-section p { color: #444; font-size: 11px; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 1px; font-weight: bold; }
        .history-chips { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .chip { background: #0a0a0a; border: 1px solid #222; padding: 6px 14px; border-radius: 20px; font-size: 12px; cursor: pointer; color: #888; transition: 0.2s; }
        .chip:hover { border-color: #facc15; color: #facc15; }

        .ad-placeholder { background-color: #0a0a0a; border: 1px dashed #333; display: flex; align-items: center; justify-content: center; color: #333; font-size: 10px; letter-spacing: 2px; border-radius: 8px; margin: 40px auto; overflow: hidden; direction: ltr !important; }
        .top-ad { max-width: 728px; height: 90px; }

        .footer { text-align: center; margin-top: 60px; color: #222; font-size: 11px; direction: ltr; }

        @media (min-width: 600px) {
          .input-group { flex-direction: row; gap: 0; }
          
          [dir='ltr'] .input-group input { border-radius: 12px 0 0 12px; border-right: none; }
          [dir='ltr'] .input-group button { border-radius: 0 12px 12px 0; width: auto; padding: 0 40px; }
          
          [dir='rtl'] .input-group input { border-radius: 0 12px 12px 0; border-left: none; }
          [dir='rtl'] .input-group button { border-radius: 12px 0 0 12px; width: auto; padding: 0 40px; }
        }
      `}</style>
    </div>
  );
}
