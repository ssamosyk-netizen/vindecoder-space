import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: {
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
  }
};

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

  const t = translations[lang];

  const handleSearch = () => {
    if (vinInput.trim().length > 5) {
      router.push(`/vin/${vinInput.toUpperCase().trim()}`);
    } else {
      alert(t.alert);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>{capitalizedMake} VIN Decoder | {lang === 'uk' ? 'Безкоштовна перевірка' : 'Free Specifications'}</title>
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
          <span 
            className={lang === 'en' ? 'active' : ''} 
            onClick={() => toggleLang('en')}
          >EN</span>
          <span className="divider">|</span>
          <span 
            className={lang === 'uk' ? 'active' : ''} 
            onClick={() => toggleLang('uk')}
          >UK</span>
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
          font-family: -apple-system, sans-serif;
        }
      `}</style>

      <style jsx>{`
        .container { padding: 20px; text-align: center; max-width: 1200px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 20px 0 60px; }
        h1 { font-size: 1.5rem; font-weight: 900; margin: 0; letter-spacing: -1px; }
        .yellow { color: #facc15; }
        
        .lang-switcher { font-size: 12px; font-weight: bold; color: #444; }
        .lang-switcher span { cursor: pointer; padding: 5px; transition: color 0.2s; }
        .lang-switcher span.active { color: #facc15; }
        .lang-switcher span:hover:not(.divider) { color: #fff; }
        .divider { cursor: default !important; padding: 0 2px !important; }

        .hero h2 { font-size: clamp(2rem, 7vw, 3.5rem); font-weight: 900; text-transform: uppercase; margin: 0 0 15px; line-height: 1; }
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
          text-align: left; 
          background: #0a0a0a; 
          padding: 40px; 
          border-radius: 30px; 
          border: 1px solid #1a1a1a; 
        }
        .info-section h3 { color: #facc15; margin-bottom: 20px; font-size: 1.4rem; }
        .info-section p { color: #aaa; line-height: 1.6; }
        .info-section ul { color: #777; line-height: 2; margin-top: 20px; padding-left: 20px; }
        
        @media (max-width: 600px) {
          .search-box { flex-direction: column; background: transparent; border: none; padding: 0; }
          input { background: #111; border: 1px solid #222; margin-bottom: 10px; border-radius: 15px; }
          button { padding: 18px; border-radius: 15px; }
          .header { flex-direction: column; gap: 20px; }
        }
      `}</style>
    </div>
  );
}
