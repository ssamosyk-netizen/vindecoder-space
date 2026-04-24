import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { 
    dir: 'ltr', subtitle: "Vehicle Specification Report", back: "Back to Search", privacy: "Privacy Policy", ad: "ADVERTISEMENT",
    partnerTitle: "Full Report Available", partnerDesc: "Get hidden damages and mileage history.", partnerBtn: "GET FULL REPORT",
    lockedTitle: "🔒 Technical Data Protected", lockedDesc: "European manufacturers restrict detailed specs in free databases. Unlock for full history.", unlockBtn: "UNLOCK REPORT",
    sections: { general: "General Information", engine: "Engine & Performance", dimensions: "Dimensions & Weight", safety: "Safety Equipment", origin: "Manufacturing" },
    fields: { make: "Make", model: "Model", year: "Year", trim: "Trim", type: "Vehicle Type", body: "Body Class", doors: "Doors", engine: "Engine", cylinders: "Cylinders", hp: "Horsepower", fuel: "Fuel Type", drive: "Drive Type", transmission: "Transmission", gvwr: "Gross Weight", wheelbase: "Wheelbase", axles: "Axles", abs: "ABS", esc: "ESC", tpms: "TPMS", airbagsF: "Front Airbags", airbagsS: "Side Airbags", country: "Country", plant: "Plant City", manufacturer: "Manufacturer" }
  },
  uk: { 
    dir: 'ltr', subtitle: "Звіт про специфікації автомобіля", back: "Назад до пошуку", privacy: "Політика конфіденційності", ad: "РЕКЛАМА",
    partnerTitle: "Доступний повний звіт", partnerDesc: "Перевірте скручений пробіг та історію ДТП.", partnerBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ",
    lockedTitle: "🔒 Технічні дані захищені", lockedDesc: "Європейські виробники обмежують дані у безкоштовних базах. Розблокуйте повну історію.", unlockBtn: "РОЗБЛОКУВАТИ ЗВІТ",
    sections: { general: "Загальна інформація", engine: "Двигун та трансмісія", dimensions: "Габарити та Вага", safety: "Системи безпеки", origin: "Виробництво" },
    fields: { make: "Марка", model: "Модель", year: "Рік", trim: "Комплектація", type: "Тип ТЗ", body: "Клас кузова", doors: "Двері", engine: "Двигун", cylinders: "Циліндри", hp: "Кінські сили", fuel: "Паливо", drive: "Привід", transmission: "Трансмісія", gvwr: "Повна маса", wheelbase: "Колісна база", axles: "Осі", abs: "ABS", esc: "ESC", tpms: "Тиск шин", airbagsF: "Фронтальні Airbag", airbagsS: "Бокові Airbag", country: "Країна", plant: "Місто заводу", manufacturer: "Виробник" }
  }
};

const fixEuroYear = (vin) => {
  const yearChar = vin.charAt(9).toUpperCase();
  const yearMap = { 'W':1998, 'X':1999, 'Y':2000, '1':2001, '2':2002, '3':2003, '4':2004, '5':2005, '6':2006, '7':2007, '8':2008, '9':2009, 'A':2010, 'B':2011, 'C':2012, 'D':2013, 'E':2014, 'F':2015, 'G':2016, 'H':2017, 'J':2018, 'K':2019, 'L':2020, 'M':2021, 'N':2022, 'P':2023, 'R':2024, 'S':2025 };
  return yearMap[yearChar] || null;
};

export default function VinResult() {
  const router = useRouter();
  const { id, region } = router.query;
  const [lang, setLang] = useState('en');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEuro, setIsEuro] = useState(false);

  useEffect(() => {
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
      let vData = result.Results[0];
      if (vinCode.includes('ZZZ')) {
        const cYear = fixEuroYear(vinCode);
        if (cYear) vData.ModelYear = cYear;
        setIsEuro(true);
      }
      setData(vData);
    } catch (err) {} finally { setLoading(false); }
  };

  const t = translations[lang] || translations.en;
  const val = (v) => (!v || v === "" || v === "Not Applicable" || v === "null") ? "—" : v;

  if (loading) return <div className="loader"><div className="spinner"></div><style jsx>{`.loader{height:100vh;display:flex;align-items:center;justify-content:center;background:#000;color:#facc15;}.spinner{width:40px;height:40px;border:4px solid #333;border-top:4px solid #facc15;border-radius:50%;animation:spin 1s linear infinite;}@keyframes spin{to{transform:rotate(360deg);}}`}</style></div>;

  return (
    <div dir={t.dir} className="container">
      <Head><title>{data ? `${data.ModelYear} ${data.Make} ${data.Model}` : id} | VIN DECODER</title></Head>

      <div className="header">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
        {data && (
          <div className="hero">
            <h2>{val(data.ModelYear)} {val(data.Make)} {val(data.Model)}</h2>
            <p className="subtitle">{t.subtitle} <b>{id}</b></p>
            <div className="badges">
              <span className="badge engine">{val(data.DisplacementL)}L {val(data.EngineConfiguration)}</span>
              {isEuro && <span className="badge eu">EU SPEC</span>}
            </div>
          </div>
        )}
      </div>

      {data && (
        <div className="wrapper">
          <main className="main">
            {/* ГЕНЕРАЛЬНА СЕКЦІЯ */}
            <section className="section">
              <h3>{t.sections.general}</h3>
              <div className="grid">
                <div className="item"><span>{t.fields.make}</span><b>{val(data.Make)}</b></div>
                <div className="item"><span>{t.fields.model}</span><b>{val(data.Model)}</b></div>
                <div className="item"><span>{t.fields.year}</span><b style={{color: isEuro ? '#4ade80' : '#eee'}}>{val(data.ModelYear)}</b></div>
                <div className="item"><span>{t.fields.type}</span><b>{val(data.VehicleType)}</b></div>
                <div className="item"><span>{t.fields.body}</span><b>{val(data.BodyClass)}</b></div>
                <div className="item"><span>{t.fields.doors}</span><b>{val(data.Doors)}</b></div>
              </div>
            </section>

            <div className="ad-box-wide">{t.ad}</div>

            {/* ЛОГІКА ДЛЯ ЄВРОПИ ТА АМЕРИКИ */}
            {isEuro ? (
              <div className="premium-lock">
                <div className="lock-icon">🔒</div>
                <h3>{t.lockedTitle}</h3>
                <p>{t.lockedDesc}</p>
                <button className="partner-btn pulse" onClick={() => window.open('https://www.carvertical.com/', '_blank')}>{t.unlockBtn}</button>
              </div>
            ) : (
              <>
                <section className="section">
                  <h3>{t.sections.engine}</h3>
                  <div className="grid">
                    <div className="item"><span>{t.fields.engine}</span><b>{val(data.DisplacementL)}L {val(data.EngineConfiguration)}</b></div>
                    <div className="item"><span>{t.fields.cylinders}</span><b>{val(data.EngineNumberofCylinders)}</b></div>
                    <div className="item"><span>{t.fields.hp}</span><b>{val(data.EngineHP)}</b></div>
                    <div className="item"><span>{t.fields.fuel}</span><b>{val(data.FuelTypePrimary)}</b></div>
                    <div className="item"><span>{t.fields.drive}</span><b>{val(data.DriveType)}</b></div>
                    <div className="item"><span>{t.fields.transmission}</span><b>{val(data.TransmissionStyle)}</b></div>
                  </div>
                </section>

                <section className="section">
                  <h3>{t.sections.safety}</h3>
                  <div className="grid">
                    <div className="item"><span>{t.fields.abs}</span><b>{val(data.ABS)}</b></div>
                    <div className="item"><span>{t.fields.esc}</span><b>{val(data.ESC)}</b></div>
                    <div className="item"><span>{t.fields.tpms}</span><b>{val(data.TPMS)}</b></div>
                    <div className="item"><span>{t.fields.airbagsF}</span><b>{val(data.AirBagLocFront)}</b></div>
                  </div>
                </section>

                <section className="section">
                  <h3>{t.sections.dimensions}</h3>
                  <div className="grid">
                    <div className="item"><span>{t.fields.gvwr}</span><b>{val(data.GVWR)}</b></div>
                    <div className="item"><span>{t.fields.wheelbase}</span><b>{val(data.WheelBaseLong)}</b></div>
                  </div>
                </section>
              </>
            )}

            <section className="section">
              <h3>{t.sections.origin}</h3>
              <div className="grid">
                <div className="item"><span>{t.fields.manufacturer}</span><b>{val(data.Manufacturer)}</b></div>
                <div className="item"><span>{t.fields.country}</span><b>{val(data.PlantCountry)}</b></div>
              </div>
            </section>

            <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
          </main>

          <aside className="sidebar">
            <div className="ad-box-side">{t.ad} (300x600)</div>
          </aside>
        </div>
      )}

      <footer className="footer">
        <p>© 2026 VIN DECODER | <a href="/privacy">{t.privacy}</a></p>
      </footer>

      <style jsx global>{`
        body { background-color: #000; color: #fff; font-family: sans-serif; margin: 0; }
        .container { padding: 20px; min-height: 100vh; text-align: center; }
        .header h1 { font-size: 2.5rem; font-weight: 900; margin-bottom: 30px; letter-spacing: -2px; }
        .yellow { color: #facc15; } .white { color: #fff; }
        .hero h2 { font-size: clamp(1.8rem, 5vw, 3rem); text-transform: uppercase; margin: 0; font-weight: 900; line-height: 1.1; }
        .subtitle { color: #666; margin: 10px 0 20px; font-size: 14px; }
        .badges { display: flex; justify-content: center; gap: 10px; margin-bottom: 40px; }
        .badge { padding: 6px 16px; border-radius: 8px; font-weight: bold; font-size: 13px; text-transform: uppercase; }
        .engine { background: #facc15; color: #000; }
        .eu { background: #1e3a8a; color: #fff; border: 1px solid #3b82f6; }
        .wrapper { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; gap: 30px; }
        .section { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 20px; text-align: left; }
        .section h3 { color: #facc15; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #222; padding-bottom: 12px; margin-bottom: 20px; letter-spacing: 1px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 25px; }
        .item span { color: #555; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .item b { display: block; font-size: 18px; margin-top: 6px; word-break: break-word; color: #eee; }
        .premium-lock { background: linear-gradient(180deg, #0a0a0a 0%, #000 100%); border: 1px dashed #333; padding: 50px 20px; border-radius: 20px; margin-bottom: 20px; }
        .lock-icon { font-size: 50px; margin-bottom: 15px; opacity: 0.5; }
        .premium-lock h3 { color: #fff; margin-bottom: 10px; }
        .premium-lock p { color: #666; max-width: 500px; margin: 0 auto 25px; font-size: 14px; }
        .partner-btn { background: #facc15; border: none; padding: 18px 40px; font-weight: 900; cursor: pointer; border-radius: 12px; text-transform: uppercase; font-size: 15px; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.4); } 70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(250, 204, 21, 0); } 100% { transform: scale(1); } }
        .ad-box-wide { background: #080808; border: 1px dashed #222; padding: 20px; border-radius: 15px; color: #333; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
        .ad-box-side { background: #080808; border: 1px dashed #222; height: 600px; display: flex; align-items: center; justify-content: center; color: #333; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; writing-mode: vertical-rl; }
        .sidebar { display: none; }
        .back-btn { background: transparent; color: #666; border: 1px solid #222; padding: 15px 30px; border-radius: 12px; font-weight: bold; cursor: pointer; margin-top: 20px; transition: 0.2s; }
        .back-btn:hover { background: #111; color: #fff; }
        .footer { padding: 80px 0 40px; color: #222; font-size: 11px; }
        .footer a { color: #444; text-decoration: none; margin-left: 10px; }
        @media (min-width: 900px) {
          .wrapper { flex-direction: row; align-items: flex-start; }
          .main { flex: 1; }
          .sidebar { display: block; width: 300px; position: sticky; top: 20px; }
        }
      `}</style>
    </div>
  );
}
