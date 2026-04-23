import React, { useState } from 'react';

// Словник перекладів
const translations = {
  en: { title: "VINDECODER", subtitle: "Free vehicle specification check", placeholder: "Enter VIN...", button: "CHECK", country: "Country", engine: "Engine", model: "Model", make: "Make" },
  uk: { title: "VINDECODER", subtitle: "Безкоштовна розшифровка специфікацій", placeholder: "Введіть VIN...", button: "ПЕРЕВІРИТИ", country: "Країна", engine: "Двигун", model: "Модель", make: "Марка" },
  es: { title: "VINDECODER", subtitle: "Comprobación gratuita de especificaciones", placeholder: "Ingrese VIN...", button: "VERIFICAR", country: "País", engine: "Motor", model: "Modelo", make: "Marca" },
  de: { title: "VINDECODER", subtitle: "Kostenlose Überprüfung der Fahrzeugspezifikationen", placeholder: "VIN eingeben...", button: "PRÜFEN", country: "Land", engine: "Motor", model: "Modell", make: "Marke" }
};

export default function VinDecoder() {
  const [lang, setLang] = useState('en'); // Мова за замовчуванням
  const [vin, setVin] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const t = translations[lang];

  const decodeVin = async (e) => {
    e.preventDefault();
    if (vin.length !== 17) return alert("17 symbols required");
    setLoading(true);
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vin}?format=json`);
      const result = await res.json();
      setData(result.Results[0]);
    } catch (err) { alert("Error"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center'}}>
      
      {/* ПЕРЕМИКАЧ МОВ */}
      <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px'}}>
        {Object.keys(translations).map(l => (
          <button key={l} onClick={() => setLang(l)} style={{backgroundColor: lang === l ? '#facc15' : '#111', color: lang === l ? '#000' : '#fff', border: '1px solid #333', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'}}>
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      <h1 style={{color: '#facc15', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px'}}>{t.title}<span style={{color: '#fff'}}>.SPACE</span></h1>
      <p style={{color: '#444'}}>{t.subtitle}</p>
      
      <form onSubmit={decodeVin} style={{margin: '40px 0'}}>
        <div style={{display: 'inline-flex', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333'}}>
          <input 
            type="text" 
            maxLength="17" 
            value={vin} 
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder={t.placeholder}
            style={{padding: '18px', fontSize: '18px', border: 'none', backgroundColor: '#0a0a0a', color: 'white', width: '280px', outline: 'none'}}
          />
          <button type="submit" style={{padding: '18px 30px', fontSize: '18px', backgroundColor: '#facc15', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#000'}}>
            {loading ? '...' : t.button}
          </button>
        </div>
      </form>

      {data && data.Make ? (
        <div style={{maxWidth: '600px', margin: '0 auto', backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '16px', border: '1px solid #1a1a1a', textAlign: 'left'}}>
          <h2 style={{color: '#facc15', marginBottom: '20px'}}>{data.ModelYear} {data.Make} {data.Model}</h2>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            <div><span style={{color: '#444', fontSize: '10px'}}>{t.make.toUpperCase()}</span><br/><b>{data.Make}</b></div>
            <div><span style={{color: '#444', fontSize: '10px'}}>{t.model.toUpperCase()}</span><br/><b>{data.Model}</b></div>
            <div><span style={{color: '#444', fontSize: '10px'}}>{t.engine.toUpperCase()}</span><br/><b>{data.DisplacementL}L {data.EngineConfiguration}</b></div>
            <div><span style={{color: '#444', fontSize: '10px'}}>{t.country.toUpperCase()}</span><br/><b>{data.PlantCountry}</b></div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
