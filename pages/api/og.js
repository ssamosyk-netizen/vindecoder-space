import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Отримуємо дані
    const vin = searchParams.get('vin') || '';
    const make = (searchParams.get('make') || '').toUpperCase();
    const model = (searchParams.get('model') || '').toUpperCase();
    const year = searchParams.get('year') || '';
    let engine = searchParams.get('engine') || '';
    
    // Очищення символів
    if (engine === '—' || engine === 'null') engine = '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#000000',
            paddingLeft: '80px',
            paddingRight: '80px',
          }}
        >
          {/* ЛОГОТИП */}
          <div style={{ display: 'flex', marginBottom: '60px' }}>
            <div style={{ color: '#facc15', fontSize: '30px', fontWeight: 900 }}>VIN</div>
            <div style={{ color: '#ffffff', fontSize: '30px', fontWeight: 900, marginLeft: '8px' }}>DECODER</div>
          </div>

          {/* ВЕЛИКИЙ VIN НОМЕР (Тепер він помітний) */}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '30px' }}>
            <div style={{ fontSize: '20px', color: '#facc15', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px', letterSpacing: '2px' }}>
              Vehicle Identification Number
            </div>
            <div style={{ fontSize: '52px', color: '#ffffff', fontWeight: 900, letterSpacing: '1px' }}>
              {vin}
            </div>
          </div>

          {/* ГОЛОВНА ІНФОРМАЦІЯ: РІК ТА МАРКА */}
          <div style={{ display: 'flex', fontSize: '85px', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
            {year} 
            <div style={{ color: '#facc15', marginLeft: '25px' }}>{make}</div>
          </div>

          {/* МОДЕЛЬ ТА ДВИГУН */}
          <div style={{ display: 'flex', fontSize: '85px', fontWeight: 900, color: '#ffffff', lineHeight: 1, marginTop: '10px' }}>
            {model} {engine}
          </div>

          {/* ПЛАШКА СТАТУСУ */}
          <div
            style={{
              display: 'flex',
              marginTop: '60px',
              backgroundColor: '#facc15',
              paddingLeft: '30px',
              paddingRight: '30px',
              paddingTop: '15px',
              paddingBottom: '15px',
              borderRadius: '15px',
            }}
          >
            <div style={{ color: '#000000', fontSize: '22px', fontWeight: 'bold' }}>
              ✓ FULL SPECIFICATION REPORT READY
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
