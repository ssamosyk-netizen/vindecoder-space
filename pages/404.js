import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: {
    dir: 'ltr',
    title: "404 | Page Not Found",
    bigText: "404",
    oops: "VEHICLE NOT FOUND",
    msg: "The vehicle or page you are looking for doesn't exist, has been moved, or the VIN is incorrect.",
    btn: "BACK TO SEARCH",
    policy: "Privacy Policy",
    terms: "Terms of Service",
    footer: "© 2026 VIN DECODER | PROFESSIONAL DATA"
  },
  uk: {
    dir: 'ltr',
    title: "404 | Сторінку не знайдено",
    bigText: "404",
    oops: "АВТОМОБІЛЬ НЕ ЗНАЙДЕНО",
    msg: "Сторінка, яку ви шукаєте, не існує, або ви ввели неправильний VIN-код.",
    btn: "НАЗАД ДО ПОШУКУ",
    policy: "Політика конфіденційності",
    terms: "Умови використання",
    footer: "© 2026 VIN DECODER | ПРОФЕСІЙНІ ДАНІ"
  },
  es: {
    dir: 'ltr',
    title: "404 | Página No Encontrada",
    bigText: "404",
    oops: "VEHÍCULO NO ENCONTRADO",
    msg: "La página que buscas no existe o el código VIN es incorrecto.",
    btn: "VOLVER A LA BÚSQUEDA",
    policy: "Política de Privacidad",
    terms: "Términos de Servicio",
    footer: "© 2026 VIN DECODER | DATOS PROFESIONALES"
  },
  de: {
    dir: 'ltr',
    title: "404 | Seite nicht gefunden",
    bigText: "404",
    oops: "FAHRZEUG NICHT GEFUNDEN",
    msg: "Die gesuchte Seite existiert nicht oder die VIN ist falsch.",
    btn: "ZURÜCK ZUR SUCHE",
    policy: "Datenschutzrichtlinie",
    terms: "Nutzungsbedingungen",
    footer: "© 2026 VIN DECODER | PROFESSIONELLE DATEN"
  },
  zh: {
    dir: 'ltr',
    title: "404 | 找不到页面",
    bigText: "404",
    oops: "未找到车辆",
    msg: "您寻找的页面不存在，或者车架号不正确。",
    btn: "返回搜索",
    policy: "隐私政策",
    terms: "服务条款",
    footer: "© 2026 VIN DECODER | 专业数据"
  },
  ar: {
    dir: 'rtl',
    title: "404 | الصفحة غير موجودة",
    bigText: "404",
    oops: "لم يتم العثور على المركبة",
    msg: "الصفحة التي تبحث عنها غير موجودة أو أن رقم الشاسيه غير صحيح.",
    btn: "العودة للبحث",
    policy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    footer: "© 2026 VIN DECODER | بيانات احترافية"
  }
};

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'UK' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
  { code: 'zh', label: 'ZH' },
  { code: 'ar', label: 'AR' }
];

export default function Custom404() {
  const router = useRouter();
  const [lang, setLang] = useState('en');

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

  return (
    <div className="container" dir={t.dir}>
      <Head>
        <title>{t.title}</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <header className="header">
        <div className="logo" onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span>DECODER
        </div>
        
        <div className="lang-switcher">
          {languages.map((l) => (
            <span 
              key={l.code}
              className={lang === l.code ? 'active' : ''} 
              onClick={() => toggleLang(l.code)}
            >
              {l.label}
            </span>
          ))}
        </div>
      </header>

      <main className="main">
        <div className="error-wrapper">
          <h1 className="big-text">{t.bigText}</h1>
          <h2 className="oops-text">{t.oops}</h2>
          <p className="msg-text">{t.msg}</p>
          <button className="back-btn" onClick={() => router.push('/')}>{t.btn}</button>
        </div>
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
        html, body {
          margin: 0;
          padding: 0;
          background-color: #000;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          overflow-x: hidden;
        }
      `}</style>

      <style jsx>{`
        .container { padding: 0 20px; text-align: center; max-width: 1200px; margin: 0 auto; min-height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; }
        
        .header { display: flex; justify-content: space-between; align-items: center; padding: 30px 0 60px; }
        .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px; }
        .yellow { color: #facc15; }
        
        .lang-switcher { display: flex; gap: 8px; font-size: 10px; font-weight: bold; }
        .lang-switcher span { cursor: pointer; padding: 6px 10px; border: 1px solid transparent; border-radius: 8px; transition: all 0.2s; color: #444; }
        .lang-switcher span.active { color: #facc15; border-color: #facc15; background: rgba(250, 204, 21, 0.05); }
        .lang-switcher span:hover:not(.active) { color: #aaa; border-color: #222; }

        .main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 60px; }
        
        .error-wrapper { max-width: 600px; }
        .big-text { font-size: clamp(6rem, 15vw, 12rem); font-weight: 900; margin: 0; line-height: 1; color: transparent; -webkit-text-stroke: 2px #333; text-shadow: 4px 4px 0 #facc15; letter-spacing: -5px; }
        .oops-text { font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 900; text-transform: uppercase; margin: 20px 0 10px; color: #fff; letter-spacing: 2px; }
        .msg-text { color: #888; font-size: 1.1rem; line-height: 1.6; margin-bottom: 40px; }
        
        .back-btn { padding: 18px 40px; border-radius: 18px; border: none; background: #facc15; color: #000; font-weight: 900; font-size: 1rem; cursor: pointer; text-transform: uppercase; transition: transform 0.2s, box-shadow 0.2s; }
        .back-btn:hover { box-shadow: 0 0 20px rgba(250, 204, 21, 0.3); }
        .back-btn:active { transform: scale(0.95); }

        .footer { padding: 40px 0; color: #555; font-size: 12px; text-align: center; }
        .footer-links { display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; }
        .footer-links span { cursor: pointer; transition: color 0.2s; }
        .footer-links span:hover { color: #facc15; }
        .dot { color: #333; cursor: default !important; }
        .copyright { font-size: 10px; font-weight: bold; letter-spacing: 1px; color: #222; text-transform: uppercase; margin: 0; }
        
        @media (max-width: 768px) {
          .header { flex-direction: column; gap: 20px; padding-bottom: 40px; }
        }
      `}</style>
    </div>
  );
}
