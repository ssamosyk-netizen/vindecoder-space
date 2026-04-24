import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: {
    dir: 'ltr',
    title: "FREE VIN DECODER",
    subtitle: "Get full vehicle specifications and manufacturing details instantly.",
    placeholder: "Enter 17-character VIN...",
    button: "DECODE",
    popular: "Popular Brands",
    footer: "© 2026 VIN DECODER | PROFESSIONAL DATA",
    alert: "Please enter a valid 17-character VIN"
  },
  uk: {
    dir: 'ltr',
    title: "БЕЗКОШТОВНИЙ VIN ДЕКОДЕР",
    subtitle: "Отримайте повні технічні характеристики та дані про виробництво миттєво.",
    placeholder: "Введіть 17-значний VIN...",
    button: "ПЕРЕВІРИТИ",
    popular: "Популярні марки",
    footer: "© 2026 VIN DECODER | ПРОФЕСІЙНІ ДАНІ",
    alert: "Будь ласка, введіть коректний 17-значний VIN"
  },
  es: {
    dir: 'ltr',
    title: "DECODIFICADOR VIN GRATUITO",
    subtitle: "Obtenga especificaciones completas del vehículo y detalles de fabricación.",
    placeholder: "Ingrese el VIN de 17 caracteres...",
    button: "DECODIFICAR",
    popular: "Marcas populares",
    footer: "© 2026 VIN DECODER | DATOS PROFESIONALES",
    alert: "Ingrese un VIN válido de 17 caracteres"
  },
  de: {
    dir: 'ltr',
    title: "KOSTENLOSER VIN DECODER",
    subtitle: "Erhalten Sie sofort vollständige Fahrzeugspezifikationen und Details.",
    placeholder: "17-stellige VIN eingeben...",
    button: "DEKODIEREN",
    popular: "Beliebte Marken",
    footer: "© 2026 VIN DECODER | PROFESSIONELLE DATEN",
    alert: "Bitte geben Sie eine gültige 17-stellige VIN ein"
  },
  zh: {
    dir: 'ltr',
    title: "免费车架号 (VIN) 解码器",
    subtitle: "立即获取完整的车辆规格和制造详情。",
    placeholder: "输入17位车架号...",
    button: "解码",
    popular: "热门品牌",
    footer: "© 2026 VIN DECODER | 专业数据",
    alert: "请输入有效的17位车架号"
  },
  ar: {
    dir: 'rtl',
    title: "فك تشفير رقم الشاسيه مجاناً",
    subtitle: "احصل على مواصفات السيارة الكاملة وتفاصيل التصنيع على الفور.",
    placeholder: "أدخل رقم الشاسيه المكون من 17 حرفًا...",
    button: "فك التشفير",
    popular: "ماركات شعبية",
    footer: "© 2026 VIN DECODER | بيانات احترافية",
    alert: "يرجى إدخال رقم شاسيه صحيح مكون من 17 حرفًا"
  }
};

const popularMakes = [
  { name: 'Ford', slug: 'ford' },
  { name: 'Hyundai', slug: 'hyundai' },
  { name: 'Kia', slug: 'kia' },
  { name: 'Toyota', slug: 'toyota' },
  { name: 'BMW', slug: 'bmw' },
  { name: 'Mercedes', slug: 'mercedes-benz' },
  { name: 'Volkswagen', slug: 'volkswagen' },
  { name: 'Tesla', slug: 'tesla' },
  { name: 'Chevrolet', slug: 'chevrolet' },
  { name: 'Audi', slug: 'audi' },
  { name: 'Nissan', slug: 'nissan' },
  { name: 'Lexus', slug: 'lexus' }
];

export default function Home() {
  const router = useRouter();
  const [vin, setVin] = useState('');
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);
  }, []);

  const t = translations[lang];

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('userLanguage', newLang);
  };

  const handleSearch = () => {
    if (vin.trim().length >= 10) {
      router.push(`/vin/${vin.toUpperCase().trim()}`);
    } else {
      alert(t.alert);
    }
  };

  return (
    <div className="container" dir={t.dir}>
      <Head>
        <title>VIN DECODER | Free Vehicle Specifications Report</title>
        <meta name="description" content="Free online VIN decoder. Check any vehicle specifications, engine data, and options instantly." />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <header className="header">
        <div className="logo"><span className="yellow">VIN</span>DECODER</div>
        <div className="lang-bar">
          {Object.keys(translations).map((l) => (
            <span 
              key={l} 
              className={lang === l ? 'active' : ''} 
              onClick={() => handleLangChange(l)}
            >
              {l.toUpperCase()}
            </span>
          ))}
        </div>
      </header>

      <main className="main">
        <h1 className="title">{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>

        <div className="search-box">
          <input 
            type="text" 
            placeholder={t.placeholder} 
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>{t.button}</button>
        </div>

        {/* Блок з марками */}
        <div className="makes-section">
          <h3>{t.popular}</h3>
          <div className="makes-grid">
            {popularMakes.map((make) => (
              <div 
                key={make.slug} 
                className="make-item"
                onClick={() => router.push(`/make/${make.slug}`)}
              >
                {make.name}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="footer">{t.footer}</footer>

      <style jsx global>{`
        body { background-color: #000; color: #fff; margin: 0; font-family: sans-serif; overflow-x: hidden; }
      `}</style>

      <style jsx>{`
        .container { min-height: 100vh; display: flex; flex-direction: column; padding: 0 20px; max-width: 1200px; margin: 0 auto; box-sizing: border-box; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 30px 0; }
        .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px; cursor: pointer; }
        .yellow { color: #facc15; }
        
        .lang-bar { display: flex; gap: 10px; font-size: 11px; font-weight: bold; color: #444; }
        .lang-bar span { cursor: pointer; padding: 5px; transition: color 0.2s; }
        .lang-bar span.active { color: #facc15; }
        .lang-bar span:hover { color: #fff; }

        .main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; text-align: center; }
        .title { font-size: clamp(2.5rem, 10vw, 5rem); font-weight: 900; margin: 0; line-height: 0.9; letter-spacing: -3px; }
        .subtitle { color: #555; margin: 20px 0 40px; font-size: clamp(1rem, 2vw, 1.2rem); max-width: 600px; }

        .search-box { width: 100%; max-width: 700px; display: flex; gap: 10px; background: #111; padding: 12px; border-radius: 25px; border: 1px solid #222; margin-bottom: 80px; }
        input { flex: 1; background: transparent; border: none; padding: 15px 25px; color: #fff; font-size: 1.2rem; outline: none; }
        button { background: #facc15; color: #000; border: none; padding: 0 40px; border-radius: 20px; font-weight: 900; cursor: pointer; transition: transform 0.2s; }
        button:active { transform: scale(0.95); }

        .makes-section { width: 100%; max-width: 900px; }
        .makes-section h3 { color: #333; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 30px; }
        .makes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px; }
        .make-item { background: #0a0a0a; border: 1px solid #111; padding: 15px; border-radius: 12px; font-size: 14px; font-weight: bold; color: #888; cursor: pointer; transition: all 0.2s; }
        .make-item:hover { border-color: #facc15; color: #fff; background: #111; }

        .footer { padding: 40px 0; color: #222; font-size: 10px; font-weight: bold; letter-spacing: 1px; text-align: center; }

        @media (max-width: 768px) {
          .header { flex-direction: column; gap: 20px; }
          .search-box { flex-direction: column; background: transparent; border: none; padding: 0; }
          input { background: #111; border: 1px solid #222; border-radius: 20px; margin-bottom: 10px; }
          button { padding: 20px; border-radius: 20px; }
          .makes-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
