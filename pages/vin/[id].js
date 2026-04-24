import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { 
    dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", privacy: "Privacy Policy", ad: "ADVERTISEMENT",
    market: "Market Region", basicData: "Basic Data (Decoded from VIN)",
    partnerTitle: "Full Report Available", partnerDesc: "Get hidden damages and mileage history.", partnerBtn: "GET FULL REPORT",
    lockedTitle: "🔒 Technical Data Protected", lockedDesc: "European manufacturers restrict detailed specs in free databases. Unlock for full history.", unlockBtn: "UNLOCK REPORT",
    sections: { general: "General Information", engine: "Engine & Performance", mechanical: "Mechanical & Chassis", safety: "Safety & Interior", origin: "Manufacturing Details" },
    fields: { 
      make: "Make", model: "Model", year: "Year", trim: "Trim", series: "Series", type: "Vehicle Type", body: "Body Class", doors: "Doors",
      engine: "Engine", cylinders: "Cylinders", hp: "Horsepower", fuel: "Fuel Type", drive: "Drive Type", transmission: "Transmission",
      brakes: "Brake System", steering: "Steering", axles: "Axles", wheelbase: "Wheelbase", gvwr: "Gross Weight",
      abs: "ABS", esc: "ESC", tpms: "TPMS", country: "Country", plantCity: "Plant City", manufacturer: "Manufacturer"
    }
  },
  uk: { 
    dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", privacy: "Політика конфіденційності", ad: "РЕКЛАМА",
    market: "Регіон ринку", basicData: "Базові дані (розшифровано з VIN)",
    partnerTitle: "Доступний повний звіт", partnerDesc: "Перевірте скручений пробіг та історію ДТП.", partnerBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ",
    lockedTitle: "🔒 Технічні дані захищені", lockedDesc: "Європейські виробники обмежують дані у безкоштовних базах. Розблокуйте повну історію.", unlockBtn: "РОЗБЛОКУВАТИ ЗВІТ",
    sections: { general: "Загальна інформація", engine: "Двигун та трансмісія", mechanical: "Ходова та механіка", safety: "Безпека", origin: "Дані виробництва" },
    fields: { 
      make: "Марка", model: "Модель", year: "Рік", trim: "Комплектація", series: "Серія", type: "Тип ТЗ", body: "Клас кузова", doors: "Двері",
      engine: "Двигун", cylinders: "Циліндри", hp: "Кінські сили", fuel: "Паливо", drive: "Привід", transmission: "Трансмісія",
      brakes: "Гальма", steering: "Кермо", axles: "Осі", wheelbase: "Колісна база", gvwr: "Повна маса",
      abs: "ABS", esc: "ESC", tpms: "Тиск у шинах", country: "Країна", plantCity: "Місто заводу", manufacturer: "Виробник"
    }
  }
};

// --- ГЛОБАЛЬНИЙ ДЕКОДЕР WMI (Світ) ---
const decodeVinBasics = (vin) => {
  const wmi = vin.substring(0, 3);
  const yearChar = vin.charAt(9).toUpperCase();
  
  const wmiMap = {
    'TMA': { make: 'HYUNDAI', country: 'Czech Republic' },
    'TMB': { make: 'SKODA', country: 'Czech Republic' },
    'WDB': { make: 'MERCEDES-BENZ', country: 'Germany' },
    'WBA': { make: 'BMW', country: 'Germany' },
    'WVW': { make: 'VOLKSWAGEN', country: 'Germany' },
    'ZAR': { make: 'ALFA ROMEO', country: 'Italy' },
    'ZFA': { make: 'FIAT', country: 'Italy' },
    'VF3': { make: 'PEUGEOT', country: 'France' },
    'UU1': { make: 'DACIA', country: 'Romania' },
    'VSS': { make: 'SEAT', country: 'Spain' },
    'JHM': { make: 'HONDA', country: 'Japan' },
    'JT1': { make: 'TOYOTA', country: 'Japan' },
    'KL3': { make: 'CHEVROLET', country: 'South Korea' },
    'KNA': { make: 'KIA', country: 'South Korea' },
    'KPT': { make: 'SSANGYONG', country: 'South Korea' },
    'SJ3': { make: 'NISSAN', country: 'United Kingdom' },
    'SAL': { make: 'LAND ROVER', country: 'United Kingdom' },
    'TRU': { make: 'AUDI', country: 'Hungary' },
    'WF0': { make: 'FORD', country: 'Germany' }
  };

  const yearMap = { 'W':1998, 'X':1999, 'Y':2000, '1':2001, '2':2002, '3':2003, '4':2004, '5':2005, '6':2006, '7':2007, '8':2008, '9':2009, 'A':2010, 'B':2011, 'C':2012, 'D':2013, 'E':2014, 'F':2015, 'G':2016, 'H':2017, 'J':2018, 'K':2019, 'L':2020, 'M':2021, 'N':2022, 'P':2023, 'R':2024, 'S':2025 };

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

const getMarketInfo = (vin) => {
  const first = vin[0];
  if (['1','2','3','4','5'].includes(first)) return { name: "North America", icon: "🇺🇸" };
  if (['J','K','L','M','N','P','R'].includes(first)) return { name: "Asia", icon: "🇯🇵" };
  if (['S','T','U','V','W','X','Y','Z'].includes(first)) return { name: "Europe", icon: "🇪🇺" };
  return { name: "Global", icon: "🌍" };
};

const fixEuroYear = (vin) => {
  const yearChar = vin.charAt(9).toUpperCase();
  const yearMap = { 'W':1998, 'X':1999, 'Y':2000, '1':2001, '2':2002, '3':2003, '4':2004, '5':2005, '6':2006, '7':2007, '8':2008, '9':2009, 'A':2010, 'B':2011, 'C':2012, 'D':2013, 'E':2014, 'F':2015, 'G':2016, 'H':2017, 'J':2018, 'K':2019, 'L':2020, 'M':2021, 'N':2022, 'P':2023, 'R':2024, 'S':2025 };
  return yearMap[yearChar] || null;
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${id}?format=json`);
    const result = await res.json();
    let carData = result.Results[0];
    if (id.toUpperCase().includes('ZZZ')) {
      const cYear = fixEuroYear(id);
      if (cYear) carData.ModelYear = cYear;
    }
    return { props: { serverData: carData, vin: id.toUpperCase() } };
  } catch (error) {
    return { props: { serverData: null, vin: id.toUpperCase() } };
  }
}

export default function VinResult({ serverData, vin }) {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const market = getMarketInfo(vin);
  const decoded = decodeVinBasics(vin);
  
  // Перевірка на наявність даних від NHTSA
  const hasFullData = serverData && serverData.Make && serverData.Make !== "" && serverData.Make !== "Not Applicable" && serverData.Make !== "None";

  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);
  }, []);

  const t = translations[lang] || translations.en;
  const val = (v) => (!v || v === "" || v === "Not Applicable" || v === "null" || v === "None") ? "—" : v;

  // Формуємо фінальні дані (Пріоритет базі, якщо ні — нашому декодеру)
  const finalMake = hasFullData ? serverData.Make : (decoded.make || "Unknown");
  const finalYear = hasFullData ? serverData.ModelYear : (decoded.year || "—");
  const finalCountry = hasFullData ? serverData.PlantCountry : decoded.country;
  const finalModel = hasFullData ? serverData.Model : "—";
  const carEngine = serverData?.DisplacementL ? `${serverData.DisplacementL}L` : '—';

  const shareTitle = `${vin} | ${finalYear} ${finalMake} ${finalModel} ${carEngine !== '—' ? carEngine : ''}`;
  const ogImageUrl = `https://vindecoder.space/api/og?vin=${vin}&make=${encodeURIComponent(finalMake)}&model=${encodeURIComponent(finalModel)}&year=${finalYear}&engine=${encodeURIComponent(carEngine)}`;

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{shareTitle}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={`Full technical report for ${finalYear} ${finalMake}. Region: ${market.name}`} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://vindecoder.space/vin/${vin}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span><span className="white">DECODER</span>
        </h1>
        <div className="market-badge">{market.icon} {market.name} Market</div>
      </div>

      <div className="wrapper">
        <main className="main">
          <div className="hero">
            {!hasFullData && <div className="notice-badge">{t.basicData}</div>}
            <h2>{finalYear} <span className="yellow">{finalMake}</span> {finalModel} {carEngine !== '—' ? carEngine : ''}</h2>
            <p className="subtitle">{t.subtitle} <b>{vin}</b></p>
          </div>

          {/* 1. GENERAL INFORMATION */}
          <section className="section">
            <h3>{t.sections.general}</h3>
            <div className="grid">
              <div className="item"><span>{t.fields.make}</span><b>{finalMake}</b></div>
              <div className="item"><span>{t.fields.model}</span><b>{finalModel}</b></div>
              <div className="item"><span>{t.fields.year}</span><b style={{color: vin.includes('ZZZ') || !hasFullData ? '#4ade80' : '#eee'}}>{finalYear}</b></div>
              <div className="item"><span>{t.fields.country}</span><b>{val(finalCountry)}</b></div>
              {hasFullData && (
                <>
                  <div className="item"><span>{t.fields.trim}</span><b>{val(serverData.Trim)}</b></div>
                  <div className="item"><span>{t.fields.type}</span><b>{val(serverData.VehicleType)}</b></div>
                </>
              )}
            </div>
          </section>

          <div className="ad-container horizontal"><span className="ad-tag">{t.ad}</span><div className="ad-placeholder-hor">728 x 90</div></div>

          {!hasFullData ? (
            <div className="europe-lock-card">
              <div className="lock-icon">🔒</div>
              <h3>{t.lockedTitle}</h3>
              <p>{t.lockedDesc}</p>
              <button className="partner-btn pulse" onClick={() => window.open('https://www.carvertical.com/', '_blank')}>
                {t.unlockBtn}
              </button>
            </div>
          ) : (
            <>
              {/* 2. ENGINE & PERFORMANCE */}
              <section className="section">
                <h3>{t.sections.engine}</h3>
                <div className="grid">
                  <div className="item"><span>{t.fields.engine}</span><b>{val(serverData.DisplacementL)}L {val(serverData.EngineConfiguration)}</b></div>
                  <div className="item"><span>{t.fields.cylinders}</span><b>{val(serverData.EngineNumberofCylinders)}</b></div>
                  <div className="item"><span>{t.fields.hp}</span><b>{val(serverData.EngineHP)} hp</b></div>
                  <div className="item"><span>{t.fields.fuel}</span><b>{val(serverData.FuelTypePrimary)}</b></div>
                  <div className="item"><span>{t.fields.drive}</span><b>{val(serverData.DriveType)}</b></div>
                  <div className="item"><span>{t.fields.transmission}</span><b>{val(serverData.TransmissionStyle)}</b></div>
                </div>
              </section>

              {/* 3. MECHANICAL & CHASSIS */}
              <section className="section">
                <h3>{t.sections.mechanical}</h3>
                <div className="grid">
                  <div className="item"><span>{t.fields.brakes}</span><b>{val(serverData.BrakeSystemType)}</b></div>
                  <div className="item"><span>{t.fields.steering}</span><b>{val(serverData.SteeringLocation)}</b></div>
                  <div className="item"><span>{t.fields.axles}</span><b>{val(serverData.Axles)}</b></div>
                  <div className="item"><span>{t.fields.wheelbase}</span><b>{val(serverData.WheelBaseLong)} in</b></div>
                  <div className="item"><span>{t.fields.gvwr}</span><b>{val(serverData.GVWR)}</b></div>
                </div>
              </section>

              {/* 4. SAFETY */}
              <section className="section">
                <h3>{t.sections.safety}</h3>
                <div className="grid">
                  <div className="item"><span>{t.fields.abs}</span><b>{val(serverData.ABS)}</b></div>
                  <div className="item"><span>{t.fields.esc}</span><b>{val(serverData.ESC)}</b></div>
                  <div className="item"><span>{t.fields.tpms}</span><b>{val(serverData.TPMS)}</b></div>
                  <div className="item"><span>{t.fields.airbagF}</span><b>{val(serverData.AirBagLocFront)}</b></div>
                  <div className="item"><span>{t.fields.airbagS}</span><b>{val(serverData.AirBagLocSide)}</b></div>
                </div>
              </section>
            </>
          )}

          {/* 5. ORIGIN (Якщо є дані бази) */}
          {hasFullData && (
            <section className="section">
              <h3>{t.sections.origin}</h3>
              <div className="grid">
                <div className="item"><span>{t.fields.manufacturer}</span><b>{val(serverData.Manufacturer)}</b></div>
                <div className="item"><span>{t.fields.country}</span><b>{val(serverData.PlantCountry)}</b></div>
                <div className="item"><span>{t.fields.plantCity}</span><b>{val(serverData.PlantCity)}, {val(serverData.PlantState)}</b></div>
              </div>
            </section>
          )}

          <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
        </main>

        <aside className="sidebar">
          <div className="premium-card">
            <h4>{lang === 'uk' ? 'Історія та пробіг' : 'History & Mileage'}</h4>
            <p>{lang === 'uk' ? 'Перевірте авто на приховані ДТП та скручений пробіг.' : 'Check for hidden accidents and odometer rollbacks.'}</p>
            <button className="partner-btn-sm" onClick={() => window.open('https://www.carvertical.com/', '_blank')}>
              {lang === 'uk' ? 'ПЕРЕВІРИТИ' : 'CHECK NOW'}
            </button>
          </div>
          <div className="ad-container vertical">
            <span className="ad-tag">{t.ad}</span>
            <div className="ad-placeholder-vert">300 x 600</div>
          </div>
        </aside>
      </div>

      <footer className="footer"><p>© 2026 VIN DECODER | <a href="/privacy">{t.privacy}</a></p></footer>

      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: sans-serif; margin: 0; }
        .container { padding: 20px; min-height: 100vh; text-align: center; max-width: 1200px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .header h1 { font-size: 1.8rem; font-weight: 900; margin: 0; letter-spacing: -2px; }
        .yellow { color: #facc15; } .white { color: #fff; }
        .market-badge { background: #1a1a1a; padding: 8px 16px; border-radius: 30px; font-size: 11px; font-weight: bold; border: 1px solid #333; text-transform: uppercase; color: #aaa; }
        .notice-badge { display: inline-block; background: #2563eb; color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 900; margin-bottom: 15px; text-transform: uppercase; }
        .hero h2 { font-size: clamp(1.4rem, 5vw, 2.6rem); text-transform: uppercase; margin: 0; font-weight: 900; line-height: 1.1; }
        .subtitle { color: #666; margin: 10px 0 40px; font-size: 14px; }
        .wrapper { display: flex; flex-direction: column; gap: 30px; }
        .main { flex: 1; text-align: left; }
        .section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 20px; margin-bottom: 25px; }
        .section h3 { color: #facc15; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 15px; margin-bottom: 20px; letter-spacing: 1px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .item span { color: #555; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .item b { display: block; font-size: 16px; margin-top: 6px; word-break: break-word; color: #eee; line-height: 1.2; }
        .europe-lock-card { background: #080808; border: 1px dashed #333; padding: 50px 20px; border-radius: 20px; text-align: center; margin-bottom: 25px; }
        .lock-icon { font-size: 45px; margin-bottom: 15px; }
        .premium-card { background: #080808; border: 1px solid #facc15; padding: 25px; border-radius: 20px; margin-bottom: 25px; }
        .premium-card h4 { margin: 0 0 10px 0; color: #facc15; text-transform: uppercase; font-size: 14px; }
        .premium-card p { font-size: 13px; color: #888; margin-bottom: 20px; }
        .partner-btn-sm { background: #facc15; width: 100%; border: none; padding: 12px; font-weight: 900; border-radius: 8px; cursor: pointer; text-transform: uppercase; }
        .partner-btn { background: #facc15; color: #000; border: none; padding: 18px 40px; font-weight: 900; cursor: pointer; border-radius: 12px; text-transform: uppercase; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
        .ad-container { margin: 25px 0; text-align: center; }
        .ad-tag { display: block; font-size: 9px; color: #333; margin-bottom: 5px; text-transform: uppercase; }
        .ad-placeholder-hor { background: #080808; border: 1px solid #111; min-height: 90px; border-radius: 10px; }
        .ad-placeholder-vert { background: #080808; border: 1px solid #111; width: 300px; height: 600px; border-radius: 15px; }
        .sidebar { width: 100%; }
        .back-btn { background: transparent; color: #444; border: 1px solid #222; padding: 15px 30px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; }
        .footer { padding: 60px 0 30px; color: #222; font-size: 11px; }
        .footer a { color: #444; text-decoration: none; margin-left: 10px; }
        @media (min-width: 900px) {
          .wrapper { flex-direction: row; align-items: flex-start; }
          .sidebar { width: 300px; position: sticky; top: 20px; }
        }
      `}</style>
    </div>
  );
}
