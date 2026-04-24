import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { 
    dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", privacy: "Privacy Policy", ad: "ADVERTISEMENT",
    partnerTitle: "Full Report Available", partnerDesc: "Get hidden damages and mileage history.", partnerBtn: "GET FULL REPORT",
    lockedTitle: "🔒 Technical Data Protected", lockedDesc: "European manufacturers restrict detailed specs in free databases. Unlock for full history.", unlockBtn: "UNLOCK REPORT",
    sections: { general: "General Information", engine: "Engine & Performance", mechanical: "Mechanical & Chassis", safety: "Safety & Interior", origin: "Manufacturing Details" },
    fields: { 
      make: "Make", model: "Model", year: "Year", trim: "Trim", series: "Series", type: "Vehicle Type", body: "Body Class", doors: "Doors",
      engine: "Engine", cylinders: "Cylinders", hp: "Horsepower", fuel: "Fuel Type", injection: "Injection Type", drive: "Drive Type", transmission: "Transmission",
      brakes: "Brake System", steering: "Steering", axles: "Axles", wheelbase: "Wheelbase", gvwr: "Gross Weight",
      abs: "ABS", esc: "ESC", tpms: "TPMS", seatbelts: "Seat Belts", airbagF: "Front Airbags", airbagS: "Side Airbags", airbagK: "Knee Airbags", airbagC: "Curtain Airbags",
      country: "Country", plantCity: "Plant City", manufacturer: "Manufacturer"
    }
  },
  uk: { 
    dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", privacy: "Політика конфіденційності", ad: "РЕКЛАМА",
    partnerTitle: "Доступний повний звіт", partnerDesc: "Перевірте скручений пробіг та історію ДТП.", partnerBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ",
    lockedTitle: "🔒 Технічні дані захищені", lockedDesc: "Європейські виробники обмежують дані у безкоштовних базах. Розблокуйте повну історію.", unlockBtn: "РОЗБЛОКУВАТИ ЗВІТ",
    sections: { general: "Загальна інформація", engine: "Двигун та трансмісія", mechanical: "Ходова та механіка", safety: "Безпека та інтер'єр", origin: "Дані виробництва" },
    fields: { 
      make: "Марка", model: "Модель", year: "Рік", trim: "Комплектація", series: "Серія", type: "Тип ТЗ", body: "Клас кузова", doors: "Двері",
      engine: "Двигун", cylinders: "Циліндри", hp: "Кінські сили", fuel: "Паливо", injection: "Тип впорскування", drive: "Привід", transmission: "Трансмісія",
      brakes: "Гальма", steering: "Кермо", axles: "Осі", wheelbase: "Колісна база", gvwr: "Повна маса",
      abs: "ABS", esc: "ESC", tpms: "Тиск у шинах", seatbelts: "Ремені безпеки", airbagF: "Передні Airbag", airbagS: "Бокові Airbag", airbagK: "Колінні Airbag", airbagC: "Шторки безпеки",
      country: "Країна", plantCity: "Місто заводу", manufacturer: "Виробник"
    }
  }
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
  const isEuro = vin.includes('ZZZ');

  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) setLang(savedLang);
  }, []);

  const t = translations[lang] || translations.en;
  const val = (v) => (!v || v === "" || v === "Not Applicable" || v === "null" || v === "None") ? "—" : v;

  const carYear = val(serverData?.ModelYear);
  const carMake = val(serverData?.Make);
  const carModel = val(serverData?.Model);
  const carEngine = serverData?.DisplacementL ? `${serverData.DisplacementL}L` : '—';

  // ПОВНИЙ ЛІНК ДЛЯ МЕСЕНДЖЕРІВ
  const shareTitle = `${vin} | ${carYear} ${carMake} ${carModel} ${carEngine !== '—' ? carEngine : ''}`;
  const ogImageUrl = `https://vindecoder.space/api/og?vin=${vin}&make=${encodeURIComponent(carMake)}&model=${encodeURIComponent(carModel)}&year=${carYear}&engine=${encodeURIComponent(carEngine)}`;

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{shareTitle}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        
        {/* OPEN GRAPH ДЛЯ VIBER / TELEGRAM / FACEBOOK */}
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={`Full technical report for ${carYear} ${carMake} ${carModel}.`} />
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
        {serverData && (
          <div className="hero">
            <h2>{carYear} <span className="yellow">{carMake}</span> {carModel} {carEngine !== '—' ? carEngine : ''}</h2>
            <p className="subtitle">{t.subtitle} <b>{vin}</b></p>
          </div>
        )}
      </div>

      {serverData && (
        <div className="wrapper">
          <main className="main">
            {/* 1. GENERAL INFORMATION */}
            <section className="section">
              <h3>{t.sections.general}</h3>
              <div className="grid">
                <div className="item"><span>{t.fields.make}</span><b>{val(serverData.Make)}</b></div>
                <div className="item"><span>{t.fields.model}</span><b>{val(serverData.Model)}</b></div>
                <div className="item"><span>{t.fields.year}</span><b style={{color: isEuro ? '#4ade80' : '#eee'}}>{val(serverData.ModelYear)}</b></div>
                <div className="item"><span>{t.fields.trim}</span><b>{val(serverData.Trim)}</b></div>
                <div className="item"><span>{t.fields.series}</span><b>{val(serverData.Series)}</b></div>
                <div className="item"><span>{t.fields.type}</span><b>{val(serverData.VehicleType)}</b></div>
                <div className="item"><span>{t.fields.body}</span><b>{val(serverData.BodyClass)}</b></div>
                <div className="item"><span>{t.fields.doors}</span><b>{val(serverData.Doors)}</b></div>
              </div>
            </section>

            <div className="ad-container horizontal"><span className="ad-tag">{t.ad}</span><div className="ad-placeholder-hor">728 x 90</div></div>

            {isEuro ? (
              <div className="premium-lock">
                <div className="lock-icon">🔒</div>
                <h3>{t.lockedTitle}</h3>
                <p>{t.lockedDesc}</p>
                <button className="partner-btn pulse" onClick={() => window.open('https://www.carvertical.com/', '_blank')}>{t.unlockBtn}</button>
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
                    <div className="item"><span>{t.fields.injection}</span><b>{val(serverData.FuelInjectionType)}</b></div>
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
                    <div className="item"><span>{t.fields.airbagK}</span><b>{val(serverData.AirBagLocKnee)}</b></div>
                    <div className="item"><span>{t.fields.airbagC}</span><b>{val(serverData.AirBagLocCurtain)}</b></div>
                  </div>
                </section>
              </>
            )}

            {/* 5. ORIGIN */}
            <section className="section">
              <h3>{t.sections.origin}</h3>
              <div className="grid">
                <div className="item"><span>{t.fields.manufacturer}</span><b>{val(serverData.Manufacturer)}</b></div>
                <div className="item"><span>{t.fields.country}</span><b>{val(serverData.PlantCountry)}</b></div>
                <div className="item"><span>{t.fields.plantCity}</span><b>{val(serverData.PlantCity)}, {val(serverData.PlantState)}</b></div>
              </div>
            </section>

            <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
          </main>

          <aside className="sidebar">
            <div className="ad-container vertical">
              <span className="ad-tag">{t.ad}</span>
              <div className="ad-placeholder-vert">300 x 600</div>
            </div>
          </aside>
        </div>
      )}

      <footer className="footer"><p>© 2026 VIN DECODER | <a href="/privacy">{t.privacy}</a></p></footer>

      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: sans-serif; margin: 0; }
        .container { padding: 20px; min-height: 100vh; text-align: center; }
        .header h1 { font-size: 2rem; font-weight: 900; margin-bottom: 20px; letter-spacing: -2px; }
        .yellow { color: #facc15; } .white { color: #fff; }
        .hero h2 { font-size: clamp(1.4rem, 5vw, 2.6rem); text-transform: uppercase; margin: 0; font-weight: 900; line-height: 1.1; }
        .subtitle { color: #666; margin: 10px 0 30px; font-size: 14px; }
        .wrapper { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .main { flex: 1; min-width: 0; }
        .section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 20px; text-align: left; margin-bottom: 25px; }
        .section h3 { color: #facc15; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 12px; margin-bottom: 20px; letter-spacing: 1px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        .item span { color: #555; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .item b { display: block; font-size: 16px; margin-top: 6px; word-break: break-word; color: #eee; line-height: 1.2; }
        .premium-lock { background: #050505; border: 1px dashed #444; padding: 50px 20px; border-radius: 20px; margin-bottom: 25px; }
        .lock-icon { font-size: 40px; margin-bottom: 15px; }
        .partner-btn { background: #facc15; color: #000; border: none; padding: 18px 40px; font-weight: 900; cursor: pointer; border-radius: 12px; text-transform: uppercase; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
        .ad-container { margin: 25px 0; text-align: center; }
        .ad-tag { display: block; font-size: 9px; color: #333; margin-bottom: 5px; text-transform: uppercase; }
        .ad-placeholder-hor { background: #080808; border: 1px solid #111; min-height: 90px; display: flex; align-items: center; justify-content: center; color: #222; border-radius: 10px; }
        .ad-placeholder-vert { background: #080808; border: 1px solid #111; width: 300px; height: 600px; display: flex; align-items: center; justify-content: center; color: #222; border-radius: 15px; }
        .sidebar { display: none; }
        .back-btn { background: transparent; color: #444; border: 1px solid #222; padding: 15px 30px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 10px; }
        .footer { padding: 60px 0 30px; color: #222; font-size: 11px; }
        .footer a { color: #444; text-decoration: none; margin-left: 10px; }
        @media (min-width: 900px) {
          .wrapper { flex-direction: row; align-items: flex-start; }
          .sidebar { display: block; width: 300px; position: sticky; top: 20px; }
        }
      `}</style>
    </div>
  );
}
