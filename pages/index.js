import React, { useState, useEffect } from 'react';

const translations = {
  en: { dir: 'ltr', title: "VINDECODER", subtitle: "Free vehicle specification check", placeholder: "Enter VIN...", button: "CHECK", country: "Country", engine: "Engine", model: "Model", make: "Make" },
  uk: { dir: 'ltr', title: "VINDECODER", subtitle: "Безкоштовна розшифровка специфікацій", placeholder: "Введіть VIN...", button: "ПЕРЕВІРИТИ", country: "Країна", engine: "Двигун", model: "Модель", make: "Марка" },
  es: { dir: 'ltr', title: "VINDECODER", subtitle: "Comprobación gratuita de especificaciones", placeholder: "Ingrese VIN...", button: "VERIFICAR", country: "País", engine: "Motor", model: "Modelo", make: "Marca" },
  de: { dir: 'ltr', title: "VINDECODER", subtitle: "Kostenlose Fahrzeug-Prüfung", placeholder: "VIN eingeben...", button: "PRÜFEN", country: "Land", engine: "Motor", model: "Modell", make: "Marke" },
  zh: { dir: 'ltr', title: "车架号解析", subtitle: "免费车辆规格查询", placeholder: "输入17位VIN码...", button: "查询", country: "生产国", engine: "发动机", model: "型号", make: "品牌" },
  ar: { dir: 'rtl', title: "فك رمز VIN", subtitle: "فحص مواصفات السيارة مجاناً", placeholder: "أدخل رمز VIN...", button: "تحقق", country: "البلد", engine: "المحرك", model: "الموديل", make: "العلامة التجارية" }
};

export default function VinDecoder() {
  const [lang, setLang] = useState('en');
  const [vin, setVin] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // МАГІЯ АВТОВИЗНАЧЕННЯ МОВИ
  useEffect(() => {
    const browserLang = navigator.language.split('-')[0]; // Отримуємо 'uk', 'en', 'de' і т.д.
    if (translations[browserLang]) {
      setLang(browserLang);
    }
  }, []);

  const t = translations[lang];

  const decodeVin = async (e) => {
    e.preventDefault();
    if (vin.length !== 17) return alert(lang === 'ar' ? "مطلوب 17 رمزاً" : "17 characters required");
    setLoading(true);
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vin}?format=json`);
      const result = await res.json();
      setData(result.Results[0]);
    } catch (err) { alert("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div dir={t.dir} style={{minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px', fontFamily: 'sans-serif', textAlign: t.dir === 'rtl' ? 'right' : 'center'}}>
      
      {/* КНОПКИ МОВ */}
      <div style={{marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap'}}>
        {Object.keys(translations).map(l => (
          <button key={l} onClick={() => setLang(l)} style={{
            backgroundColor: lang === l ? '#facc15' : '#111', 
            color: lang === l ? '#000' : '#fff', 
            border: '1px solid #333', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold'
          }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{textAlign: 'center'}}>
        <h1 style={{color: '#facc15', fontSize: '2.5rem', fontWeight: '900', margin: '0'}}>{t.title}</h1>
        <p style={{color: '#444', marginBottom: '40px'}}>{t.subtitle}</p>
      </div>
      
      <form onSubmit={decodeVin} style={{margin: '40px 0', textAlign: 'center'}}>
        <div style={{display: 'inline-flex', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', flexDirection: t.dir === 'rtl' ? 'row-reverse' : 'row'}}>
          <input 
            type="text" 
            maxLength="17" 
            value={vin} 
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder={t.placeholder}
            style={{padding: '18px', fontSize: '18px', border: 'none', backgroundColor: '#0a0a0a', color: 'white', width: '280px', outline: 'none', textAlign: t.dir === 'rtl' ? 'right' : 'left'}}
          />
          <button type="submit" style={{padding: '18px 30px', fontSize: '18px', backgroundColor: '#facc15', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#000'}}>
            {loading ? '...' : t.button}
          </button>
        </div>
      </form>

      {data && data.Make ? (
        <div style={{maxWidth: '600px', margin: '0 auto', backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '16px', border: '1px solid #1a1a1a'}}>
          <h2 style={{color: '#facc15', marginBottom: '20px', textAlign: 'center'}}>{data.ModelYear} {data.Make} {data.Model}</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
            <div style={{textAlign: t.dir === 'rtl' ? 'right' : 'left'}}><span style={{color: '#444', fontSize: '10px'}}>{t.make.toUpperCase()}</span><br/><b>{data.Make}</b></div>
            <div style={{textAlign: t.dir === 'rtl' ? 'right' : 'left'}}><span style={{color: '#444', fontSize: '10px'}}>{t.model.toUpperCase()}</span><br/><b>{data.Model}</b></div>
            <div style={{textAlign: t.dir === 'rtl' ? 'right' : 'left'}}><span style={{color: '#444', fontSize: '10px'}}>{t.engine.toUpperCase()}</span><br/><b>{data.DisplacementL}L {data.EngineConfiguration}</b></div>
            <div style={{textAlign: t.dir === 'rtl' ? 'right' : 'left'}}><span style={{color: '#444', fontSize: '10px'}}>{t.country.toUpperCase()}</span><br/><b>{data.PlantCountry}</b></div>
          </div>
        </div>
      ) : null}

      <div style={{marginTop: '100px', padding: '20px', color: '#222', fontSize: '10px', textAlign: 'center'}}>
         <p>© 2026 VINDECODER.SPACE</p>
      </div>
    </div>
  );
}
