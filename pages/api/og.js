import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Отримуємо параметри та обробляємо пусті значення
    const vin = searchParams.get('vin') || '';
    const make = (searchParams.get('make') || '').toUpperCase();
    const model = (searchParams.get('model') || '').toUpperCase();
    const year = searchParams.get('year') || '';
    let engine = searchParams.get('engine') || '';
    
    // Очищуємо значення двигуна від символів, які ламають шрифти
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
            padding: '80px',
          }}
        >
          {/* LOGO */}
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ color: '#facc15', fontSize: 40, fontWeight: 900 }}>VIN</div>
            <div style={{ color: '#ffffff', fontSize: 40, fontWeight: 900, marginLeft: '10px' }}>DECODER</div>
          </div>

          {/* VIN */}
          <div style={{ fontSize: 24, color: '#666666', marginBottom: '10px', fontWeight: 'bold' }}>
            VIN: {vin}
          </div>

          {/* CAR NAME */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 72, fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
              {year} <div style={{ color: '#facc15', marginLeft: '20px' }}>{make}</div>
            </div>
            <div style={{ display: 'flex', fontSize: 72, fontWeight: 900, color: '#ffffff', lineHeight: 1, marginTop: '10px' }}>
              {model} {engine}
            </div>
          </div>

          {/* STATUS */}
          <div
            style={{
              display: 'flex',
              marginTop: '60px',
              backgroundColor: '#facc15',
              color: '#000000',
              padding: '15px 30px',
              borderRadius: '15px',
              fontSize: 24,
              fontWeight: 'bold',
            }}
          >
            ✓ TECHNICAL DATA VERIFIED
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e.message);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
