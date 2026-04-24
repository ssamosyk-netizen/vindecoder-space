import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function TermsOfService() {
  const router = useRouter();

  return (
    <div className="container">
      <Head>
        <title>Terms of Service | VIN DECODER</title>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Head>

      <div className="header">
        <h1 onClick={() => router.push('/')} style={{cursor: 'pointer'}}>
          <span className="yellow">VIN</span><span className="white">DECODER</span>
        </h1>
      </div>

      <main className="content">
        <h2>Terms of Service for VIN DECODER</h2>
        <p>Last updated: April 2026</p>

        <p>Welcome to VIN DECODER. By accessing this website, we assume you accept these terms and conditions. Do not continue to use VIN DECODER if you do not agree to take all of the terms and conditions stated on this page.</p>

        <h3>1. Use of the Service</h3>
        <p>Our website provides a free tool to decode Vehicle Identification Numbers (VIN) and access vehicle specifications. This service is provided "as is" and for informational purposes only. You agree to use this service responsibly and not for any illegal or automated bulk-scraping activities.</p>

        <h3>2. Accuracy of Information</h3>
        <p>While we strive to keep the vehicle specifications and reports as accurate and up-to-date as possible, VIN DECODER makes no warranties regarding the completeness, reliability, or accuracy of the decoded data. Always verify critical vehicle information with official dealerships or mechanics before making purchasing decisions.</p>

        <h3>3. Third-Party Links</h3>
        <p>Our Service may contain links to third-party web sites or services (such as advertising partners) that are not owned or controlled by VIN DECODER. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third party web sites or services.</p>

        <h3>4. Limitation of Liability</h3>
        <p>In no event shall VIN DECODER, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

        <h3>5. Changes to Terms</h3>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>

        <button className="back-btn" onClick={() => router.push('/')}>← Back to Home</button>
      </main>

      <footer className="footer"><p>© 2026 VIN DECODER</p></footer>

      <style jsx global>{`
        body { background-color: #000; color: #ccc; font-family: sans-serif; line-height: 1.6; margin: 0; padding: 0;}
        .container { padding: 20px; min-height: 100vh; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; }
        .header { text-align: center; margin-bottom: 40px; width: 100%; }
        .header h1 { font-size: 2.5rem; font-weight: 900; margin: 0; letter-spacing: -2px; }
        .yellow { color: #facc15; } .white { color: #fff; }
        
        .content { max-width: 800px; width: 100%; background: #0a0a0a; border: 1px solid #222; padding: 40px; border-radius: 15px; }
        .content h2 { color: #fff; margin-top: 0; }
        .content h3 { color: #facc15; margin-top: 30px; font-size: 1.2rem; }
        .content p { margin-bottom: 15px; font-size: 0.95rem; }
        .content a { color: #facc15; text-decoration: none; }
        .content a:hover { text-decoration: underline; }
        
        .back-btn { background: #facc15; color: #000; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 30px; transition: 0.2s; }
        .back-btn:hover { background: #fff; }
        
        .footer { text-align: center; margin-top: 60px; color: #222; font-size: 11px; }
        
        @media (max-width: 600px) {
          .content { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
