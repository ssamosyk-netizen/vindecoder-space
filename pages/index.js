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
    <div style={{minHeight: '100vh', backgroundColor: '#111', color: 'white', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center'}}>
      <h1 style={{color: '#facc15'}}>VINDECODER.SPACE</h1>
      <form onSubmit={decodeVin} style={{margin: '40px 0'}}>
        <input 
          type="text" 
          maxLength="17" 
          value={vin} 
          onChange={(e) => setVin(e.target.value.toUpperCase())}
          placeholder="Введіть VIN..."
          style={{padding: '15px', fontSize: '18px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#222', color: 'white', width: '300px', marginRight: '10px'}}
        />
        <button type="submit" style={{padding: '15px 30px', fontSize: '18px', backgroundColor: '#facc15', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}>
          {loading ? 'ШУКАЮ...' : 'РОЗШИФРУВАТИ'}
        </button>
      </form>

      {data && data.Make && (
        <div style={{maxWidth: '600px', margin: '0 auto', backgroundColor: '#222', padding: '20px', borderRadius: '12px', border: '1px solid #facc15'}}>
          <h2 style={{color: '#facc15'}}>{data.ModelYear} {data.Make} {data.Model}</h2>
          <p>Двигун: {data.DisplacementL}L {data.EngineConfiguration}</p>
          <p>Країна: {data.PlantCountry}</p>
          <hr style={{borderColor: '#444', margin: '20px 0'}} />
          <p><i>Потрібні запчастини?</i></p>
          <a href={`https://usamotors.com.ua/`} target="_blank" style={{color: '#facc15', fontWeight: 'bold'}}>Перейти в USAMOTORS</a>
        </div>
      )}
    </div>
  );
}
