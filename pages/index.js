import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const tr = {
  en: { dir:'ltr', mTitle:"VIN DECODER | Free Vehicle Specifications Report", mDesc:"Free online VIN decoder. Check any vehicle specs, engine data, and manufacturing details instantly.", title:"FREE VEHICLE CHECK", sub:"Get full vehicle specifications and manufacturing details instantly.", place:"Enter 17-character VIN...", btn:"DECODE", pop:"Popular Brands", hist:"Recent Searches", foot:"© 2026 VIN DECODER | PROFESSIONAL DATA", pol:"Privacy Policy", terms:"Terms of Service", alert:"Please enter a valid 17-character VIN" },
  uk: { dir:'ltr', mTitle:"VIN ДЕКОДЕР | Безкоштовна перевірка авто", mDesc:"Безкоштовний онлайн VIN декодер. Миттєво перевіряйте характеристики авто та деталі виробництва.", title:"БЕЗКОШТОВНА ПЕРЕВІРКА", sub:"Отримайте повні технічні характеристики та дані про заводське складання.", place:"Введіть 17-значний VIN...", btn:"ПЕРЕВІРИТИ", pop:"Популярні марки", hist:"Останні пошуки", foot:"© 2026 VIN DECODER | ПРОФЕСІЙНІ ДАНІ", pol:"Політика конфіденційності", terms:"Умови використання", alert:"Будь ласка, введіть коректний VIN (мін. 8 символів)" },
  es: { dir:'ltr', mTitle:"DECODIFICADOR VIN | Informe de especificaciones", mDesc:"Decodificador VIN gratuito. Verifique las especificaciones del vehículo al instante.", title:"VERIFICACIÓN DE VEHÍCULOS", sub:"Obtenga especificaciones completas del vehículo y detalles de fabricación.", place:"Ingrese el VIN de 17 caracteres...", btn:"DECODIFICAR", pop:"Marcas populares", hist:"Búsquedas recientes", foot:"© 2026 VIN DECODER | DATOS PROFESIONALES", pol:"Privacidad", terms:"Términos de servicio", alert:"Ingrese un VIN válido" },
  de: { dir:'ltr', mTitle:"VIN DECODER | Kostenloser Fahrzeugbericht", mDesc:"Kostenloser Online-VIN-Decoder. Prüfen Sie sofort Fahrzeugspezifikationen.", title:"KOSTENLOSE FAHRZEUGPRÜFUNG", sub:"Erhalten Sie sofort vollständige Fahrzeugspezifikationen und Details.", place:"17-stellige VIN eingeben...", btn:"DEKODIEREN", pop:"Beliebte Marken", hist:"Letzte Suchen", foot:"© 2026 VIN DECODER | PROFESSIONELLE DATEN", pol:"Datenschutz", terms:"Nutzungsbedingungen", alert:"Bitte geben Sie eine gültige VIN ein" },
  zh: { dir:'ltr', mTitle:"车架号解码器 | 免费车辆规格报告", mDesc:"免费在线车架号解码器。立即查询车辆规格和制造详情。", title:"免费车辆信息查询", sub:"立即获取完整的车辆规格和制造详情。", place:"输入17位车架号...", btn:"解码", pop:"热门品牌", hist:"最近搜索", foot:"© 2026 VIN DECODER | 专业数据", pol:"隐私政策", terms:"服务条款", alert:"请输入有效的车架号" },
  ar: { dir:'rtl', mTitle:"فك تشفير رقم الشاسيه | تقرير مواصفات السيارة", mDesc:"أداة فك تشفير رقم الشاسيه مجانية. تحقق من مواصفات السيارة فوراً.", title:"فحص مجاني للسيارة", sub:"احصل على مواصفات السيارة الكاملة وتفاصيل التصنيع.", place:"أدخل رقم الشاسيه...", btn:"فك التشفير", pop:"ماركات شعبية", hist:"عمليات البحث الأخيرة", foot:"© 2026 VIN DECODER | بيانات احترافية", pol:"سياسة الخصوصية", terms:"شروط الخدمة", alert:"يرجى إدخال رقم شاسيه صحيح" }
};

const popMakes = [
  { n: 'Ford', s: 'ford' }, { n: 'Chevrolet', s: 'chevrolet' }, { n: 'Dodge', s: 'dodge' }, { n: 'Jeep', s: 'jeep' },
  { n: 'Tesla', s: 'tesla' }, { n: 'GMC', s: 'gmc' }, { n: 'Chrysler', s: 'chrysler' }, { n: 'Cadillac', s: 'cadillac' },
  { n: 'Buick', s: 'buick' }, { n: 'Lincoln', s: 'lincoln' }, { n: 'Toyota', s: 'toyota' }, { n: 'Honda', s: 'honda' }
];

export default function Home() {
  const router = useRouter();
  const [vin, setVin] = useState('');
  const [lang, setLang] = useState('en');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // 1. Відновлюємо мову
    const sLang = localStorage.getItem('userLanguage');
    if (sLang && tr[sLang]) setLang(sLang);
    
    // 2. Відновлюємо РЕАЛЬНУ історію (без фейкових кодів)
    const sHist = JSON.parse(localStorage.getItem('vinHistory') || '[]');
    setHistory(sHist);
  }, []);

  const t = tr[lang] || tr.en;

  const changeLang = (l) => { 
    setLang(l); 
    localStorage.setItem('userLanguage', l); 
  };

  const handleSearch = (searchVin = vin) => {
    const fVin = searchVin.toUpperCase().trim();
    if (fVin.length >= 8) {
      // Зберігаємо ОСТАННІ 20 кодів, які шукав користувач
      const nHist = [fVin, ...history.filter(h => h !== fVin)].slice(0, 20);
      setHistory(nHist);
      localStorage.setItem('vinHistory', JSON.stringify(nHist));
      router.push(`/vin/${fVin}`);
    } else {
      alert(t.alert);
    }
  };

  return (
    <div className="container" dir={t.dir}>
      <Head>
        <title>{t.mTitle}</title>
        <meta name="description" content={t.mDesc} />
        <link rel="icon" href="/favicon.png" />
        
        {/* МЕТА-ТЕГИ ДЛЯ МЕСЕНДЖЕРІВ (TELEGRAM, VIBER, FACEBOOK) */}
        <meta property="og:title" content={t.mTitle} />
        <meta property="og:description" content={t.mDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vindecoder.space/" />
        <meta property="og:image" content="https://vindecoder.space/og-image.png" />
        <meta property="og:image:secure_url" content="https://vindecoder.space/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t.mTitle} />
        <meta name="twitter:description" content={t.mDesc} />
        <meta name="twitter:image" content="https://vindecoder.space/og-image.png" />
      </Head>

      <header className="header">
        <div className="logo" onClick={() => router.push('/')} style={{cursor:'pointer'}}>
          <span className="yellow">VIN</span>DECODER
        </div>
        <div className="lang-bar">
          {Object.keys(tr).map((l) => (
            <span key={l} className={lang===l?'active':''} onClick={()=>changeLang(l)}>{l.toUpperCase()}</span>
          ))}
        </div>
      </header>

      <main className="main">
        <h1 className="title">{t.title}</h1>
        <p className="subtitle">{t.sub}</p>

        <div className="search-box">
          <input 
            type="text" 
            placeholder={t.place} 
            value={vin} 
            onChange={(e)=>setVin(e.target.value)} 
            onKeyDown={(e)=>e.key==='Enter'&&handleSearch()} 
          />
          <button onClick={()=>handleSearch()}>{t.btn}</button>
        </div>

        <div className="makes-section">
          <h3>{t.pop}</h3>
          <div className="makes-grid">
            {popMakes.map((m) => (
              <div key={m.s} className="make-item" onClick={() => router.push(`/make/${m.s}`)}>{m.n}</div>
            ))}
          </div>
        </div>

        {/* Секція "Останні пошуки" з'явиться ТІЛЬКИ якщо користувач вже щось шукав */}
        {history.length > 0 && (
          <div className="history-section">
            <span className="section-label">{t.hist}</span>
            <div className="history-chips">
              {history.map((h) => (
                <span key={h} className="chip" onClick={() => handleSearch(h)}>{h}</span>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="f-links">
          <span onClick={()=>router.push('/privacy')}>{t.pol}</span>
          <span className="dot">•</span>
          <span onClick={()=>router.push('/terms')}>{t.terms}</span>
        </div>
        <p className="copy">{t.foot}</p>
      </footer>

      <style jsx global>{`body{background:#000;color:#fff;margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;overflow-x:hidden;}`}</style>
      <style jsx>{`
        .container{min-height:100vh;display:flex;flex-direction:column;padding:0 20px;max-width:1200px;margin:0 auto;box-sizing:border-box;}
        .header{display:flex;justify-content:space-between;align-items:center;padding:30px 0;}
        .logo{font-size:1.5rem;font-weight:900;letter-spacing:-1px;}
        .yellow{color:#facc15;}
        
        .lang-bar{display:flex;gap:8px;font-size:10px;font-weight:bold;}
        .lang-bar span{cursor:pointer;padding:6px 10px;border-radius:8px;color:#666;border:1px solid transparent;transition:all 0.2s;}
        .lang-bar span.active{color:#facc15;border-color:#facc15;background:rgba(250,204,21,0.05);}
        .lang-bar span:hover:not(.active){color:#aaa;border-color:#222;}

        .main{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 0 40px;text-align:center;}
        .title{font-size:clamp(1.8rem,5vw,3.5rem);font-weight:900;margin:0;line-height:1.1;letter-spacing:-1px;text-transform:uppercase;}
        .subtitle{color:#777;margin:15px 0 40px;font-size:clamp(0.9rem,2vw,1.1rem);max-width:600px;line-height:1.5;}
        
        .search-box{width:100%;max-width:700px;display:flex;gap:10px;background:#111;padding:10px;border-radius:25px;border:1px solid #222;margin-bottom:80px;}
        input{flex:1;background:transparent;border:none;padding:15px 25px;color:#fff;font-size:1.1rem;outline:none;}
        button{background:#facc15;color:#000;border:none;padding:0 40px;border-radius:18px;font-weight:900;cursor:pointer;text-transform:uppercase;transition:transform 0.2s;}
        button:active{transform:scale(0.95);}

        .makes-section{width:100%;max-width:900px;margin-bottom:60px;}
        .makes-section h3{color:#333;font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:25px;}
        .makes-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:12px;}
        .make-item{background:#0a0a0a;border:1px solid #111;padding:15px;border-radius:12px;font-size:13px;font-weight:bold;color:#777;cursor:pointer;transition:0.2s;text-transform:uppercase;}
        .make-item:hover{border-color:#facc15;color:#fff;background:#111;}

        .history-section{display:flex;flex-direction:column;align-items:center;gap:15px;padding-bottom:40px;width:100%;max-width:900px;}
        .section-label{font-size:10px;color:#333;text-transform:uppercase;font-weight:bold;letter-spacing:1px;}
        .history-chips{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}
        .chip{background:#080808;border:1px solid #1a1a1a;padding:8px 16px;border-radius:20px;font-size:12px;color:#666;cursor:pointer;transition:0.2s;font-family:monospace;letter-spacing:0.5px;}
        .chip:hover{border-color:#facc15;color:#facc15;}

        .footer{padding:40px 0;color:#555;font-size:12px;text-align:center;}
        .f-links{display:flex;justify-content:center;gap:15px;margin-bottom:15px;}
        .f-links span{cursor:pointer;transition:color 0.2s;} 
        .f-links span:hover{color:#facc15;}
        .dot{color:#333;cursor:default!important;}
        .copy{font-size:10px;font-weight:bold;letter-spacing:1px;color:#333;text-transform:uppercase;margin:0;}

        @media(max-width:768px){
          .header{flex-direction:column;gap:20px;}
          .search-box{flex-direction:column;background:transparent;border:none;padding:0;margin-bottom:40px;}
          input{background:#111;border:1px solid #222;border-radius:20px;margin-bottom:10px;}
          button{padding:20px;border-radius:20px;}
          .makes-grid{grid-template-columns:repeat(2,1fr);}
        }
      `}</style>
    </div>
  );
}
