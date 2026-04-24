import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: {
    dir: 'ltr',
    heroTitle: "Free {make} VIN Decoder",
    heroSub: "Instant technical report and specifications for {make} vehicles.",
    searchPlaceholder: "Enter {make} VIN...",
    searchBtn: "Search",
    whyTitle: "Why check {make} VIN?",
    whyText: "Every {make} has a unique 17-character identifier. By decoding it, you can verify:",
    bullet1: "Actual engine displacement and configuration",
    bullet2: "Original equipment and trim level",
    bullet3: "Manufacturing plant and assembly year",
    bullet4: "Safety features and braking systems",
    alert: "Please enter a valid VIN code"
  },
  uk: {
    dir: 'ltr',
    heroTitle: "Безкоштовний VIN Декодер {make}",
    heroSub: "Миттєвий технічний звіт та характеристики для автомобілів {make}.",
    searchPlaceholder: "Введіть VIN {make}...",
    searchBtn: "Пошук",
    whyTitle: "Навіщо перевіряти VIN {make}?",
    whyText: "Кожен {make} має унікальний 17-значний ідентифікатор. Розшифрувавши його, ви можете перевірити:",
    bullet1: "Реальний об'єм та конфігурацію двигуна",
    bullet2: "Оригінальне обладнання та рівень комплектації",
    bullet3: "Завод-виробник та рік складання",
    bullet4: "Системи безпеки та гальмівні системи",
    alert: "Будь ласка, введіть коректний VIN код"
  },
  es: {
    dir: 'ltr',
    heroTitle: "Decodificador VIN de {make} gratuito",
    heroSub: "Informe técnico instantáneo y especificaciones para vehículos {make}.",
    searchPlaceholder: "Ingrese el VIN de {make}...",
    searchBtn: "Buscar",
    whyTitle: "¿Por qué verificar el VIN de {make}?",
    whyText: "Cada {make} tiene un identificador único de 17 caracteres. Al decodificarlo, puedes verificar:",
    bullet1: "Cilindrada y configuración real del motor",
    bullet2: "Equipamiento original y nivel de acabado",
    bullet3: "Planta de fabricación y año de ensamblaje",
    bullet4: "Funciones de seguridad y sistemas de frenado",
    alert: "Por favor, introduzca un código VIN válido"
  },
  de: {
    dir: 'ltr',
    heroTitle: "Kostenloser {make} VIN Decoder",
    heroSub: "Sofortiger technischer Bericht und Spezifikationen für {make} Fahrzeuge.",
    searchPlaceholder: "{make} VIN eingeben...",
    searchBtn: "Suche",
    whyTitle: "Warum den {make} VIN prüfen?",
    whyText: "Jeder {make} hat eine eindeutige 17-stellige Kennung. Durch die Dekodierung können Sie Folgendes überprüfen:",
    bullet1: "Tatsächlicher Hubraum und Motorkonfiguration",
    bullet2: "Originalausstattung und Ausstattungsvariante",
    bullet3: "Herstellungswerk und Montagejahr",
    bullet4: "Sicherheitsmerkmale und Bremssysteme",
    alert: "Bitte geben Sie einen gültigen VIN-Code ein"
  },
  zh: {
    dir: 'ltr',
    heroTitle: "免费 {make} 车架号 (VIN) 解码器",
    heroSub: "立即获取 {make} 车辆的技术报告和规格。",
    searchPlaceholder: "输入 {make} 车架号...",
    searchBtn: "搜索",
    whyTitle: "为什么要检查 {make} 车架号？",
    whyText: "每辆 {make} 都有一个唯一的 17 位识别码。通过解码，您可以验证：",
    bullet1: "实际发动机排量和配置",
    bullet2: "原始设备和装饰级别",
    bullet3: "制造工厂和组装年份",
    bullet4: "安全功能和制动系统",
    alert: "请输入有效的车架号"
  },
  ar: {
    dir: 'rtl',
    heroTitle: "فك تشفير رقم الشاسيه {make} مجاني",
    heroSub: "تقرير فني فوري ومواصفات لمركبات {make}.",
    searchPlaceholder: "أدخل رقم شاسيه {make}...",
    searchBtn: "بحث",
    whyTitle: "لماذا تتحقق من رقم شاسيه {make}؟",
    whyText: "تمتلك كل {make} معرفًا فريدًا مكونًا من 17 حرفًا. من خلال فك تشفيره ، يمكنك التحقق من:",
    bullet1: "إزاحة المحرك الفعلية وتكوينه",
    bullet2: "المعدات الأصلية ومستوى القطع",
    bullet3: "مصنع التصنيع وسنة التجميع",
    bullet4: "ميزات السلامة وأنظمة الكبح",
    alert: "يرجى إدخال رقم شاسيه صحيح"
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

export default function MakeLanding() {
  const router = useRouter();
  const { make } = router.query;
  const [vinInput, setVinInput] = useState('');
  const [lang, setLang] = useState('en');
  
  const capitalizedMake = make ? make.charAt(0).toUpperCase() + make.slice(1).toLowerCase() : '';

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

  const handleSearch = () => {
    if (vinInput.trim().length > 5) {
      router.push(`/vin/${vinInput.toUpperCase().trim()}`);
    } else {
      alert(t.alert);
    }
  };

  return (
    <div className="container" dir={t.dir}>
      <Head>
        <title>{capitalizedMake} VIN Decoder | {lang === 'uk' ? 'Перевірка характеристик' : 'Technical Specifications'}</title>
        <meta name="description" content={t.heroSub.replace('{make}', capitalizedMake)} />
        <link rel="canonical" href={`https://vindecoder.space/make/${make}`} />
        
        <meta property="og:title" content={`${capitalizedMake} VIN Decoder`} />
        <meta property="og:image" content={`https://vindecoder.space/api/og?make=${capitalizedMake}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>

      <header className="header">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span><span className="white">DECODER</span>
        </h1>
        
        <div className="lang-switcher">
          {languages.map((l, index) => (
            <React.Fragment key={l.code}>
              <span 
                className={lang === l.code ? 'active' : ''} 
                onClick={() => toggleLang(l.code)}
              >{l.label}</span>
              {index < languages.length - 1 && <span className="divider">|</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      <div className="content">
        <div className="hero">
          <h2>{t.heroTitle.replace('{make}', capitalizedMake)}</h2>
          <p>{t.heroSub.replace('{make}', capitalizedMake)}</p>
        </div>

        <div className="search-box">
          <input 
            type="text" 
            placeholder={t.searchPlaceholder.replace('{make}', capitalizedMake)} 
            value={vinInput}
            onChange={(e) => setVinInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button onClick={handleSearch}>{t.searchBtn}</button>
        </div>

        <div className="info-section">
          <h3>{t.whyTitle.replace('{make}', capitalizedMake)}</h3>
          <p>{t.whyText.replace('{make}', capitalizedMake)}</p>
          <ul>
            <li>{t.bullet1}</li>
            <li>{t.bullet2}</li>
            <li>{t.bullet3}</li>
            <li>{t.bullet4}</li>
          </ul>
        </div>
      </div>

      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background-color: #000;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        }
      `}</style>

      <style jsx>{`
        .container { padding: 20px; text-align: center; max-width: 1200px; margin: 0 auto; min-height: 100vh; box-sizing: border-box; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 60px; }
        h1 { font-size: 1.5rem; font-weight: 900; margin: 0; letter-spacing: -1px; }
        .yellow { color: #facc15; }
        
        .lang-switcher { font-size: 11px; font-weight: bold; color: #444; display: flex; gap: 2px; }
        .lang-switcher span { cursor: pointer; padding: 5px; transition: color 0.2s; }
        .lang-switcher span.active { color: #facc15; }
        .lang-switcher span:hover:not(.divider) { color: #fff; }
        .divider { cursor: default !important; color: #222; }

        .hero h2 { font-size: clamp(1.8rem, 7vw, 3.5rem); font-weight: 900; text-transform: uppercase; margin: 0 0 15px; line-height: 1.1; }
        .hero p { color: #666; font-size: 1.1rem; margin-bottom: 40px; }
        
        .search-box { 
          max-width: 650px; 
          margin: 0 auto 80px; 
          display: flex; 
          gap: 10px; 
          background: #111; 
          padding: 10px; 
          border-radius: 20px; 
          border: 1px solid #222; 
        }
        input { flex: 1; padding: 15px 20px; border: none; background: transparent; color: #fff; font-size: 1.1rem; outline: none; }
        button { padding: 0 35px; border-radius: 12px; border: none; background: #facc15; color: #000; font-weight: 900; cursor: pointer; text-transform: uppercase; }
        
        .info-section { 
          max-width: 800px; 
          margin: 0 auto; 
          text-align: inherit; 
          background: #0a0a0a; 
          padding: 40px; 
          border-radius: 30px; 
          border: 1px solid #1a1a1a; 
        }
        .info-section h3 { color: #facc15; margin-bottom: 20px; font-size: 1.4rem; }
        .info-section p { color: #aaa; line-height: 1.6; }
        .info-section ul { color: #777; line-height: 2; margin-top: 20px; padding-left: 20px; padding-right: 20px; }
        
        @media (max-width: 768px) {
          .header { flex-direction: column; gap: 20px; padding-bottom: 40px; }
          .search-box { flex-direction: column; background: transparent; border: none; padding: 0; }
          input { background: #111; border: 1px solid #222; margin-bottom: 10px; border-radius: 15px; }
          button { padding: 18px; border-radius: 15px; }
        }
      `}</style>
    </div>
  );
}
