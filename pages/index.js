import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Redis } from '@upstash/redis';

const translations = {
  en: { dir: 'ltr', subtitle: "Free vehicle specification check", placeholder: "Enter 17-digit VIN...", button: "CHECK", history: "Global Recent Searches", ad: "ADVERTISEMENT", privacy: "Privacy Policy", regions: { us: "US / Canada", eu: "Europe", asia: "Asia / Global" } },
  uk: { dir: 'ltr', subtitle: "Безкоштовна розшифровка специфікацій", placeholder: "Введіть 17 символів VIN...", button: "ПЕРЕВІРИТИ", history: "Останні перевірки у світі", ad: "РЕКЛАМА", privacy: "Політика конфіденційності", regions: { us: "США / Канада", eu: "Європа", asia: "Азія / Інші" } },
  es: { dir: 'ltr', subtitle: "Comprobación gratuita de especificaciones", placeholder: "Ingrese el VIN...", button: "VERIFICAR", history: "Búsquedas globales recientes", ad: "ANUNCIO", privacy: "Política de privacidad", regions: { us: "EE.UU. / Canadá", eu: "Europa", asia: "Asia / Global" } },
  de: { dir: 'ltr', subtitle: "Kostenlose Fahrzeug-Prüfung", placeholder: "VIN eingeben...", button: "PRÜFEN", history: "Globale letzte Suchen", ad: "ANZEIGE", privacy: "Datenschutz", regions: { us: "USA / Kanada", eu: "Europa", asia: "Asien / Global" } },
  zh: { dir: 'ltr', subtitle: "免费车辆规格查询", placeholder: "输入17位VIN码...", button: "查询", history: "全球最近查询", ad: "广告", privacy: "隐私政策", regions: { us: "美国 / 加拿大", eu: "欧洲", asia: "亚洲 / 全球" } },
  ar: { dir: 'rtl', subtitle: "فحص مواصفات السيارة مجاناً", placeholder: "أدخل رمز VIN...", button: "تحقق", history: "عمليات البحث العالمية الأخيرة", ad: "إعلان", privacy: "سياسة الخصوصية", regions: { us: "أمريكا / كندا", eu: "أوروبا", asia: "آسيا / عالمي" } }
};

// МАГІЯ SEO: Ця функція виконується на сервері Vercel ДО завантаження сторінки
export async function getServerSideProps() {
  try {
    const redis = Redis.fromEnv();
    // Дістаємо останні 15 реальних кодів прямо з бази
    const vins = await redis.lrange('recent_vins', 0, 14);
    
    return {
      props: {
        initialHistory: vins || [] // Передаємо реальні коди на сторінку
      }
    };
  } catch (error) {
    console.error("Помилка SSR Redis:", error);
    return { props: { initialHistory: [] } }; // Якщо база порожня, нічого не показуємо
  }
}

// ... (верхня частина з перекладами та getServerSideProps залишається такою ж)

export default function Home({ initialHistory }) {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [vin, setVin] = useState('');
  const [region, setRegion] = useState('us'); // За замовчуванням 'us'
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);
  }, []);

  const t = translations[lang] || translations.en;

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanVin = vin.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (cleanVin.length === 17) {
      setIsSearching(true);
      try {
        await fetch('/api/vins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vin: cleanVin })
        });
      } catch (err) {}
      
      // ЧИСТИЙ ЛІНК: Додаємо регіон лише якщо це НЕ 'us'
      const url = `/vin/${cleanVin}${region !== 'us' ? `?region=${region}` : ''}`;
      router.push(url);
    } else {
      alert(lang === 'uk' ? `Потрібно 17 символів!` : `17 symbols required!`);
    }
  };

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>VIN DECODER - {t.subtitle}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta property="og:title" content="VIN DECODER - Free Vehicle Specification Report" />
        <meta property="og:image" content="https://vindecoder.space/og-image.jpg" />
      </Head>

      <div className="lang-switcher">
        {Object.keys(translations).map(l => (
          <button key={l} onClick={() => { setLang(l); localStorage.setItem('userLanguage', l); }} className={lang === l ? 'active' : ''}>{l.toUpperCase()}</button>
        ))}
      </div>

      <div className="header">
        <h1><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
        <p className="subtitle">{t.subtitle}</p>
      </div>
      
      <div className="vin-form">
        <div className="region-selector">
          {Object.entries(t.regions).map(([key, label]) => (
            <button key={key} type="button" className={`region-btn ${region === key ? 'active' : ''}`} onClick={() => setRegion(key)}>{label}</button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="input-group">
          <input type="text" value={vin} onChange={(e) => setVin(e.target.value)} placeholder={t.placeholder} maxLength="25" />
          <button type="submit" disabled={isSearching}>{isSearching ? "..." : t.button}</button>
        </form>
      </div>

      {initialHistory && initialHistory.length > 0 && (
        <div className="history-section">
          <p>{t.history}</p>
          <div className="history-chips">
            {initialHistory.map((h, i) => {
              // Чистий лінк для історії (якщо людина клікає на історію, зазвичай це US авто)
              const historyUrl = `/vin/${h}${region !== 'us' ? `?region=${region}` : ''}`;
              return (
                <a key={i} href={historyUrl} onClick={(e) => { e.preventDefault(); setIsSearching(true); router.push(historyUrl); }} className="chip" style={{textDecoration: 'none'}}>{h}</a>
              );
            })}
          </div>
        </div>
      )}

      <footer className="footer"><p>© 2026 VIN DECODER | <a href="/privacy">{t.privacy}</a></p></footer>

      <style jsx global>{`
        body { background-color: #000; margin: 0; padding: 0; color: #fff; }
        .container { min-height: 100vh; padding: 20px; font-family: sans-serif; box-sizing: border-box; text-align: center; display: flex; flex-direction: column; }
        .lang-switcher { display: flex; justify-content: center; gap: 6px; flex-wrap: wrap; margin-bottom: 30px; direction: ltr; }
        .lang-switcher button { background: #111; color: #fff; border: 1px solid #222; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: bold; }
        .lang-switcher button.active { background: #facc15; color: #000; border-color: #facc15; }
        .header { margin-bottom: 40px; }
        .header h1 { font-size: clamp(2.5rem, 10vw, 4rem); font-weight: 900; margin: 0; letter-spacing: -3px; line-height: 1; direction: ltr; }
        .yellow { color: #facc15; } .white { color: #fff; }
        .subtitle { color: #888; font-size: 1rem; font-weight: bold; margin-top: 10px; }
        .vin-form { max-width: 600px; margin: 0 auto 30px; width: 100%; }
        .region-selector { display: flex; background: #0a0a0a; border: 1px solid #333; border-radius: 12px; padding: 5px; margin-bottom: 15px; }
        .region-btn { flex: 1; background: transparent; color: #888; border: none; padding: 12px; font-size: 0.9rem; font-weight: bold; border-radius: 8px; cursor: pointer; }
        .region-btn.active { background: #333; color: #fff; }
        .input-group { display: flex; flex-direction: column; gap: 10px; border-radius: 12px; overflow: hidden; }
        .input-group input { padding: 18px; font-size: 18px; border: 1px solid #333; background: #0a0a0a; color: #fff; text-align: center; outline: none; width: 100%; box-sizing: border-box; border-radius: 12px; }
        .input-group button { padding: 18px; font-size: 18px; background: #facc15; border: none; font-weight: bold; color: #000; cursor: pointer; border-radius: 12px; }
        .history-section { margin-bottom: 40px; flex-grow: 1; }
        .history-section p { color: #444; font-size: 11px; text-transform: uppercase; margin-bottom: 12px; font-weight: bold; }
        .history-chips { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
        .chip { display: inline-block; background: #0a0a0a; border: 1px solid #222; padding: 6px 14px; border-radius: 20px; font-size: 12px; color: #888; transition: 0.2s; }
        .chip:hover { border-color: #facc15; color: #facc15; }
        .footer { padding: 40px 0; color: #222; font-size: 11px; }
        .footer a { color: #444; text-decoration: none; margin-left: 10px; }
        @media (min-width: 600px) {
          .input-group { flex-direction: row; gap: 0; border: 1px solid #333; background: #0a0a0a; }
          .input-group input { border: none !important; border-radius: 0 !important; flex: 1; }
          .input-group button { border-radius: 0 !important; width: auto !important; padding: 0 40px !important; }
        }
      `}</style>
    </div>
  );
}
