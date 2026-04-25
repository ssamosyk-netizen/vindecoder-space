import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const translations = {
  en: {
    dir: 'ltr',
    title: "VIN Report for",
    loading: "Decoding VIN, please wait...",
    error: "Sorry, we couldn't decode this VIN. It might be invalid or too old.",
    details: "Vehicle Specifications",
    engine: "Engine & Performance",
    production: "Manufacturing",
    getHistoryTitle: "Want to know the car's hidden history?",
    getHistoryText: "Check for accidents, mileage rollbacks, theft, and salvage titles.",
    getHistoryBtn: "GET FULL HISTORY REPORT",
    supportTitle: "Support our free project!",
    supportBtn: "☕ Buy us a coffee",
    policy: "Privacy Policy",
    terms: "Terms of Service",
    footer: "© 2026 VIN DECODER | PROFESSIONAL DATA"
  },
  uk: {
    dir: 'ltr',
    title: "Звіт по VIN-коду",
    loading: "Розшифровуємо VIN, зачекайте...",
    error: "Вибачте, ми не змогли розшифрувати цей VIN. Він може бути некоректним або застарілим.",
    details: "Технічні характеристики",
    engine: "Двигун та Трансмісія",
    production: "Виробництво",
    getHistoryTitle: "Бажаєте дізнатися приховану історію авто?",
    getHistoryText: "Перевірте наявність ДТП, скручений пробіг, крадіжки та статус Salvage.",
    getHistoryBtn: "ОТРИМАТИ ПОВНИЙ ЗВІТ (CARFAX/AUTOCHECK)",
    supportTitle: "Підтримайте наш безкоштовний проект!",
    supportBtn: "☕ Пригостити кавою",
    policy: "Політика конфіденційності",
    terms: "Умови використання",
    footer: "© 2026 VIN DECODER | ПРОФЕСІЙНІ ДАНІ"
  },
  es: {
    dir: 'ltr',
    title: "Informe VIN para",
    loading: "Decodificando VIN, por favor espere...",
    error: "Lo sentimos, no pudimos decodificar este VIN. Puede ser inválido o muy antiguo.",
    details: "Especificaciones del vehículo",
    engine: "Motor y rendimiento",
    production: "Fabricación",
    getHistoryTitle: "¿Quieres conocer el historial oculto del coche?",
    getHistoryText: "Comprueba si hay accidentes, retrocesos de kilometraje, robos y títulos de salvamento.",
    getHistoryBtn: "OBTENER INFORME HISTÓRICO COMPLETO",
    supportTitle: "¡Apoya nuestro proyecto gratuito!",
    supportBtn: "☕ Cómpranos un café",
    policy: "Política de privacidad",
    terms: "Términos de servicio",
    footer: "© 2026 VIN DECODER | DATOS PROFESIONALES"
  },
  de: {
    dir: 'ltr',
    title: "VIN-Bericht für",
    loading: "VIN wird dekodiert, bitte warten...",
    error: "Leider konnten wir diese VIN nicht dekodieren. Sie ist möglicherweise ungültig.",
    details: "Fahrzeugspezifikationen",
    engine: "Motor & Leistung",
    production: "Herstellung",
    getHistoryTitle: "Möchten Sie die verborgene Geschichte des Autos kennen?",
    getHistoryText: "Prüfen Sie auf Unfälle, Tachomanipulationen, Diebstahl und Totalschäden.",
    getHistoryBtn: "VOLLSTÄNDIGEN HISTORIENBERICHT ABRUFEN",
    supportTitle: "Unterstützen Sie unser kostenloses Projekt!",
    supportBtn: "☕ Spendieren Sie uns einen Kaffee",
    policy: "Datenschutzrichtlinie",
    terms: "Nutzungsbedingungen",
    footer: "© 2026 VIN DECODER | PROFESSIONELLE DATEN"
  },
  zh: {
    dir: 'ltr',
    title: "车架号 (VIN) 报告",
    loading: "正在解码车架号，请稍候...",
    error: "抱歉，我们无法解码此车架号。它可能无效或太旧。",
    details: "车辆规格",
    engine: "发动机与性能",
    production: "生产信息",
    getHistoryTitle: "想知道这辆车的隐藏历史吗？",
    getHistoryText: "检查是否有事故、里程表倒转、盗窃和报废记录。",
    getHistoryBtn: "获取完整历史报告",
    supportTitle: "支持我们的免费项目！",
    supportBtn: "☕ 请我们喝杯咖啡",
    policy: "隐私政策",
    terms: "服务条款",
    footer: "© 2026 VIN DECODER | 专业数据"
  },
  ar: {
    dir: 'rtl',
    title: "تقرير رقم الشاسيه لـ",
    loading: "جاري فك تشفير رقم الشاسيه، يرجى الانتظار...",
    error: "عذرًا، لم نتمكن من فك تشفير هذا الرقم. قد يكون غير صالح.",
    details: "مواصفات السيارة",
    engine: "المحرك والأداء",
    production: "التصنيع",
    getHistoryTitle: "هل تريد معرفة التاريخ المخفي للسيارة؟",
    getHistoryText: "تحقق من الحوادث وتراجع الأميال والسرقة وسجلات الخردة.",
    getHistoryBtn: "احصل على تقرير التاريخ الكامل",
    supportTitle: "ادعم مشروعنا المجاني!",
    supportBtn: "☕ اشتري لنا قهوة",
    policy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    footer: "© 2026 VIN DECODER | بيانات احترافية"
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

export default function VinReport() {
  const router = useRouter();
  const { id } = router.query;
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('userLanguage');
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    }
  }, []);

  const toggleLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('userLanguage', newLang);
  };

  const t = translations[lang] || translations.en;

  // Отримання даних VIN
  useEffect(() => {
    if (!id) return;
    
    const fetchVinData = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${id}?format=json`);
        const json = await response.json();
        
        if (json.Results && json.Results[0] && json.Results[0].Make) {
          setVehicleData(json.Results[0]);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchVinData();
  }, [id]);

  // Партнерське посилання на CARFAX або інший сервіс (додай своє)
  const affiliateLink = `https://your-affiliate-link.com/report?vin=${id}`;
  
  // Посилання на донати
  const donationLink = `https://buymeacoffee.com/yourprofile`;

  // Формуємо динамічне посилання на картинку для месенджерів (OG Image)
  const currentVin = id || 'CHECK';
  const ogImageUrl = `https://vindecoder.space/api/og?vin=${currentVin}`;

  return (
    <div className="container" dir={t.dir}>
      <Head>
        <title>{id ? `VIN Report: ${id}` : 'VIN DECODER'} | Free Check</title>
        <meta name="description" content={`Get full vehicle specifications and history report for VIN ${id}.`} />
        <link rel="icon" type="image/png" href="/favicon.png" />
        
        {/* КАРТИНКА ДЛЯ МЕСЕНДЖЕРІВ, ЯКА ГЕНЕРУЄТЬСЯ ДЛЯ КОЖНОГО VIN */}
        <meta property="og:title" content={`${id ? id : 'Vehicle'} | Free VIN Decoder`} />
        <meta property="og:description" content={`Get full vehicle specifications and history report for VIN ${id}.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://vindecoder.space/vin/${id}`} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:secure_url" content={ogImageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>

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

      <main className="content">
        <h1 className="report-title">{t.title} <span className="yellow">{id}</span></h1>

        {loading ? (
          <div className="status-box">
            <div className="spinner"></div>
            <p>{t.loading}</p>
          </div>
        ) : error || !vehicleData ? (
          <div className="status-box error">
            <p>{t.error}</p>
            <button className="back-btn" onClick={() => router.push('/')}>Go Back</button>
          </div>
        ) : (
          <>
            {/* БЛОК МОНЕТИЗАЦІЇ */}
            <div className="monetization-banner">
              <div className="banner-text">
                <h3>⚠️ {t.getHistoryTitle}</h3>
                <p>{t.getHistoryText}</p>
              </div>
              <a href={affiliateLink} target="_blank" rel="noopener noreferrer" className="action-btn">
                {t.getHistoryBtn}
              </a>
            </div>

            <div className="data-grid">
              <div className="data-card">
                <h3>{t.details}</h3>
                <ul>
                  <li><span>Make:</span> {vehicleData.Make || 'N/A'}</li>
                  <li><span>Model:</span> {vehicleData.Model || 'N/A'}</li>
                  <li><span>Year:</span> {vehicleData.ModelYear || 'N/A'}</li>
                  <li><span>Trim:</span> {vehicleData.Trim || 'N/A'}</li>
                  <li><span>Body Style:</span> {vehicleData.BodyClass || 'N/A'}</li>
                  <li><span>Drive Type:</span> {vehicleData.DriveType || 'N/A'}</li>
                  <li><span>Vehicle Type:</span> {vehicleData.VehicleType || 'N/A'}</li>
                </ul>
              </div>

              <div className="data-card">
                <h3>{t.engine}</h3>
                <ul>
                  <li><span>Engine Model:</span> {vehicleData.EngineModel || 'N/A'}</li>
                  <li><span>Cylinders:</span> {vehicleData.EngineCylinders || 'N/A'}</li>
                  <li><span>Displacement (L):</span> {vehicleData.DisplacementL || 'N/A'}</li>
                  <li><span>Horsepower:</span> {vehicleData.EngineHP || 'N/A'}</li>
                  <li><span>Fuel Type:</span> {vehicleData.FuelTypePrimary || 'N/A'}</li>
                  <li><span>Transmission:</span> {vehicleData.TransmissionStyle || 'N/A'}</li>
                </ul>
              </div>

              <div className="data-card">
                <h3>{t.production}</h3>
                <ul>
                  <li><span>Manufacturer:</span> {vehicleData.Manufacturer || 'N/A'}</li>
                  <li><span>Plant City:</span> {vehicleData.PlantCity || 'N/A'}</li>
                  <li><span>Plant Country:</span> {vehicleData.PlantCountry || 'N/A'}</li>
                  <li><span>Plant State:</span> {vehicleData.PlantState || 'N/A'}</li>
                  <li><span>Series:</span> {vehicleData.Series || 'N/A'}</li>
                </ul>
              </div>
            </div>

            <div className="support-banner">
              <h3>{t.supportTitle}</h3>
              <a href={donationLink} target="_blank" rel="noopener noreferrer" className="donate-btn">
                {t.supportBtn}
              </a>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="footer-links">
          <span onClick={() => router.push('/privacy')}>{t.policy}</span>
          <span className="dot">•</span>
          <span onClick={() => router.push('/terms')}>{t.terms}</span>
        </div>
        <p className="copyright">{t.footer}</p>
      </footer>

      <style jsx global>{`
        html, body { margin: 0; padding: 0; background-color: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; overflow-x: hidden; }
      `}</style>

      <style jsx>{`
        .container { padding: 0 20px; max-width: 1200px; margin: 0 auto; min-height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; }
        .header { display: flex; justify-content: space-between; align-items: center; padding: 30px 0 50px; }
        .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -1px; }
        .yellow { color: #facc15; }
        
        .lang-switcher { display: flex; gap: 8px; font-size: 10px; font-weight: bold; }
        .lang-switcher span { cursor: pointer; padding: 6px 10px; border: 1px solid transparent; border-radius: 8px; transition: all 0.2s; color: #444; }
        .lang-switcher span.active { color: #facc15; border-color: #facc15; background: rgba(250, 204, 21, 0.05); }
        .lang-switcher span:hover:not(.active) { color: #aaa; border-color: #222; }

        .content { flex: 1; width: 100%; max-width: 900px; margin: 0 auto; }
        .report-title { font-size: clamp(1.5rem, 4vw, 2.2rem); font-weight: 900; margin-bottom: 30px; text-transform: uppercase; text-align: center; }
        .report-title .yellow { word-break: break-all; }

        .status-box { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 50px 20px; border-radius: 20px; text-align: center; color: #aaa; font-size: 1.1rem; }
        .status-box.error { color: #ff4d4d; border-color: #331111; }
        .spinner { width: 40px; height: 40px; border: 4px solid rgba(250, 204, 21, 0.1); border-left-color: #facc15; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        
        .back-btn { background: #222; color: #fff; border: none; padding: 12px 30px; border-radius: 12px; margin-top: 20px; cursor: pointer; font-weight: bold; transition: 0.2s; }
        .back-btn:hover { background: #333; color: #facc15; }

        .monetization-banner { background: linear-gradient(135deg, #111, #1a1a1a); border: 1px solid #333; padding: 25px 30px; border-radius: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .banner-text h3 { margin: 0 0 5px; color: #fff; font-size: 1.2rem; }
        .banner-text p { margin: 0; color: #aaa; font-size: 0.95rem; }
        .action-btn { background: #facc15; color: #000; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 900; font-size: 0.9rem; text-transform: uppercase; white-space: nowrap; transition: 0.2s; box-shadow: 0 4px 15px rgba(250, 204, 21, 0.3); }
        .action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(250, 204, 21, 0.5); }

        .data-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 40px; }
        .data-card { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 25px; border-radius: 20px; }
        .data-card h3 { color: #facc15; margin-top: 0; margin-bottom: 20px; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #222; padding-bottom: 10px; }
        .data-card ul { list-style: none; padding: 0; margin: 0; }
        .data-card li { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed #111; font-size: 0.95rem; color: #eee; }
        .data-card li:last-child { border-bottom: none; }
        .data-card li span { color: #777; font-weight: bold; }

        .support-banner { text-align: center; background: #080808; border: 1px dashed #333; padding: 30px; border-radius: 20px; margin-bottom: 20px; }
        .support-banner h3 { color: #aaa; margin: 0 0 15px; font-size: 1rem; }
        .donate-btn { display: inline-block; background: #222; color: #fff; text-decoration: none; padding: 10px 24px; border-radius: 12px; font-weight: bold; border: 1px solid #333; transition: 0.2s; }
        .donate-btn:hover { background: #333; border-color: #facc15; color: #facc15; }

        .footer { padding: 40px 0; color: #555; font-size: 12px; text-align: center; margin-top: 40px; }
        .footer-links { display: flex; justify-content: center; gap: 15px; margin-bottom: 15px; }
        .footer-links span { cursor: pointer; transition: color 0.2s; }
        .footer-links span:hover { color: #facc15; }
        .dot { color: #333; cursor: default !important; }
        .copyright { font-size: 10px; font-weight: bold; letter-spacing: 1px; color: #222; text-transform: uppercase; margin: 0; }

        @media (max-width: 768px) {
          .header { flex-direction: column; gap: 20px; padding-bottom: 30px; }
          .monetization-banner { flex-direction: column; text-align: center; gap: 20px; padding: 25px 20px; }
          .action-btn { width: 100%; text-align: center; box-sizing: border-box; }
          .data-card li { flex-direction: column; gap: 5px; }
        }
      `}</style>
    </div>
  );
}
// --- КІНЕЦЬ ФАЙЛУ VIN/[ID].JS ---
