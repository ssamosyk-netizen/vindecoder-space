import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { dir: 'ltr', subtitle: "Free vehicle specification check", placeholder: "Enter VIN...", button: "CHECK", ad: "ADVERTISEMENT" },
  uk: { dir: 'ltr', subtitle: "Безкоштовна розшифровка специфікацій", placeholder: "Введіть VIN...", button: "ПЕРЕВІРИТИ", ad: "РЕКЛАМА" },
  es: { dir: 'ltr', subtitle: "Comprobación gratuita de especificaciones", placeholder: "Ingrese VIN...", button: "VERIFICAR", ad: "ANUNCIO" },
  de: { dir: 'ltr', subtitle: "Kostenlose Fahrzeug-Prüfung", placeholder: "VIN eingeben...", button: "PRÜFEN", ad: "ANZEIGE" },
  zh: { dir: 'ltr', subtitle: "免费车辆规格查询", placeholder: "输入17位VIN码...", button: "查询", ad: "广告" },
  ar: { dir: 'rtl', subtitle: "فحص مواصفات السيارة مجанаً", placeholder: "أدخل رمز VIN...", button: "تحقق", ad: "إعلان" }
};

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [vin, setVin] = useState('');

  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang) setLang(savedLang);
  }, []);

  const t = translations[lang] || translations.en;

  const handleSearch = (e) => {
    e.preventDefault();
    if (vin.length === 17) {
      // КЛЮЧОВА ЗМІНА: перехід на сторінку /vin/[id]
      router.push(`/vin/${vin.toUpperCase()}`);
    } else {
      alert("17 symbols required");
    }
  };

  return (
    <div dir={t.dir} style={{minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center'}}>
      <Head>
        <title>VIN DECODER - {t.subtitle}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div style={{display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px'}}>
        {Object.keys(translations).map(l => (
          <button key={l} onClick={() => { setLang(l); localStorage.setItem('userLanguage', l); }} style={{backgroundColor: lang === l ? '#facc15' : '#111', color: lang === l ? '#000' : '#fff', border: '1px solid #333', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold'}}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{marginTop: '50px'}}>
        <h1 style={{fontSize: '3.5rem', fontWeight: '900', margin: '0', letterSpacing: '-3px'}}>
          <span style={{color: '#facc15'}}>VIN</span><span style={{color: '#fff'}}>DECODER</span>
        </h1>
        <p style={{color: '#888', marginTop: '10px', fontWeight: 'bold'}}>{t.subtitle}</p>
      </div>
      
      <form onSubmit={handleSearch} style={{margin: '50px auto', maxWidth: '500px'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <input 
            type="text" 
            maxLength="17" 
            value={vin} 
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder={t.placeholder}
            style={{padding: '18px', fontSize: '18px', border: '1px solid #333', borderRadius: '12px', backgroundColor: '#0a0a0a', color: 'white', textAlign: 'center', outline: 'none'}}
          />
          <button type="submit" style={{padding: '18px', fontSize: '18px', backgroundColor: '#facc15', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', color: '#000'}}>
            {t.button}
          </button>
        </div>
      </form>

      <div style={{maxWidth: '728px', height: '90px', backgroundColor: '#0a0a0a', border: '1px dashed #222', margin: '50px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', fontSize: '10px', letterSpacing: '2px'}}>
         {t.ad}
      </div>

      <footer style={{marginTop: '100px', color: '#222', fontSize: '11px'}}>
         <p>© 2026 VIN DECODER</p>
      </footer>
    </div>
  );
}
