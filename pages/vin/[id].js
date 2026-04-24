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

// --- РОЗУМНИЙ ДЕКОДЕР ДЛЯ ЄВРОПИ/АЗІЇ (WMI Decoder) ---
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
    'SAL': { make: 'LAND ROVER', country: 'United Kingdom' }
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

export async function getServerSideProps(context) {
  const { id } = context.params;
  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${id}?format=json`);
    const result = await res.json();
    return { props: { serverData: result.Results[0], vin: id.toUpperCase() } };
  } catch (error) {
    return { props: { serverData: null, vin: id.toUpperCase() } };
  }
}

export default function VinResult({ serverData, vin }) {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const decoded = decodeVinBasics(vin);
  const hasFullData = serverData && serverData.Make && serverData.Make !== "" && serverData.Make !== "Not Applicable";

  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);
  }, []);

  const t = translations[lang] || translations.en;
  const val = (v) => (!v || v === "" || v === "Not Applicable" || v === "null") ? "—" : v;

  const finalMake = hasFullData ? serverData.Make : (decoded.make || "Unknown");
  const finalYear = hasFullData ? serverData.ModelYear : (decoded.year || "—");
  const finalCountry = hasFullData ? serverData.PlantCountry : decoded.country;
  const finalModel = hasFullData ? serverData.Model : "—";
  const carEngine = serverData?.DisplacementL ? `${serverData.DisplacementL}L` : '—';

  const shareTitle = `${vin} | ${finalYear} ${finalMake} ${finalModel}`;
  const ogImageUrl = `https://vindecoder.space/api/og?vin=${vin}&make=${encodeURIComponent(finalMake)}&model=${encodeURIComponent(finalModel)}&year=${finalYear}&engine=${encodeURIComponent(carEngine)}`;

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{shareTitle}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={`Full technical report for ${finalYear} ${finalMake}. Region: ${decoded.market.name}`} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
        <div className="market-badge">{decoded.market.icon} {decoded.market.name}</div>
      </div>

      <div className="wrapper">
        <main className="main">
          <div className="hero">
            {!hasFullData && <div className="notice-badge">{t.basicData}</div>}
            <h2>{finalYear} <span className="yellow">{finalMake}</span> {finalModel} {carEngine !== '—' ? carEngine : ''}</h2>
            <p className="subtitle">VIN: <b>{vin}</b></p>
          </div>

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
                </>
              )}
            </div>
          </section>

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
              <section className="section">
                <h3>{t.sections.engine}</h3>
                <div className="grid">
                  <div className="item"><span>{t.fields.engine}</span><b>{val(serverData.DisplacementL)}L {val(serverData.EngineConfiguration)}</b></div>
                  <div className="item"><span>{t.fields.hp}</span><b>{val(serverData.EngineHP)} hp</b></div>
                  <div className="item"><span>{t.fields.drive}</span><b>{val(serverData.DriveType)}</b></div>
                  <div className="item"><span>{t.fields.transmission}</span><b>{val(serverData.TransmissionStyle)}</b></div>
                </div>
              </section>

              <section className="section">
                <h3>{t.sections.safety}</h3>
                <div className="grid">
                  <div className="item"><span>ABS</span><b>{val(serverData.ABS)}</b></div>
                  <div className="item"><span>TPMS</span><b>{val(serverData.TPMS)}</b></div>
                  <div className="item"><span>Front Airbags</span><b>{val(serverData.AirBagLocFront)}</b></div>
                </div>
              </section>
            </>
          )}

          <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
        </main>

        <aside className="sidebar">
          <div className="premium-card">
            <h4>{lang === 'uk' ? 'Повна історія' : 'Full History'}</h4>
            <p>{lang === 'uk' ? 'Перевірте реальний пробіг та історію ДТП.' : 'Get accident and mileage history report.'}</p>
            <button className="partner-btn-sm" onClick={() => window.open('https://www.carvertical.com/', '_blank')}>
              {lang === 'uk' ? 'ПЕРЕВІРИТИ' : 'CHECK NOW'}
            </button>
          </div>
          <div className="ad-placeholder-vert">ADVERTISEMENT</div>
        </aside>
      </div>

      <footer className="footer"><p>© 2026 VIN DECODER | <a href="/privacy">{t.privacy}</a></p></footer>

      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: sans-serif; margin: 0; }
        .container { padding: 20px; max-width: 1200px; margin: 0 auto; min-height: 100vh; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .header h1 { font-size: 1.6rem; font-weight: 900; margin: 0; letter-spacing: -2px; }
        .yellow { color: #facc15; } .white { color: #fff; }
        .market-badge { background: #111; padding: 8px 16px; border-radius: 30px; font-size: 11px; font-weight: bold; border: 1px solid #333; color: #aaa; }
        .notice-badge { display: inline-block; background: #2563eb; color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 900; margin-bottom: 15px; text-transform: uppercase; }
        .hero h2 { font-size: clamp(1.8rem, 5vw, 2.8rem); font-weight: 900; text-transform: uppercase; margin: 0; line-height: 1.1; }
        .subtitle { color: #666; margin: 10px 0 40px; font-size: 14px; }
        .wrapper { display: flex; flex-direction: column; gap: 30px; }
        .main { flex: 1; text-align: left; }
        .section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 20px; margin-bottom: 25px; }
        .section h3 { color: #facc15; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 15px; margin-bottom: 20px; letter-spacing: 1px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
        .item span { color: #555; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .item b { display: block; font-size: 16px; margin-top: 5px; color: #eee; line-height: 1.2; }
        .europe-lock-card { background: #080808; border: 1px dashed #333; padding: 50px 20px; border-radius: 20px; text-align: center; margin-bottom: 25px; }
        .lock-icon { font-size: 45px; margin-bottom: 15px; }
        .partner-btn { background: #facc15; color: #000; border: none; padding: 18px 40px; font-weight: 900; border-radius: 12px; cursor: pointer; text-transform: uppercase; }
        .partner-btn-sm { background: #facc15; width: 100%; border: none; padding: 12px; font-weight: 900; border-radius: 8px; cursor: pointer; text-transform: uppercase; }
        .back-btn { background: transparent; color: #444; border: 1px solid #222; padding: 15px 30px; border-radius: 12px; margin-top: 20px; cursor: pointer; }
        .sidebar { width: 100%; }
        .premium-card { background: #111; border: 1px solid #333; padding: 25px; border-radius: 20px; margin-bottom: 20px; }
        .premium-card h4 { margin: 0 0 10px 0; color: #facc15; font-size: 14px; text-transform: uppercase; }
        .premium-card p { font-size: 13px; color: #888; margin-bottom: 20px; }
        .ad-placeholder-vert { background: #080808; border: 1px solid #111; height: 400px; border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #222; font-size: 10px; }
        .footer { padding: 40px 0; border-top: 1px solid #111; margin-top: 40px; font-size: 12px; color: #333; }
        .footer a { color: #555; text-decoration: none; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
        @media (min-width: 900px) {
          .wrapper { flex-direction: row; }
          .sidebar { width: 300px; position: sticky; top: 20px; align-self: flex-start; }
        }
      `}</style>
    </div>
  );
}
