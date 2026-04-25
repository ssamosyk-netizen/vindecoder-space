import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

// 1. СЛОВНИКИ ТА ПЕРЕКЛАДИ
const translations = {
  en: { dir: 'ltr', sub: "Vehicle Report", back: "Back to Search", privacy: "Privacy", ad: "ADVERTISEMENT", market: "Market:", base: "Decoded by:", nhtsa: "NHTSA (USA)", wmi: "WMI (Basic Data)", pTitle: "Full History Report", pDesc: "Check for hidden damages and mileage rollbacks.", pBtn: "GET FULL REPORT", lTitle: "🔒 Technical Data Protected", lDesc: "European manufacturers restrict detailed specs in free databases. Unlock for full history.", unBtn: "UNLOCK REPORT", s: { gen: "General Info", eng: "Engine & Performance", saf: "Safety & Features", org: "Manufacturing" }, f: { make: "Make", model: "Model", year: "Year", trim: "Trim", series: "Series", type: "Vehicle Type", body: "Body Class", doors: "Doors", eng: "Engine", cyl: "Cylinders", hp: "Horsepower", fuel: "Fuel Type", drive: "Drive Type", trans: "Transmission", brk: "Brake System", abs: "ABS", tpms: "TPMS", cntry: "Country", city: "Plant City", mfr: "Manufacturer" } },
  uk: { dir: 'ltr', sub: "Звіт про авто", back: "Назад до пошуку", privacy: "Політика конфіденційності", ad: "МІСЦЕ ДЛЯ РЕКЛАМИ", market: "Ринок:", base: "База даних:", nhtsa: "NHTSA (США)", wmi: "WMI (Базовий стандарт)", pTitle: "Повна історія авто", pDesc: "Перевірте скручений пробіг та історію ДТП.", pBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ", lTitle: "🔒 Технічні дані захищені", lDesc: "Європейські виробники обмежують дані у безкоштовних базах. Розблокуйте повну історію.", unBtn: "РОЗБЛОКУВАТИ ЗВІТ", s: { gen: "Загальна інформація", eng: "Двигун та трансмісія", saf: "Безпека", org: "Дані виробництва" }, f: { make: "Марка", model: "Модель", year: "Рік", trim: "Комплектація", series: "Серія", type: "Тип ТЗ", body: "Клас кузова", doors: "Двері", eng: "Двигун", cyl: "Циліндри", hp: "Кінські сили", fuel: "Паливо", drive: "Привід", trans: "Трансмісія", brk: "Гальма", abs: "ABS", tpms: "Тиск у шинах", cntry: "Країна", city: "Місто заводу", mfr: "Виробник" } },
  es: { dir: 'ltr', sub: "Informe del Vehículo", back: "Volver", privacy: "Privacidad", ad: "ANUNCIO", market: "Mercado:", base: "Base de datos:", nhtsa: "NHTSA (EE. UU.)", wmi: "WMI (Datos Básicos)", pTitle: "Informe Completo", pDesc: "Comprueba daños y kilometraje.", pBtn: "OBTENER INFORME", lTitle: "🔒 Datos Protegidos", lDesc: "Desbloquea el historial completo.", unBtn: "DESBLOQUEAR", s: { gen: "General", eng: "Motor", saf: "Seguridad", org: "Fabricación" }, f: { make: "Marca", model: "Modelo", year: "Año", trim: "Versión", series: "Serie", type: "Tipo", body: "Carrocería", doors: "Puertas", eng: "Motor", cyl: "Cilindros", hp: "CV", fuel: "Combustible", drive: "Tracción", trans: "Transmisión", brk: "Frenos", abs: "ABS", tpms: "TPMS", cntry: "País", city: "Planta", mfr: "Fabricante" } },
  de: { dir: 'ltr', sub: "Fahrzeugbericht", back: "Zurück", privacy: "Datenschutz", ad: "WERBUNG", market: "Markt:", base: "Datenbank:", nhtsa: "NHTSA (USA)", wmi: "WMI (Basisdaten)", pTitle: "Vollständiger Bericht", pDesc: "Überprüfen Sie Unfälle und Kilometerstand.", pBtn: "BERICHT ABRUFEN", lTitle: "🔒 Daten Geschützt", lDesc: "Historie freischalten.", unBtn: "FREISCHALTEN", s: { gen: "Allgemein", eng: "Motor", saf: "Sicherheit", org: "Herstellung" }, f: { make: "Marke", model: "Modell", year: "Jahr", trim: "Ausstattung", series: "Serie", type: "Typ", body: "Karosserie", doors: "Türen", eng: "Motor", cyl: "Zylinder", hp: "PS", fuel: "Kraftstoff", drive: "Antrieb", trans: "Getriebe", brk: "Bremsen", abs: "ABS", tpms: "RDKS", cntry: "Land", city: "Werk", mfr: "Hersteller" } },
  zh: { dir: 'ltr', sub: "车辆报告", back: "返回", privacy: "隐私政策", ad: "广告", market: "市场:", base: "数据库:", nhtsa: "NHTSA (美国)", wmi: "WMI (基本数据)", pTitle: "完整历史记录", pDesc: "检查隐藏的损坏和里程表倒转。", pBtn: "获取完整报告", lTitle: "🔒 数据受保护", lDesc: "解锁完整历史。", unBtn: "解锁报告", s: { gen: "常规信息", eng: "发动机", saf: "安全", org: "制造" }, f: { make: "品牌", model: "型号", year: "年份", trim: "配置", series: "系列", type: "类型", body: "车身", doors: "车门", eng: "发动机", cyl: "气缸", hp: "马力", fuel: "燃料", drive: "驱动", trans: "变速箱", brk: "刹车", abs: "ABS", tpms: "TPMS", cntry: "国家", city: "工厂城市", mfr: "制造商" } },
  ar: { dir: 'rtl', sub: "تقرير المركبة", back: "رجوع", privacy: "الخصوصية", ad: "إعلان", market: "السوق:", base: "قاعدة البيانات:", nhtsa: "NHTSA (أمريكا)", wmi: "WMI (بيانات أساسية)", pTitle: "تقرير كامل", pDesc: "تحقق من الحوادث والمسافة.", pBtn: "احصل على التقرير", lTitle: "🔒 بيانات محمية", lDesc: "افتح السجل الكامل.", unBtn: "افتح التقرير", s: { gen: "عام", eng: "المحرك", saf: "أمان", org: "تصنيع" }, f: { make: "الماركة", model: "الموديل", year: "السنة", trim: "الفئة", series: "السلسلة", type: "النوع", body: "الهيكل", doors: "الأبواب", eng: "المحرك", cyl: "أسطوانات", hp: "قوة الحصان", fuel: "الوقود", drive: "الدفع", trans: "ناقل الحركة", brk: "الفرامل", abs: "ABS", tpms: "TPMS", cntry: "البلد", city: "المصنع", mfr: "الشركة المصنعة" } }
};

const languages = [
  { code: 'en', label: 'EN' }, { code: 'uk', label: 'UK' }, { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' }, { code: 'zh', label: 'ZH' }, { code: 'ar', label: 'AR' }
];

// 2. РОЗУМНИЙ ДЕКОДЕР РИНКУ ТА WMI
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
    'SJ3': { make: 'NISSAN', country: 'UK' }, 'SAL': { make: 'LAND ROVER', country: 'UK' },
    '1J8': { make: 'JEEP', country: 'USA' }
  };

  const yearMap = { 'V':1997, 'W':1998, 'X':1999, 'Y':2000, '1':2001, '2':2002, '3':2003, '4':2004, '5':2005, '6':2006, '7':2007, '8':2008, '9':2009, 'A':2010, 'B':2011, 'C':2012, 'D':2013, 'E':2014, 'F':2015, 'G':2016, 'H':2017, 'J':2018, 'K':2019, 'L':2020, 'M':2021, 'N':2022, 'P':2023, 'R':2024, 'S':2025 };

  const first = vin[0];
  let market = { name: "Global", icon: "🌍" };
  if (['1','2','3','4','5'].includes(first)) market = { name: "North America", icon: "🇺🇸" };
  else if (['J','K','L'].includes(first)) market = { name: "Asia", icon: "🇯🇵" };
  else if (['S','T','U','V','W','X','Y','Z'].includes(first)) market = { name: "Europe", icon: "🇪🇺" };

  return { make: wmiMap[wmi]?.make || null, country: wmiMap[wmi]?.country || market.name, year: yearMap[yearChar] || null, market };
};

// 3. SERVER-SIDE ДАНИХ NHTSA
export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${id}?format=json`);
    const result = await res.json();
    return { props: { serverData: result.Results[0], vin: id.toUpperCase() } };
  } catch (error) { return { props: { serverData: null, vin: id.toUpperCase() } }; }
}

// 4. ГОЛОВНИЙ КОМПОНЕНТ
export default function VinResult({ serverData, vin }) {
  const router = useRouter();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);
  }, []);

  const t = translations[lang] || translations.en;
  const decoded = decodeVinBasics(vin);
  const hasFullData = serverData && serverData.Make && serverData.Make !== "" && serverData.Make !== "Not Applicable";
  const val = (v) => (!v || v === "" || v === "Not Applicable" || v === "null") ? "—" : v;

  // Злиття та виправлення (напр. Audi 1981 -> 2011)
  const finalMake = hasFullData ? serverData.Make : (decoded.make || "Unknown");
  let finalYear = hasFullData ? serverData.ModelYear : (decoded.year || "—");
  if (finalYear === "1981" && vin.includes('ZZZ')) finalYear = "2011";
  
  const finalCountry = hasFullData && serverData.PlantCountry ? serverData.PlantCountry : decoded.country;
  const finalModel = hasFullData ? serverData.Model : "—";
  const carEngine = serverData?.DisplacementL ? `${serverData.DisplacementL}L` : '';

  // Формування красивого заголовку (Рік Марка Модель Двигун)
  const fullTitle = `${finalYear !== "—" ? finalYear : ''} ${finalMake !== "Unknown" ? finalMake : ''} ${finalModel !== "—" ? finalModel : ''} ${carEngine}`.trim() || vin;
  const affiliateLink = `https://www.epicvin.com/en/check-vin-number-report?vin=${vin}&affiliate=YOUR_ID`;

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{fullTitle} | VIN DECODER</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <header className="header">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span><span className="white">DECODER</span>
        </h1>
        <div className="lang-switcher">
          {languages.map((l) => (
            <span key={l.code} className={lang === l.code ? 'active' : ''} onClick={() => { setLang(l.code); localStorage.setItem('userLanguage', l.code); }}>
              {l.label}
            </span>
          ))}
        </div>
      </header>

      <div className="wrapper">
        <main className="main">
          
          {/* ГЕРОЙ-БЛОК (База, Ринок, Заголовок) */}
          <div className="hero">
            <div className="badges-row">
              <div className="badge market-badge">
                <span className="icon">{decoded.market.icon}</span> 
                {t.market} <b>{decoded.market.name}</b>
              </div>
              <div className="badge source-badge">
                {t.base} <b>{hasFullData ? t.nhtsa : t.wmi}</b>
              </div>
            </div>
            
            <h2 className="vehicle-title">
              {finalYear !== "—" ? finalYear : ''} <span className="yellow">{finalMake}</span> {finalModel !== "—" ? finalModel : ''} {carEngine && <span className="engine-tag">{carEngine}</span>}
            </h2>
            <p className="vin-subtitle">VIN: <b>{vin}</b></p>
          </div>

          <section className="section">
            <h3>{t.s.gen}</h3>
            <div className="grid">
              <div className="item"><span>{t.f.make}</span><b>{finalMake}</b></div>
              <div className="item"><span>{t.f.model}</span><b>{finalModel}</b></div>
              <div className="item"><span>{t.f.year}</span><b>{finalYear}</b></div>
              <div className="item"><span>{t.f.cntry}</span><b>{finalCountry}</b></div>
              {hasFullData && (
                <>
                  <div className="item"><span>{t.f.trim}</span><b>{val(serverData.Trim)}</b></div>
                  <div className="item"><span>{t.f.type}</span><b>{val(serverData.VehicleType)}</b></div>
                  <div className="item"><span>{t.f.body}</span><b>{val(serverData.BodyClass)}</b></div>
                  <div className="item"><span>{t.f.doors}</span><b>{val(serverData.Doors)}</b></div>
                </>
              )}
            </div>
          </section>

          {!hasFullData ? (
            <div className="europe-lock-card">
              <div className="lock-icon">🔒</div>
              <h3>{t.lTitle}</h3>
              <p>{t.lDesc}</p>
              <a href={affiliateLink} target="_blank" rel="noreferrer" className="partner-btn pulse">{t.unBtn}</a>
            </div>
          ) : (
            <>
              <section className="section">
                <h3>{t.s.eng}</h3>
                <div className="grid">
                  <div className="item"><span>{t.f.eng}</span><b>{carEngine} {val(serverData.EngineConfiguration)}{val(serverData.EngineCylinders)}</b></div>
                  <div className="item"><span>{t.f.hp}</span><b>{val(serverData.EngineHP)}</b></div>
                  <div className="item"><span>{t.f.fuel}</span><b>{val(serverData.FuelTypePrimary)}</b></div>
                  <div className="item"><span>{t.f.drive}</span><b>{val(serverData.DriveType)}</b></div>
                  <div className="item"><span>{t.f.trans}</span><b>{val(serverData.TransmissionStyle)}</b></div>
                </div>
              </section>

              <section className="section">
                <h3>{t.s.saf}</h3>
                <div className="grid">
                  <div className="item"><span>{t.f.brk}</span><b>{val(serverData.BrakeSystemType)}</b></div>
                  <div className="item"><span>{t.f.abs}</span><b>{val(serverData.ABS)}</b></div>
                  <div className="item"><span>{t.f.tpms}</span><b>{val(serverData.TPMS)}</b></div>
                  <div className="item"><span>Airbags</span><b>{val(serverData.AirBagLocFront)}</b></div>
                </div>
              </section>
            </>
          )}

          <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
        </main>

        <aside className="sidebar">
          {/* БЛОК ПАРТНЕРКИ */}
          <div className="premium-card">
            <h4>{t.pTitle}</h4>
            <p>{t.pDesc}</p>
            <a href={affiliateLink} target="_blank" rel="noreferrer" className="partner-btn-sm">{t.pBtn}</a>
          </div>
          
          {/* ЗАГЛУШКА ПІД РЕКЛАМУ (AdSense) */}
          <div className="ad-placeholder-vert">
            <span>{t.ad}</span>
            <br/><br/>300 x 600
          </div>
        </aside>
      </div>

      <footer className="footer">
        <p>© 2026 VIN DECODER | <span onClick={() => router.push('/privacy')} style={{cursor: 'pointer', textDecoration: 'underline'}}>{t.privacy}</span></p>
      </footer>

      {/* 5. СТИЛІ (CSS) */}
      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 0; }
      `}</style>

      <style jsx>{`
        .container { padding: 20px; max-width: 1200px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .header h1 { font-size: 1.8rem; font-weight: 900; margin: 0; letter-spacing: -1px; }
        .yellow { color: #facc15; } .white { color: #fff; }
        
        .lang-switcher { display: flex; gap: 8px; font-size: 11px; font-weight: bold; }
        .lang-switcher span { cursor: pointer; padding: 6px 12px; border-radius: 6px; color: #888; transition: 0.2s; border: 1px solid transparent; }
        .lang-switcher span.active { color: #facc15; border-color: #facc15; background: rgba(250, 204, 21, 0.05); }
        .lang-switcher span:hover:not(.active) { color: #fff; border-color: #333; }

        .wrapper { display: flex; flex-direction: column; gap: 40px; flex: 1; }
        .main { flex: 1; }
        
        .hero { margin-bottom: 40px; }
        .badges-row { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
        .badge { padding: 8px 16px; border-radius: 8px; font-size: 12px; border: 1px solid #333; display: flex; align-items: center; gap: 8px; }
        .market-badge { background: #111; color: #aaa; }
        .source-badge { background: rgba(37, 99, 235, 0.1); border-color: rgba(37, 99, 235, 0.3); color: #60a5fa; }
        .badge b { color: #fff; font-weight: 800; }
        
        .vehicle-title { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 900; text-transform: uppercase; margin: 0 0 10px 0; line-height: 1.1; letter-spacing: -1px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
        .engine-tag { background: #222; padding: 4px 12px; border-radius: 8px; font-size: clamp(1rem, 2vw, 1.5rem); color: #ccc; border: 1px solid #333; }
        .vin-subtitle { color: #666; margin: 0; font-size: 1.2rem; font-family: monospace; letter-spacing: 1px; }

        .section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 30px; border-radius: 20px; margin-bottom: 30px; }
        .section h3 { color: #facc15; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 15px; margin-top: 0; margin-bottom: 25px; letter-spacing: 1px; }
        
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px; }
        .item span { color: #666; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
        .item b { display: block; font-size: 16px; margin-top: 6px; color: #eee; }

        .europe-lock-card { background: #080808; border: 1px dashed #333; padding: 50px 20px; border-radius: 20px; text-align: center; margin-bottom: 30px; }
        .lock-icon { font-size: 45px; margin-bottom: 15px; }
        
        .partner-btn { display: inline-block; background: #facc15; color: #000; border: none; padding: 18px 40px; font-weight: 900; border-radius: 12px; cursor: pointer; text-transform: uppercase; text-decoration: none; margin-top: 15px; }
        .partner-btn-sm { display: block; background: #facc15; color: #000; width: 100%; border: none; padding: 15px; font-weight: 900; border-radius: 8px; cursor: pointer; text-transform: uppercase; text-align: center; text-decoration: none; box-sizing: border-box; }
        
        .sidebar { width: 100%; }
        .premium-card { background: #111; border: 1px solid #333; padding: 25px; border-radius: 20px; margin-bottom: 30px; }
        .premium-card h4 { margin: 0 0 10px 0; color: #facc15; font-size: 14px; text-transform: uppercase; }
        .premium-card p { font-size: 13px; color: #aaa; margin-bottom: 20px; line-height: 1.5; }
        
        .ad-placeholder-vert { background: #080808; border: 1px solid #1a1a1a; height: 600px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #444; font-size: 12px; font-weight: bold; letter-spacing: 1px; }
        
        .back-btn { background: transparent; color: #888; border: 1px solid #333; padding: 12px 30px; border-radius: 10px; margin-top: 10px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .back-btn:hover { background: #222; color: #fff; }

        .footer { padding: 40px 0; border-top: 1px solid #111; margin-top: 50px; font-size: 13px; color: #555; text-align: center; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }

        @media (min-width: 1000px) {
          .wrapper { flex-direction: row; }
          .sidebar { width: 300px; flex-shrink: 0; position: sticky; top: 30px; align-self: flex-start; }
        }
        @media (max-width: 768px) {
          .header { flex-direction: column; gap: 20px; }
          .badges-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
}
