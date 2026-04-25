import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const tr = {
  en: { dir:'ltr', sub:"Vehicle Report", back:"Back to Search", privacy:"Privacy Policy", ad:"ADVERTISEMENT", market:"Market:", base:"Decoded by:", nhtsa:"NHTSA (USA)", wmi:"WMI (Basic Data)", pTitle:"Full History Report", pDesc:"Check for hidden damages and mileage rollbacks.", pBtn:"GET FULL REPORT", lTitle:"🔒 Technical Data Protected", lDesc:"Detailed specs are restricted in free databases. Unlock for full history.", unBtn:"UNLOCK REPORT ON CARVERTICAL", s:{ gen:"General Information", eng:"Engine & Chassis", saf:"Safety", org:"Manufacturing" }, f:{ make:"Make", model:"Model", year:"Year", trim:"Trim", series:"Series", type:"Vehicle Type", body:"Body Class", doors:"Doors", gvwr:"GVWR", eng:"Engine", hp:"Horsepower", fuel:"Fuel", drive:"Drive", trans:"Transmission", axles:"Axles", brk:"Brakes", steer:"Steering", abs:"ABS", esc:"ESC", tpms:"TPMS", cntry:"Country", city:"Plant City", state:"Plant State", mfr:"Manufacturer" }, footer:"© 2026 VIN DECODER" },
  uk: { dir:'ltr', sub:"Звіт про авто", back:"Назад до пошуку", privacy:"Політика конфіденційності", ad:"МІСЦЕ ДЛЯ РЕКЛАМИ", market:"Ринок:", base:"База даних:", nhtsa:"NHTSA (США)", wmi:"WMI (Базовий стандарт)", pTitle:"Повна історія авто", pDesc:"Перевірте скручений пробіг та історію ДТП.", pBtn:"ОТРИМАТИ ПОВНИЙ ЗВІТ", lTitle:"🔒 Технічні дані захищені", lDesc:"Детальні технічні дані обмежені у безкоштовних базах. Розблокуйте повну історію.", unBtn:"РОЗБЛОКУВАТИ НА CARVERTICAL", s:{ gen:"Загальна інформація", eng:"Двигун та ходова", saf:"Безпека", org:"Виробництво" }, f:{ make:"Марка", model:"Модель", year:"Рік", trim:"Комплектація", series:"Серія", type:"Тип ТЗ", body:"Клас кузова", doors:"Двері", gvwr:"Повна маса", eng:"Двигун", hp:"Кінські сили", fuel:"Паливо", drive:"Привід", trans:"Трансмісія", axles:"Осі", brk:"Гальма", steer:"Кермове упр.", abs:"ABS", esc:"ESC", tpms:"Тиск у шинах", cntry:"Країна", city:"Місто заводу", state:"Штат заводу", mfr:"Виробник" }, footer:"© 2026 VIN DECODER" },
  es: { dir:'ltr', sub:"Informe del Vehículo", back:"Volver", privacy:"Privacidad", ad:"ANUNCIO", market:"Mercado:", base:"Base de datos:", nhtsa:"NHTSA (EE. UU.)", wmi:"WMI (Básico)", pTitle:"Informe Completo", pDesc:"Comprueba daños y kilometraje.", pBtn:"OBTENER INFORME", lTitle:"🔒 Datos Protegidos", lDesc:"Las especificaciones están restringidas. Desbloquee el historial completo.", unBtn:"DESBLOQUEAR EN CARVERTICAL", s:{ gen:"General", eng:"Motor y Chasis", saf:"Seguridad", org:"Fabricación" }, f:{ make:"Marca", model:"Modelo", year:"Año", trim:"Versión", series:"Serie", type:"Tipo", body:"Carrocería", doors:"Puertas", gvwr:"Peso Bruto", eng:"Motor", hp:"CV", fuel:"Combustible", drive:"Tracción", trans:"Transmisión", axles:"Ejes", brk:"Frenos", steer:"Dirección", abs:"ABS", esc:"ESC", tpms:"TPMS", cntry:"País", city:"Ciudad", state:"Estado", mfr:"Fabricante" }, footer:"© 2026 VIN DECODER" },
  de: { dir:'ltr', sub:"Fahrzeugbericht", back:"Zurück", privacy:"Datenschutz", ad:"WERBUNG", market:"Markt:", base:"Datenbank:", nhtsa:"NHTSA (USA)", wmi:"WMI (Basis)", pTitle:"Vollständiger Bericht", pDesc:"Überprüfen Sie Unfälle und Kilometerstand.", pBtn:"BERICHT ABRUFEN", lTitle:"🔒 Daten Geschützt", lDesc:"Detaillierte Daten sind eingeschränkt. Historie freischalten.", unBtn:"AUF CARVERTICAL FREISCHALTEN", s:{ gen:"Allgemein", eng:"Motor & Fahrwerk", saf:"Sicherheit", org:"Herstellung" }, f:{ make:"Marke", model:"Modell", year:"Jahr", trim:"Ausstattung", series:"Serie", type:"Typ", body:"Karosserie", doors:"Türen", gvwr:"Zulässiges Gesamtgewicht", eng:"Motor", hp:"PS", fuel:"Kraftstoff", drive:"Antrieb", trans:"Getriebe", axles:"Achsen", brk:"Bremsen", steer:"Lenkung", abs:"ABS", esc:"ESC", tpms:"RDKS", cntry:"Land", city:"Stadt", state:"Bundesland", mfr:"Hersteller" }, footer:"© 2026 VIN DECODER" },
  zh: { dir:'ltr', sub:"车辆报告", back:"返回", privacy:"隐私", ad:"广告", market:"市场:", base:"数据库:", nhtsa:"NHTSA (美国)", wmi:"WMI (基本)", pTitle:"完整报告", pDesc:"检查损坏和里程。", pBtn:"获取报告", lTitle:"🔒 数据受保护", lDesc:"详细规格受限。解锁完整历史。", unBtn:"在 CARVERTICAL 解锁", s:{ gen:"常规信息", eng:"发动机与底盘", saf:"安全", org:"制造" }, f:{ make:"品牌", model:"型号", year:"年份", trim:"配置", series:"系列", type:"类型", body:"车身", doors:"车门", gvwr:"总重", eng:"发动机", hp:"马力", fuel:"燃料", drive:"驱动", trans:"变速箱", axles:"车轴", brk:"刹车", steer:"转向", abs:"ABS", esc:"ESC", tpms:"TPMS", cntry:"国家", city:"城市", state:"州", mfr:"制造商" }, footer:"© 2026 VIN DECODER" },
  ar: { dir:'rtl', sub:"تقرير المركبة", back:"رجوع", privacy:"الخصوصية", ad:"إعلان", market:"السوق:", base:"قاعدة:", nhtsa:"NHTSA (أمريكا)", wmi:"WMI (أساسي)", pTitle:"تقرير كامل", pDesc:"تحقق من الحوادث.", pBtn:"احصل على التقرير", lTitle:"🔒 بيانات محمية", lDesc:"البيانات الفنية محدودة. افتح السجل الكامل.", unBtn:"افتح في CARVERTICAL", s:{ gen:"عام", eng:"المحرك", saf:"أمان", org:"تصنيع" }, f:{ make:"الماركة", model:"الموديل", year:"السنة", trim:"الفئة", series:"السلسلة", type:"النوع", body:"الهيكل", doors:"الأبواب", gvwr:"الوزن", eng:"المحرك", hp:"قوة", fuel:"الوقود", drive:"الدفع", trans:"ناقل", axles:"محاور", brk:"الفرامل", steer:"توجيه", abs:"ABS", esc:"ESC", tpms:"TPMS", cntry:"البلد", city:"مدينة", state:"ولاية", mfr:"صانع" }, footer:"© 2026 VIN DECODER" }
};

const langs = [
  { c:'en', l:'EN' }, { c:'uk', l:'UK' }, { c:'es', l:'ES' },
  { c:'de', l:'DE' }, { c:'zh', l:'ZH' }, { c:'ar', l:'AR' }
];

const decodeWMI = (vin) => {
  if (!vin) return {};
  const w = vin.substring(0,3).toUpperCase(), w2 = vin.substring(0,2).toUpperCase(), y = vin.charAt(9).toUpperCase();
  
  // Точковий словник (для конкретних заводів)
  const map = { 'TMA':{m:'HYUNDAI',c:'Czech'},'TMB':{m:'SKODA',c:'Czech'},'WDB':{m:'MERCEDES-BENZ',c:'Germany'},'WBA':{m:'BMW',c:'Germany'},'WAU':{m:'AUDI',c:'Germany'},'TRU':{m:'AUDI',c:'Hungary'},'WVW':{m:'VOLKSWAGEN',c:'Germany'},'WVG':{m:'VOLKSWAGEN',c:'Germany'},'WP0':{m:'PORSCHE',c:'Germany'},'ZAR':{m:'ALFA ROMEO',c:'Italy'},'ZFA':{m:'FIAT',c:'Italy'},'VF1':{m:'RENAULT',c:'France'},'VF3':{m:'PEUGEOT',c:'France'},'VF7':{m:'CITROEN',c:'France'},'UU1':{m:'DACIA',c:'Romania'},'VSS':{m:'SEAT',c:'Spain'},'VSK':{m:'NISSAN',c:'Spain'},'JHM':{m:'HONDA',c:'Japan'},'JT1':{m:'TOYOTA',c:'Japan'},'KL3':{m:'CHEVROLET',c:'Korea'},'KNA':{m:'KIA',c:'Korea'},'SJ3':{m:'NISSAN',c:'UK'},'SAL':{m:'LAND ROVER',c:'UK'},'1J8':{m:'JEEP',c:'USA'},'1FA':{m:'FORD',c:'USA'},'3FA':{m:'FORD',c:'Mexico'},'1G1':{m:'CHEVROLET',c:'USA'},'3C4':{m:'DODGE/JEEP',c:'Mexico'},'5YJ':{m:'TESLA',c:'USA'},'W0L':{m:'OPEL',c:'Germany'} };
  
  // Глобальний двосимвольний сканер (врятує, якщо завод невідомий)
  const map2 = { 'WA':'AUDI', 'WV':'VOLKSWAGEN', 'WM':'MINI', 'WP':'PORSCHE', 'W0':'OPEL', 'JM':'MAZDA', 'JN':'NISSAN', 'JT':'TOYOTA', 'JH':'HONDA', 'JS':'SUZUKI', 'JF':'SUBARU', 'JA':'ISUZU', 'KM':'HYUNDAI', 'KN':'KIA', 'KL':'CHEVROLET', 'SA':'LAND ROVER', 'SB':'TOYOTA', 'SH':'HONDA', 'SJ':'NISSAN', 'VF':'RENAULT/PEUGEOT', 'VS':'NISSAN/SEAT', 'YV':'VOLVO', 'YS':'SAAB', 'ZA':'ALFA ROMEO', 'ZF':'FIAT', '1N':'NISSAN', '1H':'HONDA', '1G':'CHEVROLET', '2T':'TOYOTA', '3N':'NISSAN', '4T':'TOYOTA', '5N':'HYUNDAI', '7S':'TESLA' };
  
  const yrs = { 'V':1997,'W':1998,'X':1999,'Y':2000,'1':2001,'2':2002,'3':2003,'4':2004,'5':2005,'6':2006,'7':2007,'8':2008,'9':2009,'A':2010,'B':2011,'C':2012,'D':2013,'E':2014,'F':2015,'G':2016,'H':2017,'J':2018,'K':2019,'L':2020,'M':2021,'N':2022,'P':2023,'R':2024,'S':2025 };
  
  let mkt = { n:"Global", i:"🌍" };
  const f = vin[0];
  if (['1','4','5'].includes(f)) mkt = { n:"USA", i:"🇺🇸" };
  else if (f === '2') mkt = { n:"Canada", i:"🇨🇦" };
  else if (f === '3') mkt = { n:"Mexico", i:"🇲🇽" };
  else if (['J','K','L'].includes(f)) mkt = { n:"Asia", i:"🇯🇵" };
  else if (['S','T','U','V','W','X','Y','Z'].includes(f)) mkt = { n:"Europe", i:"🇪🇺" };
  
  const finalMake = map[w]?.m || map2[w2] || null;
  return { make: finalMake, country: map[w]?.c||mkt.n, year: yrs[y]||null, mkt };
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
    if (s && tr[s]) setLang(s);
  }, []);

  const t = tr[lang] || tr.en;
  const dec = decodeWMI(vin);
  
  const val = (v) => {
    if (v === undefined || v === null) return "—";
    const s = String(v).trim();
    if (s === "" || s.toLowerCase() === "not applicable" || s.toLowerCase() === "null" || s.toLowerCase().includes("unspec")) return "—";
    return s;
  };

  const isEuroStub = vin.includes('ZZZ');
  const nhtsaMake = val(data?.Make);
  const hasNhtsaMake = nhtsaMake !== "—";

  // 1. ВИЗНАЧАЄМО МАРКУ (Тепер Nissan ніколи не буде Unknown)
  const mk = hasNhtsaMake ? nhtsaMake : (dec.make || "Unknown");

  // 2. ПОШУК МОДЕЛІ
  let md = "—";
  if (mk === "FORD" && (vin.includes("P8M") || vin.includes("P8S"))) {
    md = "Mustang Mach-E";
  } else if (mk === "TESLA" || vin.startsWith("5YJ") || vin.startsWith("7SA")) {
    const v3 = vin[3];
    if (v3==='S') md="Model S"; else if(v3==='3') md="Model 3"; else if(v3==='X') md="Model X"; else if(v3==='Y') md="Model Y";
  } else if (hasNhtsaMake) {
    const cands = [data?.Model, data?.Series, data?.Trim, data?.BodyClass];
    for (let c of cands) {
      let v = val(c);
      if (v !== "—") { md = v; break; }
    }
  }

  // 3. ПЕРЕВІРКА ПОВНОТИ (Замок для іноземців)
  const full = hasNhtsaMake && md !== "—" && !isEuroStub;

  // 4. ВИЗНАЧАЄМО РІК
  let yr = full ? val(data?.ModelYear) : (dec.year || (hasNhtsaMake ? val(data?.ModelYear) : "—"));
  if (yr === "1981" && dec.year && dec.year !== 1981 && !['1','4','5'].includes(vin[0])) {
    yr = dec.year;
  }

  const cy = full && val(data?.PlantCountry) !== "—" ? data.PlantCountry : dec.country;
  const eng = full && val(data?.DisplacementL) !== "—" ? `${data.DisplacementL}L` : '';

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
                  <div className="item"><span>{t.f.series}</span><b>{val(data.Series)}</b></div>
                  <div className="item"><span>{t.f.type}</span><b>{val(data.VehicleType)}</b></div>
                  <div className="item"><span>{t.f.body}</span><b>{val(data.BodyClass)}</b></div>
                  <div className="item"><span>{t.f.doors}</span><b>{val(data.Doors)}</b></div>
                  <div className="item"><span>{t.f.gvwr}</span><b>{val(data.GVWR)}</b></div>
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
                  <div className="item"><span>{t.f.axles}</span><b>{val(data.Axles)}</b></div>
                </div>
              </section>

              <section className="section">
                <h3>{t.s.saf}</h3>
                <div className="grid">
                  <div className="item"><span>{t.f.brk}</span><b>{val(data.BrakeSystemType)}</b></div>
                  <div className="item"><span>{t.f.steer}</span><b>{val(data.SteeringLocation)}</b></div>
                  <div className="item"><span>{t.f.abs}</span><b>{val(data.ABS)}</b></div>
                  <div className="item"><span>{t.f.esc}</span><b>{val(data.ESC)}</b></div>
                  <div className="item"><span>{t.f.tpms}</span><b>{val(data.TPMS)}</b></div>
                  <div className="item"><span>Airbags</span><b>{val(data.AirBagLocFront)}</b></div>
                </div>
              </section>

              <section className="section">
                <h3>{t.s.org}</h3>
                <div className="grid">
                  <div className="item"><span>{t.f.mfr}</span><b>{val(data.Manufacturer)}</b></div>
                  <div className="item"><span>{t.f.city}</span><b>{val(data.PlantCity)}</b></div>
                  <div className="item"><span>{t.f.state}</span><b>{val(data.PlantState)}</b></div>
                </div>
              </section>
            </>
          )}

          <button className="back-btn" onClick={() => router.push('/')}>← {t.back}</button>
        </main>

        <aside className="sidebar">
          <div className="sticky-box">
            <div className="premium-card">
              <h4>{t.pTitle}</h4>
              <p>{t.pDesc}</p>
              <a href={cvLink} target="_blank" rel="noreferrer" className="partner-btn-sm">{t.pBtn}</a>
            </div>
            <div className="ad-box">
              <span style={{color:'#666',marginBottom:'10px'}}>{t.ad}</span>
              <div style={{color:'#444'}}>300 x 600</div>
            </div>
          </div>
        </aside>
      </div>

      <footer className="footer">
        <p>{t.footer} | <span onClick={()=>router.push('/privacy')} style={{cursor:'pointer',textDecoration:'underline'}}>{t.privacy}</span></p>
      </footer>

      <div className="mob-cta">
        <div className="mob-cta-text">
          <h4>{t.pTitle}</h4>
          <p>{t.pDesc}</p>
        </div>
        <a href={cvLink} target="_blank" rel="noreferrer" className="mob-btn">{t.pBtn}</a>
      </div>

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
        .sticky-box { position: sticky; top: 30px; }
        .premium-card{background:#111;border:1px solid #333;padding:25px;border-radius:20px;margin-bottom:30px;}
        .premium-card h4{margin:0 0 10px 0;color:#facc15;font-size:14px;text-transform:uppercase;}
        .premium-card p{font-size:13px;color:#aaa;margin-bottom:20px;line-height:1.5;}
        .ad-box{background:#080808;border:1px solid #1a1a1a;height:600px;border-radius:20px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#444;font-size:12px;font-weight:bold;letter-spacing:1px;}
        .back-btn{background:transparent;color:#888;border:1px solid #333;padding:12px 30px;border-radius:10px;margin-top:10px;cursor:pointer;font-weight:bold;transition:0.2s;}
        .back-btn:hover{background:#222;color:#fff;}
        .footer{padding:40px 0;border-top:1px solid #111;margin-top:50px;font-size:13px;color:#555;text-align:center;}
        .mob-cta { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(10,10,10,0.95); backdrop-filter: blur(10px); padding: 15px 20px; border-top: 1px solid #333; z-index: 100; box-shadow: 0 -5px 20px rgba(0,0,0,0.8); }
        .mob-cta-text h4 { margin:0 0 5px; color:#facc15; font-size: 14px; text-transform: uppercase; }
        .mob-cta-text p { margin:0; color:#aaa; font-size: 12px; }
        .mob-btn { display: block; background: #facc15; color:#000; text-align:center; padding: 12px; border-radius:8px; font-weight:900; text-transform:uppercase; text-decoration:none; margin-top:10px; }
        .pulse{animation:pulse 2s infinite;}
        @keyframes pulse{0%{transform:scale(1);}50%{transform:scale(1.03);}100%{transform:scale(1);}}
        @media(min-width:1000px){.wrapper{flex-direction:row;}.sidebar{width:300px;flex-shrink:0;}}
        @media(max-width:1000px){.mob-cta { display: block; } .footer { padding-bottom: 120px; }}
        @media(max-width:768px){.header{flex-direction:column;gap:20px;}.badges-row{flex-direction:column;align-items:flex-start;}}
      `}</style>
    </div>
  );
}
