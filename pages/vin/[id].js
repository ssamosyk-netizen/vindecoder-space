import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { 
    dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", ad: "ADVERTISEMENT",
    sections: { general: "General Information", engine: "Engine & Drivetrain", body: "Body & Chassis", origin: "Manufacturing Information" },
    fields: { make: "Make", model: "Model", year: "Year", trim: "Trim", type: "Vehicle Type", engine: "Engine Displacement", cylinders: "Cylinders", fuel: "Fuel Type", drive: "Drive Type", transmission: "Transmission", body: "Body Class", doors: "Doors", country: "Country", plant: "Plant City" }
  },
  uk: { 
    dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", ad: "РЕКЛАМА",
    sections: { general: "Загальна інформація", engine: "Двигун та трансмісія", body: "Кузов та шасі", origin: "Інформація про виробництво" },
    fields: { make: "Марка", model: "Модель", year: "Рік", trim: "Комплектація", type: "Тип ТЗ", engine: "Об'єм двигуна", cylinders: "Циліндри", fuel: "Тип палива", drive: "Привід", transmission: "Трансмісія", body: "Клас кузова", doors: "Двері", country: "Країна", plant: "Місто заводу" }
  },
  es: { 
    dir: 'ltr', subtitle: "Informe de especificaciones", back: "Volver", ad: "ANUNCIO",
    sections: { general: "Información general", engine: "Motor y transmisión", body: "Carrocería", origin: "Información de fabricación" },
    fields: { make: "Marca", model: "Modelo", year: "Año", trim: "Versión", type: "Tipo de vehículo", engine: "Motor", cylinders: "Cilindros", fuel: "Combustible", drive: "Tracción", transmission: "Transmisión", body: "Clase de carrocería", doors: "Puertas", country: "País", plant: "Planta" }
  },
  de: { 
    dir: 'ltr', subtitle: "Fahrzeugspezifikationsbericht", back: "Zurück", ad: "ANZEIGE",
    sections: { general: "Allgemeine Informationen", engine: "Motor & Antrieb", body: "Karosserie", origin: "Herstellerinformationen" },
    fields: { make: "Marke", model: "Modell", year: "Jahr", trim: "Ausstattung", type: "Fahrzeugtyp", engine: "Hubraum", cylinders: "Zylinder", fuel: "Kraftstoff", drive: "Antrieb", transmission: "Getriebe", body: "Karosserieklasse", doors: "Türen", country: "Land", plant: "Werk" }
  },
  zh: { 
    dir: 'ltr', subtitle: "车辆规格报告", back: "返回", ad: "广告",
    sections: { general: "一般信息", engine: "发动机与传动系统", body: "车身与底盘", origin: "制造信息" },
    fields: { make: "品牌", model: "型号", year: "年份", trim: "配置", type: "车辆类型", engine: "排量", cylinders: "气缸", fuel: "燃料", drive: "驱动", transmission: "变速箱", body: "车身类型", doors: "车门", country: "国家", plant: "工厂" }
  },
  ar: { 
    dir: 'rtl', subtitle: "تقرير مواصفات السيارة", back: "العودة", ad: "إعلان",
    sections: { general: "معلومات عامة", engine: "المحرك ونظام الدفع", body: "الهيكل والشاسيه", origin: "معلومات التصنيع" },
    fields: { make: "العلامة التجارية", model: "الموديل", year: "السنة", trim: "الفئة", type: "نوع المركبة", engine: "سعة المحرك", cylinders: "الاسطوانات", fuel: "نوع الوقود", drive: "نظام الدفع", transmission: "ناقل الحركة", body: "فئة الهيكل", doors: "الأبواب", country: "البلد", plant: "المصنع" }
  }
};

export default function VinResult() {
  const router = useRouter();
  const { id } = router.query;
  const [lang, setLang] = useState('en');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.backgroundColor = "#000";
    
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
    
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

  if (loading) return <div className="loader">...</div>;

  const t = translations[lang] || translations.en;

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{id} - {data?.Make} {data?.Model} Specs | VIN DECODER</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')}>
          <span className="yellow">VIN</span><span className="white">DECODER</span>
        </h1>
        <p className="subtitle">{t.subtitle} <b>{id}</b></p>
      </div>

      {data && (
        <div className="results-wrapper">
          <main className="main-content">
            
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
                <div className="data-item"><span>{t.fields.engine}</span><b>{data.DisplacementL ? `${data.DisplacementL}L` : ''} {data.EngineConfiguration}</b></div>
                <div className="data-item"><span>{t.fields.cylinders}</span><b>{data.EngineNumberofCylinders || '—'}</b></div>
                <div className="data-item"><span>{t.fields.fuel}</span><b>{data.FuelTypePrimary || '—'}</b></div>
                <div className="data-item"><span>{t.fields.drive}</span><b>{data.DriveType || '—'}</b></div>
                <div className="data-item"><span>{t.fields.transmission}</span><b>{data.TransmissionStyle || '—'} {data.TransmissionSpeeds ? `(${data.TransmissionSpeeds} spd)` : ''}</b></div>
              </div>
            </section>

            <section className="info-section">
              <h3>{t.sections.body}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.body}</span><b>{data.BodyClass || '—'}</b></div>
                <div className="data-item"><span>{t.fields.doors}</span><b>{data.Doors || '—'}</b></div>
              </div>
            </section>

            <section className="info-section">
              <h3>{t.sections.origin}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.country}</span><b>{data.PlantCountry || '—'}</b></div>
                <div className="data-item"><span>{t.fields.plant}</span><b>{data.PlantCity ? `${data.PlantCity}, ${data.PlantState}` : '—'}</b></div>
              </div>
            </section>
            
            <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
          </main>

          <aside className="sidebar">
            <div className="ad-placeholder sidebar-ad"><span>{t.ad}</span></div>
          </aside>
        </div>
      )}

      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; }
        .container { padding: 20px; min-height: 100vh; box-sizing: border-box; }
        
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { cursor: pointer; font-size: 2.5rem; font-weight: 900; letter-spacing: -2px; margin: 0; direction: ltr; }
        .yellow { color: #facc15; }
        .white { color: #fff; }
        .subtitle { color: #888; margin-top: 10px; font-weight: bold; }

        .results-wrapper { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }
        .main-content { flex: 1; min-width: 0; }
        
        .info-section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 15px; margin-bottom: 20px; }
        .info-section h3 { color: #facc15; margin-top: 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 20px; }
        
        .data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .data-item { text-align: inherit; }
        .data-item span { color: #666; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
        .data-item b { display: block; font-size: 1.1rem; margin-top: 4px; color: #eee; }

        .ad-placeholder { background: #050505; border: 1px dashed #222; display: flex; align-items: center; justify-content: center; color: #333; font-size: 10px; letter-spacing: 2px; border-radius: 10px; direction: ltr !important; text-align: center; }
        .native-ad { height: 100px; margin: 20px 0; }
        .sidebar-ad { width: 300px; height: 600px; position: sticky; top: 20px; }
        .sidebar { display: none; }

        .back-btn { background: #facc15; color: #000; border: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 20px; font-size: 1rem; transition: 0.2s; }
        .back-btn:hover { opacity: 0.8; }
        
        .loader { height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #facc15; font-weight: bold; font-size: 1.2rem; }

        @media (min-width: 900px) {
          .results-wrapper { flex-direction: row; align-items: flex-start; }
          .sidebar { display: block; }
        }
      `}</style>
    </div>
  );
}
