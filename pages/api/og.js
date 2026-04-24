import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Отримуємо дані та відразу ставимо дефолтні значення, щоб не було null
    const vin = searchParams.get('vin') || 'VIN UNKNOWN';
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
            backgroundColor: 'black',
            padding: '80px',
          }}
        >
          {/* Логотип */}
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <div style={{ color: '#facc15', fontSize: 40, fontWeight: 900 }}>VIN</div>
            <div style={{ color: 'white', fontSize: 40, fontWeight: 900 }}>DECODER</div>
          </div>

          {/* VIN номер */}
          <div
            style={{
              fontSize: 26,
              color: '#666666',
              marginBottom: '10px',
              fontWeight: 'bold',
            }}
          >
            VIN: {vin}
          </div>

          {/* Основний блок з авто */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 70,
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
            }}
          >
            <div style={{ display: 'flex' }}>
              {year} <span style={{ color: '#facc15', marginLeft: '15px' }}>{make.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex' }}>
              {model.toUpperCase()} {engine !== '—' ? engine : ''}
            </div>
          </div>

          {/* Плашка верифікації */}
          <div
            style={{
              display: 'flex',
              marginTop: '50px',
              backgroundColor: '#facc15',
              color: 'black',
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
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, { status: 500 });
  }
}
