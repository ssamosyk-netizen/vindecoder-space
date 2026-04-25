import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// ПОВНИЙ ОБ'ЄКТ ПЕРЕКЛАДІВ НА 6 МОВ
const translations = {
  en: {
    dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", privacy: "Privacy Policy", ad: "ADVERTISEMENT",
    market: "Market Region", basicData: "Basic Data (Decoded from VIN)",
    partnerTitle: "Full Report Available", partnerDesc: "Get hidden damages and mileage history.", partnerBtn: "GET FULL REPORT",
    lockedTitle: "🔒 Technical Data Protected", lockedDesc: "European manufacturers restrict detailed specs in free databases. Unlock for full history.", unlockBtn: "UNLOCK REPORT",
    sections: { general: "General Information", engine: "Engine & Performance", safety: "Safety & Interior", origin: "Manufacturing Details" },
    fields: { make: "Make", model: "Model", year: "Year", trim: "Trim", series: "Series", type: "Vehicle Type", body: "Body Class", doors: "Doors", engine: "Engine", cylinders: "Cylinders", hp: "Horsepower", fuel: "Fuel Type", drive: "Drive Type", transmission: "Transmission", brakes: "Brake System", abs: "ABS", tpms: "TPMS", country: "Country", plantCity: "Plant City", manufacturer: "Manufacturer" },
    footer: "© 2026 VIN DECODER | PROFESSIONAL DATA"
  },
  uk: {
    dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", privacy: "Політика конфіденційності", ad: "РЕКЛАМА",
    market: "Регіон ринку", basicData: "Базові дані (розшифровано з VIN)",
    partnerTitle: "Доступний повний звіт", partnerDesc: "Перевірте скручений пробіг та історію ДТП.", partnerBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ",
    lockedTitle: "🔒 Технічні дані захищені", lockedDesc: "Європейські виробники обмежують дані у безкоштовних базах. Розблокуйте повну історію.", unlockBtn: "РОЗБЛОКУВАТИ ЗВІТ",
    sections: { general: "Загальна інформація", engine: "Двигун та трансмісія", safety: "Безпека", origin: "Дані виробництва" },
    fields: { make: "Марка", model: "Модель", year: "Рік", trim: "Комплектація", series: "Серія", type: "Тип ТЗ", body: "Клас кузова", doors: "Двері", engine: "Двигун", cylinders: "Циліндри", hp: "Кінські сили", fuel: "Паливо", drive: "Привід", transmission: "Трансмісія", brakes: "Гальма", abs: "ABS", tpms: "Тиск у шинах", country: "Країна", plantCity: "Місто заводу", manufacturer: "Виробник" },
    footer: "© 2026 VIN DECODER | ПРОФЕСІЙНІ ДАНІ"
  },
  es: {
    dir: 'ltr', subtitle: "Informe de Especificaciones", back: "Volver a la búsqueda", privacy: "Política de Privacidad", ad: "ANUNCIO",
    market: "Región del Mercado", basicData: "Datos Básicos (Decodificados)",
    partnerTitle: "Informe Completo Disponible", partnerDesc: "Obtenga daños ocultos e historial de kilometraje.", partnerBtn: "OBTENER INFORME COMPLETO",
    lockedTitle: "🔒 Datos Técnicos Protegidos", lockedDesc: "Los fabricantes europeos restringen los datos. Desbloquee el historial completo.", unlockBtn: "DESBLOQUEAR INFORME",
    sections: { general: "Información General", engine: "Motor y Rendimiento", safety: "Seguridad e Interior", origin: "Detalles de Fabricación" },
    fields: { make: "Marca", model: "Modelo", year: "Año", trim: "Versión", series: "Serie", type: "Tipo de Vehículo", body: "Carrocería", doors: "Puertas", engine: "Motor", cylinders: "Cilindros", hp: "Caballos de Fuerza", fuel: "Combustible", drive: "Tracción", transmission: "Transmisión", brakes: "Frenos", abs: "ABS", tpms: "TPMS", country: "País", plantCity: "Planta", manufacturer: "Fabricante" },
    footer: "© 2026 VIN DECODER | DATOS PROFESIONALES"
  },
  de: {
    dir: 'ltr', subtitle: "Fahrzeugspezifikationsbericht", back: "Zurück zur Suche", privacy: "Datenschutzrichtlinie", ad: "WERBUNG",
    market: "Marktregion", basicData: "Basisdaten (Aus VIN decodiert)",
    partnerTitle: "Vollständiger Bericht Verfügbar", partnerDesc: "Erhalten Sie versteckte Schäden und Kilometerstand.", partnerBtn: "VOLLSTÄNDIGEN BERICHT ABRUFEN",
    lockedTitle: "🔒 Technische Daten Geschützt", lockedDesc: "Europäische Hersteller beschränken detaillierte Spezifikationen. Historie freischalten.", unlockBtn: "BERICHT FREISCHALTEN",
    sections: { general: "Allgemeine Informationen", engine: "Motor & Leistung", safety: "Sicherheit & Innenraum", origin: "Herstellungsdetails" },
    fields: { make: "Marke", model: "Modell", year: "Jahr", trim: "Ausstattung", series: "Serie", type: "Fahrzeugtyp", body: "Karosserie", doors: "Türen", engine: "Motor", cylinders: "Zylinder", hp: "PS", fuel: "Kraftstoff", drive: "Antrieb", transmission: "Getriebe", brakes: "Bremsen", abs: "ABS", tpms: "RDKS", country: "Land", plantCity: "Werk", manufacturer: "Hersteller" },
    footer: "© 2026 VIN DECODER | PROFESSIONELLE DATEN"
  },
  zh: {
    dir: 'ltr', subtitle: "车辆规格报告", back: "返回搜索", privacy: "隐私政策", ad: "广告",
    market: "市场区域", basicData: "基本数据 (从 VIN 解码)",
    partnerTitle: "完整报告可用", partnerDesc: "获取隐藏的损坏和里程历史记录。", partnerBtn: "获取完整报告",
    lockedTitle: "🔒 技术数据受保护", lockedDesc: "欧洲制造商在免费数据库中限制详细规格。解锁以获取完整历史记录。", unlockBtn: "解锁报告",
    sections: { general: "一般信息", engine: "发动机与性能", safety: "安全与内饰", origin: "制造详情" },
    fields: { make: "品牌", model: "型号", year: "年份", trim: "配置", series: "系列", type: "车辆类型", body: "车身", doors: "车门", engine: "发动机", cylinders: "气缸", hp: "马力", fuel: "燃料类型", drive: "驱动类型", transmission: "变速箱", brakes: "刹车系统", abs: "防抱死刹车", tpms: "胎压监测", country: "国家", plantCity: "工厂城市", manufacturer: "制造商" },
    footer: "© 2026 VIN DECODER | 专业数据"
  },
  ar: {
    dir: 'rtl', subtitle: "تقرير مواصفات المركبة", back: "العودة للبحث", privacy: "سياسة الخصوصية", ad: "إعلان",
    market: "منطقة السوق", basicData: "البيانات الأساسية (مفككة من رقم الهيكل)",
    partnerTitle: "التقرير الكامل متاح", partnerDesc: "احصل على الأضرار المخفية وسجل الأميال.", partnerBtn: "احصل على التقرير الكامل",
    lockedTitle: "🔒 البيانات الفنية محمية", lockedDesc: "يقيد المصنعون الأوروبيون المواصفات التفصيلية. افتح السجل الكامل.", unlockBtn: "افتح التقرير",
    sections: { general: "معلومات عامة", engine: "المحرك والأداء", safety: "الأمان والداخلية", origin: "تفاصيل التصنيع" },
    fields: { make: "الماركة", model: "الموديل", year: "السنة", trim: "الفئة", series: "السلسلة", type: "نوع المركبة", body: "الهيكل", doors: "الأبواب", engine: "المحرك", cylinders: "الأسطوانات", hp: "قوة الحصان", fuel: "نوع الوقود", drive: "نظام الدفع", transmission: "ناقل الحركة", brakes: "الفرامل", abs: "ABS", tpms: "TPMS", country: "البلد", plantCity: "مدينة المصنع", manufacturer: "الشركة المصنعة" },
    footer: "© 2026 VIN DECODER | بيانات احترافية"
  }
};

const languages = [
  { code: 'en', label: 'EN' }, { code: 'uk', label: 'UK' }, { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' }, { code: 'zh', label: 'ZH' }, { code: 'ar', label: 'AR' }
];

// РОЗУМНИЙ ДЕКОДЕР ДЛЯ ЄВРОПИ/АЗІЇ ТА ФІКС AUDI
const decodeVinBasics = (vin) => {
  if (!vin) return {};
  const wmi = vin.substring(0, 3).toUpperCase();
  const yearChar = vin.charAt(9).toUpperCase();
  
  const wmiMap = {
    'TMA': { make: 'HYUNDAI', country: 'Czech Republic' }, 'TMB': { make: 'SKODA', country: 'Czech Republic' },
    'WDB': { make: 'MERCEDES-BENZ', country: 'Germany' }, 'WBA': { make: 'BMW', country: 'Germany' },
    'WAU': { make: 'AUDI', country: 'Germany' }, 'TRU': { make: 'AUDI', country: 'Hungary' },
    'WVW': { make: 'VOLKSWAGEN', country: 'Germany' }, 'ZAR': { make: 'ALFA ROMEO', country: 'Italy' },
    'ZFA': { make: 'FIAT', country: 'Italy' }, 'VF3': { make: 'PEUGEOT', country: 'France' },
    'UU1': { make: 'DACIA', country: 'Romania' }, 'VSS': { make: 'SEAT', country: 'Spain' },
    'JHM': { make: 'HONDA', country: 'Japan' }, 'JT1': { make: 'TOYOTA', country: 'Japan' },
    'KL3': { make: 'CHEVROLET', country: 'South Korea' }, 'KNA': { make: 'KIA', country: 'South Korea' },
    'SJ3': { make: 'NISSAN', country: 'United Kingdom' }, 'SAL': { make: 'LAND ROVER', country: 'United Kingdom' },
    '1J8': { make: 'JEEP', country: 'United States' }
  };

  const yearMap = { 
    'V':1997, 'W':1998, 'X':1999, 'Y':2000, '1':2001, '2':2002, '3':2003, '4':2004, '5':2005, 
    '6':2006, '7':2007, '8':2008, '9':2009, 'A':2010, 'B':2011, 'C':2012, 'D':2013, 'E':2014, 
    'F':2015, 'G':2016, 'H':2017, 'J':2018, 'K':2019, 'L':2020, 'M':2021, 'N':2022, 'P':2023, 
    'R':2024, 'S':2025 
  };

  const first = vin[0];
  let market = { name: "Global", icon: "🌍" };
  if (['1','2','3','4','5'].includes(first)) market = { name: "North America", icon: "🇺🇸" };
  else if (['J','K','L'].includes(first)) market = { name: "Asia", icon: "🇯🇵" };
  else if (['S','T','U','V','W','X','Y','Z'].includes(first)) market = { name: "Europe", icon: "🇪🇺" };

  return {
    make: wmiMap[wmi]?.make || null,
    country: wmiMap[wmi]?.country || market.name,
    year: yearMap[yearChar] || null,
    market: market
  };
};

export default function VinReport() {
  const router = useRouter();
  const { id } = router.query;
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [serverData, setServerData] = useState(null);

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

  useEffect(() => {
    if (!id) return;
    const fetchVinData = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${id}?format=json`);
        const json = await response.json();
        
        if (json.Results && json.Results[0]) {
          setServerData(json.Results[0]);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("API Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVinData();
  }, [id]);

  const t = translations[lang] || translations.en;
  const decoded = decodeVinBasics(id || "");
  const hasFullData = serverData && serverData.Make && serverData.Make !== "" && serverData.Make !== "Not Applicable";
  const val = (v) => (!v || v === "" || v === "Not Applicable" || v === "null") ? "—" : v;

  // Логіка злиття даних та виправлення 1981 року для Audi
  const finalMake = hasFullData ? serverData.Make : (decoded.make || "Unknown");
  let finalYear = hasFullData ? serverData.ModelYear : (decoded.year || "—");
  
  if (finalYear === "1981" && id && id.toUpperCase().includes('ZZZ')) {
    finalYear = "2011"; 
  }

  const finalCountry = hasFullData && serverData.PlantCountry ? serverData.PlantCountry : decoded.country;
  const finalModel = hasFullData ? serverData.Model : "—";
  const carEngine = serverData?.DisplacementL ? `${serverData.DisplacementL}L` : '—';

  // Динамічний Title (Рік Марка Модель)
  const titleString = `${finalYear !== "—" ? finalYear : ''} ${finalMake !== "Unknown" ? finalMake : ''} ${finalModel !== "—" ? finalModel : ''}`.trim() || id;
  const affiliateLink = `https://www.epicvin.com/en/check-vin-number-report?vin=${id}&affiliate=YOUR_ID`;
  const ogImageUrl = `https://vindecoder.space/api/og?vin=${id}&make=${encodeURIComponent(finalMake)}&model=${encodeURIComponent(finalModel)}&year=${finalYear}`;

  return (
    <div className="container" dir={t.dir}>
      <Head>
        <title>{titleString} | VIN DECODER</title>
        <meta name="description" content={`Get full vehicle specifications and history report for ${titleString}. VIN: ${id}`} />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta property="og:title" content={`${titleString} | Free VIN Report`} />
        <meta property="og:description" content={`Full technical report for ${titleString}. Region: ${decoded.market.name}`} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <header className="header">
        <div className="logo" onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span>DECODER
        </div>
        <div className="lang-switcher">
          {languages.map((l) => (
            <span key={l.code} className={lang === l.code ? 'active' : ''} onClick={() => toggleLang(l.code)}>
              {l.label}
            </span>
          ))}
        </div>
      </header>

      <div className="wrapper">
        <main className="main">
          
          {/* ГОЛОВНИЙ ГЕРОЙ БЛОК: РІК МАРКА МОДЕЛЬ */}
          <div className="hero">
            <div className="badges">
              <span className="market-badge">{decoded.market.icon} {decoded.market.name}</span>
              {!hasFullData && !loading && !error && <span className="notice-badge">{t.basicData}</span>}
            </div>
            {loading ? (
              <h2>{t.loading}</h2>
            ) : error ? (
              <h2>{t.error}</h2>
            ) : (
              <h2>{finalYear !== "—" ? finalYear : ''} <span className="yellow">{finalMake}</span> {finalModel !== "—" ? finalModel : ''}</h2>
            )}
            <p className="subtitle">VIN: <b>{id}</b></p>
          </div>

          {loading ? (
            <div className="status-box"><div className="spinner"></div><p>{t.loading}</p></div>
          ) : error ? (
            <div className="status-box error"><p>{t.error}</p><button className="back-btn" onClick={() => router.push('/')}>{t.back}</button></div>
          ) : (
            <>
              {/* ЗАГАЛЬНІ ДАНІ */}
              <section className="section">
                <h3>{t.sections.general}</h3>
                <div className="grid">
                  <div className="item"><span>{t.fields.make}</span><b>{finalMake}</b></div>
                  <div className="item"><span>{t.fields.model}</span><b>{finalModel}</b></div>
                  <div className="item"><span>{t.fields.year}</span><b>{finalYear}</b></div>
                  <div className="item"><span>{t.fields.country}</span><b>{finalCountry}</b></div>
                  {hasFullData && (
                    <>
                      <div className="item"><span>{t.fields.trim}</span><b>{val(serverData.Trim)}</b></div>
                      <div className="item"><span>{t.fields.type}</span><b>{val(serverData.VehicleType)}</b></div>
                      <div className="item"><span>{t.fields.body}</span><b>{val(serverData.BodyClass)}</b></div>
                      <div className="item"><span>{t.fields.doors}</span><b>{val(serverData.Doors)}</b></div>
                    </>
                  )}
                </div>
              </section>

              {/* ЯКЩО НЕМАЄ ПОВНИХ ДАНИХ (ЄВРОПА) -> ПОКАЗУЄМО ЗАМОК */}
              {!hasFullData ? (
                <div className="europe-lock-card">
                  <div className="lock-icon">🔒</div>
                  <h3>{t.lockedTitle}</h3>
                  <p>{t.lockedDesc}</p>
                  <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="partner-btn pulse">
                    {t.unlockBtn}
                  </a>
                </div>
              ) : (
                /* ЯКЩО ДАНІ Є (США) -> ПОКАЗУЄМО ДВИГУН ТА БЕЗПЕКУ */
                <>
                  <section className="section">
                    <h3>{t.sections.engine}</h3>
                    <div className="grid">
                      <div className="item"><span>{t.fields.engine}</span><b>{carEngine !== '—' ? carEngine : ''} {val(serverData.EngineConfiguration)}{val(serverData.EngineCylinders)}</b></div>
                      <div className="item"><span>{t.fields.hp}</span><b>{val(serverData.EngineHP)}</b></div>
                      <div className="item"><span>{t.fields.fuel}</span><b>{val(serverData.FuelTypePrimary)}</b></div>
                      <div className="item"><span>{t.fields.drive}</span><b>{val(serverData.DriveType)}</b></div>
                      <div className="item"><span>{t.fields.transmission}</span><b>{val(serverData.TransmissionStyle)}</b></div>
                    </div>
                  </section>

                  <section className="section">
                    <h3>{t.sections.safety}</h3>
                    <div className="grid">
                      <div className="item"><span>{t.fields.brakes}</span><b>{val(serverData.BrakeSystemType)}</b></div>
                      <div className="item"><span>{t.fields.abs}</span><b>{val(serverData.ABS)}</b></div>
                      <div className="item"><span>{t.fields.tpms}</span><b>{val(serverData.TPMS)}</b></div>
                      <div className="item"><span>Airbags</span><b>{val(serverData.AirBagLocFront)}</b></div>
                    </div>
                  </section>
                </>
              )}

              <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
            </>
          )}
        </main>

        {/* ПРАВА БОКОВА ПАНЕЛЬ (РЕКЛАМА / ПАРТНЕРКА) */}
        <aside className="sidebar">
          <div className="premium-card">
            <h4>{t.partnerTitle}</h4>
            <p>{t.partnerDesc}</p>
            <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="partner-btn-sm" style={{display: 'block', textAlign: 'center', textDecoration: 'none'}}>
              {t.partnerBtn}
            </a>
          </div>
          <div className="ad-placeholder-vert">{t.ad}</div>
        </aside>
      </div>

      <footer className="footer">
        <p>{t.footer} | <span onClick={() => router.push('/privacy')} style={{cursor: 'pointer', textDecoration: 'underline'}}>{t.privacy}</span></p>
      </footer>

      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; }
      `}</style>
      <style jsx>{`
        .container { padding: 20px; max-width: 1200px; margin: 0 auto; min-height: 100vh; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .logo { font-size: 1.6rem; font-weight: 900; letter-spacing: -1px; }
        .yellow { color: #facc15; }
        
        .lang-switcher { display: flex; gap: 8px; font-size: 11px; font-weight: bold; }
        .lang-switcher span { cursor: pointer; padding: 6px 10px; border-radius: 8px; border: 1px solid transparent; color: #666; transition: 0.2s; }
        .lang-switcher span.active { color: #facc15; border-color: #facc15; background: rgba(250, 204, 21, 0.05); }
        .lang-switcher span:hover:not(.active) { color: #aaa; border-color: #333; }

        .wrapper { display: flex; flex-direction: column; gap: 30px; }
        .main { flex: 1; }
        
        .badges { display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap; }
        .market-badge { background: #111; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; border: 1px solid #333; color: #ccc; }
        .notice-badge { background: #2563eb; color: #fff; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        
        .hero h2 { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 900; text-transform: uppercase; margin: 0; line-height: 1.1; letter-spacing: -1px; }
        .subtitle { color: #666; margin: 10px 0 30px; font-size: 16px; font-family: monospace; letter-spacing: 1px; }

        .status-box { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 50px 20px; border-radius: 20px; text-align: center; color: #aaa; }
        .status-box.error { color: #ff4d4d; border-color: #331111; }
        .spinner { width: 40px; height: 40px; border: 4px solid rgba(250, 204, 21, 0.1); border-left-color: #facc15; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 20px; margin-bottom: 25px; }
        .section h3 { color: #facc15; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 15px; margin-bottom: 20px; letter-spacing: 1px; margin-top: 0; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        .item span { color: #555; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .item b { display: block; font-size: 16px; margin-top: 5px; color: #eee; }

        .europe-lock-card { background: #080808; border: 1px dashed #333; padding: 50px 20px; border-radius: 20px; text-align: center; margin-bottom: 25px; }
        .lock-icon { font-size: 45px; margin-bottom: 15px; }
        .partner-btn { display: inline-block; background: #facc15; color: #000; border: none; padding: 18px 40px; font-weight: 900; border-radius: 12px; cursor: pointer; text-transform: uppercase; text-decoration: none; margin-top: 15px; }
        
        .sidebar { width: 100%; }
        .premium-card { background: #111; border: 1px solid #333; padding: 25px; border-radius: 20px; margin-bottom: 20px; }
        .premium-card h4 { margin: 0 0 10px 0; color: #facc15; font-size: 14px; text-transform: uppercase; }
        .premium-card p { font-size: 13px; color: #888; margin-bottom: 20px; }
        .partner-btn-sm { background: #facc15; color: #000; width: 100%; border: none; padding: 15px; font-weight: 900; border-radius: 8px; cursor: pointer; text-transform: uppercase; box-sizing: border-box; }
        
        .ad-placeholder-vert { background: #080808; border: 1px solid #111; height: 400px; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #333; font-size: 11px; font-weight: bold; }
        
        .back-btn { background: transparent; color: #666; border: 1px solid #222; padding: 12px 25px; border-radius: 8px; margin-top: 10px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .back-btn:hover { background: #222; color: #fff; }

        .footer { padding: 40px 0; border-top: 1px solid #111; margin-top: 40px; font-size: 12px; color: #444; text-align: center; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }

        @media (min-width: 900px) {
          .wrapper { flex-direction: row; }
          .sidebar { width: 320px; position: sticky; top: 20px; align-self: flex-start; }
        }
        @media (max-width: 768px) {
          .header { flex-direction: column; gap: 20px; }
        }
      `}</style>
    </div>
  );
}
