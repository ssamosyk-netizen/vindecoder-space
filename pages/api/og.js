import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Отримуємо дані. Використовуємо .get() і додаємо дефолтні значення
    const vin = searchParams.get('vin') || '';
    const make = (searchParams.get('make') || '').toUpperCase();
    const model = (searchParams.get('model') || '').toUpperCase();
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
            backgroundColor: '#000000',
            padding: '80px',
          }}
        >
          {/* Логотип */}
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ color: '#facc15', fontSize: 40, fontWeight: 900 }}>VIN</div>
            <div style={{ color: '#ffffff', fontSize: 40, fontWeight: 900, marginLeft: '5px' }}>DECODER</div>
          </div>

          {/* VIN номер */}
          <div style={{ fontSize: 24, color: '#666666', marginBottom: '10px', fontWeight: 'bold' }}>
            VIN: {vin}
          </div>

          {/* Назва авто (Рік + Марка) */}
          <div style={{ display: 'flex', fontSize: 75, fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
            {year} <div style={{ color: '#facc15', marginLeft: '20px' }}>{make}</div>
          </div>

          {/* Модель + Двигун */}
          <div style={{ display: 'flex', fontSize: 75, fontWeight: 900, color: '#ffffff', lineHeight: 1, marginTop: '10px' }}>
            {model} {engine !== '—' ? engine : ''}
          </div>

          {/* Плашка знизу */}
          <div
            style={{
              display: 'flex',
              marginTop: '50px',
              backgroundColor: '#facc15',
              color: '#000000',
              padding: '15px 30px',
              borderRadius: '15px',
              fontSize: 26,
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
