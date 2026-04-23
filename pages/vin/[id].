import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", country: "Country", engine: "Engine", model: "Model", make: "Make", ad: "ADVERTISEMENT" },
  uk: { dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", country: "Країна", engine: "Двигун", model: "Модель", make: "Марка", ad: "РЕКЛАМА" },
  es: { dir: 'ltr', subtitle: "Informe de especificaciones", back: "Volver", country: "País", engine: "Motor", model: "Modelo", make: "Marca", ad: "ANUNCIO" },
  de: { dir: 'ltr', subtitle: "Fahrzeugspezifikationsbericht", back: "Zurück", country: "Land", engine: "Motor", model: "Modell", make: "Marke", ad: "ANZEIGE" },
  zh: { dir: 'ltr', subtitle: "车辆规格报告", back: "返回", country: "生产国", engine: "发动机", model: "型号", make: "品牌", ad: "广告" },
  ar: { dir: 'rtl', subtitle: "تقرير مواصفات السيارة", back: "العودة до البحث", country: "البلد", engine: "المحرك", model: "الموديل", make: "العلامة التجارية", ad: "إعلان" }
};

export default function VinResult() {
  const router = useRouter();
  const { id } = router.query; // Отримуємо VIN з адреси сайту
  const [lang, setLang] = useState('en');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedLang = localStorage.getItem('userLanguage') || 'en';
    setLang(savedLang);
    if (id) fetchVinData(id);
  }, [id]);

  const fetchVinData = async (vinCode) => {
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vinCode}?format=json`);
      const result = await res.json();
      setData(result.Results[0]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <div style={{backgroundColor: '#000', color: '#fff', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>...</div>;

  const t = translations[lang] || translations.en;

  return (
    <div dir={t.dir} style={{minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px', fontFamily: 'sans-serif'}}>
      <Head>
        <title>{id} - {data?.Make} {data?.Model} | VIN DECODER</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div style={{textAlign: 'center', marginBottom: '30px'}}>
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-2px'}}>
          <span style={{color: '#facc15'}}>VIN</span><span style={{color: '#fff'}}>DECODER</span>
        </h1>
        <p style={{color: '#888'}}>{t.subtitle} for <b>{id}</b></p>
      </div>

      {data && (
        <div style={{maxWidth: '800px', margin: '0 auto'}}>
          <div style={{backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '20px', border: '1px solid #1a1a1a'}}>
            <h2 style={{color: '#facc15', textAlign: 'center', marginBottom: '30px'}}>{data.ModelYear} {data.Make} {data.Model}</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              <div><span style={{color: '#aaa', fontSize: '11px'}}>{t.make}</span><br/><b style={{fontSize: '1.2rem'}}>{data.Make}</b></div>
              <div><span style={{color: '#aaa', fontSize: '11px'}}>{t.model}</span><br/><b style={{fontSize: '1.2rem'}}>{data.Model}</b></div>
              <div><span style={{color: '#aaa', fontSize: '11px'}}>{t.engine}</span><br/><b style={{fontSize: '1.2rem'}}>{data.DisplacementL}L {data.EngineConfiguration}</b></div>
              <div><span style={{color: '#aaa', fontSize: '11px'}}>{t.country}</span><br/><b style={{fontSize: '1.2rem'}}>{data.PlantCountry}</b></div>
            </div>
            
            <div style={{marginTop: '30px', backgroundColor: '#050505', height: '150px', border: '1px dashed #222', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333'}}>
                {t.ad}
            </div>
          </div>
          
          <button onClick={() => router.push('/')} style={{marginTop: '20px', background: 'none', border: 'none', color: '#facc15', cursor: 'pointer', fontWeight: 'bold'}}>
            ← {t.back}
          </button>
        </div>
      )}
    </div>
  );
}
