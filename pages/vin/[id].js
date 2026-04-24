import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { 
    dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", error: "Error loading data", ad: "ADVERTISEMENT",
    partnerTitle: "Full European / Global Report Available", partnerDesc: "Get hidden damages, mileage rollbacks, and historical photos.", partnerBtn: "GET FULL REPORT",
    sections: { general: "General Information", engine: "Engine & Performance", dimensions: "Dimensions & Weight", safety: "Safety Equipment", origin: "Manufacturing" },
    fields: { make: "Make", model: "Model", year: "Year", trim: "Trim", type: "Vehicle Type", body: "Body Class", doors: "Doors", engine: "Engine", cylinders: "Cylinders", hp: "Horsepower (HP)", fuel: "Fuel Type", drive: "Drive Type", transmission: "Transmission", gvwr: "Gross Weight (GVWR)", wheelbase: "Wheelbase (in)", axles: "Axles", abs: "Anti-lock Braking (ABS)", esc: "Stability Control (ESC)", tpms: "Tire Pressure Monitor", airbagsF: "Front Airbags", airbagsS: "Side Airbags", country: "Country", plant: "Plant City", manufacturer: "Manufacturer" }
  },
  uk: { 
    dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", error: "Помилка завантаження", ad: "РЕКЛАМА",
    partnerTitle: "Доступний повний звіт для Європи / Азії", partnerDesc: "Перевірте скручений пробіг, приховані ДТП та історичні фотографії.", partnerBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ",
    sections: { general: "Загальна інформація", engine: "Двигун та трансмісія", dimensions: "Габарити та Вага", safety: "Системи безпеки", origin: "Виробництво" },
    fields: { make: "Марка", model: "Модель", year: "Рік", trim: "Комплектація", type: "Тип ТЗ", body: "Клас кузова", doors: "Двері", engine: "Двигун", cylinders: "Циліндри", hp: "Кінські сили (К.С.)", fuel: "Паливо", drive: "Привід", transmission: "Трансмісія", gvwr: "Повна маса (GVWR)", wheelbase: "Колісна база", axles: "Осі", abs: "Система ABS", esc: "Стабілізація (ESC)", tpms: "Датчик тиску шин", airbagsF: "Фронтальні Airbag", airbagsS: "Бокові Airbag", country: "Країна", plant: "Місто заводу", manufacturer: "Виробник" }
  },
  es: { 
    dir: 'ltr', subtitle: "Informe de especificaciones", back: "Volver", error: "Error", ad: "ANUNCIO",
    partnerTitle: "Informe completo disponible", partnerDesc: "Obtenga daños ocultos e historial.", partnerBtn: "OBTENER INFORME",
    sections: { general: "Información general", engine: "Motor y Transmisión", dimensions: "Dimensiones y Peso", safety: "Seguridad", origin: "Fabricación" },
    fields: { make: "Marca", model: "Modelo", year: "Año", trim: "Versión", type: "Tipo", body: "Carrocería", doors: "Puertas", engine: "Motor", cylinders: "Cilindros", hp: "Caballos (HP)", fuel: "Combustible", drive: "Tracción", transmission: "Transmisión", gvwr: "Peso Bruto", wheelbase: "Distancia entre ejes", axles: "Ejes", abs: "Frenos ABS", esc: "Control de Estabilidad", tpms: "Monitor de Presión", airbagsF: "Bolsas Frontales", airbagsS: "Bolsas Laterales", country: "País", plant: "Planta", manufacturer: "Fabricante" }
  },
  de: { 
    dir: 'ltr', subtitle: "Fahrzeugspezifikationsbericht", back: "Zurück", error: "Fehler", ad: "ANZEIGE",
    partnerTitle: "Vollständiger Bericht verfügbar", partnerDesc: "Erhalten Sie versteckte Schäden und Historie.", partnerBtn: "BERICHT ABRUFEN",
    sections: { general: "Allgemeine Informationen", engine: "Motor & Getriebe", dimensions: "Abmessungen & Gewicht", safety: "Sicherheit", origin: "Herstellung" },
    fields: { make: "Marke", model: "Modell", year: "Jahr", trim: "Ausstattung", type: "Typ", body: "Karosserie", doors: "Türen", engine: "Motor", cylinders: "Zylinder", hp: "PS", fuel: "Kraftstoff", drive: "Antrieb", transmission: "Getriebe", gvwr: "Zul. Gesamtgewicht", wheelbase: "Radstand", axles: "Achsen", abs: "ABS", esc: "ESP", tpms: "Reifendruckkontrolle", airbagsF: "Frontairbags", airbagsS: "Seitenairbags", country: "Land", plant: "Werk", manufacturer: "Hersteller" }
  },
  zh: { 
    dir: 'ltr', subtitle: "车辆规格报告", back: "返回", error: "错误", ad: "广告",
    partnerTitle: "获取完整报告", partnerDesc: "获取隐藏损坏和历史记录。", partnerBtn: "获取完整报告",
    sections: { general: "一般信息", engine: "发动机与传动", dimensions: "尺寸与重量", safety: "安全配置", origin: "制造信息" },
    fields: { make: "品牌", model: "型号", year: "年份", trim: "配置", type: "类型", body: "车身", doors: "车门", engine: "发动机", cylinders: "气缸", hp: "马力 (HP)", fuel: "燃料", drive: "驱动", transmission: "变速箱", gvwr: "总重量", wheelbase: "轴距", axles: "车轴", abs: "防抱死刹车 (ABS)", esc: "车身稳定系统 (ESC)", tpms: "胎压监测", airbagsF: "前排气囊", airbagsS: "侧排气囊", country: "国家", plant: "工厂", manufacturer: "制造商" }
  },
  ar: { 
    dir: 'rtl', subtitle: "تقرير مواصفات السيارة", back: "العودة", error: "خطأ", ad: "إعلان",
    partnerTitle: "تقرير كامل متاح", partnerDesc: "احصل على الأضرار المخفية والتاريخ.", partnerBtn: "احصل على التقرير",
    sections: { general: "معلومات عامة", engine: "المحرك وناقل الحركة", dimensions: "الأبعاد والوزن", safety: "معدات السلامة", origin: "التصنيع" },
    fields: { make: "العلامة التجارية", model: "الموديل", year: "السنة", trim: "الفئة", type: "النوع", body: "الهيكل", doors: "الأبواب", engine: "المحرك", cylinders: "الاسطوانات", hp: "قوة الحصان", fuel: "الوقود", drive: "نظام الدفع", transmission: "ناقل الحركة", gvwr: "الوزن الإجمالي", wheelbase: "قاعدة العجلات", axles: "المحاور", abs: "نظام ABS", esc: "نظام الاستقرار", tpms: "مراقبة ضغط الإطارات", airbagsF: "وسائد هوائية أمامية", airbagsS: "وسائد هوائية جانبية", country: "البلد", plant: "المصنع", manufacturer: "الشركة المصنعة" }
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

  const val = (v) => {
    if (!v || v === "" || v === "Not Applicable" || v === "null") return "—";
    return v;
  };

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
        <title>{data ? `${data.ModelYear || ''} ${data.Make || ''} ${data.Model || ''}` : id} | VIN DECODER</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
        
        {!data ? (
          <p className="subtitle">{t.subtitle} <b>{id}</b></p>
        ) : (
          <div className="hero-title">
            <h2>
              {data.ModelYear && data.ModelYear !== "—" ? `${data.ModelYear} ` : ''}
              {data.Make && data.Make !== "—" ? `${data.Make} ` : 'UNKNOWN VEHICLE '}
              {data.Model && data.Model !== "—" ? data.Model : ''}
            </h2>
            
            {/* Офіційний підзаголовок з VIN-кодом */}
            <p className="subtitle hero-subtitle">{t.subtitle} <b>{id}</b></p>
            
            <div className="hero-badges">
              {(data.DisplacementL || data.EngineConfiguration) && (
                <span className="badge engine-badge">
                  {data.DisplacementL && data.DisplacementL !== "—" ? `${data.DisplacementL}L ` : ''}
                  {val(data.EngineConfiguration) !== "—" ? data.EngineConfiguration : ''}
                </span>
              )}
              {data.VehicleType && data.VehicleType !== "—" && (
                <span className="badge type-badge">{data.VehicleType}</span>
              )}
            </div>
          </div>
        )}
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
                <button className="partner-btn" onClick={() => window.open('https://www.carvertical.com/', '_blank')}>
                  {t.partnerBtn}
                </button>
              </div>
            )}

            <section className="info-section">
              <h3>{t.sections.general}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.make}</span><b>{val(data.Make)}</b></div>
                <div className="data-item"><span>{t.fields.model}</span><b>{val(data.Model)}</b></div>
                <div className="data-item"><span>{t.fields.year}</span><b>{val(data.ModelYear)}</b></div>
                <div className="data-item"><span>{t.fields.trim}</span><b>{val(data.Trim)}</b></div>
                <div className="data-item"><span>{t.fields.type}</span><b>{val(data.VehicleType)}</b></div>
                <div className="data-item"><span>{t.fields.body}</span><b>{val(data.BodyClass)}</b></div>
                <div className="data-item"><span>{t.fields.doors}</span><b>{val(data.Doors)}</b></div>
              </div>
            </section>

            <div className="ad-placeholder native-ad"><span>{t.ad}</span></div>

            <section className="info-section">
              <h3>{t.sections.engine}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.engine}</span><b>{data.DisplacementL ? `${data.DisplacementL}L` : ''} {val(data.EngineConfiguration)}</b></div>
                <div className="data-item"><span>{t.fields.cylinders}</span><b>{val(data.EngineNumberofCylinders)}</b></div>
                <div className="data-item"><span>{t.fields.hp}</span><b>{val(data.EngineHP)}</b></div>
                <div className="data-item"><span>{t.fields.fuel}</span><b>{val(data.FuelTypePrimary)}</b></div>
                <div className="data-item"><span>{t.fields.drive}</span><b>{val(data.DriveType)}</b></div>
                <div className="data-item"><span>{t.fields.transmission}</span><b>{val(data.TransmissionStyle)}</b></div>
              </div>
            </section>

            <section className="info-section">
              <h3>{t.sections.safety}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.abs}</span><b>{val(data.ABS)}</b></div>
                <div className="data-item"><span>{t.fields.esc}</span><b>{val(data.ESC)}</b></div>
                <div className="data-item"><span>{t.fields.tpms}</span><b>{val(data.TPMS)}</b></div>
                <div className="data-item"><span>{t.fields.airbagsF}</span><b>{val(data.AirBagLocFront)}</b></div>
                <div className="data-item"><span>{t.fields.airbagsS}</span><b>{val(data.AirBagLocSide)}</b></div>
              </div>
            </section>

            <section className="info-section">
              <h3>{t.sections.dimensions}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.gvwr}</span><b>{val(data.GVWR)}</b></div>
                <div className="data-item"><span>{t.fields.wheelbase}</span><b>{val(data.WheelBaseLong)}</b></div>
                <div className="data-item"><span>{t.fields.axles}</span><b>{val(data.Axles)}</b></div>
              </div>
            </section>

            <section className="info-section">
              <h3>{t.sections.origin}</h3>
              <div className="data-grid">
                <div className="data-item"><span>{t.fields.manufacturer}</span><b>{val(data.Manufacturer)}</b></div>
                <div className="data-item"><span>{t.fields.country}</span><b>{val(data.PlantCountry)}</b></div>
                <div className="data-item"><span>{t.fields.plant}</span><b>{data.PlantCity ? `${data.PlantCity}, ${data.PlantState}` : '—'}</b></div>
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
        body { background-color: #000; color: #fff; font-family: sans-serif; line-height: 1.5; margin: 0; padding: 0;}
        .container { padding: 20px; min-height: 100vh; box-sizing: border-box; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { font-size: 2.5rem; font-weight: 900; margin: 0; direction: ltr; letter-spacing: -2px;}
        .yellow { color: #facc15; } .white { color: #fff; }
        .subtitle { color: #888; margin-top: 10px; }
        
        /* СТИЛІ ДЛЯ ЗАГОЛОВКУ МАШИНИ ТА ПІДЗАГОЛОВКУ З ВІН-КОДОМ */
        .hero-title { margin-top: 20px; animation: fadeInDown 0.5s ease-out; }
        .hero-title h2 { font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 900; margin: 0 0 5px 0; color: #fff; text-transform: uppercase; letter-spacing: -1px; line-height: 1.1; }
        .hero-subtitle { margin-bottom: 20px; font-size: 1rem; color: #aaa; }
        
        .hero-badges { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
        .badge { padding: 6px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .engine-badge { background: #facc15; color: #000; box-shadow: 0 4px 15px rgba(250, 204, 21, 0.2); }
        .type-badge { background: #1a1a1a; color: #888; border: 1px solid #333; }

        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .results-wrapper { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }
        .main-content { flex: 1; min-width: 0; }
        .partner-banner { background: linear-gradient(135deg, #1a1a1a 0%, #2d2000 100%); border: 1px solid #facc15; padding: 25px; border-radius: 15px; margin-bottom: 30px; display: flex; flex-direction: column; gap: 20px; align-items: center; text-align: center; }
        .partner-banner h2 { color: #facc15; margin: 0; font-size: 1.4rem; }
        .partner-banner p { color: #ccc; margin: 10px 0 0 0; font-size: 0.95rem; }
        .partner-btn { background: #facc15; color: #000; font-weight: 900; border: none; padding: 15px 30px; border-radius: 8px; cursor: pointer; font-size: 1rem; text-transform: uppercase; width: 100%; max-width: 300px; transition: 0.2s; }
        .partner-btn:hover { background: #fff; }
        
        .info-section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 15px; margin-bottom: 20px; text-align: left; }
        .info-section h3 { color: #facc15; margin-top: 0; font-size: 0.9rem; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 10px; margin-bottom: 20px; }
        .data-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .data-item span { color: #666; font-size: 11px; text-transform: uppercase; font-weight: bold; }
        .data-item b { display: block; font-size: 1.1rem; margin-top: 4px; color: #eee; }
        .ad-placeholder { background: #080808; border: 1px dashed #333; display: flex; align-items: center; justify-content: center; color: #555; font-size: 11px; font-weight: bold; letter-spacing: 2px; border-radius: 10px; }
        .native-ad { height: 100px; margin: 25px 0; width: 100%; }
        .sidebar { display: none; }
        .sidebar-ad { width: 300px; height: 600px; position: sticky; top: 20px; }
        .back-btn { background: #facc15; color: #000; border: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; text-align: center; transition: 0.2s; }
        .back-btn:hover { background: #fff; }
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
