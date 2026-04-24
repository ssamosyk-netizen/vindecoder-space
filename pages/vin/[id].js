import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { 
    dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", error: "Error loading data", ad: "ADVERTISEMENT",
    partnerTitle: "Full European / Global Report Available", partnerDesc: "Get hidden damages, mileage rollbacks, and historical photos.", partnerBtn: "GET FULL REPORT",
    sections: { general: "General Information", engine: "Engine & Drivetrain", body: "Body & Chassis", origin: "Manufacturing Information" },
    fields: { make: "Make", model: "Model", year: "Year", trim: "Trim", type: "Vehicle Type", engine: "Engine", cylinders: "Cylinders", fuel: "Fuel Type", drive: "Drive Type", transmission: "Transmission", body: "Body Class", doors: "Doors", country: "Country", plant: "Plant City" }
  },
  uk: { 
    dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", error: "Помилка завантаження", ad: "РЕКЛАМА",
    partnerTitle: "Доступний повний звіт для Європи / Азії", partnerDesc: "Перевірте скручений пробіг, приховані ДТП та історичні фотографії.", partnerBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ",
    sections: { general: "Загальна інформація", engine: "Двигун та трансмісія", body: "Кузов та шасі", origin: "Інформація про виробництво" },
    fields: { make: "Марка", model: "Модель", year: "Рік", trim: "Комплектація", type: "Тип ТЗ", engine: "Двигун", cylinders: "Циліндри", fuel: "Паливо", drive: "Привід", transmission: "Трансмісія", body: "Клас кузова", doors: "Двері", country: "Країна", plant: "Місто заводу" }
  },
  es: { 
    dir: 'ltr', subtitle: "Informe de especificaciones", back: "Volver", error: "Error", ad: "ANUNCIO",
    partnerTitle: "Informe completo disponible", partnerDesc: "Obtenga daños ocultos e historial.", partnerBtn: "OBTENER INFORME",
    sections: { general: "Información general", engine: "Motor", body: "Carrocería", origin: "Fabricación" },
    fields: { make: "Marca", model: "Modelo", year: "Año", trim: "Versión", type: "Tipo", engine: "Motor", cylinders: "Cilindros", fuel: "Combustible", drive: "Tracción", transmission: "Transmisión", body: "Clase", doors: "Puertas", country: "País", plant: "Planta" }
  },
  de: { 
    dir: 'ltr', subtitle: "Fahrzeugspezifikationsbericht", back: "Zurück", error: "Fehler", ad: "ANZEIGE",
    partnerTitle: "Vollständiger Bericht verfügbar", partnerDesc: "Erhalten Sie versteckte Schäden und Historie.", partnerBtn: "BERICHT ABRUFEN",
    sections: { general: "Allgemeine Informationen", engine: "Motor", body: "Karosserie", origin: "Herstellung" },
    fields: { make: "Marke", model: "Modell", year: "Jahr", trim: "Ausstattung", type: "Typ", engine: "Motor", cylinders: "Zylinder", fuel: "Kraftstoff", drive: "Antrieb", transmission: "Getriebe", body: "Karosserie", doors: "Türen", country: "Land", plant: "Werk" }
  },
  zh: { 
    dir: 'ltr', subtitle: "车辆规格报告", back: "返回", error: "错误", ad: "广告",
    partnerTitle: "获取完整报告", partnerDesc: "获取隐藏损坏和历史记录。", partnerBtn: "获取完整报告",
    sections: { general: "一般信息", engine: "发动机", body: "车身", origin: "制造信息" },
    fields: { make: "品牌", model: "型号", year: "年份", trim: "配置", type: "类型", engine: "发动机", cylinders: "气缸", fuel: "燃料", drive: "驱动", transmission: "变速箱", body: "车身", doors: "车门", country: "国家", plant: "工厂" }
  },
  ar: { 
    dir: 'rtl', subtitle: "تقرير مواصفات السيارة", back: "العودة", error: "خطأ", ad: "إعلان",
    partnerTitle: "تقرير كامل متاح", partnerDesc: "احصل على الأضرار المخفية والتاريخ.", partnerBtn: "احصل على التقرير",
    sections: { general: "معلومات عامة", engine: "المحرك", body: "الهيكل", origin: "التصنيع" },
    fields: { make: "العلامة التجارية", model: "الموديل", year: "السنة", trim: "الفئة", type: "النوع", engine: "المحرك", cylinders: "الاسطوانات", fuel: "الوقود", drive: "نظام الدفع", transmission: "ناقل الحركة", body: "الهيكل", doors: "الأبواب", country: "البلد", plant: "المصنع" }
  }
};

export default function VinResult() {
  const router = useRouter();
  const { id, region } = router.query;
  const [lang, setLang] = useState('en');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";
    
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);
    
    if (!router.isReady) return;
    if (id) fetchVinData(id);
  }, [router.isReady, id]);

  const fetchVinData = async (vinCode) => {
    try {
      setLoading(true);
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vinCode}?format=json`);
      const result = await res.json();
      setData(result.Results[0]);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const t = translations[lang] || translations.en;

  if (loading) return (
    <div className="loader-container">
      <h1 className="logo"><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
      <div className="spinner"></div><p>Decoding {id || 'vehicle'}...</p>
      <style jsx>{`.loader-container { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #000; color: #888; font-family: sans-serif; } .logo { font-size: 2rem; font-weight: 900; margin-bottom: 20px; } .yellow { color: #facc15; } .white { color: #fff; } .spinner { width: 40px; height: 40px; border: 4px solid #333; border-top: 4px solid #facc15; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px; } @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{id} Specs | VIN DECODER</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
        <p className="subtitle">{t.subtitle} <b>{id}</b></p>
      </div>

      {data && (
        <div className="results-wrapper">
          <main className="main-content">
            
            {(region === 'eu' || region === 'asia') && (
              <div className="partner-banner">
                <div className="banner-content">
                  <h2>{t.partnerTitle}</h2>
                  <p>{t.partnerDesc}</p>
                </div>
                <button className="partner-btn" onClick={() => alert("Реферальне посилання!")}>
                  {t.partnerBtn}
                </button>
              </div>
            )}

            <section className="info-section">
              <h3>{t.sections.general}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.make}</span><b>{data.Make || '—'}</b></div>
                <div className="data-item"><span>{t.fields.model}</span><b>{data.Model || '—'}</b></div>
                <div className="data-item"><span>{t.fields.year}</span><b>{data.ModelYear || '—'}</b></div>
                <div className="data-item"><span>{t.fields.trim}</span><b>{data.Trim || '—'}</b></div>
                <div className="data-item"><span>{t.fields.type}</span><b>{data.VehicleType || '—'}</b></div>
              </div>
            </section>

            <div className="ad-placeholder native-ad"><span>{t.ad}</span></div>

            <section className="info-section">
              <h3>{t.sections.engine}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.engine}</span><b>{data.DisplacementL ? `${data.DisplacementL}L` : '—'} {data.EngineConfiguration}</b></div>
                <div className="data-item"><span>{t.fields.cylinders}</span><b>{data.EngineNumberofCylinders || '—'}</b></div>
                <div className="data-item"><span>{t.fields.fuel}</span><b>{data.FuelTypePrimary || '—'}</b></div>
                <div className="data-item"><span>{t.fields.drive}</span><b>{data.DriveType || '—'}</b></div>
                <div className="data-item"><span>{t.fields.transmission}</span><b>{data.TransmissionStyle || '—'}</b></div>
              </div>
            </section>
            
            <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
          </main>

          <aside className="sidebar">
            <div className="ad-placeholder sidebar-ad"><span>{t.ad}<br/><br/>(300x600)</span></div>
          </aside>
        </div>
      )}

      <footer className="footer"><p>© 2026 VIN DECODER</p></footer>

      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: sans-serif; line-height: 1.5; }
        .container { padding: 20px; min-height: 100vh; box-sizing: border-box; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { font-size: 2.5rem; font-weight: 900; margin: 0; direction: ltr; letter-spacing: -2px;}
        .yellow { color: #facc15; } .white { color: #fff; }
        .subtitle { color: #888; margin-top: 10px; }
        
        .results-wrapper { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }
        .main-content { flex: 1; min-width: 0; }
        
        .partner-banner { background: linear-gradient(135deg, #1a1a1a 0%, #2d2000 100%); border: 1px solid #facc15; padding: 25px; border-radius: 15px; margin-bottom: 30px; display: flex; flex-direction: column; gap: 20px; align-items: center; text-align: center; }
        .partner-banner h2 { color: #facc15; margin: 0; font-size: 1.4rem; }
        .partner-banner p { color: #ccc; margin: 10px 0 0 0; font-size: 0.95rem; }
        .partner-btn { background: #facc15; color: #000; font-weight: 900; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 1rem; text-transform: uppercase; width: 100%; max-width: 300px; }
        
        .info-section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 15px; margin-bottom: 20px; }
        .info-section h3 { color: #facc15; margin-top: 0; font-size: 0.9rem; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 20px; }
        .data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .data-item span { color: #666; font-size: 11px; text-transform: uppercase; font-weight: bold; }
        .data-item b { display: block; font-size: 1.1rem; margin-top: 4px; color: #eee; }
        
        .ad-placeholder { background: #080808; border: 1px dashed #333; display: flex; align-items: center; justify-content: center; color: #555; font-size: 11px; font-weight: bold; letter-spacing: 2px; border-radius: 10px; }
        .native-ad { height: 100px; margin: 25px 0; width: 100%; }
        .sidebar { display: none; }
        .sidebar-ad { width: 300px; height: 600px; position: sticky; top: 20px; }
        .back-btn { background: #facc15; color: #000; border: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; }
        .footer { text-align: center; margin-top: 80px; color: #222; font-size: 11px; direction: ltr; }

        @media (min-width: 900px) {
          .results-wrapper { flex-direction: row; align-items: flex-start; }
          .sidebar { display: block; }
          .partner-banner { flex-direction: row; text-align: left; justify-content: space-between; }
          .partner-btn { width: auto; }
        }
      `}</style>
    </div>
  );
}
