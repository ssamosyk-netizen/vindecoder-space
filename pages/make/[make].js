import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function MakeLanding() {
  const router = useRouter();
  const { make } = router.query;
  const [vinInput, setVinInput] = useState('');
  
  // Робимо першу літеру великою (Chevrolet, Ford тощо)
  const capitalizedMake = make ? make.charAt(0).toUpperCase() + make.slice(1).toLowerCase() : '';

  const handleSearch = () => {
    if (vinInput.trim().length > 5) {
      router.push(`/vin/${vinInput.toUpperCase().trim()}`);
    } else {
      alert('Please enter a valid VIN code');
    }
  };

  return (
    <div className="container">
      <Head>
        <title>{capitalizedMake} VIN Decoder | Free {capitalizedMake} Specifications</title>
        <meta name="description" content={`Free ${capitalizedMake} VIN decoder. Get instant technical specifications, engine data, and manufacturing details for any ${capitalizedMake} vehicle.`} />
        <link rel="canonical" href={`https://vindecoder.space/make/${make}`} />
        
        {/* OG Tags для коректного відображення в Viber/FB */}
        <meta property="og:title" content={`${capitalizedMake} VIN Decoder`} />
        <meta property="og:description" content={`Decode any ${capitalizedMake} VIN to see full technical specifications.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://vindecoder.space/make/${make}`} />
        <meta property="og:image" content={`https://vindecoder.space/api/og?make=${capitalizedMake}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
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
            value={vinInput}
            onChange={(e) => setVinInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button onClick={handleSearch}>Search</button>
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

      <style jsx global>{`
        /* Це виправляє білі лінії по краях */
        html, body {
          margin: 0;
          padding: 0;
          background-color: #000;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
      `}</style>

      <style jsx>{`
        .container { 
          background: #000; 
          min-height: 100vh; 
          padding: 40px 20px; 
          text-align: center; 
          box-sizing: border-box;
        }
        .yellow { color: #facc15; } 
        .white { color: #fff; }
        h1 { font-size: 2rem; font-weight: 900; margin-bottom: 60px; letter-spacing: -2px; }
        .hero h2 { font-size: clamp(2rem, 8vw, 3.5rem); font-weight: 900; text-transform: uppercase; margin-bottom: 10px; line-height: 1; }
        .hero p { color: #666; font-size: 1.1rem; margin-bottom: 40px; }
        
        .search-box { 
          max-width: 650px; 
          margin: 0 auto 60px; 
          display: flex; 
          gap: 10px; 
          background: #111; 
          padding: 10px; 
          border-radius: 20px; 
          border: 1px solid #222; 
        }
        input { 
          flex: 1; 
          padding: 15px 20px; 
          border-radius: 12px; 
          border: none; 
          background: transparent; 
          color: #fff; 
          font-size: 1.1rem; 
          outline: none; 
        }
        button { 
          padding: 0 35px; 
          border-radius: 12px; 
          border: none; 
          background: #facc15; 
          color: #000; 
          font-weight: 900; 
          cursor: pointer; 
          text-transform: uppercase; 
          transition: transform 0.2s; 
        }
        button:hover { background: #eab308; }
        button:active { transform: scale(0.95); }
        
        .info-section { 
          max-width: 800px; 
          margin: 0 auto; 
          text-align: left; 
          background: #0a0a0a; 
          padding: 40px; 
          border-radius: 30px; 
          border: 1px solid #1a1a1a; 
        }
        .info-section h3 { color: #facc15; margin-bottom: 20px; font-size: 1.5rem; }
        .info-section p { color: #aaa; line-height: 1.6; font-size: 1.1rem; }
        .info-section ul { color: #888; line-height: 2; margin-top: 20px; padding-left: 20px; }
        
        @media (max-width: 600px) {
          .search-box { flex-direction: column; background: transparent; border: none; padding: 0; }
          input { background: #111; border: 1px solid #222; margin-bottom: 10px; }
          button { padding: 18px; }
          .hero h2 { font-size: 2.2rem; }
        }
      `}</style>
    </div>
  );
}
