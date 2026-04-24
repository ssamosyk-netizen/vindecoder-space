import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Отримуємо параметри
    const vin = searchParams.get('vin') || 'NO VIN';
    const make = searchParams.get('make') || '';
    const model = searchParams.get('model') || '';
    const year = searchParams.get('year') || '';
    const engine = searchParams.get('engine') || '';

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
            backgroundColor: '#000',
            padding: '80px',
          }}
        >
          {/* Логотип */}
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <span style={{ color: '#facc15', fontSize: 40, fontWeight: 900 }}>VIN</span>
            <span style={{ color: '#fff', fontSize: 40, fontWeight: 900 }}>DECODER</span>
          </div>

          {/* VIN код */}
          <div style={{ fontSize: 26, color: '#666', marginBottom: '10px', fontWeight: 'bold' }}>
            VIN: {vin}
          </div>

          {/* Назва автомобіля */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 70,
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.1,
            }}
          >
            <span style={{ textTransform: 'uppercase' }}>
              {year} <span style={{ color: '#facc15' }}>{make}</span>
            </span>
            <span style={{ textTransform: 'uppercase' }}>
              {model} {engine !== '—' ? engine : ''}
            </span>
          </div>

          {/* Плашка */}
          <div
            style={{
              display: 'flex',
              marginTop: '50px',
              background: '#facc15',
              color: '#000',
              padding: '12px 24px',
              borderRadius: '12px',
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
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
