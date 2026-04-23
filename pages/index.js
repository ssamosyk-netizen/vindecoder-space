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
    <div style={{minHeight: '100vh', backgroundColor: '#000', color: '#fff', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center'}}>
      
      {/* ВЕРХНІЙ РЕКЛАМНИЙ БЛОК */}
      <div style={{maxWidth: '728px', height: '90px', backgroundColor: '#111', border: '1px dashed #333', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444', borderRadius: '8px'}}>
         <span style={{fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px'}}>Місце для вашої реклами</span>
      </div>

      <h1 style={{color: '#facc15', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px', margin: '0'}}>VINDECODER<span style={{color: '#fff'}}>.SPACE</span></h1>
      <p style={{color: '#666', marginTop: '10px'}}>Безкоштовна розшифровка специфікацій автомобіля за VIN кодом</p>
      
      <form onSubmit={decodeVin} style={{margin: '40px 0'}}>
        <div style={{display: 'inline-flex', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', borderRadius: '12px', overflow: 'hidden'}}>
          <input 
            type="text" 
            maxLength="17" 
            value={vin} 
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Введіть 17 символів..."
            style={{padding: '20px', fontSize: '18px', border: '2px solid #333', borderRight: 'none', backgroundColor: '#111', color: 'white', width: '320px', outline: 'none'}}
          />
          <button type="submit" style={{padding: '20px 30px', fontSize: '18px', backgroundColor: '#facc15', border: '2px solid #facc15', fontWeight: 'bold', cursor: 'pointer', color: '#000'}}>
            {loading ? 'ПОШУК...' : 'ПЕРЕВІРИТИ'}
          </button>
        </div>
      </form>

      {data && data.Make ? (
        <div style={{maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '25px', textAlign: 'left'}}>
          
          {/* ОСНОВНА ІНФОРМАЦІЯ */}
          <div style={{backgroundColor: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #222'}}>
            <h2 style={{color: '#facc15', fontSize: '26px', marginBottom: '25px', borderBottom: '1px solid #222', paddingBottom: '15px'}}>
               {data.ModelYear} {data.Make} {data.Model}
            </h2>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              <div><span style={{color: '#555', fontSize: '11px', fontWeight: 'bold'}}>МАРКА</span><br/><span style={{fontSize: '18px'}}>{data.Make}</span></div>
              <div><span style={{color: '#555', fontSize: '11px', fontWeight: 'bold'}}>МОДЕЛЬ</span><br/><span style={{fontSize: '18px'}}>{data.Model}</span></div>
              <div><span style={{color: '#555', fontSize: '11px', fontWeight: 'bold'}}>ДВИГУН</span><br/><span style={{fontSize: '18px'}}>{data.DisplacementL}L {data.EngineConfiguration} {data.EngineCylinders} цил.</span></div>
              <div><span style={{color: '#555', fontSize: '11px', fontWeight: 'bold'}}>КРАЇНА ВИРОБНИК</span><br/><span style={{fontSize: '18px'}}>{data.PlantCountry}</span></div>
              <div><span style={{color: '#555', fontSize: '11px', fontWeight: 'bold'}}>ТИП КУЗОВА</span><br/><span style={{fontSize: '18px'}}>{data.BodyClass}</span></div>
              <div><span style={{color: '#555', fontSize: '11px', fontWeight: 'bold'}}>ПРИВІД</span><br/><span style={{fontSize: '18px'}}>{data.DriveType}</span></div>
            </div>
            
            {/* ЗАМІСТЬ ПОСИЛАННЯ - НЕЙТРАЛЬНИЙ БЛОК */}
            <div style={{marginTop: '40px', padding: '25px', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <div style={{fontSize: '10px', fontWeight: 'bold', color: '#facc15', marginBottom: '5px'}}>ПРОПОЗИЦІЯ</div>
                <div style={{fontWeight: '700', fontSize: '18px'}}>Запчастини та аксесуари</div>
                <div style={{fontSize: '13px', color: '#666'}}>Швидкий підбір за технічними даними авто</div>
              </div>
              <div style={{backgroundColor: '#333', color: '#fff', padding: '12px 25px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold'}}>
                СКОРО БУДЕ
              </div>
            </div>
          </div>

          {/* БІЧНА ПАНЕЛЬ */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
             <div style={{height: '300px', backgroundColor: '#111', border: '1px dashed #333', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#444', padding: '20px'}}>
                <span style={{fontSize: '11px', textTransform: 'uppercase'}}>Тут може бути<br/>ваша реклама</span>
             </div>
             
             <div style={{padding: '20px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #222'}}>
                <h4 style={{margin: '0 0 10px 0', fontSize: '14px', color: '#facc15'}}>Історія авто</h4>
                <p style={{fontSize: '12px', color: '#666', margin: '0'}}>Повна перевірка на ДТП, угони та страхові випадки (в розробці).</p>
             </div>
          </div>

        </div>
      ) : (
        <div style={{marginTop: '60px', color: '#333'}}>
            <p style={{fontSize: '14px'}}>Сервіс використовує офіційні дані NHTSA для розшифровки параметрів транспортних засобів.</p>
        </div>
      )}

      {/* FOOTER */}
      <div style={{marginTop: '100px', padding: '30px', color: '#333', fontSize: '11px', borderTop: '1px solid #111'}}>
         <p>© 2026 VINDECODER.SPACE — Професійний інструмент дешифрування VIN</p>
      </div>

    </div>
  );
}
