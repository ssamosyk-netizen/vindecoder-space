import React, { useState } from 'react';

export default function VinDecoder() {
  const [vin, setVin] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const decodeVin = async (e) => {
    e.preventDefault();
    if (vin.length !== 17) return alert("Потрібно 17 символів");
    setLoading(true);
    try {
      const res = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvaluesextended/${vin}?format=json`);
      const result = await res.json();
      setData(result.Results[0]);
    } catch (err) { alert("Помилка зв'язку з базою"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#000', color: 'white', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center'}}>
      
      {/* РЕКЛАМНИЙ СЛОТ №1: TOP BANNER */}
      <div style={{maxWidth: '728px', height: '90px', backgroundColor: '#1a1a1a', border: '1px dashed #444', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', borderRadius: '8px'}}>
         <span style={{fontSize: '12px', textTransform: 'uppercase'}}>Місце для вашої реклами (728x90)</span>
      </div>

      <h1 style={{color: '#facc15', fontSize: '3rem', fontWeight: '900', letterSpacing: '-1px'}}>VINDECODER<span style={{color: '#fff'}}>.SPACE</span></h1>
      
      <form onSubmit={decodeVin} style={{margin: '40px 0'}}>
        <div style={{display: 'inline-flex', boxShadow: '0 0 20px rgba(250, 204, 21, 0.2)', borderRadius: '12px'}}>
          <input 
            type="text" 
            maxLength="17" 
            value={vin} 
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Введіть VIN код авто..."
            style={{padding: '20px', fontSize: '18px', borderRadius: '12px 0 0 12px', border: '2px solid #facc15', borderRight: 'none', backgroundColor: '#111', color: 'white', width: '350px', outline: 'none'}}
          />
          <button type="submit" style={{padding: '20px 40px', fontSize: '18px', backgroundColor: '#facc15', border: '2px solid #facc15', borderRadius: '0 12px 12px 0', fontWeight: 'bold', cursor: 'pointer', color: '#000'}}>
            {loading ? 'ПОШУК...' : 'ПЕРЕВІРИТИ'}
          </button>
        </div>
      </form>

      {data && data.Make ? (
        <div style={{maxWidth: '800px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', textAlign: 'left'}}>
          
          {/* РЕЗУЛЬТАТИ */}
          <div style={{backgroundColor: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #333'}}>
            <h2 style={{color: '#facc15', fontSize: '24px', marginBottom: '20px'}}>{data.ModelYear} {data.Make} {data.Model}</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
              <div><span style={{color: '#666', fontSize: '12px'}}>МАРКА</span><br/><b>{data.Make}</b></div>
              <div><span style={{color: '#666', fontSize: '12px'}}>МОДЕЛЬ</span><br/><b>{data.Model}</b></div>
              <div><span style={{color: '#666', fontSize: '12px'}}>ДВИГУН</span><br/><b>{data.DisplacementL}L {data.EngineConfiguration}</b></div>
              <div><span style={{color: '#666', fontSize: '12px'}}>КРАЇНА</span><br/><b>{data.PlantCountry}</b></div>
            </div>
            
            {/* РЕКЛАМНИЙ СЛОТ №2: NATIVE AD (Ваш магазин) */}
            <div style={{marginTop: '30px', padding: '20px', backgroundColor: '#facc15', borderRadius: '12px', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <div style={{fontSize: '12px', fontWeight: 'bold', opacity: '0.6'}}>РЕКЛАМА</div>
                <div style={{fontWeight: '900', fontSize: '18px'}}>Запчастини для {data.Make}</div>
                <div style={{fontSize: '14px'}}>В наявності на складі в Україні</div>
              </div>
              <a href="https://usamotors.com.ua/" target="_blank" style={{backgroundColor: '#000', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold'}}>КУПИТИ</a>
            </div>
          </div>

          {/* ПРАВА КОЛОНКА (SIDEBAR AD) */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
             <div style={{height: '250px', backgroundColor: '#1a1a1a', border: '1px dashed #444', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#666', padding: '20px'}}>
                <span style={{fontSize: '12px'}}>Тут може бути ваша реклама<br/>(300x250)</span>
             </div>
             <div style={{height: '150px', backgroundColor: '#1a1a1a', border: '1px dashed #444', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#666', padding: '20px'}}>
                <span style={{fontSize: '12px'}}>Перевірка історії ДТП<br/>(Скоро буде)</span>
             </div>
          </div>

        </div>
      ) : (
        <div style={{marginTop: '50px', color: '#444'}}>
            <p>Введіть 17-значний код для отримання повної специфікації автомобіля.</p>
        </div>
      )}

      {/* FOOTER AD */}
      <div style={{marginTop: '100px', padding: '40px', borderTop: '1px solid #222', color: '#444', fontSize: '12px'}}>
         <p>© 2026 VINDECODER.SPACE | <a href="#" style={{color: '#444'}}>Розмістити рекламу</a></p>
      </div>

    </div>
  );
}
