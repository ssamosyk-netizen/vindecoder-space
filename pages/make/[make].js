import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: {
    dir: 'ltr',
    heroTitle: "Free {make} VIN Check",
    heroSub: "Instant technical report and specifications for {make} vehicles.",
    searchPlaceholder: "Enter {make} VIN...",
    searchBtn: "Search",
    whyTitle: "Why check {make} VIN?",
    whyText: "Every {make} has a unique 17-character identifier. By decoding it, you can verify:",
    bullet1: "Actual engine displacement and configuration",
    bullet2: "Original equipment and trim level",
    bullet3: "Manufacturing plant and assembly year",
    bullet4: "Safety features and braking systems",
    policy: "Privacy Policy",
    terms: "Terms of Service",
    alert: "Please enter a valid 17-character VIN code. It cannot contain I, O, Q or be a fake sequence.",
    errTitle: "Invalid VIN"
  },
  uk: {
    dir: 'ltr',
    heroTitle: "Перевірка авто {make}",
    heroSub: "Миттєвий технічний звіт та характеристики для автомобілів {make}.",
    searchPlaceholder: "Введіть VIN {make}...",
    searchBtn: "Пошук",
    whyTitle: "Навіщо перевіряти VIN {make}?",
    whyText: "Кожен {make} має унікальний 17-значний ідентифікатор. Розшифрувавши його, ви можете перевірити:",
    bullet1: "Реальний об'єм та конфігурацію двигуна",
    bullet2: "Оригінальне обладнання та рівень комплектації",
    bullet3: "Завод-виробник та рік складання",
    bullet4: "Системи безпеки та гальмівні системи",
    policy: "Політика конфіденційності",
    terms: "Умови використання",
    alert: "Введіть коректний VIN-код (17 символів). Він не може містити літери I, O, Q або бути фейковим набором.",
    errTitle: "Помилка"
  },
  es: {
    dir: 'ltr',
    heroTitle: "Verificación de {make}",
    heroSub: "Informe técnico instantáneo y especificaciones para vehículos {make}.",
    searchPlaceholder: "Ingrese el VIN de {make}...",
    searchBtn: "Buscar",
    whyTitle: "¿Por qué verificar el VIN de {make}?",
    whyText: "Cada {make} tiene un identificador único de 17 caracteres. Al decodificarlo, puedes verificar:",
    bullet1: "Cilindrada y configuración real del motor",
    bullet2: "Equipamiento original y nivel de acabado",
    bullet3: "Planta de fabricación y año de ensamblaje",
    bullet4: "Funciones de seguridad y sistemas de frenado",
    policy: "Política de privacidad",
    terms: "Términos de servicio",
    alert: "Ingrese un código VIN válido de 17 caracteres. No puede contener I, O, Q ni secuencias falsas.",
    errTitle: "Error"
  },
  de: {
    dir: 'ltr',
    heroTitle: "Kostenlose {make} Prüfung",
    heroSub: "Sofortiger technischer Bericht und Spezifikationen für {make} Fahrzeuge.",
    searchPlaceholder: "{make} VIN eingeben...",
    searchBtn: "Suche",
    whyTitle: "Warum den {make} VIN prüfen?",
    whyText: "Jeder {make} hat eine eindeutige 17-stellige Kennung. Durch die Dekodierung können Sie Folgendes überprüfen:",
    bullet1: "Tatsächlicher Hubraum und Motorkonfiguration",
    bullet2: "Originalausstattung und Ausstattungsvariante",
    bullet3: "Herstellungswerk und Montagejahr",
    bullet4: "Sicherheitsmerkmale und Bremssysteme",
    policy: "Datenschutzrichtlinie",
    terms: "Nutzungsbedingungen",
    alert: "Bitte geben Sie eine gültige 17-stellige VIN ein (keine I, O, Q, keine gefälschten Wiederholungen).",
    errTitle: "Fehler"
  },
  zh: {
    dir: 'ltr',
    heroTitle: "免费 {make} 车辆检查",
    heroSub: "立即获取 {make} 车辆的技术报告和规格。",
    searchPlaceholder: "输入 {make} 车架号...",
    searchBtn: "搜索",
    whyTitle: "为什么要检查 {make} 车架号？",
    whyText: "每辆 {make} 都有一个唯一的 17 位识别码。通过解码，您可以验证：",
    bullet1: "实际发动机排量和配置",
    bullet2: "原始设备和装饰级别",
    bullet3: "制造工厂和组装年份",
    bullet4: "安全功能和制动系统",
    policy: "隐私政策",
    terms: "服务条款",
    alert: "请输入有效的 17 位车架号。不能包含 I、O、Q 或虚假的重复序列。",
    errTitle: "错误"
  },
  ar: {
    dir: 'rtl',
    heroTitle: "فحص سيارة {make} مجاني",
    heroSub: "تقرير فني فوري ومواصفات لمركبات {make}.",
    searchPlaceholder: "أدخل رقم شاسيه {make}...",
    searchBtn: "بحث",
    whyTitle: "لماذا تتحقق من رقم شاسيه {make}؟",
    whyText: "تمتلك كل {make} معرفًا فريدًا مكونًا من 17 حرفًا. من خلال فك تشفيره ، يمكنك التحقق من:",
    bullet1: "إزاحة المحرك الفعلية وتكوينه",
    bullet2: "المعدات الأصلية ومستوى القطع",
    bullet3: "مصنع التصنيع وسنة التجميع",
    bullet4: "ميزات السلامة وأنظمة الكبح",
    policy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    alert: "يرجى إدخال رقم شاسيه صحيح مكون من 17 حرفاً. لا يمكن أن يحتوي على I, O, Q.",
    errTitle: "خطأ"
  }
};

const languages = [
  { code: 'en', label: 'EN' },
  { code: 'uk', label: 'UK' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
  { code: 'zh', label: 'ZH' },
  { code: 'ar', label: 'AR' }
];

export default function MakeLanding() {
  const router = useRouter();
  const { make } = router.query;
  const [vinInput, setVinInput] = useState('');
  const [lang, setLang] = useState('en');
  const [history, setHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const formatMakeName = (m) => {
    if (!m) return '';
    const acronyms = ['bmw', 'kia', 'vw', 'gmc'];
    if (acronyms.includes(m.toLowerCase())) return m.toUpperCase();
    return m.charAt(0).toUpperCase() + m.slice(1).toLowerCase();
  };
  
  const displayMake = formatMakeName(make);

  useEffect(() => {
    if (!router.isReady) return; 

    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }

    if (make) {
      // Суворо тягнемо тільки коди цієї марки. Ніяких фолбеків на загальну базу!
      fetch(`/api/vins?make=${make}`)
        .then(res => res.json())
        .then(data => {
          const codes = Array.isArray(data) ? data : (data.vins || []);
          const cleanCodes = codes.filter(c => isValidVin(c));
          
          // Якщо масив порожній, setHistory([]) приховає блок історії
          setHistory(cleanCodes.slice(0, 15));
        })
        .catch(err => console.error("Помилка завантаження історії:", err));
    }
  }, [router.isReady, make]); 

  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('userLanguage', newLang);
  };

  const t = translations[lang] || translations.en;

  const isValidVin = (testVin) => {
    if (!testVin || testVin.length !== 17) return false;
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
    if (!vinRegex.test(testVin)) return false;
    const uniqueChars = new Set(testVin.split(''));
    if (uniqueChars.size < 5) return false;
    if (/([1-9A-HJ-NPR-Z])\1{5,}/i.test(testVin)) return false;
    if (testVin === '12345678901234567' || testVin === '01234567890123456') return false;
    return true;
  };

  const handleVinInput = (e) => {
    const cleanValue = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
    if (cleanValue.length <= 17) {
      setVinInput(cleanValue);
    }
  };

  const handleSearch = (searchVin = vinInput) => {
    const fVin = searchVin.toUpperCase().trim();
    
    if (isValidVin(fVin)) {
      setShowModal(false);
      
      fetch('/api/vins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vin: fVin, make: make })
      }).catch(err => console.error("Помилка запису в базу:", err));

      router.push(`/vin/${fVin}`);
    } else {
      setShowModal(true);
    }
  };

  const isError = (vinInput.length > 0 && vinInput.length < 17) || (vinInput.length === 17 && !isValidVin(vinInput));
  const isSuccess = vinInput.length === 17 && isValidVin(vinInput);

  return (
    <div className="container" dir={t.dir}>
      <Head>
        <title>{displayMake} VIN Decoder | {lang === 'uk' ? 'Безкоштовна перевірка' : 'Free Report'}</title>
        <meta name="description" content={t.heroSub.replace('{make}', displayMake)} />
        <link rel="canonical" href={`https://vindecoder.space/make/${make}`} />
        <link rel="icon" type="image/png" href="/favicon.png" />
        
        <meta property="og:title" content={`${displayMake} VIN Decoder`} />
        <meta property="og:description" content={t.heroSub.replace('{make}', displayMake)} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://vindecoder.space/make/${make}`} />
        <meta property="og:image" content={`https://vindecoder.space/api/og?make=${displayMake}`} />
        <meta property="og:image:secure_url" content={`https://vindecoder.space/api/og?make=${displayMake}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={`https://vindecoder.space/api/og?make=${displayMake}`} />
      </Head>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h3 className="modal-title">{t.errTitle}</h3>
            <p className="modal-desc">{t.alert}</p>
            <button className="modal-btn" onClick={() => setShowModal(false)}>OK</button>
          </div>
        </div>
      )}

      <header className="header">
        <div className="logo" onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span>DECODER
        </div>
        
        <div className="lang-switcher">
          {languages.map((l) => (
            <span 
              key={l.code}
              className={lang === l.code ? 'active' : ''} 
              onClick={() => toggleLang(l.code)}
            >
              {l.label}
            </span>
          ))}
        </div>
      </header>

      <div className="content">
        <div className="hero">
          <h2>{t.heroTitle.replace('{make}', displayMake)}</h2>
          <p>{t.heroSub.replace('{make}', displayMake)}</p>
        </div>

        <div className={`search-box ${isError ? 'box-error' : isSuccess ? 'box-success' : ''}`}>
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder={t.searchPlaceholder.replace('{make}', displayMake)} 
              value={vinInput}
              onChange={handleVinInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <span className={`char-count ${isError ? 'text-red' : isSuccess ? 'text-green' : ''}`}>
              {vinInput.length}/17
            </span>
          </div>
          <button onClick={() => handleSearch()}>{t.searchBtn}</button>
        </div>

        {/* ІСТОРІЯ ТЕПЕР ПОКАЗУЄТЬСЯ ТІЛЬКИ ЯКЩО Є ХОЧА Б 1 КОД САМЕ ЦІЄЇ МАРКИ */}
        {history.length > 0 && (
          <div className="history-section">
            <div className="history-chips">
              {history.map((h, i) => (
                <span key={`${h}-${i}`} className="chip" onClick={() => handleSearch(h)}>{h}</span>
              ))}
            </div>
          </div>
        )}

        <div className="info-section">
          <h3>{t.whyTitle.replace('{make}', displayMake)}</h3>
          <p>{t.whyText.replace('{make}', displayMake)}</p>
          <ul>
            <li>{t.bullet1}</li>
            <li>{t.bullet2}</li>
            <li>{t.bullet3}</li>
            <li>{t.bullet4}</li>
          </ul>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-links">
          <span onClick={() => router.push('/privacy')}>{t.policy}</span>
          <span className="dot">•</span>
          <span onClick={() => router.push('/terms')}>{t.terms}</span>
        </div>
        <p className="copyright">© 2026 VIN DECODER | PROFESSIONAL DATA</p>
      </footer>

      <style jsx global>{`
        html, body { margin: 0; padding: 0; background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow-x: hidden; }
      `}</style>

      <style jsx>{`
        .container { padding: 0 20px; text-align: center; max-width: 1200px; margin: 0 auto; min-height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-content { background: #111; border: 1px solid #333; padding: 40px 30px; border-radius: 20px; text-align: center; max-width: 400px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.5); animation: popIn 0.3s ease-out; }
        @keyframes popIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .modal-icon { font-size: 50px; margin-bottom: 15px; }
        .modal-title { color: #fff; margin: 0 0 10px 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px; }
        .modal-desc { color: #aaa; font-size: 14px; margin-bottom: 30px; line-height: 1.5; }
        .modal-btn { background: #facc15; color: #000; border: none; padding: 15px 40px; border-radius: 12px; font-weight: 900; font-size: 16px; cursor: pointer; text-transform: uppercase; width: 100%; transition: transform 0.2s; }
        .modal-btn:active { transform: scale(0.95); }

        .header { display: flex; justify-content: space-between; align-items: center; padding: 30px 0 60px; }
        .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px; }
        .yellow { color: #facc15; }
        
        .lang-switcher { display: flex; gap: 8px; font-size: 10px; font-weight: bold; }
        .lang-switcher span { cursor: pointer; padding: 6px 10px; border: 1px solid transparent; border-radius: 8px; transition: all 0.2s; color: #444; }
        .lang-switcher span.active { color: #facc15; border-color: #facc15; background: rgba(250, 204, 21, 0.05); }
        .lang-switcher span:hover:not(.active) { color: #aaa; border-color: #222; }

        .content { flex: 1; display: flex; flex-direction: column; align-items: center; }
        .hero h2 { font-size: clamp(1.8rem, 7vw, 3.5rem); font-weight: 900; text-transform: uppercase; margin: 0 0 15px; line-height: 1.1; }
        .hero p { color: #666; font-size: 1.1rem; margin-bottom: 40px; }
        
        .search-box { width: 100%; max-width: 700px; margin: 0 auto 30px; display: flex; gap: 10px; background: #111; padding: 10px; border-radius: 25px; border: 1px solid #222; transition: 0.3s border-color, 0.3s box-shadow; }
        .box-error { border-color: #ef4444; box-shadow: 0 0 15px rgba(239,68,68,0.2); }
        .box-success { border-color: #22c55e; box-shadow: 0 0 15px rgba(34,197,94,0.2); }
        
        .input-wrapper { position: relative; flex: 1; display: flex; align-items: center; }
        input { width: 100%; padding: 15px 65px 15px 25px; border: none; background: transparent; color: #fff; font-size: 1.1rem; font-family: monospace; outline: none; }
        
        .char-count { position: absolute; right: 20px; font-size: 12px; font-weight: bold; color: #555; transition: 0.3s color; pointer-events: none; }
        .text-red { color: #ef4444 !important; }
        .text-green { color: #22c55e !important; }

        button { padding: 0 40px; border-radius: 18px; border: none; background: #facc15; color: #000; font-weight: 900; cursor: pointer; text-transform: uppercase; transition: transform 0.2s; }
        button:active { transform: scale(0.95); }

        .history-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 60px; width: 100%; max-width: 900px; }
        .history-chips { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .chip { background: #080808; border: 1px solid #1a1a1a; padding: 8px 16px; border-radius: 20px; font-size: 12px; color: #666; cursor: pointer; transition: 0.2s; font-family: monospace; letter-spacing: 0.5px; }
        .chip:hover { border-color: #facc15; color: #facc15; }
        
        .info-section { width: 100%; max-width: 800px; margin: 0 auto 60px; background: #0a0a0a; padding: 40px; border-radius: 30px; border: 1px solid #1a1a1a; text-align: left; }
        .container[dir="rtl"] .info-section { text-align: right; }
        
        .info-section h3 { color: #facc15; margin-bottom: 20px; font-size: 1.4rem; }
        .info-section p { color: #aaa; line-height: 1.6; margin-bottom: 20px; }
        
        .info-section ul { color: #777; line-height: 1.8; margin: 0; padding: 0; padding-left: 20px; text-align: left; }
        .container[dir="rtl"] .info-section ul { padding-left: 0; padding-right: 20px; text-align: right; }
        
        .info-section li { margin-bottom: 12px; font-size: 1.05rem; }

        .footer { padding: 40px 0; color: #555; font-size: 12px; text-align: center; }
        .footer-links { display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; }
        .footer-links span { cursor: pointer; transition: color 0.2s; }
        .footer-links span:hover { color: #facc15; }
        .dot { color: #333; cursor: default !important; }
        .copyright { font-size: 10px; font-weight: bold; letter-spacing: 1px; color: #222; text-transform: uppercase; margin: 0; }
        
        @media (max-width: 768px) {
          .header { flex-direction: column; gap: 20px; padding-bottom: 40px; }
          .search-box { flex-direction: column; background: transparent; border: none; padding: 0; margin-bottom: 40px; box-shadow: none; }
          .input-wrapper { width: 100%; }
          input { background: #111; border: 1px solid #222; border-radius: 20px; margin-bottom: 10px; transition: 0.3s border-color; }
          .box-error input { border-color: #ef4444; }
          .box-success input { border-color: #22c55e; }
          .char-count { top: 18px; right: 20px; }
          button { padding: 20px; border-radius: 20px; width: 100%; }
          .info-section { padding: 30px 20px; }
        }
      `}</style>
    </div>
  );
}
