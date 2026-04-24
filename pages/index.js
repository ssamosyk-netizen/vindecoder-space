import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: {
    dir: 'ltr',
    metaTitle: "VIN DECODER | Free Vehicle Specifications Report",
    metaDesc: "Free online VIN decoder. Check any vehicle specifications, engine data, and manufacturing details instantly.",
    title: "FREE VIN DECODER",
    subtitle: "Get full vehicle specifications and manufacturing details instantly.",
    placeholder: "Enter 17-character VIN...",
    button: "DECODE",
    popular: "Popular Brands",
    history: "Recent Searches",
    footer: "© 2026 VIN DECODER | PROFESSIONAL DATA",
    policy: "Privacy Policy",
    terms: "Terms of Service",
    alert: "Please enter a valid VIN code"
  },
  uk: {
    dir: 'ltr',
    metaTitle: "VIN ДЕКОДЕР | Безкоштовний звіт про технічні характеристики",
    metaDesc: "Безкоштовний онлайн VIN декодер. Миттєво перевіряйте характеристики авто, дані двигуна та деталі виробництва.",
    title: "БЕЗКОШТОВНИЙ VIN ДЕКОДЕР",
    subtitle: "Отримайте повні технічні характеристики та дані про заводське складання автомобіля.",
    placeholder: "Введіть 17-значний VIN...",
    button: "ПЕРЕВІРИТИ",
    popular: "Популярні марки",
    history: "Останні пошуки",
    footer: "© 2026 VIN DECODER | ПРОФЕСІЙНІ ДАНІ",
    policy: "Політика конфіденційності",
    terms: "Умови використання",
    alert: "Будь ласка, введіть коректний VIN код"
  },
  es: {
    dir: 'ltr',
    metaTitle: "DECODIFICADOR VIN | Informe gratuito de especificaciones",
    metaDesc: "Decodificador VIN en línea gratuito. Verifique las especificaciones del vehículo al instante.",
    title: "DECODIFICADOR VIN GRATUITO",
    subtitle: "Obtenga especificaciones completas del vehículo y detalles de fabricación.",
    placeholder: "Ingrese el VIN de 17 caracteres...",
    button: "DECODIFICAR",
    popular: "Marcas populares",
    history: "Búsquedas recientes",
    footer: "© 2026 VIN DECODER | DATOS PROFESIONALES",
    policy: "Política de privacidad",
    terms: "Términos de servicio",
    alert: "Ingrese un VIN válido"
  },
  de: {
    dir: 'ltr',
    metaTitle: "VIN DECODER | Kostenloser Fahrzeugbericht",
    metaDesc: "Kostenloser Online-VIN-Decoder. Prüfen Sie sofort Fahrzeugspezifikationen.",
    title: "KOSTENLOSER VIN DECODER",
    subtitle: "Erhalten Sie sofort vollständige Fahrzeugspezifikationen und Details.",
    placeholder: "17-stellige VIN eingeben...",
    button: "DEKODIEREN",
    popular: "Beliebte Marken",
    history: "Letzte Suchen",
    footer: "© 2026 VIN DECODER | PROFESSIONELLE DATEN",
    policy: "Datenschutzrichtlinie",
    terms: "Nutzungsbedingungen",
    alert: "Bitte geben Sie eine gültige VIN ein"
  },
  zh: {
    dir: 'ltr',
    metaTitle: "车架号解码器 | 免费车辆规格报告",
    metaDesc: "免费在线车架号 (VIN) 解码器。立即查询车辆规格和制造详情。",
    title: "免费车架号 (VIN) 解码器",
    subtitle: "立即获取完整的车辆规格和制造详情。",
    placeholder: "输入17位车架号...",
    button: "解码",
    popular: "热门品牌",
    history: "最近搜索",
    footer: "© 2026 VIN DECODER | 专业数据",
    policy: "隐私政策",
    terms: "服务条款",
    alert: "请输入有效的车架号"
  },
  ar: {
    dir: 'rtl',
    metaTitle: "فك تشفير رقم الشاسيه | تقرير مواصفات السيارة مجاناً",
    metaDesc: "أداة فك تشفير رقم الشاسيه مجانية عبر الإنترنت. تحقق من مواصفات السيارة وتفاصيل التصنيع فوراً.",
    title: "فك تشفير رقم الشاسيه مجاناً",
    subtitle: "احصل على مواصفات السيارة الكاملة وتفاصيل التصنيع على الفور.",
    placeholder: "أدخل رقم الشاسيه المكون من 17 حرفاً...",
    button: "فك التشفير",
    popular: "ماركات شعبية",
    history: "عمليات البحث الأخيرة",
    footer: "© 2026 VIN DECODER | بيانات احترافية",
    policy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    alert: "يرجى إدخال رقم شاسيه صحيح"
  }
};

const popularMakes = [
  { name: 'Ford', slug: 'ford' }, { name: 'Chevrolet', slug: 'chevrolet' },
  { name: 'Dodge', slug: 'dodge' }, { name: 'Jeep', slug: 'jeep' },
  { name: 'Tesla', slug: 'tesla' }, { name: 'GMC', slug: 'gmc' },
  { name: 'Chrysler', slug: 'chrysler' }, { name: 'Cadillac', slug: 'cadillac' },
  { name: 'Buick', slug: 'buick' }, { name: 'Lincoln', slug: 'lincoln' },
  { name: 'Toyota', slug: 'toyota' }, { name: 'Honda', slug: 'honda' }
];

export default function Home() {
  const router = useRouter();
  const [vin, setVin] = useState('');
  const [lang, setLang] = useState('en');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);
    
    const savedHistory = JSON.parse(localStorage.getItem('vinHistory') || 'null');
    if (savedHistory && savedHistory.length > 0) {
      setHistory(savedHistory);
    } else {
      setHistory(['W0L0TGF7552063190', '5YJ3E1EA5LF424312', '1HGCM82633A00435']);
    }
  }, []);

  const t = translations[lang] || translations.en;

  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem('userLanguage', newLang);
  };

  const handleSearch = (searchVin = vin) => {
    const finalVin = searchVin.toUpperCase().trim();
    if (finalVin.length >= 8) {
      const newHistory = [finalVin, ...history.filter(h => h !== finalVin)].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem('vinHistory', JSON.stringify(newHistory));
      router.push(`/vin/${finalVin}`);
    } else {
      alert(t.alert);
    }
  };

  return (
    <div className="container" dir={t.dir}>
      <Head>
        <title>{t.metaTitle}</title>
        <meta name="description" content={t.metaDesc} />
        <link rel="icon" href="/favicon.png" />
        
        <meta property="og:title" content={t.metaTitle} />
        <meta property="og:description" content={t.metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vindecoder.space/" />
      </Head>

      <header className="header">
        <div className="logo" onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span>DECODER
        </div>
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
        <h1 className="brand-title"><span className="yellow">VIN</span>DECODER</h1>
        <h2 className="localized-title">{t.title}</h2>
        <p className="subtitle">{t.subtitle}</p>

        <div className="search-box">
          <input 
            type="text" 
            placeholder={t.placeholder} 
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={() => handleSearch()}>{t.button}</button>
        </div>

        <div className="makes-section">
          <h3>{t.popular}</h3>
          <div className="makes-grid">
            {popularMakes.map((make) => (
              <div key={make.slug} className="make-item" onClick={() => router.push(`/make/${make.slug}`)}>
                {make.name}
              </div>
            ))}
          </div>
        </div>

        {history.length > 0 && (
          <div className="history-section">
            <span className="section-label">{t.history}</span>
            <div className="history-chips">
              {history.map((h) => (
                <span key={h} className="chip" onClick={() => handleSearch(h)}>{h}</span>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-links">
          <span onClick={() => router.push('/privacy-policy')}>{t.policy}</span>
          <span className="dot">•</span>
          <span onClick={() => router.push('/terms')}>{t.terms}</span>
        </div>
        <p className="copyright">{t.footer}</p>
      </footer>

      <style jsx global>{`
        body { background-color: #000; color: #fff; margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; overflow-x: hidden; }
      `}</style>

      <style jsx>{`
        .container { min-height: 100vh; display: flex; flex-direction: column; padding: 0 20px; max-width: 1200px; margin: 0 auto; box-sizing: border-box; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 30px 0; }
        .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px; }
        .yellow { color: #facc15; }
        
        .lang-bar { display: flex; gap: 8px; font-size: 10px; font-weight: bold; }
        .lang-bar span { cursor: pointer; padding: 6px 10px; border: 1px solid transparent; border-radius: 8px; transition: all 0.2s; color: #444; }
        .lang-bar span.active { color: #facc15; border-color: #facc15; background: rgba(250, 204, 21, 0.05); }
        .lang-bar span:hover:not(.active) { color: #aaa; border-color: #222; }

        .main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px 0 40px; text-align: center; }
        
        .brand-title { font-size: clamp(3.5rem, 12vw, 6.5rem); font-weight: 900; margin: 0; line-height: 0.9; letter-spacing: -3px; }
        .localized-title { font-size: clamp(1.3rem, 4vw, 1.8rem); font-weight: 700; color: #aaa; margin: 20px 0 10px; letter-spacing: 2px; text-transform: uppercase; }
        .subtitle { color: #777; margin: 0 0 40px; font-size: clamp(1.1rem, 2.5vw, 1.3rem); max-width: 600px; line-height: 1.5; }

        .search-box { width: 100%; max-width: 700px; display: flex; gap: 10px; background: #111; padding: 10px; border-radius: 25px; border: 1px solid #222; margin-bottom: 80px; }
        input { flex: 1; background: transparent; border: none; padding: 15px 25px; color: #fff; font-size: 1.1rem; outline: none; }
        button { background: #facc15; color: #000; border: none; padding: 0 40px; border-radius: 18px; font-weight: 900; cursor: pointer; text-transform: uppercase; transition: transform 0.2s; }
        button:active { transform: scale(0.95); }

        .makes-section { width: 100%; max-width: 900px; margin-bottom: 60px; }
        .makes-section h3 { color: #222; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 25px; }
        .makes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 12px; }
        .make-item { background: #0a0a0a; border: 1px solid #111; padding: 15px; border-radius: 12px; font-size: 13px; font-weight: bold; color: #777; cursor: pointer; transition: 0.2s; text-transform: uppercase; }
        .make-item:hover { border-color: #facc15; color: #fff; background: #111; }

        .history-section { display: flex; flex-direction: column; align-items: center; gap: 15px; padding-bottom: 40px; }
        .section-label { font-size: 10px; color: #222; text-transform: uppercase; font-weight: bold; letter-spacing: 1px; }
        .history-chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .chip { background: #080808; border: 1px solid #1a1a1a; padding: 6px 14px; border-radius: 20px; font-size: 11px; color: #555; cursor: pointer; transition: 0.2s; font-family: monospace; }
        .chip:hover { border-color: #facc15; color: #facc15; }

        .footer { padding: 40px 0; color: #555; font-size: 12px; text-align: center; }
        .footer-links { display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; }
        .footer-links span { cursor: pointer; transition: color 0.2s; }
        .footer-links span:hover { color: #facc15; }
        .dot { color: #333; cursor: default !important; }
        .copyright { font-size: 10px; font-weight: bold; letter-spacing: 1px; color: #222; text-transform: uppercase; margin: 0; }

        @media (max-width: 768px) {
          .header { flex-direction: column; gap: 20px; }
          .search-box { flex-direction: column; background: transparent; border: none; padding: 0; margin-bottom: 40px; }
          input { background: #111; border: 1px solid #222; border-radius: 20px; margin-bottom: 10px; }
          button { padding: 20px; border-radius: 20px; }
          .makes-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
// --- КІНЕЦЬ ФАЙЛУ INDEX.JS ---
