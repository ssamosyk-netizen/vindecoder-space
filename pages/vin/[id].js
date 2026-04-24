import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { 
    dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", privacy: "Privacy Policy", ad: "ADVERTISEMENT",
    sections: { general: "General Information", engine: "Engine & Performance", mechanical: "Mechanical & Chassis", safety: "Safety & Interior", origin: "Manufacturing Details" },
    fields: { make: "Make", model: "Model", year: "Year", trim: "Trim", series: "Series", type: "Vehicle Type", body: "Body Class", doors: "Doors", engine: "Engine", cylinders: "Cylinders", hp: "Horsepower", fuel: "Fuel Type", injection: "Injection Type", drive: "Drive Type", transmission: "Transmission", brakes: "Brake System", steering: "Steering", axles: "Axles", wheelbase: "Wheelbase", gvwr: "Gross Weight", abs: "ABS", esc: "ESC", tpms: "TPMS", airbagF: "Front Airbags", airbagS: "Side Airbags", country: "Country", plantCity: "Plant City", manufacturer: "Manufacturer" }
  },
  uk: { 
    dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", privacy: "Політика конфіденційності", ad: "РЕКЛАМА",
    sections: { general: "Загальна інформація", engine: "Двигун та трансмісія", mechanical: "Ходова та механіка", safety: "Безпека та інтер'єр", origin: "Дані виробництва" },
    fields: { make: "Марка", model: "Модель", year: "Рік", trim: "Комплектація", series: "Серія", type: "Тип ТЗ", body: "Клас кузова", doors: "Двері", engine: "Двигун", cylinders: "Циліндри", hp: "Кінські сили", fuel: "Паливо", injection: "Тип впорскування", drive: "Привід", transmission: "Трансмісія", brakes: "Гальма", steering: "Кермо", axles: "Осі", wheelbase: "Колісна база", gvwr: "Повна маса", abs: "ABS", esc: "ESC", tpms: "Тиск у шинах", airbagF: "Передні Airbag", airbagS: "Бокові Airbag", country: "Країна", plantCity: "Місто заводу", manufacturer: "Виробник" }
  }
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

  const shareTitle = `${vin} | ${carYear} ${carMake} ${carModel} ${carEngine !== '—' ? carEngine : ''}`;
  // ПОВНИЙ ШЛЯХ ДО КАРТИНКИ
  const ogImageUrl = `https://vindecoder.space/api/og?vin=${vin}&make=${encodeURIComponent(carMake)}&model=${encodeURIComponent(carModel)}&year=${carYear}&engine=${encodeURIComponent(carEngine)}`;

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{shareTitle}</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
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
            <section className="section">
              <h3>{t.sections.general}</h3>
              <div className="grid">
                <div className="item"><span>{t.fields.make}</span><b>{val(serverData.Make)}</b></div>
                <div className="item"><span>{t.fields.model}</span><b>{val(serverData.Model)}</b></div>
                <div className="item"><span>{t.fields.year}</span><b>{val(serverData.ModelYear)}</b></div>
                <div className="item"><span>{t.fields.type}</span><b>{val(serverData.VehicleType)}</b></div>
                <div className="item"><span>{t.fields.body}</span><b>{val(serverData.BodyClass)}</b></div>
                <div className="item"><span>{t.fields.doors}</span><b>{val(serverData.Doors)}</b></div>
              </div>
            </section>

            <section className="section">
              <h3>{t.sections.engine}</h3>
              <div className="grid">
                <div className="item"><span>{t.fields.engine}</span><b>{val(serverData.DisplacementL)}L {val(serverData.EngineConfiguration)}</b></div>
                <div className="item"><span>{t.fields.hp}</span><b>{val(serverData.EngineHP)} hp</b></div>
                <div className="item"><span>{t.fields.fuel}</span><b>{val(serverData.FuelTypePrimary)}</b></div>
                <div className="item"><span>{t.fields.drive}</span><b>{val(serverData.DriveType)}</b></div>
                <div className="item"><span>{t.fields.transmission}</span><b>{val(serverData.TransmissionStyle)}</b></div>
              </div>
            </section>

            <section className="section">
              <h3>{t.sections.origin}</h3>
              <div className="grid">
                <div className="item"><span>{t.fields.manufacturer}</span><b>{val(serverData.Manufacturer)}</b></div>
                <div className="item"><span>{t.fields.country}</span><b>{val(serverData.PlantCountry)}</b></div>
              </div>
            </section>

            <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
          </main>
          <aside className="sidebar">
            <div className="ad-container vertical"><div className="ad-placeholder-vert">300 x 600</div></div>
          </aside>
        </div>
      )}

      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: sans-serif; margin: 0; }
        .container { padding: 20px; min-height: 100vh; text-align: center; }
        .header h1 { font-size: 2rem; font-weight: 900; margin-bottom: 20px; letter-spacing: -2px; }
        .yellow { color: #facc15; } .white { color: #fff; }
        .hero h2 { font-size: clamp(1.4rem, 5vw, 2.6rem); text-transform: uppercase; margin: 0; font-weight: 900; }
        .subtitle { color: #666; margin: 10px 0 30px; font-size: 14px; }
        .wrapper { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 20px; }
        .section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 20px; text-align: left; margin-bottom: 25px; }
        .section h3 { color: #facc15; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 12px; margin-bottom: 20px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px; }
        .item span { color: #555; font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .item b { display: block; font-size: 16px; margin-top: 6px; color: #eee; }
        .sidebar { display: none; }
        .back-btn { background: transparent; color: #444; border: 1px solid #222; padding: 15px 30px; border-radius: 12px; font-weight: bold; cursor: pointer; }
        @media (min-width: 900px) {
          .wrapper { flex-direction: row; align-items: flex-start; }
          .sidebar { display: block; width: 300px; position: sticky; top: 20px; }
        }
      `}</style>
    </div>
  );
}
