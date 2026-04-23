import React, { useState, useEffect } from 'react';

const translations = {
  en: { dir: 'ltr', subtitle: "Free vehicle specification check", placeholder: "Enter VIN...", button: "CHECK", country: "Country", engine: "Engine", model: "Model", make: "Make" },
  uk: { dir: 'ltr', subtitle: "Безкоштовна розшифровка специфікацій", placeholder: "Введіть VIN...", button: "ПЕРЕВІРИТИ", country: "Країна", engine: "Двигун", model: "Модель", make: "Марка" },
  es: { dir: 'ltr', subtitle: "Comprobación gratuita de especificaciones", placeholder: "Ingrese VIN...", button: "VERIFICAR", country: "País", engine: "Motor", model: "Modelo", make: "Marca" },
  de: { dir: 'ltr', subtitle: "Kostenlose Fahrzeug-Prüfung", placeholder: "VIN eingeben...", button: "PRÜFEN", country: "Land", engine: "Motor", model: "Modell", make: "Marke" },
  zh: { dir: 'ltr', subtitle: "免费车辆规格查询", placeholder: "输入17位VIN码...", button: "查询", country: "生产国", engine: "发动机", model: "型号", make: "品牌" },
  ar: { dir: 'rtl', subtitle: "فحص مواصفات السيارة مجاناً", placeholder: "أدخل رمز VIN...", button: "تحقق", country: "البلد", engine: "المحرك", model: "الموديل", make: "العلامة التجارية" }
};

export default function VinDecoder() {
  const [lang, setLang] = useState('en');
  const [vin, setVin] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Прибираємо білу обводку (відступи браузера)
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";

    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (translations[browserLang]) {
        setLang(browserLang);
      }
    }
  }, []);

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('userLanguage', newLang);
  };

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
    <div dir={t.dir} style={{
      minHeight: '100vh', 
      backgroundColor: '#000', 
      color: '#fff', 
      padding: '20px', 
      fontFamily: 'sans-serif',
      boxSizing: 'border-box'
    }}>
      
      {/* ПЕРЕМИКАЧ МОВ */}
      <div style={{marginBottom: '30px', display: 'flex', justifyContent: 'center', gap: '5px', flexWrap: 'wrap'}}>
        {Object.keys(translations).map(l => (
          <button key={l} onClick={() => changeLanguage(l)} style={{
            backgroundColor: lang === l ? '#facc15' : '#111', 
            color: lang === l ? '#000' : '#fff', 
            border: '1px solid #333', 
            padding: '10px 14px', 
            borderRadius: '6px', 
            cursor: 'pointer', 
            fontSize: '12px', 
            fontWeight: 'bold'
          }}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ЛОГОТИП (Адаптивний розмір) */}
      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 8vw, 4rem)', // Гнучкий розмір
          fontWeight: '900', 
          margin: '0', 
          letterSpacing: '-2px',
          lineHeight: '1'
        }}>
          <span style={{color: '#facc15'}}>VIN</span>
          <span style={{color: '#fff'}}>DECODER</span>
        </h1>
        <p style={{color: '#444', marginTop: '10px', fontSize: '0.9rem', fontWeight: 'bold'}}>{t.subtitle}</p>
      </div>
      
      {/* ФОРМА (Адаптивна) */}
      <form onSubmit={decodeVin} style={{
        maxWidth: '500px', 
        margin: '30px auto', 
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex', 
          flexDirection: 'column', // На мобілках в стовпчик
          gap: '10px',
          borderRadius: '12px', 
          overflow: 'hidden'
        }}>
          <input 
            type="text" 
            maxLength="17" 
            value={vin} 
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder={t.placeholder}
            style={{
              padding: '18px', 
              fontSize: '18px', 
              border: '2px solid #333', 
              borderRadius: '12px',
              backgroundColor: '#0a0a0a', 
              color: 'white', 
              outline: 'none',
              textAlign: 'center'
            }}
          />
          <button type="submit" style={{
            padding: '18px', 
            fontSize: '18px', 
            backgroundColor: '#facc15', 
            border: 'none', 
            borderRadius: '12px',
            fontWeight: 'bold', 
            cursor: 'pointer', 
            color: '#000',
            transition: 'transform 0.2s'
          }}>
            {loading ? '...' : t.button}
          </button>
        </div>
      </form>

      {/* РЕЗУЛЬТАТИ (Адаптивні) */}
      {data && data.Make ? (
        <div style={{
          maxWidth: '600px', 
          margin: '0 auto', 
          backgroundColor: '#0a0a0a', 
          padding: '25px', 
          borderRadius: '20px', 
          border: '1px solid #1a1a1a',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{color: '#facc15', marginBottom: '25px', textAlign: 'center', fontSize: '1.5rem'}}>
            {data.ModelYear} {data.Make} {data.Model}
          </h2>
          <div style={{
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', // Авто-сітка
            gap: '20px', 
            textAlign: t.dir === 'rtl' ? 'right' : 'left'
          }}>
            <div style={{borderBottom: '1px solid #111', paddingBottom: '10px'}}>
                <span style={{color: '#444', fontSize: '10px', textTransform: 'uppercase'}}>{t.make}</span><br/>
                <b style={{fontSize: '1.1rem'}}>{data.Make}</b>
            </div>
            <div style={{borderBottom: '1px solid #111', paddingBottom: '10px'}}>
                <span style={{color: '#444', fontSize: '10px', textTransform: 'uppercase'}}>{t.model}</span><br/>
                <b style={{fontSize: '1.1rem'}}>{data.Model}</b>
            </div>
            <div style={{borderBottom: '1px solid #111', paddingBottom: '10px'}}>
                <span style={{color: '#444', fontSize: '10px', textTransform: 'uppercase'}}>{t.engine}</span><br/>
                <b style={{fontSize: '1.1rem'}}>{data.DisplacementL}L {data.EngineConfiguration}</b>
            </div>
            <div style={{borderBottom: '1px solid #111', paddingBottom: '10px'}}>
                <span style={{color: '#444', fontSize: '10px', textTransform: 'uppercase'}}>{t.country}</span><br/>
                <b style={{fontSize: '1.1rem'}}>{data.PlantCountry}</b>
            </div>
          </div>
        </div>
      ) : null}

      <div style={{marginTop: '60px', padding: '20px', color: '#222', fontSize: '10px', textAlign: 'center'}}>
         <p>© 2026 VIN DECODER</p>
      </div>

      {/* Вбудований стиль для медіа-запитів */}
      <style jsx global>{`
        body { background-color: #000; margin: 0; padding: 0; }
        @media (min-width: 600px) {
          form div { flex-direction: row !important; }
          input { border-radius: 12px 0 0 12px !important; flex: 1; }
          button { border-radius: 0 12px 12px 0 !important; }
        }
      `}</style>
    </div>
  );
}
