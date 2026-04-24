import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  try {
    const { searchParams } = new URL(req.url);

    const vin = searchParams.get('vin') || '';
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
            fontFamily: 'sans-serif',
          }}
        >
          {/* Логотип */}
          <div style={{ display: 'flex', marginBottom: '40px' }}>
            <span style={{ color: '#facc15', fontSize: 35, fontWeight: 900, letterSpacing: '-2px' }}>VIN</span>
            <span style={{ color: '#fff', fontSize: 35, fontWeight: 900, letterSpacing: '-2px' }}>DECODER</span>
          </div>

          {/* VIN код */}
          <div style={{ fontSize: 24, color: '#666', marginBottom: '15px', fontWeight: 'bold' }}>
            VIN: {vin}
          </div>

          {/* Назва авто */}
          <div
            style={{
              fontSize: 70,
              fontWeight: 900,
              color: '#fff',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>{year} <span style={{ color: '#facc15' }}>{make}</span></span>
            <span>{model} {engine !== '—' ? engine : ''}</span>
          </div>

          {/* Плашка верифікації */}
          <div
            style={{
              display: 'flex',
              marginTop: '50px',
              background: '#facc15',
              color: '#000',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: 22,
              fontWeight: 'bold',
            }}
          >
            ✓ TECHNICAL DATA VERIFIED
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
