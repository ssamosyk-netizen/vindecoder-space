import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: { dir:'ltr', sub:"Vehicle Report", back:"Back to Search", privacy:"Privacy Policy", ad:"ADVERTISEMENT", market:"Market:", base:"Decoded by:", nhtsa:"NHTSA (USA)", wmi:"WMI (Basic Data)", pTitle:"Full History Report", pDesc:"Check for hidden damages and mileage rollbacks.", pBtn:"GET FULL REPORT", lTitle:"🔒 Technical Data Protected", lDesc:"European manufacturers restrict detailed specs in free databases. Unlock for full history.", unBtn:"UNLOCK REPORT ON CARVERTICAL", s:{ gen:"General Information", eng:"Engine & Performance", saf:"Safety & Interior" }, f:{ make:"Make", model:"Model", year:"Year", trim:"Trim", type:"Vehicle Type", body:"Body Class", doors:"Doors", eng:"Engine", hp:"Horsepower", fuel:"Fuel Type", drive:"Drive Type", trans:"Transmission", brk:"Brake System", abs:"ABS", tpms:"TPMS", cntry:"Country", city:"Plant City", mfr:"Manufacturer" }, footer:"© 2026 VIN DECODER" },
  uk: { dir:'ltr', sub:"Звіт про авто", back:"Назад до пошуку", privacy:"Політика конфіденційності", ad:"МІСЦЕ ДЛЯ РЕКЛАМИ", market:"Ринок:", base:"База даних:", nhtsa:"NHTSA (США)", wmi:"WMI (Базовий стандарт)", pTitle:"Повна історія авто", pDesc:"Перевірте скручений пробіг та історію ДТП.", pBtn:"ОТРИМАТИ ПОВНИЙ ЗВІТ", lTitle:"🔒 Технічні дані захищені", lDesc:"Європейські виробники обмежують дані у безкоштовних базах. Розблокуйте повну історію.", unBtn:"РОЗБЛОКУВАТИ НА CARVERTICAL", s:{ gen:"Загальна інформація", eng:"Двигун та трансмісія", saf:"Безпека" }, f:{ make:"Марка", model:"Модель", year:"Рік", trim:"Комплектація", type:"Тип ТЗ", body:"Клас кузова", doors:"Двері", eng:"Двигун", hp:"Кінські сили", fuel:"Паливо", drive:"Привід", trans:"Трансмісія", brk:"Гальма", abs:"ABS", tpms:"Тиск у шинах", cntry:"Країна", city:"Місто заводу", mfr:"Виробник" }, footer:"© 2026 VIN DECODER" },
  es: { dir:'ltr', sub:"Informe del Vehículo", back:"Volver", privacy:"Privacidad", ad:"ANUNCIO", market:"Mercado:", base:"Base de datos:", nhtsa:"NHTSA (EE. UU.)", wmi:"WMI (Básico)", pTitle:"Informe Completo", pDesc:"Comprueba daños y kilometraje.", pBtn:"OBTENER INFORME", lTitle:"🔒 Datos Protegidos", lDesc:"Desbloquea el historial completo.", unBtn:"DESBLOQUEAR EN CARVERTICAL", s:{ gen:"General", eng:"Motor", saf:"Seguridad" }, f:{ make:"Marca", model:"Modelo", year:"Año", trim:"Versión", type:"Tipo", body:"Carrocería", doors:"Puertas", eng:"Motor", hp:"CV", fuel:"Combustible", drive:"Tracción", trans:"Transmisión", brk:"Frenos", abs:"ABS", tpms:"TPMS", cntry:"País", city:"Planta", mfr:"Fabricante" }, footer:"© 2026 VIN DECODER" },
  de: { dir:'ltr', sub:"Fahrzeugbericht", back:"Zurück", privacy:"Datenschutz", ad:"WERBUNG", market:"Markt:", base:"Datenbank:", nhtsa:"NHTSA (USA)", wmi:"WMI (Basis)", pTitle:"Vollständiger Bericht", pDesc:"Überprüfen Sie Unfälle und Kilometerstand.", pBtn:"BERICHT ABRUFEN", lTitle:"🔒 Daten Geschützt", lDesc:"Historie freischalten.", unBtn:"AUF CARVERTICAL FREISCHALTEN", s:{ gen:"Allgemein", eng:"Motor", saf:"Sicherheit" }, f:{ make:"Marke", model:"Modell", year:"Jahr", trim:"Ausstattung", type:"Typ", body:"Karosserie", doors:"Türen", eng:"Motor", hp:"PS", fuel:"Kraftstoff", drive:"Antrieb", trans:"Getriebe", brk:"Bremsen", abs:"ABS", tpms:"RDKS", cntry:"Land", city:"Werk", mfr:"Hersteller" }, footer:"© 2026 VIN DECODER" },
  zh: { dir:'ltr', sub:"车辆报告", back:"返回", privacy:"隐私", ad:"广告", market:"市场:", base:"数据库:", nhtsa:"NHTSA (美国)", wmi:"WMI (基本)", pTitle:"完整报告", pDesc:"检查损坏和里程。", pBtn:"获取报告", lTitle:"🔒 数据受保护", lDesc:"解锁完整历史。", unBtn:"在 CARVERTICAL 解锁", s:{ gen:"常规信息", eng:"发动机", saf:"安全" }, f:{ make:"品牌", model:"型号", year:"年份", trim:"配置", type:"类型", body:"车身", doors:"车门", eng:"发动机", hp:"马力", fuel:"燃料", drive:"驱动", trans:"变速箱", brk:"刹车", abs:"ABS", tpms:"TPMS", cntry:"国家", city:"工厂", mfr:"制造商" }, footer:"© 2026 VIN DECODER" },
  ar: { dir:'rtl', sub:"تقرير المركبة", back:"رجوع", privacy:"الخصوصية", ad:"إعلان", market:"السوق:", base:"قاعدة البيانات:", nhtsa:"NHTSA (أمريكا)", wmi:"WMI (أساسي)", pTitle:"تقرير كامل", pDesc:"تحقق من الحوادث.", pBtn:"احصل على التقرير", lTitle:"🔒 بيانات محمية", lDesc:"افتح السجل الكامل.", unBtn:"افتح في CARVERTICAL", s:{ gen:"عام", eng:"المحرك", saf:"أمان" }, f:{ make:"الماركة", model:"الموديل", year:"السنة", trim:"الفئة", type:"النوع", body:"الهيكل", doors:"الأبواب", eng:"المحرك", hp:"قوة", fuel:"الوقود", drive:"الدفع", trans:"ناقل", brk:"الفرامل", abs:"ABS", tpms:"TPMS", cntry:"البلد", city:"المصنع", mfr:"صانع" }, footer:"© 2026 VIN DECODER" }
};

const langs = [
  { c:'en', l:'EN' }, { c:'uk', l:'UK' }, { c:'es', l:'ES' },
  { c:'de', l:'DE' }, { c:'zh', l:'ZH' }, { c:'ar', l:'AR' }
];

const decodeWMI = (vin) => {
  if (!vin) return {};
  const w = vin.substring(0,3).toUpperCase(), y = vin.charAt(9).toUpperCase();
  const map = { 'TMA':{m:'HYUNDAI',c:'Czech'},'TMB':{m:'SKODA',c:'Czech'},'WDB':{m:'MERCEDES-BENZ',c:'Germany'},'WBA':{m:'BMW',c:'Germany'},'WAU':{m:'AUDI',c:'Germany'},'TRU':{m:'AUDI',c:'Hungary'},'WVW':{m:'VOLKSWAGEN',c:'Germany'},'ZAR':{m:'ALFA ROMEO',c:'Italy'},'ZFA':{m:'FIAT',c:'Italy'},'VF3':{m:'PEUGEOT',c:'France'},'UU1':{m:'DACIA',c:'Romania'},'VSS':{m:'SEAT',c:'Spain'},'JHM':{m:'HONDA',c:'Japan'},'JT1':{m:'TOYOTA',c:'Japan'},'KL3':{m:'CHEVROLET',c:'Korea'},'KNA':{m:'KIA',c:'Korea'},'SJ3':{m:'NISSAN',c:'UK'},'SAL':{m:'LAND ROVER',c:'UK'},'1J8':{m:'JEEP',c:'USA'},'1FA':{m:'FORD',c:'USA'} };
  const yrs = { 'V':1997,'W':1998,'X':1999,'Y':2000,'1':2001,'2':2002,'3':2003,'4':2004,'5':2005,'6':2006,'7':2007,'8':2008,'9':2009,'A':2010,'B':2011,'C':2012,'D':2013,'E':2014,'F':2015,'G':2016,'H':2017,'J':2018,'K':2019,'L':2020,'M':2021,'N':2022,'P':2023,'R':2024,'S':2025 };
  let mkt = { n:"Global", i:"🌍" };
  if (['1','2','3','4','5'].includes(vin[0])) mkt = { n:"North America", i:"🇺🇸" };
  else if (['J','K','L'].includes(vin[0])) mkt = { n:"Asia", i:"🇯🇵" };
  else if (['S','T','U','V','W','X','Y','Z'].includes(vin[0])) mkt = { n:"Europe", i:"🇪🇺" };
  return { make: map[w]?.m||null, country: map[w]?.c||mkt.n, year: yrs[y]||null, mkt };
};

export async function getServerSideProps(ctx) {
  const { id } = ctx.params;
  try {
    const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${id}?format=json`);
    const j = await res.json();
    return { props: { data: j.Results[0]||null, vin: id.toUpperCase() } };
  } catch (e) { return { props: { data: null, vin: id.toUpperCase() } }; }
}

export default function VinResult({ data, vin }) {
  const router = useRouter();
  const [lang, setLang] = useState('en');

  useEffect(() => {
    document.body.style.backgroundColor = "#000";
    const s = localStorage.getItem('userLang');
    if (s && translations[s]) setLang(s);
  }, []);

  const t = translations[lang] || translations.en;
  const dec = decodeWMI(vin);
  
  // ФІКС 1: Розумна перевірка бази NHTSA
  // Якщо VIN містить ZZZ (Європа) або NHTSA не віддає Модель, ми відхиляємо дані NHTSA.
  const isEuroSpec = vin.includes('ZZZ');
  const hasValidModel = data && data.Model && data.Model !== "Not Applicable" && data.Model !== "";
  const full = data && data.Make && data.Make !== "Not Applicable" && data.Make !== "" && !isEuroSpec && hasValidModel;

  const val = (v) => (!v || v === "Not Applicable" || v === "null") ? "—" : v;

  // ФІКС 2: Злиття даних. Якщо full = false, беремо рік з нашого розумного декодера!
  const mk = full ? data.Make : (dec.make || (data?.Make !== "Not Applicable" ? data?.Make : "Unknown"));
  let yr = full ? data.ModelYear : (dec.year || "—");
  const cy = full && data.PlantCountry ? data.PlantCountry : dec.country;
  const md = full ? data.Model : "—";
  const eng = full && data?.DisplacementL ? `${data.DisplacementL}L` : '';

  const title = `${yr!=="—"?yr:''} ${mk!=="Unknown"?mk:''} ${md!=="—"?md:''} ${eng}`.trim() || vin;
  const ogImg = `https://vindecoder.space/api/og?vin=${vin}&make=${encodeURIComponent(mk)}&model=${encodeURIComponent(md)}&year=${yr}`;
  const cvLink = `https://www.carvertical.com/ua/landing/v3?a=YOUR_AFFILIATE_ID&b=YOUR_BANNER_ID&vin=${vin}`;

  return (
    <div dir={t.dir} className="container">
      <Head>
        <title>{title} | VIN DECODER</title>
        <meta name="description" content={`${t.sub} ${title}. VIN: ${vin}`} />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta property="og:title" content={`${title} | Free VIN Report`} />
        <meta property="og:description" content={`Region: ${dec.mkt.n}. Check full specs.`} />
        <meta property="og:image" content={ogImg} />
        <meta property="og:image:secure_url" content={ogImg} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImg} />
      </Head>

      <header className="header">
        <h1 onClick={() => router.push('/')} style={{cursor:'pointer'}}><span className="yellow">VIN</span><span className="white">DECODER</span></h1>
        <div className="langs">
          {langs.map(l => (
            <span key={l.c} className={lang===l.c?'active':''} onClick={()=>{setLang(l.c);localStorage.setItem('userLang',l.c);}}>{l.l}</span>
          ))}
        </div>
      </header>

      <div className="wrapper">
        <main className="main">
          
          <div className="hero">
            <div className="badges-row">
              <div className="badge market-badge"><span className="icon">{dec.mkt.i}</span> {t.market} <b>{dec.mkt.n}</b></div>
              <div className="badge source-badge">{t.base} <b>{full ? t.nhtsa : t.wmi}</b></div>
            </div>
            <h2 className="v-title">{yr!=="—"?yr:''} <span className="yellow">{mk}</span> {md!=="—"?md:''} {eng&&<span className="eng-tag">{eng}</span>}</h2>
            <p className="v-sub">VIN: <b>{vin}</b></p>
          </div>

          <section className="section">
            <h3>{t.s.gen}</h3>
            <div className="grid">
              <div className="item"><span>{t.f.make}</span><b>{mk}</b></div>
              <div className="item"><span>{t.f.model}</span><b>{md}</b></div>
              <div className="item"><span>{t.f.year}</span><b>{yr}</b></div>
              <div className="item"><span>{t.f.cntry}</span><b>{cy}</b></div>
              {full && (
                <>
                  <div className="item"><span>{t.f.trim}</span><b>{val(data.Trim)}</b></div>
                  <div className="item"><span>{t.f.type}</span><b>{val(data.VehicleType)}</b></div>
                  <div className="item"><span>{t.f.body}</span><b>{val(data.BodyClass)}</b></div>
                  <div className="item"><span>{t.f.doors}</span><b>{val(data.Doors)}</b></div>
                </>
              )}
            </div>
          </section>

          {!full ? (
            <div className="europe-lock-card">
              <div className="lock-icon">🔒</div>
              <h3>{t.lTitle}</h3>
              <p>{t.lDesc}</p>
              <a href={cvLink} target="_blank" rel="noreferrer" className="partner-btn pulse">{t.unBtn}</a>
            </div>
          ) : (
            <>
              <section className="section">
                <h3>{t.s.eng}</h3>
                <div className="grid">
                  <div className="item"><span>{t.f.eng}</span><b>{eng} {val(data.EngineConfiguration)}{val(data.EngineCylinders)}</b></div>
                  <div className="item"><span>{t.f.hp}</span><b>{val(data.EngineHP)}</b></div>
                  <div className="item"><span>{t.f.fuel}</span><b>{val(data.FuelTypePrimary)}</b></div>
                  <div className="item"><span>{t.f.drive}</span><b>{val(data.DriveType)}</b></div>
                  <div className="item"><span>{t.f.trans}</span><b>{val(data.TransmissionStyle)}</b></div>
                </div>
              </section>

              <section className="section">
                <h3>{t.s.saf}</h3>
                <div className="grid">
                  <div className="item"><span>{t.f.brk}</span><b>{val(data.BrakeSystemType)}</b></div>
                  <div className="item"><span>{t.f.abs}</span><b>{val(data.ABS)}</b></div>
                  <div className="item"><span>{t.f.tpms}</span><b>{val(data.TPMS)}</b></div>
                  <div className="item"><span>Airbags</span><b>{val(data.AirBagLocFront)}</b></div>
                </div>
              </section>
            </>
          )}

          <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
        </main>

        <aside className="sidebar">
          <div className="premium-card">
            <h4>{t.pTitle}</h4>
            <p>{t.pDesc}</p>
            <a href={cvLink} target="_blank" rel="noreferrer" className="partner-btn-sm">{t.pBtn}</a>
          </div>
          <div className="ad-box">
            <span style={{color:'#666',marginBottom:'10px'}}>{t.ad}</span>
            <div style={{color:'#444'}}>300 x 600</div>
          </div>
        </aside>
      </div>

      <footer className="footer">
        <p>{t.footer} | <span onClick={()=>router.push('/privacy')} style={{cursor:'pointer',textDecoration:'underline'}}>{t.privacy}</span></p>
      </footer>

      <style jsx global>{`body{background:#000;color:#fff;font-family:-apple-system,sans-serif;margin:0;}`}</style>
      <style jsx>{`
        .container{padding:20px;max-width:1200px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;}
        .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:40px;}
        .header h1{font-size:1.8rem;font-weight:900;margin:0;letter-spacing:-1px;}
        .yellow{color:#facc15;} .white{color:#fff;}
        .langs{display:flex;gap:8px;font-size:11px;font-weight:bold;}
        .langs span{cursor:pointer;padding:6px 12px;border-radius:6px;color:#888;border:1px solid transparent;transition:0.2s;}
        .langs span.active{color:#facc15;border-color:#facc15;background:rgba(250,204,21,0.05);}
        .langs span:hover:not(.active){color:#fff;border-color:#333;}
        .wrapper{display:flex;flex-direction:column;gap:40px;flex:1;}
        .main{flex:1;}
        .hero{margin-bottom:40px;}
        .badges-row{display:flex;gap:15px;margin-bottom:20px;flex-wrap:wrap;}
        .badge{padding:8px 16px;border-radius:8px;font-size:12px;border:1px solid #333;display:flex;align-items:center;gap:8px;}
        .market-badge{background:#111;color:#aaa;} .source-badge{background:rgba(37,99,235,0.1);border-color:rgba(37,99,235,0.3);color:#60a5fa;}
        .badge b{color:#fff;font-weight:800;}
        .v-title{font-size:clamp(2rem,5vw,3.5rem);font-weight:900;text-transform:uppercase;margin:0 0 10px 0;line-height:1.1;letter-spacing:-1px;display:flex;flex-wrap:wrap;align-items:center;gap:10px;}
        .eng-tag{background:#1a1a1a;padding:4px 12px;border-radius:8px;font-size:clamp(1rem,2vw,1.5rem);color:#ccc;border:1px solid #333;}
        .v-sub{color:#666;margin:0;font-size:1.2rem;font-family:monospace;letter-spacing:1px;}
        .section{background:#0a0a0a;border:1px solid #1a1a1a;padding:30px;border-radius:20px;margin-bottom:30px;}
        .section h3{color:#facc15;font-size:12px;text-transform:uppercase;border-bottom:1px solid #222;padding-bottom:15px;margin-top:0;margin-bottom:25px;letter-spacing:1px;}
        .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:25px;}
        .item span{color:#666;font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.5px;}
        .item b{display:block;font-size:16px;margin-top:6px;color:#eee;}
        .europe-lock-card{background:#080808;border:1px dashed #333;padding:50px 20px;border-radius:20px;text-align:center;margin-bottom:30px;}
        .lock-icon{font-size:45px;margin-bottom:15px;}
        .partner-btn{display:inline-block;background:#facc15;color:#000;border:none;padding:18px 40px;font-weight:900;border-radius:12px;cursor:pointer;text-transform:uppercase;text-decoration:none;margin-top:15px;}
        .partner-btn-sm{display:block;background:#facc15;color:#000;width:100%;border:none;padding:15px;font-weight:900;border-radius:8px;cursor:pointer;text-transform:uppercase;text-align:center;text-decoration:none;box-sizing:border-box;}
        .sidebar{width:100%;}
        .premium-card{background:#111;border:1px solid #333;padding:25px;border-radius:20px;margin-bottom:30px;}
        .premium-card h4{margin:0 0 10px 0;color:#facc15;font-size:14px;text-transform:uppercase;}
        .premium-card p{font-size:13px;color:#aaa;margin-bottom:20px;line-height:1.5;}
        .ad-box{background:#080808;border:1px solid #1a1a1a;height:600px;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#444;font-size:12px;font-weight:bold;letter-spacing:1px;}
        .back-btn{background:transparent;color:#888;border:1px solid #333;padding:12px 30px;border-radius:10px;margin-top:10px;cursor:pointer;font-weight:bold;transition:0.2s;}
        .back-btn:hover{background:#222;color:#fff;}
        .footer{padding:40px 0;border-top:1px solid #111;margin-top:50px;font-size:13px;color:#555;text-align:center;}
        .pulse{animation:pulse 2s infinite;}
        @keyframes pulse{0%{transform:scale(1);}50%{transform:scale(1.03);}100%{transform:scale(1);}}
        @media(min-width:1000px){.wrapper{flex-direction:row;}.sidebar{width:300px;flex-shrink:0;position:sticky;top:30px;align-self:flex-start;}}
        @media(max-width:768px){.header{flex-direction:column;gap:20px;}.badges-row{flex-direction:column;align-items:flex-start;}}
      `}</style>
    </div>
  );
}
