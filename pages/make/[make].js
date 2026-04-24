import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function MakeLanding() {
  const router = useRouter();
  const { make } = router.query;
  const capitalizedMake = make ? make.charAt(0).toUpperCase() + make.slice(1) : '';

  return (
    <div className="container">
      <Head>
        <title>{capitalizedMake} VIN Decoder | Free {capitalizedMake} Specifications</title>
        <meta name="description" content={`Free ${capitalizedMake} VIN decoder. Get instant technical specifications, engine data, and manufacturing details for any ${capitalizedMake} vehicle.`} />
        <link rel="canonical" href={`https://vindecoder.space/make/${make}`} />
      </Head>

      <div className="content">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span><span className="white">DECODER</span>
        </h1>
        
        <div className="hero">
          <h2>Free <span className="yellow">{capitalizedMake}</span> VIN Decoder</h2>
          <p>Instant technical report and specifications for {capitalizedMake} vehicles.</p>
        </div>

        <div className="search-box">
          <input 
            type="text" 
            placeholder={`Enter ${capitalizedMake} VIN...`} 
            onKeyDown={(e) => {
              if (e.key === 'Enter') router.push(`/vin/${e.target.value.toUpperCase()}`);
            }}
          />
          <button onClick={() => alert('Please enter VIN in the field')}>Search</button>
        </div>

        <div className="info-section">
          <h3>Why check {capitalizedMake} VIN?</h3>
          <p>Every {capitalizedMake} has a unique 17-character identifier. By decoding it, you can verify:</p>
          <ul>
            <li>Actual engine displacement and configuration</li>
            <li>Original equipment and trim level</li>
            <li>Manufacturing plant and assembly year</li>
            <li>Safety features and braking systems</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .container { background: #000; color: #fff; min-height: 100vh; font-family: sans-serif; padding: 40px 20px; text-align: center; }
        .yellow { color: #facc15; } .white { color: #fff; }
        h1 { font-size: 2rem; font-weight: 900; margin-bottom: 60px; letter-spacing: -2px; }
        .hero h2 { font-size: 3rem; font-weight: 900; text-transform: uppercase; margin-bottom: 10px; }
        .hero p { color: #666; font-size: 1.2rem; margin-bottom: 40px; }
        .search-box { max-width: 600px; margin: 0 auto 60px; display: flex; gap: 10px; }
        input { flex: 1; padding: 20px; border-radius: 15px; border: 1px solid #333; background: #111; color: #fff; font-size: 1.1rem; }
        button { padding: 0 30px; border-radius: 15px; border: none; background: #facc15; font-weight: 900; cursor: pointer; text-transform: uppercase; }
        .info-section { max-width: 800px; margin: 0 auto; text-align: left; background: #0a0a0a; padding: 40px; border-radius: 30px; border: 1px solid #1a1a1a; }
        .info-section h3 { color: #facc15; margin-bottom: 20px; }
        .info-section p { color: #aaa; line-height: 1.6; }
        .info-section ul { color: #888; line-height: 2; margin-top: 20px; }
      `}</style>
    </div>
  );
}
