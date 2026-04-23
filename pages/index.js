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
      
      {/* МІСЦЕ ПІД БАНЕР */}
      <div style={{maxWidth: '728px', height: '90px', backgroundColor: '#0a0a0a', border: '1px dashed #222', margin: '0 auto 30px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333', borderRadius: '8px'}}>
         <span style={{fontSize: '10px', textTransform: 'uppercase'}}>Рекламний блок</span>
      </div>

      <h1 style={{color: '#facc15', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px', margin: '0'}}>VINDECODER<span style={{color: '#fff'}}>.SPACE</span></h1>
      <p style={{color: '#444', marginTop: '10px'}}>Інформаційний сервіс перевірки специфікацій транспортних засобів</p>
      
      <form onSubmit={decodeVin} style={{margin: '40px 0'}}>
        <div style={{display: 'inline-flex', borderRadius: '12px', overflow: 'hidden', border: '1px solid #333'}}>
          <input 
            type="text" 
            maxLength="17" 
            value={vin} 
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Введіть VIN..."
            style={{padding: '18px', fontSize: '18px', border: 'none', backgroundColor: '#0a0a0a', color: 'white', width: '300px', outline: 'none'}}
          />
          <button type="submit" style={{padding: '18px 30px', fontSize: '18px', backgroundColor: '#facc15', border: 'none', fontWeight: 'bold', cursor: 'pointer', color: '#000'}}>
            {loading ? '...' : 'ПЕРЕВІРИТИ'}
          </button>
        </div>
      </form>

      {data && data.Make ? (
        <div style={{maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', textAlign: 'left'}}>
          
          <div style={{backgroundColor: '#0a0a0a', padding: '30px', borderRadius: '16px', border: '1px solid #1a1a1a'}}>
            <h2 style={{color: '#facc15', fontSize: '22px', marginBottom: '20px', borderBottom: '1px solid #1a1a1a', paddingBottom: '15px'}}>
               {data.ModelYear} {data.Make} {data.Model}
            </h2>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
              <div><span style={{color: '#444', fontSize: '10px', fontWeight: 'bold'}}>МАРКА</span><br/><b>{data.Make}</b></div>
              <div><span style={{color: '#444', fontSize: '10px', fontWeight: 'bold'}}>МОДЕЛЬ</span><br/><b>{data.Model}</b></div>
              <div><span style={{color: '#444', fontSize: '10px', fontWeight: 'bold'}}>ДВИГУН</span><br/><b>{data.DisplacementL}L {data.EngineConfiguration}</b></div>
              <div><span style={{color: '#444', fontSize: '10px', fontWeight: 'bold'}}>ВИРОБНИК</span><br/><b>{data.PlantCountry}</b></div>
            </div>
            
            {/* ПОВНІСТЮ НЕЙТРАЛЬНИЙ БЛОК БЕЗ ПОСИЛАНЬ */}
            <div style={{marginTop: '30px', padding: '20px', backgroundColor: '#111', borderRadius: '12px', border: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div>
                <div style={{fontSize: '10px', color: '#facc15', marginBottom: '5px'}}>ІНФОРМАЦІЯ</div>
                <div style={{fontWeight: '700', fontSize: '16px'}}>Сервісне обслуговування</div>
                <div style={{fontSize: '12px', color: '#444'}}>Дані базуються на офіційних звітах виробника</div>
              </div>
              <div style={{color: '#333', fontSize: '12px', fontWeight: 'bold'}}>
                SERVICE
              </div>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
             <div style={{height: '250px', backgroundColor: '#0a0a0a', border: '1px dashed #222', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222'}}>
                <span style={{fontSize: '10px'}}>ADVERTISING BLOCK</span>
             </div>
             <div style={{padding: '15px', backgroundColor: '#0a0a0a', borderRadius: '12px', border: '1px solid #1a1a1a'}}>
                <div style={{fontSize: '12px', color: '#444'}}>Для перевірки історії експлуатації зверніться до офіційних реєстрів.</div>
             </div>
          </div>

        </div>
      ) : null}

      <div style={{marginTop: '100px', padding: '20px', color: '#222', fontSize: '10px'}}>
         <p>© 2026 VINDECODER.SPACE</p>
      </div>

    </div>
  );
}
