import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Отримуємо та очищуємо дані
    const vin = searchParams.get('vin') || '';
    const make = (searchParams.get('make') || '').toUpperCase();
    const model = (searchParams.get('model') || '').toUpperCase();
    const year = searchParams.get('year') || '';
    let engine = searchParams.get('engine') || '';
    
    // Видаляємо спецсимволи, які можуть «вішати» рендеринг
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
            backgroundColor: '#000000', // Тільки повні коди кольорів
            paddingLeft: '80px',
            paddingRight: '80px',
          }}
        >
          {/* ЛОГОТИП */}
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ color: '#facc15', fontSize: '40px', fontWeight: 900 }}>VIN</div>
            <div style={{ color: '#ffffff', fontSize: '40px', fontWeight: 900, marginLeft: '10px' }}>DECODER</div>
          </div>

          {/* VIN НОМЕР */}
          <div style={{ display: 'flex', fontSize: '24px', color: '#666666', marginBottom: '10px', fontWeight: 700 }}>
            VIN: {vin}
          </div>

          {/* РЯДОК 1: РІК ТА МАРКА */}
          <div style={{ display: 'flex', fontSize: '80px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
            {year} 
            <div style={{ color: '#facc15', marginLeft: '25px' }}>{make}</div>
          </div>

          {/* РЯДОК 2: МОДЕЛЬ ТА ДВИГУН */}
          <div style={{ display: 'flex', fontSize: '80px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 }}>
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
            <div style={{ color: '#000000', fontSize: '24px', fontWeight: 'bold' }}>
              ✓ TECHNICAL DATA VERIFIED
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
